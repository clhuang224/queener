type RgbColor = readonly [number, number, number]
type XyzColor = readonly [number, number, number]
export type LabColor = readonly [number, number, number]

const hexToRgb = (hex: string): RgbColor => {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)) as [
    number,
    number,
    number,
  ]
}

const srgbChannelToLinear = (channel: number): number => {
  const normalizedChannel = channel / 255

  if (normalizedChannel <= 0.04045) {
    return normalizedChannel / 12.92
  }

  return ((normalizedChannel + 0.055) / 1.055) ** 2.4
}

const rgbToXyz = ([red, green, blue]: RgbColor): XyzColor => {
  const linearRed = srgbChannelToLinear(red)
  const linearGreen = srgbChannelToLinear(green)
  const linearBlue = srgbChannelToLinear(blue)

  return [
    0.4124564 * linearRed + 0.3575761 * linearGreen + 0.1804375 * linearBlue,
    0.2126729 * linearRed + 0.7151522 * linearGreen + 0.072175 * linearBlue,
    0.0193339 * linearRed + 0.119192 * linearGreen + 0.9503041 * linearBlue,
  ]
}

const xyzChannelToLabChannel = (channel: number): number => {
  return channel > 0.008856 ? Math.cbrt(channel) : 7.787 * channel + 16 / 116
}

const xyzToLab = ([x, y, z]: XyzColor): LabColor => {
  const referenceX = 0.95047
  const referenceY = 1
  const referenceZ = 1.08883
  const labX = xyzChannelToLabChannel(x / referenceX)
  const labY = xyzChannelToLabChannel(y / referenceY)
  const labZ = xyzChannelToLabChannel(z / referenceZ)

  return [116 * labY - 16, 500 * (labX - labY), 200 * (labY - labZ)]
}

export const hexToLabColor = (hex: string): LabColor => xyzToLab(rgbToXyz(hexToRgb(hex)))

export const getCielabDistance = (firstColor: LabColor, secondColor: LabColor): number => {
  return Math.hypot(
    firstColor[0] - secondColor[0],
    firstColor[1] - secondColor[1],
    firstColor[2] - secondColor[2],
  )
}

export const getHexCielabDistance = (firstHex: string, secondHex: string): number => {
  return getCielabDistance(hexToLabColor(firstHex), hexToLabColor(secondHex))
}
