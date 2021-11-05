import * as _ from "lodash";
import { IServerSideGetRowsParams } from 'ag-grid-community'
import { EnumDSSXMLViewMedia, HomeScreenHomeObjectType } from '../HomeScreenConfigConstant'
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
  
export function getHomeScreenBundleListGroupCellInnerRenderer() {
    function HomeScreenBundleListGroupCellInnerRenderer() { return '' };
    HomeScreenBundleListGroupCellInnerRenderer.prototype.init = function (params: any) {
      var tempDiv = document.createElement('div');
      if (params.node.group) {
        const color = hexIntToColorStr(params.node.data.color);
        tempDiv.innerHTML =
          '<span class="icon-group_groups_a" style="color:'+ color + '"/><span style="color: #35383a; padding: 6px; font-weight: 400">' +
          params.value +
          '</span>';
      } else {
        const viewMedia = params.node.data.viewMedia;
        const type: HomeScreenHomeObjectType = getContentType(viewMedia);
        if (type === HomeScreenHomeObjectType.DOSSIER) {
            tempDiv.innerHTML =
            '<span class="icon-dossier" style="color: #3492ed"/><span style="color: #35383a; padding: 6px; font-weight: 400">' +
            params.value +
            '</span>';
        } else {
            tempDiv.innerHTML =
            '<span class="icon-rsd-cover" style="color: #ff4000"/><span style="color: #35383a; padding: 6px; font-weight: 400">' +
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

export function getFeatureFlag(key: string, env: any){
  if(!env?.preferences){
      return false;
    }
    return env.preferences?.[key];
}