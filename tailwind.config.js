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
            a: {
              color: theme('colors.blue.500'),
              '&:hover': {
                color: theme('colors.blue.600'),
              },
            },
            h1: {
              color: theme('colors.gray.800'),
            },
            h2: {
              color: theme('colors.gray.800'),
            },
            h3: {
              color: theme('colors.gray.800'),
            },
            h4: {
              color: theme('colors.gray.800'),
            },
            code: {
              color: theme('colors.pink.500'),
            },
            pre: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.800'),
            },
            blockquote: {
              color: theme('colors.gray.800'),
              borderLeftColor: theme('colors.gray.200'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.400'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.500'),
              },
            },
            h1: {
              color: theme('colors.gray.200'),
            },
            h2: {
              color: theme('colors.gray.200'),
            },
            h3: {
              color: theme('colors.gray.200'),
            },
            h4: {
              color: theme('colors.gray.200'),
            },
            code: {
              color: theme('colors.pink.400'),
            },
            pre: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.800'),
            },
            blockquote: {
              color: theme('colors.gray.200'),
              borderLeftColor: theme('colors.gray.600'),
            },
          },
        },
      }),
      screens: {
        'md': '768px',
        // ... other screen sizes
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
