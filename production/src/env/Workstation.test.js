import WorkstationEnv from './Workstation'

let getEnvironmentInformation = () => {
  return {
    webVersion: "11.1.1.22796J"
  }
}
window.workstation = {
  utils: {
    getEnvironmentInfo: function () {
      return new Promise(function (resolve, reject) {
        resolve(getEnvironmentInformation())
      })
    }
  }
}

test('Workstation, isServerOutdated, NEW VERSION:\t "11.1.1.22796J"', async () => {
  let isOutDated = await WorkstationEnv.isServerOutdated()
  expect(isOutDated).toEqual(false)
})

test('Workstation, isServerOutdated, OUT DATED VERSION:\t 11.1.0', async () => {
  getEnvironmentInformation = () => {
    return {
      webVersion: "11.1.0"
    }
  }
  let isOutDated = await WorkstationEnv.isServerOutdated()
  expect(isOutDated).toEqual(true)
})

test('Workstation, isServerOutdated, web version is not available:\t 0', async () => {
  getEnvironmentInformation = () => {
    return {
      webVersion: "0"
    }
  }
  let isOutDated = await WorkstationEnv.isServerOutdated()
  expect(isOutDated).toEqual(true)
})

test('Workstation, isServerOutdated, EMPTY:\t', async () => {
  getEnvironmentInformation = () => {
    return {
    }
  }
  let isOutDated = await WorkstationEnv.isServerOutdated()
  expect(isOutDated).toEqual(true)
})
