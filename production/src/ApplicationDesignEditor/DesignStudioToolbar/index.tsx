import * as React from 'react'
import { Button } from 'antd'
import { env } from '../../main'
import classnames from 'classnames'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import './styles.scss'
import { t } from "../../i18n/i18next";


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
