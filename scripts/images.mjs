// Генерує адаптивні зображення з вихідників у src/assets/images-src/
// у форматах AVIF, WebP та JPEG у кількох ширинах: src/assets/images/{name}-{width}.{ext}
// Запуск: npm run images
import { mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_DIR = 'src/assets/images-src'
const OUT_DIR = 'src/assets/images'

// Ширини за префіксом імені файлу (мають збігатися з widths у Pug-міксинах)
const WIDTHS = {
  work: [357, 714],
  journal: [150, 300],
}

const FORMATS = {
  avif: (img) => img.avif({ quality: 50 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }),
}

await rm(OUT_DIR, { recursive: true, force: true })
await mkdir(OUT_DIR, { recursive: true })

const files = (await readdir(SRC_DIR)).filter((file) => file.endsWith('.webp'))

for (const file of files) {
  const name = path.parse(file).name
  const widths = WIDTHS[name.split('-')[0]]

  if (!widths) {
    console.warn(`Пропущено ${file}: немає налаштованих ширин`)
    continue
  }

  for (const width of widths) {
    const resized = sharp(path.join(SRC_DIR, file)).resize({ width, withoutEnlargement: true })

    for (const [ext, convert] of Object.entries(FORMATS)) {
      await convert(resized.clone()).toFile(path.join(OUT_DIR, `${name}-${width}.${ext}`))
    }
  }

  console.log(`✔ ${name}: ${widths.join(', ')}px × ${Object.keys(FORMATS).join(', ')}`)
}
