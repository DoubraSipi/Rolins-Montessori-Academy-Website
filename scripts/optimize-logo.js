const sharp = require('sharp');
const path = require('path');

const pub = path.join(__dirname, '..', 'public');
const src = path.join(pub, 'logo.png');

(async () => {
  const img = sharp(src);
  const meta = await img.metadata();
  console.log('original', meta.width, meta.height, meta.hasAlpha);

  // Full crest, trimmed, 512px wide
  await sharp(src)
    .trim({ background: '#ffffff' })
    .resize({ width: 512, withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(path.join(pub, 'logo-out.png'));
  require('fs').renameSync(path.join(pub, 'logo-out.png'), path.join(pub, 'logo.png'));
  console.log('logo.png done');

  // Favicon: centre circle region of the globe
  const m2 = await sharp(src).metadata();
  const side = Math.round(Math.min(m2.width, m2.height) * 0.62);
  await sharp(src)
    .extract({
      left: Math.round((m2.width - side) / 2),
      top: Math.round(m2.height * 0.10),
      width: side,
      height: side,
    })
    .resize({ width: 128, height: 128, fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, 'favicon.png'));
  console.log('favicon.png done');

  // Report final sizes
  const fs = require('fs');
  for (const f of ['logo.png', 'favicon.png']) {
    console.log(f, Math.round(fs.statSync(path.join(pub, f)).size / 1024) + 'KB');
  }
})();
