module.exports = {
  darkMode: 'class',
  content: ["./src/*.js", "./src/components/*.js", "./public/*.html"],
  theme: {
    screens: {
      sm: '480px',
      md: '800px',
      lg: '976px',
      xl: '1440px'
    },
    colors: {
      'blurple': 'var(--blurple)',
      'lightblurple': 'var(--lightblurple)',
      'magnolia': 'var(--magnolia)',
      'snow': 'var(--snow)',
      'champagnepink': 'var(--champagnepink)',
      'bgDark': 'var(--bgDark)',
      'darkErrorDark': 'var(--darkErrorDark)',
      'darkErrorLight': 'var(--darkErrorLight)',
      'lightErrorDark': 'var(--lightErrorDark)',
      'lightErrorLight': 'var(--lightErrorLight)',
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
