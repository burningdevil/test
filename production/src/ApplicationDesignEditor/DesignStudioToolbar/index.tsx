import * as React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import { env } from '../../main'
import classnames from 'classnames'
import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { selectTheme } from '../../store/selectors/ApplicationDesignEditorSelector'
import { ApplicationLogos, ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import * as Actions from '../../store/actions/ActionsCreator'
import { WorkstationModule } from '@mstr/workstation-types'
import './styles.scss'
import { Input } from '@mstr/rc'
import { validateUrl } from '../utils/urlValidationHelper'
import { localizedStrings } from '../../modules/components/HomeScreenConfigConstant';
import { t } from "../../i18n/i18next";

declare var workstation: WorkstationModule

type DesignStudioToolbarProps = {
    theme: ApplicationTheme
}

const DesignStudioToolbar: React.FC<DesignStudioToolbarProps> = ({ theme }) => {
    const [saving, setSaving] = React.useState(false)

    const handleCancelTheme = async () => {
        await env.window.close()
    }

    const handleSaveTheme = async () => {
        setSaving(true)
        await env.window.postMessage({ theme })
        setSaving(false)
    }

    return (
        <div className='title-section'>
            <div className='label'>Library Home - Web Interface</div>
            <div className='btn-section'>
                <Button className={classnames('btn', 'cancel')} type='default' onClick={handleCancelTheme}>{t('cancel')}</Button>
                <Button className={classnames('btn', 'save')} type='primary' onClick={handleSaveTheme} loading={saving}>{t('save')}</Button>
            </div>
        </div>
    )
}

export default DesignStudioToolbar
