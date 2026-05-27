export const pickRandomItems = <Item>(
  items: readonly Item[],
  count: number,
  random = Math.random,
): Item[] => {
  if (count <= 0) return []

  const shuffledItems = [...items]

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const currentItem = shuffledItems[index]!
    shuffledItems[index] = shuffledItems[swapIndex]!
    shuffledItems[swapIndex] = currentItem
  }

  return shuffledItems.slice(0, count)
}
