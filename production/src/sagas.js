import * as AC from './DatasetPanel/ActionConstants'
import { takeLatest, put } from 'redux-saga/effects'
import { env } from './main'
import { initReportInstance, initLayoutsConfig } from './utils/sagaHelper'
import { setReportWritable, setIsServerOutdated } from './store/content/ActionCreators'

function * initApp() {
  let cubeId = yield env.getCubeId()
  let reportId = yield env.getReportId()
  let writable = yield env.writable()
  let isServerOutdated = yield env.isServerOutdated()
  yield initLayoutsConfig()
  yield put(setReportWritable(reportId ? writable : true))
  yield put(setIsServerOutdated(isServerOutdated))
  yield initReportInstance({ cubeId, reportId })
}

export function * watchInitApp() {
  yield takeLatest(AC.INIT_APP, initApp)
}
