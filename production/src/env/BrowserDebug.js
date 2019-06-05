import error from '../utils/error'
const getFolderId = () => '5B56F71811E8C7EBE6140080EFF5CEA4'

export default {
  getCubeId: () => 'D71650694598584D99B1A19FED1D81EA',//'9370EB2611E8C04971990080EF45821E', // Customer 360
  // getCubeId: () => 'D56FA38411E8D3A764820080EFE59161', // Unpublished cube
  getReportId:() => '', //'2EE1088E11E92986DF1C0080EF659B3C',//'B663554411E8DDE824190080EFE5988D', //'D678CAC211E8DA72659B0080EFC51B1A', // '14A29EBB11E8D305648E0080EF55D81D',
  getHyperName: () => 'New Card 1' + Date.now(),
  closeWindow: () => console.log('closewindow'),
  setWindowTitle: (title) => {
    document.title = title
  },
  saveAs: () => {
    return new Promise((resolve, reject) => {
      resolve({
        folder:{
          id: getFolderId(),
        },
        name: 'Jay - new JSON Format', // + Date.now().toString(),
        canOverwrite: false
      })
    })
  },
  confirm: (cfg) => {
    return new Promise((resolve, reject) => {
      return resolve(window.confirm(cfg.message))
    })
  },
  error: function(cfg) {
    let params = {
      title: 'Error',
      message: 'An Error has occurred.',
      buttonCaption: 'OK',
      ...cfg
    }
    error({ message: params.message + ' ' + params.additionalInformation })
  },
  writable: function() {
    return true
  },
  isServerOutdated: async function() {
    return false
  },
  isBrowserDebug: true,
  postSave: () => {},
  getHelpBaseUrl: () => {
    return new Promise((resolve, reject) => {
      resolve('http://www2.microstrategy.com/producthelp/2019/Workstation/WebHelp/Lang_1033/Content/')
    })
  }
}
