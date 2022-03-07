import * as _ from "lodash";
import { IServerSideGetRowsParams, ICellRendererFunc, ICellRendererParams } from 'ag-grid-community'
import { EnumDSSXMLViewMedia, HomeScreenHomeObjectType, SPECIAL_CHARACTER_REGEX } from '../HomeScreenConfigConstant'
import { Environment } from "@mstr/workstation-types";

export function getContentType (viewMedia: number) {
    const defModePosition = viewMedia >> 27;
    let defaultViewMedia;
    if (defModePosition == 0) {
        defaultViewMedia = 0;
    }

    defaultViewMedia = EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic << defModePosition - 1;
    if (defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaViewAnalysis || defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaHTML5Dashboard) {
        return HomeScreenHomeObjectType.DOSSIER;
    } else {
        return HomeScreenHomeObjectType.DOCUMENT;
    }
}

export function isContentTypeDossier (viewMedia: number) {
    return getContentType(viewMedia) === HomeScreenHomeObjectType.DOSSIER;
}

export function hexIntToColorStr (hexIntColor: number) {
    const colorPrefix = '#';
    return colorPrefix + hexIntColor.toString(16).padStart(6, '0');
}

export function colorStrToHexInt (colorStr: string) {
    var hex = parseInt(colorStr.replace(/^#/, ''), 16);
    return hex;
}

export function HomeScreenBundleListDatasource(server: any) {
    return {
      getRows: function (params: IServerSideGetRowsParams) {
        console.log('[Datasource] - rows requested by grid: ', params.request);
        var response = server.getData(params);
        setTimeout(function () {
          if (response?.success) {
            params.success({
              rowData: response.rows,
              rowCount: response.lastRow,
            });
          } 
          
        }, 500);
      },
    };
  }
  
export  const getHomeScreenBundleListGroupCellInnerRenderer: ICellRendererFunc = (params: ICellRendererParams) => {
  const elem = document.createElement('div')
      const iconElem = document.createElement('span')
      const textElem = document.createElement('span')
      elem.appendChild(iconElem)
      elem.appendChild(textElem)

      
      textElem.classList.add('content-bundle-list-custom-name')
      const { data } = params.node
      textElem.innerText = data.name;
      if (data != null) {
        if (params.node.group) {
          const color = hexIntToColorStr(data.color)
          iconElem.classList.add('icon-group_groups_a')
          iconElem.style.color = color;

        } else {
          const { viewMedia } = data
          const type: HomeScreenHomeObjectType = getContentType(viewMedia)
          if (type === HomeScreenHomeObjectType.DOSSIER) {
            iconElem.classList.add('icon-dossier')
            iconElem.style.color = '#3492ed'
          } else {
            iconElem.classList.add('icon-rsd-cover')
            iconElem.style.color = '#ff4000'
          }
        }
      }
      return elem;
};
export function validName(name: string) {
  //cannot contain any of the following characters: \"[]
  const pattern = SPECIAL_CHARACTER_REGEX;
  const isInvalidCharacter = pattern.test(name);
  return !isInvalidCharacter;
}
 export function formatTime(timeString: string) {
   return new Date(timeString).toLocaleString()
 }