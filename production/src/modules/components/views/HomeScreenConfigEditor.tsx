import * as React from 'react';
import { connect } from 'react-redux';
import '../scss/HomeScreenConfigEditor.scss';
import '../../../assets/fonts/webfonts/css/dossier.css';
import { Tabs, Layout, Button, message } from 'antd';
import {
    WorkstationModule,
    EnvironmentChangeArg,
    EnvironmentAction,
    EnvironmentStatus,
    WindowEvent,
    dialogs,
    DialogValues,
    Environment,
} from '@mstr/workstation-types';
import HomeScreenGeneral from './HomeScreenGeneral';
import HomeScreenComponents from './HomeScreenComponents';
import HomeScreenAppearance from './HomeScreenAppearance';
import HomeScreenMoreSetting from './HomeScreenMoreSetting';
import HomeScreenHomeSetting from './HomeScreenHomeSetting';
import HomeScreenContentBundles from './HomeScreenContentBundles';
import * as _ from 'lodash';
import { HttpProxy } from '../../../main';
import { RestApiError } from '../../../server/RestApiError';
import { PARSE_METHOD } from '../../../utils/ParseMethods';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import {
    selectCurrentConfig,
    selectIsDuplicateConfig,
    selectIsConfigNameError,
    selectIsDossierAsHome,
    selectDefaultGroupsName,
    selectConfigInfoList,
    selectIsConfigChanged,
    selectColorPalettesSelected,
    selectIsCustomEmailError,
    selectShouldSendPreviewEmail,
    selectCustomizeEmailSetting,
} from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import * as api from '../../../services/Api';
import {
    default as VC,
    localizedStrings,
    editorSize,
    libraryCustomizedIconDefaultValues,
    CONTENT_BUNDLE_DEFAULT_GROUP_NAME,
    copyApplicationName,
    closeWindowConfirmationStr,
    GENERAL_PREVIEW_FEATURE_FLAG,
    SUPPORT_CONFIGURATION_PALETTE_ID,
} from '../HomeScreenConfigConstant';
import {
    ConfirmationDialog,
    ConfirmationDialogWordings,
} from '../common-components/confirmation-dialog';
import { getFeatureFlag, validName } from './HomeScreenUtils';
import { store } from '../../../main';
import {
    isLibraryServerVersionMatch,
    isUserHasManageContentGroupPrivilege,
    LIBRARY_SERVER_SUPPORT_COLOR_PALETTE_VERSION,
    LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION,
    LIBRARY_SERVER_SUPPORT_APPEARANCE_DESIGN_VERSION,
    LIBRARY_SERVER_SUPPORT_CUSTOM_EMAIL_VERSION
} from '../../../utils';
import ColorPaletteBlade from '../features/color-palette/color-palette-blade';
import CustomEmailBlade from '../features/custom-email/custom-email-blade';
import { constructSendingEmailRequestBody, getConfigIdFromHeader } from '../features/custom-email/custom-email.util';
declare var workstation: WorkstationModule;

const classNamePrefix = 'home-screen-editor';

class HomeScreenConfigEditor extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeKey: VC.GENERAL,
            homeSettingTabVisitCount: 0,
            configId: undefined,
            isNameCopyed: false, // Copy of Name for duplicate config operation should only be handled one time.
            currentEnv: {},
            handleSaving: false,
            contentBundleFeatureEnable: false,
            colorPaletteFeatureEnable: false,
            appearancePreviewFeatureEnabled: false,
            colorPalettePreviewFeatureEnable: false,
            isCloseHanlderRegistered: false,
            customEmailFeatureEnabled: false,
        };
    }

    /**
     * Function that registers functions to show confirmation dialog
     */
    async addHandlers() {
        // Show confirmation dialog on close
        workstation.window.addHandler(WindowEvent.CLOSE, async () => {
            let appName = this.props.isConfigNameError
                ? this.generateDefaultAppName(this.props.configInfoList)
                : this.props.config.name;
            let returnVal = await dialogs.confirmation({
                message: closeWindowConfirmationStr(appName),
            });
            if (returnVal == DialogValues.YES) {
                // Close and Save
                if (this.props.isConfigNameError) {
                    let config = {
                        name: appName,
                    };
                    this.props.updateCurrentConfig(config);
                }
                this.handleSaveConfig();
            } else if (returnVal == DialogValues.NO) {
                // Close and Don't Save
                workstation.window.close();
            } else if (returnVal == DialogValues.CANCEL) {
                // Cancel, back to editor window, do nothing.
            } else {
                // OK, just close window.
                workstation.window.close();
            }
            return {
                ResponseValue: true,
            };
        });
        this.setState({
            isCloseHanlderRegistered: true,
        });
    }

    async componentDidMount() {
        // Set Duplicate Config Flag
        const extraContext = await workstation.window.getExtraContext();
        const extraContextJson = JSON.parse(extraContext);
        const isDuplicate = extraContextJson.isDuplicate;
        this.props.setDuplicateConfig(isDuplicate);
        this.props.setConfigInfoList(extraContextJson.configInfoList);

        // Handle Edit config
        const configId = this.parseConfigId(
            _.get(this.props, 'location.search', undefined)
        );
        if (configId) {
            api.loadCurrentEditConfig(configId)?.catch((e: any) => {
                this.processErrorResponse(e, localizedStrings.ERR_APP_LOAD);
            });
        } else {
            const newApplicationName = this.generateDefaultAppName(
                extraContextJson.configInfoList
            );
            // init the customized icon when create new application.
            let config = {
                name: newApplicationName,
                [VC.HOME_SCREEN]: {
                    [VC.HOME_LIBRARY]: {
                        [VC.CUSTOMIZED_ITEMS]:
                            libraryCustomizedIconDefaultValues,
                    },
                },
            };
            this.props.updateCurrentConfig(config);
        }
        const checkContentGroupEnable = (currentEnv: Environment) => {
            return (
                !!currentEnv.webVersion &&
                isLibraryServerVersionMatch(
                    currentEnv.webVersion,
                    LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION
                ) &&
                isUserHasManageContentGroupPrivilege(currentEnv.privileges)
            );
        };
        const currentEnv =
            await workstation.environments.getCurrentEnvironment();
        const contentBundleEnable = checkContentGroupEnable(currentEnv);
        // check the color palette feature flag.
        const checkColorPaletteFeatureEnable = (currentEnv: Environment) => {
            const colorPaletteItem = (currentEnv as any).configFeatureFlags?.find(
                (v: any) => v.id === SUPPORT_CONFIGURATION_PALETTE_ID
            );
            return (
                !!currentEnv.webVersion &&
                isLibraryServerVersionMatch(
                    currentEnv.webVersion,
                    LIBRARY_SERVER_SUPPORT_COLOR_PALETTE_VERSION
                ) &&
                colorPaletteItem?.enabled
            );
        };
        const colorPaletteFeatureFlagEnabled  = checkColorPaletteFeatureEnable(currentEnv);
        const checkCustomEmailFeatureEnable = (currentEnv: Environment) => {
            return (
                !!currentEnv.webVersion &&
                getFeatureFlag(
                    GENERAL_PREVIEW_FEATURE_FLAG,
                    currentEnv
                    ) && 
                isLibraryServerVersionMatch(
                    currentEnv.webVersion,
                    LIBRARY_SERVER_SUPPORT_CUSTOM_EMAIL_VERSION
                )
            );
        };
        const customEmailFeatureFlagEnabled  = checkCustomEmailFeatureEnable(currentEnv);
        let isNameCopied = false;
        if (
            isDuplicate &&
            this.props.config.name &&
            this.props.config.name.length > 0
        ) {
            this.props.updateCurrentConfig({
                name: copyApplicationName(this.props.config.name),
            });
            isNameCopied = true;
        }
        this.setState({
            currentEnv: currentEnv,
            configId: configId,
            isNameCopyed: isNameCopied,
            contentBundleFeatureEnable: contentBundleEnable,
            colorPaletteFeatureEnable: colorPaletteFeatureFlagEnabled,
            customEmailFeatureEnabled: customEmailFeatureFlagEnabled

        });
        this.loadPreference();
        workstation.environments.onEnvironmentChange(
            (change: EnvironmentChangeArg) => {
                console.log('editor environment change: ' + change?.actionTaken);
                console.log(
                    'editor environment change: env name : ' +
                        change?.changedEnvironment?.name
                );
                console.log(
                    'editor environment change: env status : ' +
                        change?.changedEnvironment?.status
                );
                if (
                    change?.actionTaken === EnvironmentAction.Disconnect &&
                    change?.changedEnvironment?.status ===
                        EnvironmentStatus.Disconnected &&
                    change?.changedEnvironment?.url === this.state.currentEnv.url
                ) {
                    // Disconnect environment and Close current window
                    workstation.environments.disconnect(
                        this.state.currentEnv.url
                    );
                    workstation.window.close();
                }
            }
        );
        (workstation.utils as any).addHandler(
            'OnPreferencesChange',
            (msg: any) => {
                workstation.window.close();
            }
        );
        store.subscribe(async () => {
            const state = store.getState();
            if (
                state.configEditor.isStateChangeByManual &&
                !this.state.isCloseHanlderRegistered
            ) {
                await this.addHandlers();
            }
        });
    }
    loadPreference = (pref?: any) => {
        const colorPaletteLibrarySupport =
            !!this.state.currentEnv.webVersion &&
            isLibraryServerVersionMatch(
                this.state.currentEnv.webVersion,
                LIBRARY_SERVER_SUPPORT_COLOR_PALETTE_VERSION
            );
        
          const applicationThemeLibrarySupport = 
            !!this.state.currentEnv.webVersion &&
            isLibraryServerVersionMatch(
                this.state.currentEnv.webVersion,
                LIBRARY_SERVER_SUPPORT_APPEARANCE_DESIGN_VERSION
            );
        this.setState({
            colorPalettePreviewFeatureEnable:
                colorPaletteLibrarySupport,
            appearancePreviewFeatureEnabled:
              getFeatureFlag(
                GENERAL_PREVIEW_FEATURE_FLAG,
                this.state.currentEnv
                ) && applicationThemeLibrarySupport
        });
    };
    componentWillReceiveProps(nextProps: any) {
        if (
            this.props.isDuplicateConfig &&
            !this.state.isNameCopyed &&
            nextProps.config.name !== this.props.config.name
        ) {
            this.props.updateCurrentConfig({
                name: copyApplicationName(nextProps.config.name),
            });
            this.setState({
                isNameCopyed: true,
            });
            return;
        }
    }

    generateDefaultAppName = (configInfoList: any) => {
        const defaultAppName = localizedStrings.DEFAULT_APP_NAME;
        if (
            configInfoList?.filter((appInfo: any) => {
                return (
                    appInfo.name.toLowerCase() === defaultAppName.toLowerCase()
                );
            }).length === 0
        ) {
            return defaultAppName;
        }
        for (let i = 1; i < 10000; i++) {
            const newAppName = `${defaultAppName} ${i}`;
            if (
                configInfoList?.filter((appInfo: any) => {
                    return (
                        appInfo.name.toLowerCase() === newAppName.toLowerCase()
                    );
                }).length === 0
            ) {
                return newAppName;
            }
        }
        return ''; // Return empty name if Default App name count is larger than 10000.
    };

    parseConfigId = (querystr: string) => {
        const spliter = '=';
        const matchKey = 'id';
        if (querystr) {
            const querys = (
                /^[?#]/.test(querystr) ? querystr.slice(1) : querystr
            ).split('&');
            let queryFound = querys.find((query) => {
                let [key] = query.split('=');
                return key === matchKey;
            });
            return queryFound && queryFound.split(spliter)[1];
        }
    };

    tabBarChanged = (key: string) => {
        const { isDossierHome } = this.props;
        const homeSettingTabVisitCount =
            key === VC.HOME_SCREEN && isDossierHome
                ? this.state.homeSettingTabVisitCount + 1
                : this.state.homeSettingTabVisitCount;
        this.setState({
            activeKey: key,
            homeSettingTabVisitCount: homeSettingTabVisitCount,
        });
    };
    // confirm dialog related.
    handleCloseDialog = () => {
        this.setState({
            isConfirmationDialogOpen: false,
        });
    };
    confirmCancel = () => {
        if (!this.props.isStateChanged) {
            this.handleCancel();
            return;
        }
        this.setState({
            isConfirmationDialogOpen: true,
        });
    };
    /* Confirmation dialog wordings */
    wordings: ConfirmationDialogWordings = {
        title: localizedStrings.CANCEL,
        actionButtonText: localizedStrings.YES,
        cancelButtonText: localizedStrings.NO,
        summaryText: localizedStrings.CONFIRM_CANCEL_DIALOG_MSG_TITLE,
        detailText: localizedStrings.CONFIRM_CANCEL_DIALOG_MSG_DETAIL,
    };
    buttonGroup = () => {
        const { isDossierHome, config } = this.props;
        const dossierUrlPath = 'homeScreen.homeDocument.url';
        const dossierUrl = _.get(config, dossierUrlPath, '');
        return (
            <div className={`${classNamePrefix}-layout-btn`}>
                <Button key={VC.BACK} onClick={this.confirmCancel}>
                    {localizedStrings.CANCEL}
                </Button>
                <Button
                    key={VC.GENERATE}
                    type="primary"
                    style={{ marginLeft: 10 }}
                    onClick={this.handleSaveConfig}
                    loading={this.state.handleSaving}
                    disabled={
                        this.props.isConfigNameError ||
                        this.props.isCustomEmailError ||
                        (isDossierHome && _.isEmpty(dossierUrl)) ||
                        !validName(this.props.defaultGroupsName) ||
                        !this.props.isColorPalettesSelected
                    }
                >
                    {localizedStrings.SAVE}
                </Button>
                {/* confirmation dialog of cancel */}
                <ConfirmationDialog
                    isConfirmationDialogDisplayed={
                        this.state.isConfirmationDialogOpen
                    }
                    closeDialog={this.handleCloseDialog}
                    triggerAction={this.handleCancel}
                    wordings={this.wordings}
                />
            </div>
        );
    };

    getUserInfo = () => {
        return HttpProxy.get(
            api.getApiPathForSessions()
        )
            .then((res: any) => {
                return {
                    id: res.id,
                    fullName: res.fullName
                };
            })
            .catch((e: any) => {
                const error = e as RestApiError;
                console.log(error.errorMsg);
            });
    };

    closeEditorWindow = () => {
        // trigger load config list and close window
        workstation.window
        .postMessage({ homeConfigSaveSuccess: true })
        .then(() => {
            workstation.window.close();
        });
    };

    sendPreviewEmail = (configId: string) => {
        this.getUserInfo()
            .then((userInfo: any) => {
                const requestBody = constructSendingEmailRequestBody(configId, userInfo, this.state.currentEnv.url, this.props.config.isDefault, this.props.emailSettings);
                if (requestBody) {
                    HttpProxy.post(
                        api.getApiPathForSendingEmails(),
                        requestBody
                    )
                    .then(() => {
                        this.closeEditorWindow();
                    })
                    .catch((e: any) => {
                        const error = e as RestApiError;
                        console.log(error.errorMsg);
                        this.closeEditorWindow();
                    })
                }
            })
            .catch((e: any) => {
                const error = e as RestApiError;
                console.log(error.errorMsg);
                this.closeEditorWindow();
            })
    };

    handleSaveConfig = () => {
        this.setState({
            handleSaving: true,
        });
        let config = _.merge({}, this.props.config);
        const configId = this.state.configId;
        // Remove dossier url when mode is Library As Home. Before saving object.
        const { homeScreen } = this.props.config;
        const dossierUrlPath = 'homeDocument.url';
        const dossierUrl = _.get(homeScreen, dossierUrlPath, '');
        //special case for the default group , when the name is empty.
        if (!config.homeScreen.homeLibrary.defaultGroupsName) {
            config.homeScreen.homeLibrary.defaultGroupsName =
                CONTENT_BUNDLE_DEFAULT_GROUP_NAME;
        }
        if (dossierUrl && !this.props.isDossierHome) {
            config = _.merge(config, {
                homeScreen: {
                    homeDocument: {
                        url: '',
                    },
                },
            });
        }
        /* color palette related.
      if useConfigPalette is false, delete the selected applicationPalettes.
      */
        if (!config.useConfigPalettes && config.applicationPalettes?.length) {
            config.applicationPalettes = [];
            config.applicationDefaultPalette = '';
        }
        if (
            config.applicationPalettes?.length &&
            !config.applicationDefaultPalette
        ) {
            config.applicationDefaultPalette = config.applicationPalettes[0];
        }

        if (this.props.isDossierHome) {
            config.homeScreen.homeLibrary.contentBundleIds = [];
        }
        if (configId && !this.props.isDuplicateConfig) {
            HttpProxy.put(
                api.getApiPathForEditApplication(configId),
                config,
                {},
                PARSE_METHOD.BLOB
            )
                .then(() => {
                    if (this.props.emailSettings.enabled && this.props.shouldSendPreviewEmail) {
                        this.sendPreviewEmail(configId);
                    } else {
                        this.closeEditorWindow();
                    }
                })
                .catch((e: any) => {
                    // request error handle, if 401, need re-authrioze, disconnect current environment and close current sub-window. Else, show error message
                    this.processErrorResponse(e, localizedStrings.ERR_APP_SAVE);
                })
                .finally(() => {
                    this.setState({
                        handleSaving: false,
                    });
                });
        } else {
            if (this.props.isDuplicateConfig) {
                config = _.omit(config, [
                    'id',
                    'dateModified',
                    'dateCreated',
                    'objectVersion',
                ]);
                config.objectNames = [];
                config.objectAcl = [];
            }
            HttpProxy.post(
                api.getApiPathForNewApplication(),
                config,
                {},
                PARSE_METHOD.BLOB
            )
                .then((res: any) => {
                    if (this.props.emailSettings.enabled && this.props.shouldSendPreviewEmail) {
                        const configId = getConfigIdFromHeader(res);
                        this.sendPreviewEmail(configId);
                    } else {
                        this.closeEditorWindow();
                    }
                    
                })
                .catch((err: any) => {
                    this.processErrorResponse(
                        err,
                        localizedStrings.ERR_APP_SAVE
                    );
                })
                .finally(() => {
                    this.setState({
                        handleSaving: false,
                    });
                });
        }
    };

    processErrorResponse = (e: any, errorMsg: string) => {
        const error = e as RestApiError;
        // this.setState({
        //   handleSaving: false
        // })
        if (error.statusCode === 401) {
            workstation.environments.disconnect(this.state.currentEnv.url);
            workstation.window.close();
            return;
        }
        message.error(errorMsg + error.errorMsg);
    };

    handleCancel = () => {
        this.setState({
            isConfirmationDialogOpen: false,
        });
        workstation.window.close();
    };

    render() {
        const bodyHeight = editorSize.height - editorSize.headerHeight;
        return (
            <Layout className={`${classNamePrefix}-layout`}>
                <Layout.Content>
                    <Layout className={`${classNamePrefix}-layout-content`}>
                        <div>
                            <Tabs
                                activeKey={this.state.activeKey}
                                onChange={this.tabBarChanged}
                                tabPosition="left"
                                style={{ height: bodyHeight }}
                            >
                                <Tabs.TabPane
                                    tab={localizedStrings.NAVBAR_GENERAL}
                                    key={VC.GENERAL}
                                >
                                    <HomeScreenGeneral />
                                    {this.buttonGroup()}
                                </Tabs.TabPane>
                                <Tabs.TabPane
                                    tab={localizedStrings.NAVBAR_HOME_SCREEN}
                                    key={VC.HOME_SCREEN}
                                >
                                    <HomeScreenHomeSetting
                                        visitCount={
                                            this.state.homeSettingTabVisitCount
                                        }
                                    />
                                    {this.buttonGroup()}
                                </Tabs.TabPane>
                                <Tabs.TabPane
                                    tab={localizedStrings.NAVBAR_COMPONENTS}
                                    key={VC.COMPONENTS}
                                >
                                    <HomeScreenComponents />
                                    {this.buttonGroup()}
                                </Tabs.TabPane>
                                {
                                  this.state
                                  .appearancePreviewFeatureEnabled && (
                                    <Tabs.TabPane 
                                      tab={localizedStrings.NAVBAR_APPEARANCE} 
                                      key={VC.APPEARANCE}>
                                      <HomeScreenAppearance />
                                      {this.buttonGroup()}
                                    </Tabs.TabPane>
                                  )
                                }
                                
                                {/* <Tabs.TabPane tab={localizedStrings.NAVBAR_APPEARANCE} key={VC.APPEARANCE}>
                                {this.buttonGroup()}
                            </Tabs.TabPane> */}
                                {this.state.colorPaletteFeatureEnable &&
                                    this.state
                                        .colorPalettePreviewFeatureEnable && (
                                        <Tabs.TabPane
                                            tab={
                                                localizedStrings.NAVBAR_DOSSIERSETTINGS
                                            }
                                            key={VC.DOSSIERSETTINGS}
                                        >
                                            <ColorPaletteBlade />
                                            {this.buttonGroup()}
                                        </Tabs.TabPane>
                                    )}
                                {this.state.contentBundleFeatureEnable && (
                                    <Tabs.TabPane
                                        tab={
                                            localizedStrings.NAVBAR_CONTENT_BUNDLES
                                        }
                                        key={VC.CONTENT_BUNDLES}
                                        disabled={
                                            this.props.config.homeScreen
                                                .mode === 1
                                        }
                                    >
                                        <HomeScreenContentBundles />
                                        {this.buttonGroup()}
                                    </Tabs.TabPane>
                                )}

                                {this.state.customEmailFeatureEnabled && (
                                <Tabs.TabPane
                                    tab={localizedStrings.NAVBAR_CUSTOM_EMAIL_SETTINGS}
                                    key={VC.CUSTOMEMAILSETTINGS}
                                >
                                    <CustomEmailBlade />
                                    {this.buttonGroup()}
                                </Tabs.TabPane>)}
                                <Tabs.TabPane
                                    tab={localizedStrings.NAVBAR_MORE_SETTINGS}
                                    key={VC.MORESETTINGS}
                                >
                                    <HomeScreenMoreSetting />
                                    {this.buttonGroup()}
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    </Layout>
                </Layout.Content>
            </Layout>
        );
    }
}

const mapState = (state: RootState) => ({
    config: selectCurrentConfig(state),
    isDossierHome: selectIsDossierAsHome(state),
    isDuplicateConfig: selectIsDuplicateConfig(state),
    isConfigNameError: selectIsConfigNameError(state),
    isCustomEmailError: selectIsCustomEmailError(state),
    shouldSendPreviewEmail: selectShouldSendPreviewEmail(state),
    emailSettings: selectCustomizeEmailSetting(state),

    defaultGroupsName: selectDefaultGroupsName(state),
    configInfoList: selectConfigInfoList(state),
    isStateChanged: selectIsConfigChanged(state),
    isColorPalettesSelected: selectColorPalettesSelected(state),
});

const connector = connect(mapState, {
    updateCurrentConfig: Actions.updateCurrentConfig,
    setDuplicateConfig: Actions.setDuplicateConfig,
    setCurrentConfig: Actions.setCurrentConfig,
    setConfigInfoList: Actions.setConfigInfoList,
});

export default connector(HomeScreenConfigEditor);
