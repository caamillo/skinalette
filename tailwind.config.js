module.exports = {
  important: true,
  content: ["./src/*.js", "./public/*.html"],
  theme: {
    screens: {
      sm: '480px',
      md: '800px',
      lg: '976px',
      xl: '1440px'
    },
    colors: {
      'blurple': '#736CED',
      'lightblurple': '#9F9FED',
      'magnolia': '#F6EEFB',
      'snow': '#FEF9FF',
      'champagnepink': '#F2DFD7'
    },
    fontFamily: {
      'radiocanada': ['Radio Canada', 'sans-serif']
    }
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}
