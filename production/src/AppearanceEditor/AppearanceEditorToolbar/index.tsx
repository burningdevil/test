import * as React from 'react'
import { Button } from 'antd'
import { WorkstationModule } from '@mstr/workstation-types'
import classnames from 'classnames'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import { t } from "../../i18n/i18next";
import './styles.scss'

type AppearanceEditorToolbarProps = {
    theme: ApplicationTheme;
    handleClose: () => void;
}

declare var workstation: WorkstationModule;

const AppearanceEditorToolbar: React.FC<AppearanceEditorToolbarProps> = ({ theme, handleClose }) => {
    const [applying, setApplying] = React.useState(false)

    const handleApplyTheme = async () => {
        setApplying(true)
        const { color, ...themeRest } = theme;
        const themeToBeApplied = window.AppThemeColor.enabled ? theme : themeRest
        
        await workstation.window.setCloseInfo(JSON.stringify(themeToBeApplied))
        setApplying(false)
        await workstation.window.close()
    }

    return (
        <div className='title-section'>
            <div className='label'>{t('appearanceEditorWindowSubtitle')}</div>
            <div className='btn-section'>
                <Button className={classnames('btn', 'cancel')} type='default' onClick={handleClose}>{t('cancel')}</Button>
                <Button className={classnames('btn', 'apply')} type='primary' onClick={handleApplyTheme} loading={applying}>{t('apply')}</Button>
            </div>
        </div>
    )
}

export default AppearanceEditorToolbar
