# MONITORINC Tec-Tel Claude/Codex Loop

Copy files as follows:

C:\Users\diego\OneDrive\Documents\monitorinc\run-monitorinc-ui-loop.ps1
C:\Users\diego\OneDrive\Documents\monitorinc\.ai\CLAUDE_UI_TASK.md
C:\Users\diego\OneDrive\Documents\monitorinc\.ai\CODEX_UI_REVIEW.md

Prerequisites:
- claude CLI in PATH
- codex CLI in PATH
- npm in PATH
- Codex Playwright MCP available

Recommended command:

PowerShell:
cd C:\Users\diego\OneDrive\Documents\monitorinc
Set-ExecutionPolicy -Scope Process Bypass
.\run-monitorinc-ui-loop.ps1 -AutoStartDev

Defaults: minimum 15 rounds, maximum 18, Claude max 120 turns/round, 30-second cooldown.

Exactly 15 rounds:
.\run-monitorinc-ui-loop.ps1 -MinimumIterations 15 -MaxIterations 15 -AutoStartDev

If rate-limited, increase cooldown, e.g. `-CooldownSeconds 90`.

The controller intentionally does not stop on an early PASS before round 15; later rounds are verification-only unless a real regression appears.
