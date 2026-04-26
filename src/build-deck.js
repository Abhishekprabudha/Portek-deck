const fs = require('fs');
const path = require('path');

const SOURCE_DECK = path.join(
  __dirname,
  '../knowledge-base/documents/AIonOS_Portek_Transformation_Deck.pptx'
);
const DIST_DIR = path.join(__dirname, '../dist');
const OUTPUT_DECK = path.join(DIST_DIR, 'AIonOS_Portek_Transformation_Deck.pptx');
const LEGACY_OUTPUT_DECK = path.join(DIST_DIR, 'AIonOS_Portek_Remade_Deck.pptx');
const LEGACY_ASSET_COPY = path.join(__dirname, '../assets/AIonOS_Portek_Remade_Deck.pptx');

function assertSourceDeckExists() {
  if (!fs.existsSync(SOURCE_DECK)) {
    throw new Error(
      `Source deck not found at ${SOURCE_DECK}. Add AIonOS_Portek_Transformation_Deck.pptx to knowledge-base/documents/.`
    );
  }
}

function ensureDist() {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function copyDeck(from, to) {
  fs.copyFileSync(from, to);
  console.log(`Wrote ${to}`);
}

async function main() {
  assertSourceDeckExists();
  ensureDist();

  copyDeck(SOURCE_DECK, OUTPUT_DECK);

  // Backward-compatible output path used by older automation.
  copyDeck(SOURCE_DECK, LEGACY_OUTPUT_DECK);

  if (process.env.UPDATE_ASSET_COPY === '1') {
    copyDeck(SOURCE_DECK, LEGACY_ASSET_COPY);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
