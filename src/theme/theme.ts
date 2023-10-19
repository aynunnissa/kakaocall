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
        main: '#05086F',
        light: '#F5F8FE'
    },
    secondary: {
        main: '#D0BACE'
    },
    error: {
        main: '#D32F2F',
    },
    grey: {
        100: '#ECEDED',
        200: '#BDC4BE',
        300: '#626262'
    }
}

const shadow = {
    none: '0 0 #0000',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    normal: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
}

const shape = {
    rounded: {
        none: '0px',
        sm: '0.2rem',
        normal: '0.4rem',
        md: '0.6rem',
        lg: '0.8rem',
        xl: '1.2rem'
    }
}

export const theme = {
    palette,
    shadow,
    shape,
    breakpoints,
    spacing,
    text
}