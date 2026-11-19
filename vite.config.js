import vituum from 'vituum'
import pug from '@vituum/vite-plugin-pug'
import path from 'path'

// Vituum у збірці залишає ім'я index.pug.html, а Pages очікує index.html
const renamePugHtml = () => ({
  name: 'rename-pug-html',
  enforce: 'post',
  generateBundle(_, bundle) {
    for (const file of Object.values(bundle)) {
      if (file.fileName.endsWith('.pug.html')) {
        file.fileName = file.fileName.replace('.pug.html', '.html')
      }
    }
  },
})

export default ({ command, isPreview }) => ({
  // GitHub Pages: https://<user>.github.io/landing-bose/
  // У dev-режимі base лишається '/', бо Vituum з вкладеним base віддає 404
  base: command === 'build' || isPreview ? '/landing-bose/' : '/',
  plugins: [
    vituum({
      imports: {
        // Вимикаємо автогенерацію +.css / +.scss, яку Vituum створює за замовчуванням
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: './src' }),
    renamePugHtml(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
  build: {
    // Не вбудовувати малі файли в HTML як base64, інакше srcset у <picture> не працює
    assetsInlineLimit: 0,
  },
})
