module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        pmdb: {
          white: '#f5f5f7',
          dark: '#212121',
          gold: '#e5a00d',
          grey: '#555555',
        },
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class', // si tu veux le support dark mode basé sur une classe "dark"
}