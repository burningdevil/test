import * as React from 'react';
import { connect } from 'react-redux';
import '../scss/HomeScreenConfigMainView.scss';
import { message, Menu, Dropdown } from 'antd';
import { copyToClipboard } from '../../../utils/copy';
import { ReactWsGrid, ColumnDef } from '@mstr/react-ws-grid';
import {
    CellContextMenuEvent,
    GridReadyEvent,
    GridApi,
} from 'ag-grid-community';
import { Record } from '@mstr/rc/types';
import {
    WorkstationModule,
    ObjectEditorSettings,
    EnvironmentChangeArg,
    WindowEvent,
    EnvironmentAction,
    EnvironmentStatus,
    Environment,
    PropertiesSettings,
    MstrObject,
    Project,
} from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import { RestApiError } from '../../../server/RestApiError';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import {
    selectAllDocuments,
    selectAllDossiers,
    selectConfigList,
    selectContentBundleList,
    selectIsConfigLoading,
} from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as api from '../../../services/Api';
import * as _ from 'lodash';
import {
    formatTime,
    getFeatureFlag,
    hexIntToColorStr,
    isContentTypeDossier,
} from './HomeScreenUtils';
import DisconnectedPage from './error-pages/DisconnectedPage';
import ServerIncompatiblePage from './error-pages/ServerIncompatiblePage';
import NoAccessPage from './error-pages/NoAccessPage';
import {
    isLibraryServerVersionMatch,
    isIServerVersionMatch,
    isUserHasManageApplicationPrivilege,
    APPLICATIONS_FOLDER_ID,
    APPLICATIONS_FOLDER_TYPE,
    LIBRARY_SERVER_SUPPORT_DOC_TYPE_VERSION,
    LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION,
    isUserHasManageContentGroupPrivilege,
    LIBRARY_SERVER_SUPPORT_AUTH_MODE,
} from '../../../utils';
import classNames from 'classnames';
import {
    ConfirmationDialog,
    ConfirmationDialogWordings,
} from '../common-components/confirmation-dialog';
import CONSTANTS, {
    default as VC,
    localizedStrings,
    platformType,
    APPLICATION_OBJECT_TYPE,
    APPLICATION_OBJECT_SUBTYPE,
    HOME_DOCUMENT_TYPE_DOSSIER,
    HOME_DOCUMENT_TYPE_DOCUMENT,
    GENERAL_PREVIEW_FEATURE_FLAG,
    APPLICATIONS_AUTH_MODES_FLAG,
} from '../HomeScreenConfigConstant';
import { t } from '../../../i18n/i18next';
import { store } from '../../../main';
import { from, of, interval, ReplaySubject, Observable } from 'rxjs';
import {
    tap,
    switchMap,
    zip,
    takeUntil,
    map,
    catchError,
} from 'rxjs/operators';
import { HomeScreenConfigType } from 'src/types/data-model/HomeScreenConfigModels';
import { supportCustomAuthModes } from '../features/custom-auth/custom-auth.model';

declare var workstation: WorkstationModule;
const classNamePrefix = 'home-screen-main';
const appRootPath = 'app';
const appRootPathWithConfig = 'app/config/';
const customAppPath = 'CustomApp?id=';
const configSaveSuccessPath = 'Message.homeConfigSaveSuccess';
const invalidDisplayModeConst = '--';
let gridApi: GridApi;
class HomeScreenConfigMainView extends React.Component<any, any> {
    columnDef: ColumnDef[] = [];
    destroy$: ReplaySubject<boolean> = new ReplaySubject(1);
    unsubscribe: any;
    constructor(props: any) {
        super(props);
        this.state = {
            currentEnv: {},
            isConnected: true,
            isLibraryVersionMatched: true,
            isLibraryVersionSupportDocumentType: false,
            isIServerVersionMatched: true,
            isConfirmationDialogOpen: false,
            isMDVersionMatched: true,
            isUserHasAccess: true,
            isInitialLoading: true,
            deleteApplicationsToBeConfirmed: [],
            contentBundleFeatureEnable: true,
            authModesFeatureEnable: true
        };
        // this.initOption();
    }

    async componentDidMount() {
        this.loadData();
        this.checkServerAndUserPrivilege();
        this.checkHomeDcoumentModeRx();
        workstation.environments.onEnvironmentChange(
            (change: EnvironmentChangeArg) => {
                console.log('enviornment change: ' + change?.actionTaken);
                console.log(
                    'enviornment change: env name : ' +
                        change?.changedEnvironment.name
                );
                console.log(
                    'enviornment change: env status : ' +
                        change?.changedEnvironment.status
                );
                if (
                    change?.actionTaken ===
                        EnvironmentAction.ChangeEnvironmentSelection &&
                    change?.changedEnvironment.status ===
                        EnvironmentStatus.Connected
                ) {
                    this.setState({
                        isInitialLoading: true,
                    });
                    this.loadData();
                    this.checkServerAndUserPrivilege();
                }
                if (
                    change?.actionTaken === EnvironmentAction.Disconnect &&
                    change?.changedEnvironment?.status ===
                        EnvironmentStatus.Disconnected &&
                    change?.changedEnvironment?.url === this.state.currentEnv.url
                ) {
                    // Except isConnected state, restore all other status.
                    this.setState({
                        isConnected: false,
                        isLibraryVersionMatched: true,
                        isIServerVersionMatched: true,
                        isMDVersionMatched: true,
                        isUserHasAccess: true,
                        isLibraryVersionSupportDocumentType: false,
                    });
                }
            }
        );
        workstation.window.addHandler(WindowEvent.POSTMESSAGE, (msg: any) => {
            if (_.get(msg, configSaveSuccessPath, false)) {
                this.setState({
                    isInitialLoading: false,
                });
                this.loadData();
            }
            return {
                ResponseValue: true,
            };
        });
    }

    checkServerAndUserPrivilege = async () => {
        const currentEnv =
            await workstation.environments.getCurrentEnvironment();
        const isConnected = currentEnv.status === EnvironmentStatus.Connected;
        // connection status first
        this.setState({
            currentEnv: currentEnv,
            isConnected: isConnected,
        });
        if (isConnected) {
            const status: any = await api.getServerStatus();
            const isLibraryVersionMatched =
                !!status.webVersion &&
                isLibraryServerVersionMatch(status.webVersion);
            // check whether the library version is supported the homeDocumentType
            const isLibraryVersionSupportDocumentType =
                !!status.webVersion &&
                isLibraryServerVersionMatch(
                    status.webVersion,
                    LIBRARY_SERVER_SUPPORT_DOC_TYPE_VERSION
                );
            const isIServerVersionMatched =
                !!status.iServerVersion &&
                isIServerVersionMatch(status.iServerVersion);
            const isUserHasAccess = isUserHasManageApplicationPrivilege(
                currentEnv.privileges
            );
            const isLibraryVersionSupportContentGroup =
                !!status.webVersion &&
                isLibraryServerVersionMatch(
                    status.webVersion,
                    LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION
                ) &&
                isUserHasManageContentGroupPrivilege(currentEnv.privileges);
            const authModeFlagItem = (currentEnv as any).configFeatureFlags?.find(
                (v: any) => v.id === APPLICATIONS_AUTH_MODES_FLAG
            );
            const isLibraryVersionSupportAuthMode = !!status.webVersion && 
                getFeatureFlag(
                    GENERAL_PREVIEW_FEATURE_FLAG,
                    currentEnv
                    ) &&
                isLibraryServerVersionMatch(
                    status.webVersion,
                    LIBRARY_SERVER_SUPPORT_AUTH_MODE
                ) && authModeFlagItem?.enabled
            // Server version and User privilige
            this.setState({
                isLibraryVersionMatched: isLibraryVersionMatched,
                isIServerVersionMatched: isIServerVersionMatched,
                isUserHasAccess: isUserHasAccess,
                isLibraryVersionSupportDocumentType:
                    isLibraryVersionSupportDocumentType,
                contentBundleFeatureEnable: isLibraryVersionSupportContentGroup,
                authModesFeatureEnable: isLibraryVersionSupportAuthMode
            });
            const isMDVersionMatched = await this.loadApplicationsFolder();
            // MD version
            this.setState({
                isMDVersionMatched: isMDVersionMatched,
            });
        }
    };
    updateGridCell = (response: any, item: any) => {
        let data = response?.data ?? response;
        if (!data) return;
        const updateGrid = (targetId: string, label: string) => {
            gridApi.forEachNodeAfterFilterAndSort(function (rowNode, index) {
                let data = rowNode.data;
                if (data.id === targetId) {
                    data.mode = label;
                    gridApi.updateRowData({ update: [data] });
                }
            });
        };
        if (!data.viewMedia) {
            updateGrid(item.id, invalidDisplayModeConst);
            return;
        }
        const isTypeDocument: boolean = !isContentTypeDossier(data.viewMedia);
        item.homeScreen.homeDocument.homeDocumentType =
            HOME_DOCUMENT_TYPE_DOSSIER;
        if (isTypeDocument) {
            item.homeScreen.homeDocument.homeDocumentType =
                HOME_DOCUMENT_TYPE_DOCUMENT;
            updateGrid(item.id, localizedStrings.DOCUMENT);
        }
    };
    markGridCell = (response: any, item: any) => {
        if (!response) return null;
        let data = response?.data ?? response;
        if (!_.has(data, VC.PLATFORM)) {
            _.assign(data, { platforms: [platformType.web] });
        }
        if (!_.has(data, 'homeScreen.homeLibrary')) {
            data.homeScreen.homeLibrary = {
                icons: [],
                sidebars: [],
                contentBundleIds: [],
            };
        }
        data.homeScreen.homeDocument.homeDocumentType =
            item.homeScreen.homeDocument.homeDocumentType;
        return data;
    };
    loadConfigObservable = (response: any, item: any): Observable<any> => {
        if (!response?.data?.viewMedia && !response?.viewMedia) {
            return of(null);
        }
        return from(api.loadConfig(item.id)).pipe(
            catchError((err) => of(null)),
            takeUntil(this.destroy$)
        );
    };
    updateConfigObservable = (data: any, item: any): Observable<any> => {
        if (!data) return of(null);
        return from(api.updateConfig(item.id, data)).pipe(
            catchError((err) => of(null)),
            takeUntil(this.destroy$)
        );
    };
    handleUpdateData = (
        dossierId: string,
        projectId: string,
        item: any
    ): Observable<any> => {
        return from(api.getSingleDossierInfo(dossierId, projectId)).pipe(
            takeUntil(this.destroy$),
            catchError(() => of(null)),
            tap((response: any) => {
                this.updateGridCell(response, item);
            }),
            switchMap((response: any) => {
                return this.loadConfigObservable(response, item);
            }),
            map((response: any) => {
                return this.markGridCell(response, item);
            }),
            switchMap((data: any) => {
                return this.updateConfigObservable(data, item);
            })
        );
    };
    parseUrl = (item: any) => {
        const dossierUrlPath = 'homeScreen.homeDocument.url';
        const dossierUrl = _.get(item, dossierUrlPath, '');
        const spliter = '/';
        const ids = _.split(dossierUrl, spliter);
        if (ids && ids.length > 1) {
            const projectId = ids[ids.length - 2];
            const dossierId = ids[ids.length - 1];
            return { item, projectId, dossierId };
        }
        return {};
    };
    filterCandidate = (configList: any[]) => {
        return configList.filter(
            (v: any) =>
                v.homeScreen.mode === 1 &&
                !v.homeScreen.homeDocument?.homeDocumentType
        );
    };
    checkHomeDcoumentModeRx = () => {
        let currentValue: number;
        const handleChange = () => {
            if (!this.state.isLibraryVersionSupportDocumentType) return;
            let previousValue = currentValue;
            const configList = selectConfigList(store.getState() as RootState);
            currentValue = configList.length;
            // adding the length judgement to prevent from multi-times execute this function. Only the first time config loaded will subscribe the change.
            if (!configList || currentValue === previousValue) return;
            let candidateData = this.filterCandidate(configList);
            if (!candidateData?.length) {
                this.unsubscribe?.unsubscribe?.();
                return;
            }
            from(candidateData)
                .pipe(
                    zip(interval(2000), (a, b) => a),
                    takeUntil(this.destroy$),
                    map((item) => {
                        return this.parseUrl(item);
                    }),
                    switchMap((dossierInfo: any) => {
                        const { item, projectId, dossierId } = dossierInfo;
                        if (!dossierId) return of(null);
                        return this.handleUpdateData(
                            dossierId,
                            projectId,
                            item
                        );
                    })
                )
                .subscribe(() => {});
        };
        this.unsubscribe = store.subscribe(handleChange);
        window.addEventListener('click', (e: any) => {
            this.destroy$.next(true);
            if (!gridApi) return;
            if (e.path.join('-').includes('ag-cell')) return; // ag-cell indicate that the click target is in the table, not the blank space.
            gridApi.clearFocusedCell();
            gridApi.deselectAll();
        });
    };
    componentWillUnmount() {
        this.unsubscribe?.unsubscribe?.();
        this.destroy$.next(true);
    }
    loadApplicationsFolder = async () => {
        let hasDefault = true;
        await HttpProxy.get(
            '/objects/' +
                APPLICATIONS_FOLDER_ID +
                '?type=' +
                APPLICATIONS_FOLDER_TYPE
        ).catch((e: any) => {
            if (e.errorCode === 'ERR004') {
                // Object Not Found Error
                hasDefault = false;
            }
        });
        return hasDefault;
    };

    loadData = () => {
        api.loadConfigList();
        api.loadContentBundleList();
    };
    initOption = () => {
        this.columnDef = this.getColumnDef();
    };
    handleAddApplication = () => {
        this.openConfigEditor();
    };
    // confirm dialog related.
    handleCloseDialog = () => {
        this.setState({
            isConfirmationDialogOpen: false,
        });
    };
    deleteConfirmationStr = (name: string) => {
        return t('confirmDeleteDialogMsgTitle', { name });
    };
    /* Confirmation dialog wordings */
    wordings: ConfirmationDialogWordings = {
        title: localizedStrings.DELETE,
        actionButtonText: localizedStrings.DELETE,
        cancelButtonText: localizedStrings.CANCEL,
        summaryText: this.deleteConfirmationStr('application'),
        detailText: localizedStrings.CONFIRM_DELETE_DIALOG_MSG_DETAIL,
    };

    onGridReady = (params: GridReadyEvent) => {
        gridApi = params.api;
    };
    onSortChange = () => {
        gridApi.clearFocusedCell();
    };
    onRowClick = (event: any) => {
        gridApi.deselectAll();
    };
    openConfigEditor = (objId: string = '', isDuplicate: boolean = false) => {
        const objType = VC.CONFIG_EDITOR_OBJTYPE;
        const configInfoList = this.props.configList.map((config: any) => {
            return {
                id: config.id,
                name: config.name,
            };
        });
        const extraContext = {
            configInfoList: configInfoList,
            isDuplicate: isDuplicate,
        };
        let options: ObjectEditorSettings = {
            objectType: objType,
            environment: this.state.currentEnv,
            extraContext: JSON.stringify(extraContext),
        };
        if (objId) {
            options = _.merge(options, { objectId: objId });
        }
        workstation.dialogs.openObjectEditor(options)
    };

    processErrorResponse = (e: any, errMsg: string = '') => {
        const error = e as RestApiError;
        if (error.statusCode === 401) {
            workstation.environments
                .getCurrentEnvironment()
                .then((currentEnv) => {
                    workstation.environments.disconnect(currentEnv.url);
                    message.error(localizedStrings.ERR_SESSION_OUT);
                });
            return;
        }
        message.error(errMsg + error.errorMsg);
    };

    deleteConfig = (objId: string = '') => {
        if (objId) {
            HttpProxy.delete(api.getApiPathForDeleteApplication(objId), {})
                .then((res: any) => {
                    this.setState({
                        isInitialLoading: false,
                    });
                    // let selectedData: any[] = [];
                    // gridApi.forEachNode( (node: any) =>{
                    //   if(node.data?.id === objId){
                    //     selectedData.push(node.data);
                    //   }
                    // });
                    // gridApi.applyTransaction({ remove: selectedData });
                    api.loadConfigList();
                })
                .catch((e: any) => {
                    this.processErrorResponse(
                        e,
                        localizedStrings.ERR_APP_DELETE
                    );
                });
        }
    };
    confirmDelete = () => {
        // waiting for the another pr is merged, the null protect should be added by the optional chain.
        this.state.deleteApplicationsToBeConfirmed.forEach((id: string) => {
            this.deleteConfig(id);
        });
    };
    downloadJsonFile = async (configJson: JSON, configId: string) => {
        var FileSaver = require('file-saver');
        let blob = new Blob(
            [decodeURIComponent(encodeURI(JSON.stringify(configJson)))],
            { type: 'application/json;charset=utf-8;' }
        );
        FileSaver.saveAs(blob, configId + VC.JSONFILE_SUFFIX);
    };

    renderShareContextMenu = (d: Record) => {
        const handleClickCopyLink = async () => {
            try {
                const currentEnv =
                    await workstation.environments.getCurrentEnvironment();
                const appLink = d.isDefault
                    ? currentEnv.url + 'CustomApp'
                    : currentEnv.url + customAppPath + d.id;
                copyToClipboard(appLink);
                message.success(localizedStrings.LINK_COPIED);
            } catch (e) {
                message.error(localizedStrings.ERR_LINK_COPY + e);
            }
        };
        const handleClickDownload = () => {
            const configId = d.id;
            api.downloadSingleConfig(configId)
                .then((config) => {
                    this.downloadJsonFile(config, configId);
                })
                .catch((e) => {
                    this.processErrorResponse(e);
                });
        };
        const menu = (
            <Menu style={{ top: '-10px', left: '10px' }}>
                <Menu.Item key="0" onClick={handleClickCopyLink}>
                    <span className={`${classNamePrefix}-item-copy`} />
                    {localizedStrings.COPY_LINK}
                </Menu.Item>
                {/* <Menu.Item key="1" onClick={handleClickDownload}>
          <span className={`${classNamePrefix}-item-json`}/>
          {localizedStrings.DOWNLOAD_JSON}
        </Menu.Item> */}
            </Menu>
        );

        return (
            <Dropdown
                className={classNames(
                    classNamePrefix,
                    'application-share-menu-container'
                )}
                overlay={menu}
                trigger={['click', 'hover']}
            >
                <span className={VC.FONT_SHARE} />
            </Dropdown>
        );
    };
    getHomeMode = (config: any) => {
        if (config?.homeScreen?.mode === 0) {
            return localizedStrings.LIBRARY;
        } else {
            if (
                config?.homeScreen?.homeDocument?.homeDocumentType ===
                HOME_DOCUMENT_TYPE_DOCUMENT
            ) {
                return localizedStrings.DOCUMENT;
            } else {
                return localizedStrings.DOSSIER;
            }
        }
    };
    generateConfigDisplayList = () => {
        const THIS = this;
        const record: any = {};
        THIS.props.contentBundleList.forEach((v: any) => {
            record[v.id] = v;
        });
        return this.props.configList.map((config: any) => {
            let resultConfig = _.cloneDeep(config);
            if (!_.has(resultConfig, VC.PLATFORM)) {
                _.assign(resultConfig, {
                    platformstr: _.capitalize(platformType.web),
                });
            } else {
                _.assign(resultConfig, {
                    platformstr: resultConfig.platforms
                        .map((o: string) => _.capitalize(o))
                        .join(', '),
                });
            }
            if (
                !_.has(resultConfig, [
                    VC.HOME_SCREEN,
                    VC.HOME_LIBRARY,
                    VC.CONTENT_BUNDLE_IDS,
                ])
            ) {
                _.assign(resultConfig, { contentBundles: [] });
            } else {
                let arr: any[] = [];
                resultConfig.homeScreen.homeLibrary.contentBundleIds.forEach(
                    (id: string) => {
                        if (record[id]) {
                            arr.push(record[id]);
                        }
                    }
                );
                _.assign(resultConfig, { contentBundles: arr });
            }

            _.assign(resultConfig, { mode: this.getHomeMode(resultConfig) });

            if (_.has(resultConfig, VC.DATE_MODIFIED)) {
                _.assign(resultConfig, {
                    dateModified: formatTime(resultConfig.dateModified),
                });
            }

            if (_.has(resultConfig, VC.DATE_CREATED)) {
                _.assign(resultConfig, {
                    dateCreated: formatTime(resultConfig.dateCreated),
                });
            }
            if (_.has(resultConfig, VC.AUTH_MODES)) {
                _.assign(resultConfig, {
                    [VC.AUTHENTICATION_MODES]: resultConfig.authModes?.availableModes?.join('-') + resultConfig.authModes?.defaultMode, // aim to trigger the ag-grid to re-render the cell;
                });
            }

            return resultConfig;
        });
    };

    getColumnDef = () => {
        let cols = [
            {
                field: VC.NAME,
                headerName: localizedStrings.NAME,
                lockVisible: true,
                minWidth: 180,
                cellRendererFramework: (rendererParam: any) => {
                    const d = rendererParam.data;
                    return (
                        <div
                            className={`${classNamePrefix}-application-name-container`}
                        >
                            {d.isDefault && (
                                <span
                                    className={`${classNamePrefix}-default-application-text`}
                                >
                                    {'(' + localizedStrings.DEFAULT + ')'}
                                </span>
                            )}
                            <span
                                className={`${classNamePrefix}-application-name-text`}
                            >
                                {d.name}
                            </span>
                            {this.renderShareContextMenu(d)}
                        </div>
                    );
                },
            },
            {
                field: VC.DESC,
                headerName: localizedStrings.DESCRIPTION,
            },
            {
                field: VC.MODE,
                headerName: localizedStrings.HOME,
                width: 100,
                // flex: 1,
                resizable: false,
            },
            {
                field: VC.AUTHENTICATION_MODES,
                headerName: localizedStrings.AUTH_MODES,
                sortable: false,
                resizable: true,
                // flex: 2.5,
                hide: true,
                width: 150,
                cellRendererFramework: (rendererParam: any) => {
                    const d = rendererParam.data as HomeScreenConfigType;
                    if (!d.authModes || d.authModes?.defaultMode === 0) {
                        return (
                            <div
                                className={`${classNamePrefix}-auth-mode`}
                            >
                                <span>
                                    {localizedStrings.FOLLOW_LIBRARY_SERVER}
                                </span>
                            </div>
                        );
                    }
                    const availableModes = [...d.authModes?.availableModes]
                    ?.sort((_a: number,b: number) => {
                        return b === d.authModes?.defaultMode ? 1 : -1 
                    }) ?? [];
                    return (
                        <div className={`${classNamePrefix}-auth-mode`}>
                            <span>
                            {
                            availableModes
                            .map(
                                    (mode: number) => {
                                        return supportCustomAuthModes.find(v => v.value === mode)?.label;
                                    }
                                )
                            .join(', ')
                            }
                            </span>
                        </div>
                    );
                },
            },
            {
                field: VC.CONTENT_BUNDLES,
                headerName: localizedStrings.NAVBAR_CONTENT_BUNDLES,
                sortable: false,
                resizable: true,
                // flex: 2.5,
                hide: true,
                minWidth: 300,
                cellRendererFramework: (rendererParam: any) => {
                    const d = rendererParam.data;
                    if (!d.contentBundles) return ' ';
                    if (d.contentBundles?.length === 0) {
                        return (
                            <div
                                className={`${classNamePrefix}-content-bundles`}
                            >
                                <span>
                                    {d.mode === localizedStrings.LIBRARY
                                        ? localizedStrings.BUNDLE_USER_HINT
                                        : ''}
                                </span>
                            </div>
                        );
                    }
                    return (
                        <div className={`${classNamePrefix}-content-bundles`}>
                            {d.contentBundles?.map(
                                (bundle: { name: string; color: number }) => {
                                    if (!bundle) {
                                        return null;
                                    }
                                    return (
                                        <span
                                            className={`${classNamePrefix}-content-bundles-item`}
                                        >
                                            <span
                                                className={`${classNamePrefix}-content-bundles-item-icon`}
                                                style={{
                                                    background:
                                                        hexIntToColorStr(
                                                            bundle.color
                                                        ),
                                                }}
                                            ></span>
                                            <span
                                                className={`${classNamePrefix}-content-bundles-item-text`}
                                            >
                                                {bundle.name}
                                            </span>
                                        </span>
                                    );
                                }
                            )}
                        </div>
                    );
                },
            },
            // {
            //   field: VC.PLATFORM_STR,
            //   headerName: localizedStrings.PLATFORMS,
            // },
            {
                field: VC.DATE_MODIFIED,
                headerName: localizedStrings.DATE_MODIFIED,
                width: 150,
                resizable: true, // DE209336; make date column resizable.
            },
            {
                field: VC.DATE_CREATED,
                headerName: localizedStrings.DATE_CREATED,
                width: 150,
                resizable: true,
                initialHide: true,
            },
        ] as ColumnDef[];
        if (this.state.authModesFeatureEnable) {
            cols.find((v) => v.field === VC.AUTHENTICATION_MODES).hide = false;
        } else {
            if (Object.keys(this.state.currentEnv)?.length) {
                const index = cols.findIndex(v => v.field === VC.AUTHENTICATION_MODES);
                cols.splice(index, 1); // splice the auth mode
            }
        }
        if (this.state.contentBundleFeatureEnable) {
            cols.find((v) => v.field === VC.CONTENT_BUNDLES).hide = false;
            cols.find((v) => v.field === VC.DESC).width = 160;
        } else {
            if (
                Object.keys(this.state.currentEnv)?.length &&
                !this.state.contentBundleFeatureEnable
            ) {
                const index = cols.findIndex(v => v.field === VC.CONTENT_BUNDLES);
                cols.splice(index, 1); // splice the content bundle
            }
            cols.find((v) => v.field === VC.DESC).width = 420;
        }
        return cols;
    };

    render() {
        const configDataSource = this.generateConfigDisplayList();
        const getContextMenuItems = (event: CellContextMenuEvent) => {
            const contextMenuTarget: Record = event.data;

            const handleClickEdit = () => {
                this.openConfigEditor(contextMenuTarget.id);
            };
            const handleClickDelete = () => {
                // this.deleteConfig(contextMenuTarget.id);
                this.wordings.summaryText = this.deleteConfirmationStr(
                    contextMenuTarget.name
                );
                this.setState({
                    isConfirmationDialogOpen: true,
                    deleteApplicationsToBeConfirmed: [contextMenuTarget.id],
                });
                this.wordings.summaryText = this.deleteConfirmationStr(
                    contextMenuTarget.name
                );
            };
            const handleClickDuplicate = () => {
                this.openConfigEditor(contextMenuTarget.id, true);
            };
            const handleClickInfo = () => {
                const selectedObjs: MstrObject[] = [
                    {
                        id: contextMenuTarget.id,
                        type: APPLICATION_OBJECT_TYPE,
                        subType: APPLICATION_OBJECT_SUBTYPE,
                    },
                ];
                // const currentProj : Project = this.state.currentEnv.projects[0];
                const currentProj: Project = {
                    id: CONSTANTS.CONFIG_PROJECT,
                    type: 32,
                    subType: 8192,
                } as Project;
                let options: PropertiesSettings = {
                    objects: selectedObjs,
                    project: currentProj,
                    environment: this.state.currentEnv,
                };

                workstation.dialogs.openProperties(options).catch((e) =>
                    workstation.dialogs.error({
                        message: 'Open object properties failed with error',
                        additionalInformation: JSON.stringify(e),
                    })
                );
            };

            /* ********************************************* */
            // Context Menu Formation
            /* ********************************************* */
            const contextMenuItems = [];
            contextMenuItems.push({
                name: localizedStrings.EDIT,
                action: handleClickEdit,
            });

            contextMenuItems.push({
                name: localizedStrings.DUPLICATE,
                action: handleClickDuplicate,
                disabled: contextMenuTarget
                    ? contextMenuTarget.isDefault
                    : false,
            });

            contextMenuItems.push({
                name: localizedStrings.GETINFO,
                action: handleClickInfo,
            });

            contextMenuItems.push({
                name: localizedStrings.DELETE,
                action: handleClickDelete,
                disabled: contextMenuTarget
                    ? contextMenuTarget.isDefault
                    : false,
            });

            return contextMenuItems;
        };

        if (!this.state.isConnected) {
            return <DisconnectedPage />;
        }

        if (!this.state.isLibraryVersionMatched) {
            const errorMsgTitle =
                localizedStrings.SERVER_VERSION_ERROR_TITLE_MSG;
            const errorMsgDtail =
                localizedStrings.SERVER_VERSION_ERROR_DETAIL_MSG;
            return (
                <ServerIncompatiblePage
                    titleMsg={errorMsgTitle}
                    detailMsg={errorMsgDtail}
                />
            );
        }

        if (!this.state.isIServerVersionMatched) {
            const errorMsgTitle =
                localizedStrings.SERVER_VERSION_ERROR_TITLE_MSG;
            const errorMsgDtail =
                localizedStrings.ISERVER_VERSION_ERROR_DETAIL_MSG;
            return (
                <ServerIncompatiblePage
                    titleMsg={errorMsgTitle}
                    detailMsg={errorMsgDtail}
                />
            );
        }

        if (!this.state.isUserHasAccess) {
            return <NoAccessPage />;
        }

        if (!this.state.isMDVersionMatched) {
            const errorMsgTitle = localizedStrings.MD_VERSION_ERROR_MSG;
            return <ServerIncompatiblePage titleMsg={errorMsgTitle} />;
        }

        return (
            <div className={`${classNamePrefix}`}>
                <div className={`${classNamePrefix}-new-application-container`}>
                    <span
                        tabIndex={0}
                        aria-label={localizedStrings.NEW_APP_BTN_TEXT}
                        className={VC.FONT_ADD_NEW}
                        onClick={this.handleAddApplication}
                    />
                    <span
                        className={`${classNamePrefix}-new-application-text`}
                        onClick={this.handleAddApplication}
                    >
                        {localizedStrings.NEW_APP_TEXT}
                    </span>
                </div>
                <div
                    className={`${classNamePrefix}-application-list-container`}
                >
                    <ReactWsGrid
                        rowSelectable={true}
                        onSortChanged={this.onSortChange}
                        onRowClicked={this.onRowClick}
                        getRowHeight={() => 32}
                        showCheckbox={false}
                        useToolbar={true}
                        // @ts-ignore: RC Component Support error
                        rowSelection={'single'}
                        getContextMenuItems={getContextMenuItems}
                        isLoading={
                            this.props.configLoading &&
                            this.state.isInitialLoading
                        }
                        columnDefs={this.getColumnDef()}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            minWidth: 100,
                        }}
                        rowData={configDataSource}
                        noDataMessage={localizedStrings.NO_DATA_MESSAGE}
                        onGridReady={this.onGridReady}
                    />
                    <ConfirmationDialog
                        isConfirmationDialogDisplayed={
                            this.state.isConfirmationDialogOpen
                        }
                        closeDialog={this.handleCloseDialog}
                        triggerAction={this.confirmDelete}
                        wordings={this.wordings}
                    />
                </div>
            </div>
        );
    }
}

const mapState = (state: RootState) => ({
    configList: selectConfigList(state),
    configLoading: selectIsConfigLoading(state),
    contentBundleList: selectContentBundleList(state),
    dossierList: selectAllDossiers(state),
    documentList: selectAllDocuments(state),
});

const connector = connect(mapState, {});

export default connector(HomeScreenConfigMainView);
