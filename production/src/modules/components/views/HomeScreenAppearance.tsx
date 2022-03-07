import { Button } from 'antd'
import * as React from 'react'
import { connect } from 'react-redux'
import 'antd/dist/antd.css';
import * as _ from 'lodash'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfigThemes } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import { env } from '../../../main'
import { default as VC, localizedStrings, ApplicationTheme } from '../HomeScreenConfigConstant';
import { ObjectEditorSettings } from '@mstr/workstation-types';

const appThemeDefault = {
    id: '',
    name: '',
    settings: {}
}

class HomeScreenAppearance extends React.Component<any, any> {

    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = {
            currentEnv: {}
        }
    }

    componentDidUpdate() { }

    async componentDidMount() {
        const currentEnvironment = await env.environments.getCurrentEnvironment();
        this.setState({
            currentEnv: currentEnvironment
        });
    }

    openAppDesignEditor = (theme: ApplicationTheme = appThemeDefault) => {
        const objType = VC.APP_DESIGN_OBJTYPE;

        let options: ObjectEditorSettings = {
            objectType: objType,
            environment: this.state.currentEnv,
            extraContext: JSON.stringify(theme)
        }

        env.dialogs.openObjectEditor(options).catch((e: any) =>
            env.dialogs.error({
                message: localizedStrings.ERR_EDITOR_OPEN,
                additionalInformation: JSON.stringify(e)
            })
        )
    }

    render() {
        const { themes } = this.props;
        // TODO - Refactor/Implement UI to render list of themes
        return (
            <div>
                {
                    Array.isArray(themes) && themes.length === 0 ?
                        <div>
                            <Button type="primary" onClick={() => this.openAppDesignEditor(appThemeDefault)}>
                                Add Design
                            </Button>
                        </div>
                        : themes.forEach((theme: ApplicationTheme) => <div>{theme}</div>)
                }
            </div>
        )
    }
}

const mapState = (state: RootState) => ({
    themes: selectCurrentConfigThemes(state)
})

const connector = connect(mapState, {

})

export default connector(HomeScreenAppearance)
