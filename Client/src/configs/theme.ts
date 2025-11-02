import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      '@font-face': {
        fontFamily: 'Recoleta',
        src: `url('/fonts/Recoleta.otf') format('opentype')`,
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'Recoleta',  // Apply custom font to Heading
        fontSize: '5xl'
      },
      sizes: {
        sm: {
          fontSize: 'lg',        // Small Heading font size
        },
        md: {
          fontSize: '2xl',       // Medium Heading font size (default)
        },
        lg: {
          fontSize: '4xl',       // Large Heading font size
        },
        xl: {
          fontSize: '5xl',       // Extra Large Heading font size
        },
      },
      defaultProps: {
        size: 'md',             // Default to medium size Heading
      },
    },
    Button: {
      baseStyle: {
        bg: 'gray.800',         // Dark background color for the button
        color: 'white',         // White text color
        _hover: {
          bg: 'gray.700',       // Darken the background when hovering
        },
        _active: {
          bg: 'gray.600',       // Even darker when the button is active
        },
        _focus: {
          boxShadow: 'none',    // Optional: Remove the focus outline
        },
      },
      defaultProps: {
        colorScheme: 'gray',    // Optional: Set the default color scheme to gray
      },
    },
  },
})

export default theme
