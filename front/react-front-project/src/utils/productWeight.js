export const MANUAL_PRODUCT_UNIT_OPTIONS = [
  { size: '1', name: 'kg' },
  { size: '1', name: 'g' },
  { size: '1', name: '개' },
  { size: '1', name: '봉' },
  { size: '1', name: '박스' },
  { size: '1', name: '포대' },
  { size: '1', name: '망' },
  { size: '1', name: '단' },
  { size: '1', name: '속' },
  { size: '1', name: '마리' },
  { size: '1', name: '리터' },
]

export function calculatePackageWeightGrams(unit) {
  const match = String(unit ?? '')
    .trim()
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*(kg|g)/)

  if (!match) {
    return null
  }

  const weight = Number(match[1])

  if (!Number.isFinite(weight) || weight <= 0) {
    return null
  }

  return match[2] === 'kg'
    ? weight * 1000
    : weight
}

export function splitProductUnit(unit) {
  const match = String(unit ?? '')
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*(.+)$/)

  if (!match) {
    return {
      size: '',
      name: '',
    }
  }

  return {
    size: match[1],
    name: match[2].trim(),
  }
}

export function combineProductUnit(size, name) {
  const normalizedSize = String(size ?? '').trim()
  const normalizedName = String(name ?? '').trim()

  if (!normalizedSize || !normalizedName) {
    return ''
  }

  return `${normalizedSize}${normalizedName}`
}
