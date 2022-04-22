import ADEReducer from '../ApplicationDesignEditorReducer'
import { setTheme, updateTheme } from '../../actions/ActionsCreator'
import { ApplicationDesignEditorState } from '../../../types/redux-state/HomeScreenConfigState'

let initialState : ApplicationDesignEditorState = { }
const initalStateThemeExists : ApplicationDesignEditorState = {
  theme: {
    schemaVersion: 1,
    logos: {
        web: {
            type: 'URL',
            value: 'https://www.imageRepo/web.png'
        },
        favicon: {
            type: 'URL',
            value: 'https://www.imageRepo/favicon.svg'
        },
        mobile: {
          type: 'URL',
          value: 'https://www.imageRepo/mobile.svg'
        }
    }
  }
}

let state1 = {}

describe('Application Design Editor Reducers setTheme', () => {
  it('theme does not exist in config', () => {
    state1 = ADEReducer(initialState, setTheme(undefined))
    expect(state1).toEqual({
      theme: {}
    })
  })
  it('theme exists in config', () => {
    const expectState = {
      theme: {
        schemaVersion: 1,
        logos: {
            web: {
                type: 'URL',
                value: 'https://www.imageRepo/web.png'
            },
            favicon: {
                type: 'URL',
                value: 'https://www.imageRepo/favicon.svg'
            }
        }
      }
    }
  
    state1 = ADEReducer(initialState, setTheme(expectState.theme))
    expect(state1).toEqual(expectState)
  })
})

describe('Application Design Editor Reducers updateTheme', () => {
  it('theme exists in config', () => {
    const mobileLogo = {
      mobile: {
        type: 'URL',
        value: 'https://www.imageRepo/mobile2.svg'
      }
    }
    const updateLogo = {
      logos: {
        mobile: mobileLogo.mobile
      }
    }
    const expectState = { ...initalStateThemeExists }
    expectState.theme.logos.mobile = mobileLogo.mobile
  
    state1 = ADEReducer(initalStateThemeExists, updateTheme(updateLogo))
    expect(state1).toEqual(expectState)
  })
})