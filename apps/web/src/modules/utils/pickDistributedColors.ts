export const pickDistributedColors = <Color>(colors: readonly Color[], count: number): Color[] => {
  if (count <= 0) return []
  if (colors.length === 0) return []
  if (count === 1) return [colors[0]!]

  const lastColorIndex = colors.length - 1
  const lastPickedIndex = count - 1

  return Array.from({ length: count }, (_, index) => {
    const colorIndex = Math.round((index * lastColorIndex) / lastPickedIndex)
    return colors[colorIndex]!
  })
}
