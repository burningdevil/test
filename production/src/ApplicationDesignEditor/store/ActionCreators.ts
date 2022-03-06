import { ApplicationTheme } from '../constants'
import * as AC from './ActionConstants'

export const asyncInitAppDesignEditor = () => ({ 
  type: AC.ASYNC_INIT_APP_DESIGN_EDITOR 
})

export const setTheme = (theme: ApplicationTheme) => ({
  type: AC.SET_THEME,
  payload: theme
})
