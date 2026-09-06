#!/usr/bin/env python3
"""Tests for the pure helpers in site_capture.py. Run directly:
    python3 clone-site/test_site_capture.py
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import site_capture as sc  # noqa: E402


class Guards(unittest.TestCase):
    def test_refuses_non_http_and_local(self):
        for bad in ("file:///etc/passwd", "ftp://example.com", "http://localhost/", "http://127.0.0.1/",
                    "http://10.0.0.5/", "http://192.168.1.1/", "http://169.254.169.254/latest",
                    "http://[::1]/", "http://foo.local/", "http://db.internal/", "not a url"):
            self.assertFalse(sc.public_http_url(bad), bad)

    def test_accepts_public_ip(self):
        self.assertTrue(sc.public_http_url("https://1.1.1.1/"))

    def test_find_obscura_prefers_env_then_path_then_candidates(self):
        self.assertEqual(sc.find_obscura({"OBSCURA": "/x/ob"}, which=lambda n: None, exists=lambda p: p == "/x/ob"), "/x/ob")
        self.assertEqual(sc.find_obscura({}, which=lambda n: "/p/obscura", exists=lambda p: False), "/p/obscura")
        self.assertEqual(sc.find_obscura({}, which=lambda n: None, exists=lambda p: p == sc.OBSCURA_CANDIDATES[1]),
                         sc.OBSCURA_CANDIDATES[1])
        self.assertIsNone(sc.find_obscura({}, which=lambda n: None, exists=lambda p: False))


class Names(unittest.TestCase):
    def test_slug(self):
        self.assertEqual(sc.slug_for("https://a.com/"), "index")
        self.assertEqual(sc.slug_for("https://a.com"), "index")
        self.assertEqual(sc.slug_for("https://a.com/About Us/"), "about-us")
        self.assertEqual(sc.slug_for("https://a.com/services/roofing.html"), "services-roofing-html")
        self.assertEqual(len(sc.slug_for("https://a.com/" + "x" * 200)), 80)

    def test_same_site_ignores_www(self):
        self.assertTrue(sc.same_site("https://www.a.com/x", "https://a.com/"))
        self.assertFalse(sc.same_site("https://b.com/x", "https://a.com/"))


class Colors(unittest.TestCase):
    def test_normalize(self):
        self.assertEqual(sc.normalize_color("rgb(47, 91, 234)"), "#2f5bea")
        self.assertEqual(sc.normalize_color("rgba(47, 91, 234, 1)"), "#2f5bea")
        self.assertEqual(sc.normalize_color("rgba(47, 91, 234, 0.5)"), "#2f5bea@0.5")
        self.assertEqual(sc.normalize_color("#2F5BEA"), "#2f5bea")
        self.assertEqual(sc.normalize_color("#abc"), "#aabbcc")
        self.assertIsNone(sc.normalize_color("transparent"))
        self.assertIsNone(sc.normalize_color(""))

    def test_family_names(self):
        self.assertEqual(sc.family_names('"Bricolage Grotesque", Inter, sans-serif'),
                         ["Bricolage Grotesque", "Inter", "sans-serif"])


PAGE = """<html><head><title> Acme  Roofing </title>
<meta name="description" content="Roofs in Leeds"><meta property="og:image" content="/og.png">
<link rel="stylesheet" href="/site.css"><link rel="icon" href="/fav.svg"></head>
<body><header><a href="/"><img src="/img/logo.svg" alt="Acme"></a>
<nav><a href="/services">Services</a><a href="/about/">About</a><a href="#top">Top</a></nav></header>
<main><h1>Roofs that <b>last</b></h1><p>Text</p><h2>Services</h2>
<a href="/brochure.pdf">PDF</a><a href="https://other.com/x">Other</a><a href="mailto:a@b.c">Mail</a>
<a href="/contact?x=1#form">Contact</a><a href="/services">Dup</a>
<img src="/img/hero.jpg"><picture><source srcset="/img/a.webp 1x, /img/b.webp 2x"></picture></main></body></html>"""


class Parsing(unittest.TestCase):
    def test_parse_page(self):
        info = sc.parse_page(PAGE, "https://acme.com/")
        self.assertEqual(info["title"], "Acme Roofing")
        self.assertEqual(info["nav"], ["https://acme.com/services", "https://acme.com/about/"])
        self.assertEqual(info["links"], ["https://acme.com/services", "https://acme.com/about/", "https://acme.com/contact?x=1"])
        self.assertEqual(info["headings"], [("h1", "Roofs that last"), ("h2", "Services")])
        self.assertEqual(info["meta"]["description"], "Roofs in Leeds")
        self.assertIn("https://acme.com/img/logo.svg", info["assets"])
        self.assertIn("https://acme.com/img/a.webp", info["assets"])
        self.assertIn("https://acme.com/site.css", info["assets"])

    def test_html_to_text_strips_scripts(self):
        text = sc.html_to_text("<p>Hi</p><script>evil()</script><style>x{}</style><div>There &amp; back</div>")
        self.assertIn("Hi", text)
        self.assertIn("There & back", text)
        self.assertNotIn("evil", text)

    def test_parse_eval_accepts_raw_or_quoted_json(self):
        self.assertEqual(sc.parse_eval('{"title":"t"}'), {"title": "t"})
        self.assertEqual(sc.parse_eval('"{\\"title\\":\\"t\\"}"'), {"title": "t"})
        self.assertIsNone(sc.parse_eval("nope"))
        self.assertIsNone(sc.parse_eval(None))


class Styles(unittest.TestCase):
    def test_merge(self):
        a = {"fonts": ['"Inter", sans-serif', "Georgia, serif"], "colors": [["rgb(0, 0, 0)", 10], ["rgb(255, 255, 255)", 5]],
             "body": {"font": "Inter, sans-serif", "size": "18px", "weight": "400", "lineHeight": "28px",
                      "letterSpacing": "normal", "color": "rgb(0, 0, 0)", "background": "rgb(255, 255, 255)"},
             "buttons": [{"text": "Call", "background": "rgb(47, 91, 234)", "color": "rgb(255, 255, 255)", "radius": "8px",
                          "font": "Inter", "weight": "600", "padding": "12px"}],
             "logos": [{"tag": "img", "src": "/logo.svg", "alt": "Acme", "width": 120, "height": 40}]}
        b = {"fonts": ["Inter"], "colors": [["rgb(0, 0, 0)", 3]], "buttons": a["buttons"], "logos": a["logos"]}
        m = sc.merge_styles([a, None, b])
        self.assertEqual(m["fonts"], ["Inter", "Georgia"])
        self.assertEqual(m["colors"][0], {"color": "#000000", "count": 13})
        self.assertEqual(m["roles"]["body"]["font"], "Inter")
        self.assertEqual(m["roles"]["body"]["color"], "#000000")
        self.assertEqual(len(m["buttons"]), 1)
        self.assertEqual(len(m["logos"]), 1)
        text = sc.summary_markdown("acme.com", [{"url": "https://acme.com/", "slug": "index", "title": "Acme", "headings": [],
                                                 "meta": {}, "nav": ["https://acme.com/x"], "assets": ["https://acme.com/a.png"],
                                                 "screenshot": True}], m, "/usr/local/bin/obscura")
        self.assertIn("## Fonts", text)
        self.assertIn("- Inter", text)
        self.assertIn("#2f5bea", text)
        self.assertIn("never copy", text)


if __name__ == "__main__":
    unittest.main(verbosity=1)
