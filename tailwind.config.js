const colors = [
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

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [...colors.map((c) => 'bg-' + c), ...colors.map((c) => 'text-' + c)],
  theme: {
    extend: {
      colors: {
        primary: {
          def: '#09c380',
          light: '#0fdf93',
          dark: '#089763',
        },
      },
    },
  },
  plugins: [],
}
