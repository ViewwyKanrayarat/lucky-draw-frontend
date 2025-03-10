import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
  dark: false, // ธีม Light
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEEEEE',
    'surface-variant': '#E0E0E0',
    'on-surface-variant': '#424242',
    primary: '#1867C0',
    'primary-darken-1': '#1F5592',
    secondary: '#48A9A6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

const myCustomDarkTheme = {
  dark: true, // ธีม Dark
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    'surface-bright': '#2C2C2C',
    'surface-light': '#424242',
    'surface-variant': '#333333',
    'on-surface-variant': '#BBBBBB',
    primary: '#BB86FC',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#CF6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme', // เริ่มต้นเป็น Light
    themes: {
      myCustomLightTheme,
      myCustomDarkTheme,
    },
  },
})
