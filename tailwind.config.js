/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.600'),
            h1: {
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginBottom: theme('spacing.2'),
              color: theme('colors.gray.900'),
            },
            h2: {
              fontSize: theme('fontSize.lg'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.2'),
              color: theme('colors.gray.900'),
            },
            h3: {
              fontSize: theme('fontSize.base'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.2'),
              color: theme('colors.gray.900'),
            },
            p: {
              fontSize: theme('fontSize.sm'),
              marginBottom: theme('spacing.4'),
            },
            ul: {
              fontSize: theme('fontSize.sm'),
            },
            li: {
              marginBottom: theme('spacing.2'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.400'),
            h1: {
              color: theme('colors.gray.200'),
            },
            h2: {
              color: theme('colors.gray.200'),
            },
            h3: {
              color: theme('colors.gray.200'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(newUtilities);
    },
  ],
};
