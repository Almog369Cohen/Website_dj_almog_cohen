---
description: SoundView Pro AI implementation workflow
---
Use this workflow when implementing any SoundView Pro task so outputs stay aligned with `.ai-brain` standards.

1. Identify task type: feature, bugfix, refactor, or QA review.
2. Open and apply relevant rule files from `new/soundview-pro/.ai-brain/`:
   - `engineering-standards.md` (always)
   - `error-policy.md` (always)
   - `music-engine.md` (analysis/audio tasks)
   - `ui-system.md` and `accessibility.md` (UI tasks)
   - `track-analyzer-mvp.md` (analyzer scope tasks)
3. Start with the correct template from `prompt-templates.md` and keep output in English technical format.
4. Implement minimal root-cause changes only; avoid hidden fallbacks and contract drift.
5. If behavior changes, update docs in `new/soundview-pro/README.md` and relevant `.ai-brain` file.
// turbo
6. Run frontend verification: `npm run build` in `new/soundview-pro`.
// turbo
7. Run backend verification: `cargo check` in `new/soundview-pro/src-tauri`.
8. Confirm Definition of Done:
   - strict system-audio behavior unchanged
   - reason codes still coherent
   - keyboard/focus/contrast checks completed for touched UI
   - changed files and verification steps documented
9. If repository remote is configured, commit and push. If not configured, request the GitHub URL and then push.
