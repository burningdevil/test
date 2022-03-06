import * as AC from './ActionConstants'
import { takeLatest, put } from 'redux-saga/effects'
import { env } from '../../main'
import { setTheme } from '../store/ActionCreators'

async function initAppDesignEditor() {
  const theme = await env.window.getExtraContext()
  yield put(setTheme(theme))
  console.log(theme)
}

export function * watchInitAppDesignEditor() {
  yield takeLatest(AC.ASYNC_INIT_APP_DESIGN_EDITOR, initAppDesignEditor)
}


