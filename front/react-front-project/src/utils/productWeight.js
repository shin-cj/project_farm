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
