import * as React from 'react'
import { Button } from 'antd'
import { env } from '../../main'
import classnames from 'classnames'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import { t } from "../../i18n/i18next";
import './styles.scss'

type DesignStudioToolbarProps = {
    theme: ApplicationTheme
}

const DesignStudioToolbar: React.FC<DesignStudioToolbarProps> = ({ theme }) => {
    const [applying, setApplying] = React.useState(false)

    const handleCancelTheme = async () => {
        await env.window.close()
    }

    const handleApplyTheme = async () => {
        setApplying(true)
        await env.window.postMessage({ theme })
        setApplying(false)
    }

    return (
        <div className='title-section'>
            <div className='label'>{t('designStudioWindowSubtitle')}</div>
            <div className='btn-section'>
                <Button className={classnames('btn', 'cancel')} type='default' onClick={handleCancelTheme}>{t('cancel')}</Button>
                <Button className={classnames('btn', 'apply')} type='primary' onClick={handleApplyTheme} loading={applying}>{t('apply')}</Button>
            </div>
        </div>
    )
}

export default DesignStudioToolbar
