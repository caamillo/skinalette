module.exports = {
  content: ['./views/*.ejs'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    colors: {
      'blurple': '#736CED',
      'lightblurple': '#9F9FED',
      'magnolia': '#F6EEFB',
      'snow': '#FEF9FF',
      'champagnepink': '#F2DFD7'
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
