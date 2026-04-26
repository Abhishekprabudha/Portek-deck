# Knowledge Base Inputs for Deck Updates

Use this folder to store source material that should inform slide updates and improvements.

## What to place here

- **Documents:** strategy docs, notes, reports, transcripts, PDFs, Word files, markdown, plain text.
- **Images:** charts, screenshots, diagrams, photos, logos.
- **Data files:** CSV, JSON, Excel extracts, KPI exports.

## Folder layout

```text
knowledge-base/
├── documents/   # text and document sources
├── images/      # visual references
└── data/        # structured data inputs
```

## Suggested workflow

1. Drop new source files into the appropriate subfolder.
2. Keep descriptive names, e.g. `2026-q2-terminal-throughput.csv`.
3. Update deck content in `src/build-deck.js` using these sources.
4. If a file is confidential, avoid committing it and share securely instead.

> Tip: this folder is intentionally flexible and can hold any file type needed for future deck iterations.
