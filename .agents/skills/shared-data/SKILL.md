---
name: shared-data
description: "The project's shared Postgres schema every app reads and writes (shared.* tables, email as the key, additive schema files), and the database handle, settings, gateway calls, email and spam checks for dev and production. Use before writing a shared table or copying another skill. Not for tables only this app uses."
---

# Shared data

This is the Codex discovery adapter. The authoritative instructions live in
[the canonical shared-data skill](../../../.claude/skills/shared-data/SKILL.md).

Read that file completely before acting on it. Nothing is restated here, so
this adapter can never drift from the skill it points at.
