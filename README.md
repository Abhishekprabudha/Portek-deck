# AIonOS x Portek Deck Build

This repository now builds the exact `AIonOS_Portek_Transformation_Deck.pptx` from the knowledge base via code-driven workflows.

## Structure

```text
portek-deck-remake/
├── .github/workflows/build-deck.yml            # GitHub Actions workflow to build and upload the deck artifact
├── assets/
│   ├── brand.json                              # Legacy theme tokens (kept for compatibility)
│   └── AIonOS_Portek_Remade_Deck.pptx          # Optional legacy copy target
├── dist/
│   ├── AIonOS_Portek_Transformation_Deck.pptx  # Primary build output
│   └── AIonOS_Portek_Remade_Deck.pptx          # Backward-compatible output path
├── src/
│   └── build-deck.js                           # Build workflow (copies source deck from knowledge base)
├── knowledge-base/
│   ├── documents/
│   │   └── AIonOS_Portek_Transformation_Deck.pptx  # Source-of-truth deck
│   ├── images/
│   ├── data/
│   └── README.md
├── package.json
└── README.md
```

## Build locally

```bash
npm install
npm run build
```

Generated deck outputs:

```text
dist/AIonOS_Portek_Transformation_Deck.pptx
dist/AIonOS_Portek_Remade_Deck.pptx
```

## Build in GitHub

1. Push this repository to GitHub.
2. Open the **Actions** tab.
3. Run **Build PowerPoint deck**.
4. Download the generated `aionos-portek-transformation-deck` artifact.

## Updating the source deck

Replace `knowledge-base/documents/AIonOS_Portek_Transformation_Deck.pptx` with the newest approved version, then re-run the build workflow.
