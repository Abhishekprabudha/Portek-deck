const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const SOURCE_DECK = path.join(
  __dirname,
  '../knowledge-base/documents/AIonOS_Portek_Transformation_Deck.pptx'
);
const DIST_DIR = path.join(__dirname, '../dist');
const OUTPUT_DECK = path.join(DIST_DIR, 'AIonOS_Portek_Transformation_Deck.pptx');
const LEGACY_OUTPUT_DECK = path.join(DIST_DIR, 'AIonOS_Portek_Remade_Deck.pptx');
const LEGACY_ASSET_COPY = path.join(__dirname, '../assets/AIonOS_Portek_Remade_Deck.pptx');
const SLIDE_PATH = 'ppt/slides/slide4.xml';

const SLIDE_4_CONNECTOR_XML = `
<p:sp><p:nvSpPr><p:cNvPr id="36" name="Connector TL"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="3794760" y="1746504"/><a:ext cx="960120" cy="649224"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="19050"><a:solidFill><a:srgbClr val="C7D0DA"/></a:solidFill><a:prstDash val="solid"/><a:round/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>
<p:sp><p:nvSpPr><p:cNvPr id="37" name="Connector TR"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="7178040" y="2395728"/><a:ext cx="941832" cy="-649224"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="19050"><a:solidFill><a:srgbClr val="C7D0DA"/></a:solidFill><a:prstDash val="solid"/><a:round/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>
<p:sp><p:nvSpPr><p:cNvPr id="38" name="Connector BL"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="3840480" y="5221224"/><a:ext cx="914400" cy="-1499616"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="19050"><a:solidFill><a:srgbClr val="C7D0DA"/></a:solidFill><a:prstDash val="solid"/><a:round/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>
<p:sp><p:nvSpPr><p:cNvPr id="39" name="Connector BR"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="7178040" y="3721608"/><a:ext cx="978408" cy="1499616"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="19050"><a:solidFill><a:srgbClr val="C7D0DA"/></a:solidFill><a:prstDash val="solid"/><a:round/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>
<p:sp><p:nvSpPr><p:cNvPr id="40" name="Connector BC"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="5783580" y="5349240"/><a:ext cx="182880" cy="-1627632"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="19050"><a:solidFill><a:srgbClr val="C7D0DA"/></a:solidFill><a:prstDash val="solid"/><a:round/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>`;

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

function patchSlide4(deckPath) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portek-slide4-'));
  try {
    execSync(`unzip -qq "${deckPath}" -d "${tempDir}"`);
    const slidePath = path.join(tempDir, SLIDE_PATH);
    const slideXml = fs.readFileSync(slidePath, 'utf8');

    if (!slideXml.includes('name="Connector TL"')) {
      const patchedSlideXml = slideXml.replace(
        '<p:pic><p:nvPicPr><p:cNvPr id="33"',
        `${SLIDE_4_CONNECTOR_XML}<p:pic><p:nvPicPr><p:cNvPr id="33"`
      );
      fs.writeFileSync(slidePath, patchedSlideXml, 'utf8');
      execSync(`cd "${tempDir}" && zip -qr "${deckPath}" .`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  assertSourceDeckExists();
  ensureDist();

  copyDeck(SOURCE_DECK, OUTPUT_DECK);
  patchSlide4(OUTPUT_DECK);

  // Backward-compatible output path used by older automation.
  copyDeck(SOURCE_DECK, LEGACY_OUTPUT_DECK);
  patchSlide4(LEGACY_OUTPUT_DECK);

  if (process.env.UPDATE_ASSET_COPY === '1') {
    copyDeck(SOURCE_DECK, LEGACY_ASSET_COPY);
    patchSlide4(LEGACY_ASSET_COPY);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
