const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  prefix: 't-',
  theme: {
    container: {
      center: true
    },
    extend: {
      fontFamily: {
        sans: [ 'Roboto', ...defaultTheme.fontFamily.sans ]
      },
      colors: {
        'primary': '#611122',
        'sale': '#006EA1',
        'new': '#1AC759',
        'alt-1': '#3D9FA5',
        'alt-2': '#CE8F4B',
        'alt-3': '#65BD82',
        'base-darkest': '#000000',
        'base-dark': '#1E1E1E',
        'base-tone': '#3E3E3E',
        'base-light': '#999999',
        'base-lighter': '#C7C7C7',
        'base-lightest': '#EDEDED',
        'alert': '#CC2823',
        'facebook': '#4267B2',
        'twitter': '#1DA1F2',
        'youtube': '#ff0000'
      },
      cursor: {
        'zoom-in': 'zoom-in'
      },
      inset: {
        '1/2': '50%',
        'full': '100%'
      },
      spacing: {
        '1/8': '0.125rem',
        '3-1/2': '0.875rem',
        '2px': '2px'
      },
      minHeight: {
        'screen-25': '25vh',
        'screen-50': '50vh',
        'screen-75': '75vh',
        'screen-100': '100vh',
        '1/2': '50%',
        /** These are special classes for the buttons */
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem'
      },
      maxHeight: {
        '0': '0',
        'screen-100': '100vh'
      },
      maxWidth: {
        'screen-25': '25vw',
        'screen-50': '50vw',
        'screen-75': '75vw',
        'screen-100': '100vw',
        '1/2': '50%',
        '90pc': '90%'
      },
      fontSize: {
        'reset': '0',
        'icon': '0.875em',
        'xxs': '0.625rem',
        '1xl': '1.375rem',
        '2-1/2xl': '1.625rem'
      },
      lineHeight: {
        '1-em': '1em',
        '1-rem': '1rem',
        'looser': '3',
        'super-loose': '4'
      },
      height: {
        '50px': '50px',
        '60px': '60px'
      },
      flex: {
        'fix': '0 0 auto',
        'expand': '1 0 auto',
        'full': '1 0 100%'
      },
      opacity: {
        '60': '.6'
      },
      zIndex: {
        '1': '1',
        '1000': '1000'
      }
    },
    animations: {
      'pulse': {
        // t-animation-pulse t-animation-1/2s t-animation-twice t-animation-ease-in-out
        '0%, 100%': { transform: 'scaleX(1)' },
        '50%': { transform: 'scale3d(1.05, 1.05, 1.05)' }
      },
      'wiggle': {
        // t-animation-wiggle t-animation-1/3s t-animation-twice
        '0%, 50%, 100%': { transform: 'translateX(0)' },
        '25%': { transform: 'translateX(-5px)' },
        '75%': { transform: 'translateX(5px)' }
      },
      'spin': {
        // t-animation-spin t-animation-linear
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg)'
        }
      }
    },
    animationDuration: {
      '1/4s': '.25s',
      '1/3s': '.33333s',
      '1/2s': '.5s',
      '3/4s': '.75s'
    },
    animationDelay: {
      '1/2s': '.5s',
      '1/3s': '.33333s',
      '1/4s': '.25s'
    },
    animationIterationCount: {
      'twice': '2',
      'three-times': '3'
    }
  },
  variants: {
    backgroundColor: ['group-hover', 'responsive', 'hover', 'focus'],
    textColor: ['group-hover', 'responsive', 'hover', 'focus', 'placeholder'],
    opacity: ['hover', 'placeholder', 'disabled']
  },
  plugins: [
    require('tailwindcss-accessibility'),
    require('tailwindcss-animations'),
    /**
     * Add placeholder variant
     * @see https://tailwindcss.com/docs/pseudo-class-variants/#creating-custom-variants
    */
    function ({ addVariant, e }) {
      addVariant('placeholder', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`placeholder${separator}${className}`)}::placeholder`
        })
      })
    },
    // Add custom utilities (custom-classes)
    function ({ addUtilities }) {
      addUtilities(
        {
          '.hide-scrollbar': { 'scrollbar-width': 'none', '-ms-overflow-style': 'none' },
          '.hide-scrollbar::-webkit-scrollbar': { 'display': 'none' },
          '.webkit-tap-transparent': { '-webkit-tap-highlight-color': 'transparent' },
          '.blend-hard-light': { 'mix-blend-mode': 'hard-light' }
        },
        ['responsive']
      )
    }
  ]
}
