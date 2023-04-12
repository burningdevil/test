import ADEReducer from '../AppearanceEditorReducer'
import { setTheme, updateTheme, updateAppearancePreviewDeviceType } from '../../actions/ActionsCreator'
import { AppearanceEditorState } from '../../../types/redux-state/HomeScreenConfigState'
import { reviewType } from '../../../modules/components/HomeScreenConfigConstant'

let initialState : AppearanceEditorState = {
  theme: undefined,
  ui: {
    appearancePreviewDeviceType: reviewType.WEB
  }
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
  },
  ui: {
    appearancePreviewDeviceType: reviewType.WEB
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
      theme: {},
      appearancePreviewDeviceType: reviewType.WEB
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
      },
      ui: {
        appearancePreviewDeviceType: reviewType.WEB
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

describe('Application Appearance Editor Reducers updateAppearancePreviewDeviceType', () => {
  it('theme exists in config', () => {
    const expectState = { ...initalStateThemeExists }
    expectState.ui.appearancePreviewDeviceType = reviewType.PHONE

    state1 = ADEReducer(initalStateThemeExists, updateAppearancePreviewDeviceType(reviewType.PHONE))
    expect(state1).toEqual(expectState)
  })
})
