import ADEReducer from '../AppearanceEditorReducer'
import { setTheme, updateTheme } from '../../actions/ActionsCreator'
import { AppearanceEditorState } from '../../../types/redux-state/HomeScreenConfigState'

let initialState : AppearanceEditorState = {
  theme: undefined
}
const initalStateThemeExists : AppearanceEditorState = {
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

describe('Application Appearance Editor Reducers setTheme', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

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

describe('Application Appearance Editor Reducers updateTheme', () => {
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
