import * as _ from "lodash";
import { IServerSideGetRowsParams } from 'ag-grid-community'
import { BundleInfo } from '../HomeScreenConfigConstant'
import { HttpProxy } from '../../../main';

const EnumDSSXMLViewMedia = {
    DssXmlViewMediaViewStatic: 0x00000001,
    DssXmlViewMediaViewAnalysis: 0x00000800,
    DssXmlViewMediaHTML5Dashboard: 0x00002000
};

enum HomeScreenHomeObjectType {
    DOCUMENT = 'Document',
    DOSSIER = 'Dossier'
}

export enum BundleRecipientType {
    NONE = 'None',
    USER = 'User',
    GROUP = 'Group',
    BOTH = 'Both'
}

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
    return  '#' + hexIntColor.toString(16).padStart(6, '0');
}

export function colorStrToHexInt (colorStr: string) {
    // const hexString = _.replace(colorStr, '#', '0x');
    // return parseInt(Number(hexString), 10);
    var hex = parseInt(colorStr.replace(/^#/, ''), 16);
    return hex;
}

export function HomeScreenBundleListDatasource(server: any) {
    return {
      getRows: function (params: IServerSideGetRowsParams) {
        console.log('[Datasource] - rows requested by grid: ', params.request);
        var response = server.getData(params);
        setTimeout(function () {
          if (response.success) {
            params.success({
              rowData: response.rows,
              rowCount: response.lastRow,
            });
          } else {
            params.fail();
          }
        }, 500);
      },
    };
  }
  
export function getHomeScreenBundleListGroupCellInnerRenderer() {
    function HomeScreenBundleListGroupCellInnerRenderer() {}
    HomeScreenBundleListGroupCellInnerRenderer.prototype.init = function (params: any) {
      var tempDiv = document.createElement('div');
      if (params.node.group) {
        const color = hexIntToColorStr(params.node.data.color);
        tempDiv.innerHTML =
          '<span class="icon-group_groups_a" style="color:'+ color + '"/><span style="color: #35383a; padding: 6px;">' +
          params.value +
          '</span>';
      } else {
        const viewMedia = params.node.data.viewMedia;
        const type: HomeScreenHomeObjectType = getContentType(viewMedia);
        if (type === HomeScreenHomeObjectType.DOSSIER) {
            tempDiv.innerHTML =
            '<span class="icon-dossier" style="color: #3492ed"/><span style="color: #35383a; padding: 6px">' +
            params.value +
            '</span>';
        } else {
            tempDiv.innerHTML =
            '<span class="icon-rsd-cover" style="color: #ff4000"/><span style="color: #35383a; padding: 6px">' +
            params.value +
            '</span>';
        }
      }
      this.eGui = tempDiv.firstChild;
    };
    HomeScreenBundleListGroupCellInnerRenderer.prototype.getGui = function () {
      return this.eGui;
    };
    return HomeScreenBundleListGroupCellInnerRenderer;
  }