import * as _ from 'lodash';
import { IServerSideGetRowsParams, ICellRendererFunc, ICellRendererParams } from 'ag-grid-community'
import {
    EnumDSSXMLViewMedia,
    HomeScreenHomeObjectType,
    libraryCustomizedIconDefaultValues,
    libraryCustomizedIconKeys,
    libraryCustomizedIconStartVersion,
    MANAGE_CONTENT_BUNDLE_PRIVILEGE,
    SPECIAL_CHARACTER_REGEX,
} from '../HomeScreenConfigConstant';
import { Environment } from '@mstr/workstation-types';
import { isLibraryServerVersionMatch } from '../../../utils';

export function getContentType(viewMedia: number) {
    const defModePosition = viewMedia >> 27;
    let defaultViewMedia;
    if (defModePosition == 0) {
        defaultViewMedia = 0;
    }

    defaultViewMedia =
        EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic << (defModePosition - 1);
    if (
        defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaViewAnalysis ||
        defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaHTML5Dashboard
    ) {
        return HomeScreenHomeObjectType.DOSSIER;
    } else {
        return HomeScreenHomeObjectType.DOCUMENT;
    }
}

export function isContentTypeDossier(viewMedia: number) {
    return getContentType(viewMedia) === HomeScreenHomeObjectType.DOSSIER;
}

export function hexIntToColorStr(hexIntColor: number) {
    const colorPrefix = '#';
    return colorPrefix + hexIntColor.toString(16).padStart(6, '0');
}

export function colorStrToHexInt(colorStr: string) {
    var hex = parseInt(colorStr.replace(/^#/, ''), 16);
    return hex;
}

export function HomeScreenBundleListDatasource(server: any) {
    return {
        getRows: function (params: IServerSideGetRowsParams) {
            console.log(
                '[Datasource] - rows requested by grid: ',
                params.request
            );
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
   return new Date(timeString).toLocaleString('sv-SE')
 }
 export function getFeatureFlag(key: string, env: any) {
  if (!env?.preferences) {
      return false;
  }
  return env.preferences?.[key];
}
export function getNonsupportIconKeys(webVersion: string = '0.0.0') {
  return Object.keys(libraryCustomizedIconStartVersion).filter(v => !isLibraryServerVersionMatch(webVersion, libraryCustomizedIconStartVersion[v]))
}
export function filterCustomizedIconDefaultValue(webVersion: string = '0.0.0'){
  const res: any = {};
  const nonsupportIcons = getNonsupportIconKeys(webVersion);
  const targetIcons = libraryCustomizedIconKeys.filter(v => !nonsupportIcons.includes(v));
  targetIcons.forEach(icon => res[icon] = libraryCustomizedIconDefaultValues[icon])
  return {
    'iconsKey': targetIcons,
    'defaultValues': res
  };
}

export function filterNonsupportIcons(targetIcons: any[], webVersion: string = '0.0.0') {
  const nonsupportIcons = getNonsupportIconKeys(webVersion);
  return targetIcons.filter(v => !nonsupportIcons.includes(v.key));
}

export function awaitWrap<T, U = any>(promise: Promise<T>): Promise<[U | null, T | null]> {
  return promise
      .then<[null, T]>((data: T) => [null, data])
      .catch<[U, null]>(err => [err, null])
}

