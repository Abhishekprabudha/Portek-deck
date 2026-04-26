# AIonOS x Portek Deck Remake

This repository generates a remade PowerPoint deck from code using `pptxgenjs`.

## Structure

```text
portek-deck-remake/
├── .github/workflows/build-deck.yml   # GitHub Actions workflow to build and upload the deck
├── assets/
│   ├── brand.json                     # Theme tokens
│   └── AIonOS_Portek_Remade_Deck.pptx # Prebuilt deck copy
├── dist/
│   └── AIonOS_Portek_Remade_Deck.pptx # Local build output
├── src/
│   └── build-deck.js                  # Deck source code
├── knowledge-base/                    # Source files to guide slide updates
│   ├── documents/
│   ├── images/
│   ├── data/
│   └── README.md
├── package.json
└── README.md
```

## Build locally

```bash
npm install
npm start
npm run build
```

The generated deck will be saved to:

```text
dist/AIonOS_Portek_Remade_Deck.pptx
```

## Build in GitHub

1. Push this repository to GitHub.
2. Open the **Actions** tab.
3. Run **Build PowerPoint deck** manually, or push to `main`.
4. Download the generated `aionos-portek-remade-deck` artifact.

## Editing

Update slide content, layout, or styling in `src/build-deck.js`. Theme colors are centralized in `assets/brand.json`.

## Knowledge base for source materials

Add any supporting files (documents, images, exports, etc.) under `knowledge-base/` before updating slides.

- `knowledge-base/documents/` for notes, reports, transcripts, markdown, PDFs
- `knowledge-base/images/` for screenshots, diagrams, visuals
- `knowledge-base/data/` for CSV/JSON/XLSX inputs

See `knowledge-base/README.md` for details.
