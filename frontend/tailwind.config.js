module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eaf6ff',
          100: '#d6eeff',
          300: '#9fd6ff',
          500: '#58a6ff',
          700: '#1f6feb'
        },
        accent: {
          50: '#e8fef0',
          100: '#d1fcdf',
          300: '#66d68a',
          500: '#3fb950'
        },
        slate: {
          50: '#0d1117',
          100: '#0b1220',
          700: '#8b949e'
        }
      },
      fontFamily: {
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}
