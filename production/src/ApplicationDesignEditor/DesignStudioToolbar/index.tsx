import * as React from 'react'
import { Button } from 'antd'
import { WorkstationModule } from '@mstr/workstation-types'
import classnames from 'classnames'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import { t } from "../../i18n/i18next";
import './styles.scss'

type DesignStudioToolbarProps = {
    theme: ApplicationTheme;
    handleClose: () => void;
}

declare var workstation: WorkstationModule;

const DesignStudioToolbar: React.FC<DesignStudioToolbarProps> = ({ theme, handleClose }) => {
    const [applying, setApplying] = React.useState(false)

    const handleApplyTheme = async () => {
        setApplying(true)
        await workstation.window.setCloseInfo(JSON.stringify(theme))
        setApplying(false)
        await workstation.window.close()
    }

    return (
        <div className='title-section'>
            <div className='label'>{t('designStudioWindowSubtitle')}</div>
            <div className='btn-section'>
                <Button className={classnames('btn', 'cancel')} type='default' onClick={handleClose}>{t('cancel')}</Button>
                <Button className={classnames('btn', 'apply')} type='primary' onClick={handleApplyTheme} loading={applying}>{t('apply')}</Button>
            </div>
        </div>
    )
}

export default DesignStudioToolbar