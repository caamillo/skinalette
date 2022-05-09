module.exports = {
  content: ['./views/*.ejs'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
