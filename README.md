# landing-bose

Лабораторна робота №10 - адаптивний лендінг Bose за макетом Figma.

- **Варіант 3**, методологія **BEM + `@layer`**
- Макет: <https://www.figma.com/design/xIVUXiPZ3hdpEFiIC0qbTL/BOSE-New-Version?node-id=6703-88> (сторінка `v2 Bose`)
- Демо: _TODO: посилання на GitHub Pages_

## Команди

```bash
npm install
npm run images   # AVIF / WebP / JPEG з src/assets/images-src -> src/assets/images
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Декомпозиція на БЕМ-блоки

| Блок            | Призначення                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| `logo`          | логотип-посилання (SVG-спрайт)                                                                |
| `header`        | шапка поверх hero: логотип, телефон (hover - з'являється номер), бургер (hover - інша іконка) |
| `nav`           | оверлей-меню без JS (`:target`)                                                               |
| `hero`          | головне зображення, іконка «звукова хвиля», `h1`                                              |
| `section-title` | заголовок секції (один блок для всіх `h2`)                                                    |
| `product-card`  | картка товару; відступи й колонки задає `recommended__item` (мікс)                            |
| `recommended`   | список карток по колонках сітки                                                               |
| `category`      | пара зображень wide + narrow з підписом                                                       |
| `categories`    | список категорій і кнопка «View all»                                                          |
| `button`        | кнопка: default / hover / pressed                                                             |
| `field`         | поле вводу й textarea: default / hover / focus / filled / invalid                             |
| `benefits`      | «Why buy direct»: заголовок + список переваг + абзац                                          |
| `contacts`      | форма й контактні дані                                                                        |
| `banner`        | нижній банер на всю ширину                                                                    |

Сітка (`.container`, `.grid`) і каркас (`.page`, `.section`) - це шар `layout`.

## Архітектура стилів (BEM + `@layer`)

```
src/styles/
├── abstracts/   # змінні (токени), функції, міксини - CSS не генерують
├── reset/       # @layer reset
├── base/        # @layer base: :root з custom properties + стилі елементів
├── layout/      # @layer layout: .container, .grid, .page, .section
├── components/  # @layer components: один БЕМ-блок - один partial
├── utilities/   # @layer utilities
└── main.scss
```

- Порядок шарів оголошується один раз на початку `main.scss`:
  `@layer reset, base, layout, components, utilities;`
  Далі partial-и підключаються через `meta.load-css()`, бо `@use` Sass завжди «піднімається»
  нагору файлу й оголошення шарів потрапило б у CSS після самих шарів.
- Пріоритет визначається порядком шарів, а не специфічністю: правило з `utilities` перемагає
  правило з `components` навіть за меншої специфічності. Стилів поза шарами немає.
- Іменування: `block`, `block__element`, `block--modifier` (без «елемента елемента»).
  Зовнішні відступи блоків задають батьки через мікси (`recommended__item` для `product-card`).
- Токени: SCSS-map-и (`$colors`, `$grid`, `$sizes`, `$breakpoints`) -> CSS custom properties в `:root`.
  Медіазапити - лише через міксин `mq()` (mobile first).

## Модульна сітка

| Ширина | Колонки | Колонка | Gutter | Margin             |
| ------ | ------- | ------- | ------ | ------------------ |
| 320    | 2       | 130     | 20     | 20                 |
| 744    | 6       | 80      | 24     | 72                 |
| 1260   | 12      | 63      | 24     | 120 (контент 1020) |

> У фреймі `Grid` для 744 підпис каже `Gutter width: 64px`, але на самому фреймі (і в сумі
> 6 × 80 + 5 × 24 = 600 = 744 − 2 × 72) gutter = 24, тому у верстці 24.

`.grid` - CSS Grid з `repeat(var(--grid-columns), minmax(0, 1fr))`; `--grid-columns`, `--grid-gutter`,
`--grid-margin` перевизначаються на брейкпоінтах. Елементи стоять по колонках (`grid-column: span N`).
Режим налагодження: додати `grid--debug` до `.grid`.

## Скриншоти

_TODO: PerfectPixel (320 / 744 / 1260), W3C Validator, PageSpeed Insights (mobile і desktop)._
