export const colors = [
  'red-500',
  'orange-500',
  'amber-500',
  'yellow-500',
  'lime-500',
  'green-500',
  'emerald-500',
  'teal-500',
  'cyan-500',
  'sky-500',
  'blue-500',
  'fuchsia-500',
  'pink-500',
]

export const whiteListColors = colors.map((c) => 'bg-' + c)

const getColorName = (value: string) => {
  const colorName = value.split('-')[0]
  return colorName.charAt(0).toUpperCase() + colorName.slice(1)
}

export const colorOptions = colors.map((c) => ({ value: c, label: getColorName(c) }))
