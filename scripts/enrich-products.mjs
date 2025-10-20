import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPalette } from 'color-thief-node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const dataPath = path.join(publicDir, 'data', 'products.json')

async function main() {
  const raw = await readFile(dataPath, 'utf-8')
  const products = JSON.parse(raw)
  const enriched = []

  for (const product of products) {
    const updated = { ...product }
    const imagePath = (product.image ?? '').replace(/^\//, '')
    const absoluteImagePath = path.join(publicDir, imagePath)

    const palette = await extractPalette(absoluteImagePath)
    const colorNames = buildColorNames(palette)
    if (colorNames.length) {
      updated.colors = colorNames
    }

    const tokens = extractTokens(imagePath)
    const styleKeywords = inferStyleKeywords(tokens, product.category)

    if (needsTitleRefresh(product.title)) {
      const newTitle = buildTitle({
        category: product.category,
        colors: colorNames,
        styleKeywords,
      })
      if (newTitle) {
        updated.title = newTitle
      }
    }

    updated.slug = createSlug(`${updated.title} ${product.id}`)

    const keywords = new Set([
      ...(updated.colors ?? []),
      ...styleKeywords,
      ...(Array.isArray(product.keywords) ? product.keywords : []),
      product.category,
    ])
    updated.keywords = Array.from(keywords).filter(Boolean)

    enriched.push(updated)
  }

  enriched.sort((a, b) => {
    const categorySort = a.category.localeCompare(b.category, 'fr', { sensitivity: 'base' })
    if (categorySort !== 0) return categorySort
    return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
  })

  await writeFile(dataPath, JSON.stringify(enriched, null, 2) + '\n', 'utf-8')
  console.log(`products.json enrichi (${enriched.length} entrees)`)
}

async function extractPalette(imagePath) {
  try {
    return await getPalette(imagePath, 6)
  } catch (error) {
    console.warn(`Palette indisponible pour ${imagePath}: ${error.message}`)
    return []
  }
}

function buildColorNames(palette) {
  const seen = new Set()
  const names = []
  for (const rgb of palette) {
    const rawName = describeColor(rgb)
    const normalized = normalizeColorName(rawName)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    names.push(normalized)
    if (names.length >= 6) break
  }
  return names
}

function describeColor([r, g, b]) {
  const { h, s, l } = rgbToHsl(r, g, b)

  if (s < 0.18) {
    if (l < 0.18) return 'noir profond'
    if (l < 0.32) return 'gris anthracite'
    if (l < 0.48) return 'gris ardoise'
    if (l < 0.68) return 'gris clair'
    if (l < 0.82) return 'sable doux'
    return 'ivoire'
  }

  let base
  if (h < 12 || h >= 350) base = 'rouge carmin'
  else if (h < 28) base = 'orange brule'
  else if (h < 42) base = 'ocre dore'
  else if (h < 65) base = 'jaune safran'
  else if (h < 90) base = 'vert anis'
  else if (h < 130) base = 'vert foret'
  else if (h < 165) base = 'vert canard'
  else if (h < 190) base = 'turquoise'
  else if (h < 215) base = 'bleu azur'
  else if (h < 235) base = 'bleu nuit'
  else if (h < 260) base = 'indigo'
  else if (h < 285) base = 'violet profond'
  else if (h < 320) base = 'magenta'
  else base = 'rose framboise'

  if (l > 0.78) base = `${base} pastel`
  else if (l < 0.3) base = `${base} fonce`

  return base
}

function normalizeColorName(name) {
  if (!name) return ''
  return removeDiacritics(name.toLowerCase().replace(/\s+/g, ' ').trim())
}

function extractTokens(imagePath) {
  const baseName = path.basename(imagePath).replace(/\.[^.]+$/, '')
  return baseName.split(/[^a-z0-9]+/i).map((token) => token.toLowerCase()).filter(Boolean)
}

function inferStyleKeywords(tokens, category) {
  const keywords = new Set()

  const tokenMap = new Map([
    ['abstract', 'abstrait'],
    ['abstracted', 'abstrait'],
    ['modern', 'moderne'],
    ['minimal', 'minimaliste'],
    ['minimalist', 'minimaliste'],
    ['line', 'graphique'],
    ['lines', 'graphique'],
    ['linear', 'graphique'],
    ['graph', 'graphique'],
    ['triptych', 'triptyque'],
    ['triptyque', 'triptyque'],
    ['landscape', 'paysage'],
    ['sunset', 'couleurs solaires'],
    ['sunrise', 'aurore'],
    ['forest', 'nature'],
    ['mountain', 'montagne'],
    ['wave', 'marine'],
    ['ocean', 'marine'],
    ['luxury', 'luxueux'],
    ['gold', 'dore'],
    ['noir', 'graphique'],
    ['white', 'minimaliste'],
  ])

  for (const token of tokens) {
    if (tokenMap.has(token)) {
      keywords.add(tokenMap.get(token))
    } else if (token.startsWith('tripty')) {
      keywords.add('triptyque')
    }
  }

  if (keywords.size === 0) {
    const fallback = categoryFallbackKeyword(category)
    if (fallback) keywords.add(fallback)
  }

  return Array.from(keywords)
}

function categoryFallbackKeyword(category = '') {
  const key = category.toLowerCase()
  if (key.includes('salon')) return 'composition contemporaine'
  if (key.includes('chambre')) return 'ambiance apaisante'
  if (key.includes('cuisine')) return 'gourmand'
  if (key.includes('bureau')) return 'graphique moderne'
  if (key.includes('salle a manger')) return 'elegant'
  if (key.includes('toilette')) return 'minimaliste'
  return 'contemporain'
}

function needsTitleRefresh(title) {
  if (!title) return true
  const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, '')
  const genericPatterns = [
    /^landing\d+$/,
    /^salon\d+$/,
    /^bureau\d+$/,
    /^cuisine\d+$/,
    /^chambre\d+$/,
    /^c\d+$/,
    /^img\d+$/,
    /^image\d+$/,
    /^oeuvre\d+$/,
  ]
  if (genericPatterns.some((pattern) => pattern.test(normalized))) return true
  const wordCount = title.trim().split(/\s+/).length
  return wordCount <= 2 && /\d/.test(title)
}

function buildTitle({ category, colors, styleKeywords }) {
  const descriptor = selectPrimaryDescriptor(styleKeywords, category)
  const colorSegment = formatColorSegment(colors)
  const suffix = styleKeywords.includes('triptyque') ? ' - triptyque' : ''
  if (colorSegment) {
    return `${descriptor} ${colorSegment}${suffix}`
  }
  return `${descriptor}${suffix}`
}

function selectPrimaryDescriptor(styleKeywords, category) {
  const primary = styleKeywords.find((keyword) => keyword !== 'triptyque')
  if (primary) return capitalize(primary)

  const map = new Map([
    ['salon', 'Composition contemporaine'],
    ['chambre a coucher', 'Paysage onirique'],
    ['cuisine', 'Illustration gourmande'],
    ['salle a manger', 'Graphique moderne'],
    ['bureau', 'Abstraction elegante'],
    ['toilette', 'Design minimal'],
  ])

  for (const [key, label] of map.entries()) {
    if ((category ?? '').toLowerCase() === key) {
      return label
    }
  }

  return 'Oeuvre contemporaine'
}

function formatColorSegment(colors = []) {
  if (!colors.length) return ''
  const displayNames = colors.slice(0, 2).map(colorDisplayName)
  if (displayNames.length === 1) {
    return `teintes ${displayNames[0]}`.trim()
  }
  return `${displayNames[0]} & ${displayNames[1]}`
}

function colorDisplayName(color) {
  const words = color.split(' ').map((word) => displayWord(word))
  return words.map(capitalize).join(' ')
}

function displayWord(word) {
  const map = new Map([
    ['dore', 'dore'],
    ['fonce', 'fonce'],
    ['safran', 'safran'],
    ['ocre', 'ocre'],
    ['bleu', 'bleu'],
    ['nuit', 'nuit'],
    ['vert', 'vert'],
    ['anis', 'anis'],
    ['foret', 'foret'],
    ['canard', 'canard'],
    ['turquoise', 'turquoise'],
    ['azur', 'azur'],
    ['indigo', 'indigo'],
    ['violet', 'violet'],
    ['profond', 'profond'],
    ['magenta', 'magenta'],
    ['rose', 'rose'],
    ['framboise', 'framboise'],
    ['pastel', 'pastel'],
    ['gris', 'gris'],
    ['anthracite', 'anthracite'],
    ['ardoise', 'ardoise'],
    ['clair', 'clair'],
    ['sable', 'sable'],
    ['doux', 'doux'],
    ['ivoire', 'ivoire'],
    ['noir', 'noir'],
    ['carmin', 'carmin'],
    ['brule', 'brule'],
  ])
  return map.get(word) ?? word
}

function capitalize(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function createSlug(value) {
  const normalized = removeDiacritics(value.toLowerCase())
  return normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function removeDiacritics(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function rgbToHsl(r, g, b) {
  const nr = r / 255
  const ng = g / 255
  const nb = b / 255

  const max = Math.max(nr, ng, nb)
  const min = Math.min(nr, ng, nb)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case nr:
        h = (ng - nb) / d + (ng < nb ? 6 : 0)
        break
      case ng:
        h = (nb - nr) / d + 2
        break
      case nb:
        h = (nr - ng) / d + 4
        break
      default:
        break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s, l }
}

await main().catch((error) => {
  console.error('Enrichissement echoue:', error)
  process.exitCode = 1
})
