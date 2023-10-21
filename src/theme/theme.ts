import { breakpoints } from "./breakpoints";
import { spacing } from "./spacing";
import { text } from "./typography";

const palette = {
    common: {
        black: '#1A110F',
        white: '#FFFFFF'
    },
    surface: {
        white: '#FFFFFF'
    },
    primary: {
        dark: '#05086F',
        main: '#232681',
        light: '#F5F8FE'
    },
    secondary: {
        main: '#D0BACE'
    },
    error: {
        dark: '#C62828',
        main: '#D32F2F',
    },
    warning: {
        main: '#FF9800'
    },
    grey: {
        100: '#EEEEFA',
        200: '#ECEDED',
        300: '#BDC4BE',
        400: '#626262'
    }
}

const shadow = {
    none: '0 0 #0000',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    normal: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
}

const shape = {
    rounded: {
        none: '0px',
        sm: '0.2rem',
        normal: '0.4rem',
        md: '0.6rem',
        lg: '0.8rem',
        xl: '1.2rem'
    },
    circle: '50%'
}

export const theme = {
    palette,
    shadow,
    shape,
    breakpoints,
    spacing,
    text
}