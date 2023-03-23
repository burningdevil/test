import * as React from 'react'
import { connect } from 'react-redux'
import { Button, Radio } from 'antd'
import { WorkstationModule } from '@mstr/workstation-types'
import classnames from 'classnames'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import { reviewType } from '../../modules/components/HomeScreenConfigConstant'
import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { selectAppearancePreviewDeviceType } from '../../store/selectors/AppearanceEditorSelector'
import * as Actions from '../../store/actions/ActionsCreator'
import { t } from "../../i18n/i18next";
import './styles.scss'

type AppearanceEditorToolbarProps = {
    theme: ApplicationTheme;
    appearancePreviewDeviceType: string;
    handleAppearancePreviewDeviceTypeChange: (type: string) => {
        type: string;
        data: string;
    };
    handleClose: () => void;
}

declare var workstation: WorkstationModule;

const AppearanceEditorToolbar: React.FC<AppearanceEditorToolbarProps> = ({ theme, appearancePreviewDeviceType, handleAppearancePreviewDeviceTypeChange, handleClose }) => {
    const [applying, setApplying] = React.useState(false)

    const handleApplyTheme = async () => {
        setApplying(true)
        await workstation.window.setCloseInfo(JSON.stringify(theme))
        setApplying(false)
        await workstation.window.close()
    }

    return (
        <div className='title-section'>
            <div className='label'>{t('appearanceEditorWindowSubtitle')}</div>
            <div className='btn-section'>
                <Radio.Group
                    className='mstr-appearance-editor-preview-device-type-radio-group'
                    value={appearancePreviewDeviceType}
                    buttonStyle='solid'
                    onChange={(e) => handleAppearancePreviewDeviceTypeChange(e?.target?.value)}
                >
                    <Radio.Button value={reviewType.WEB}><div className={classnames('preview-device-type-icn', reviewType.WEB)} /></Radio.Button>
                    <Radio.Button value={reviewType.PHONE}><div className={classnames('preview-device-type-icn', reviewType.PHONE)} /></Radio.Button>
                </Radio.Group>
                <Button className={classnames('btn', 'cancel')} type='default' onClick={handleClose}>{t('cancel')}</Button>
                <Button className={classnames('btn', 'apply')} type='primary' onClick={handleApplyTheme} loading={applying}>{t('apply')}</Button>
            </div>
        </div>
    )
}

const mapState = (state: RootState) => ({
    appearancePreviewDeviceType: selectAppearancePreviewDeviceType(state)
})

const connector = connect(mapState, {
    handleAppearancePreviewDeviceTypeChange: Actions.updateAppearancePreviewDeviceType
})

export default connector(AppearanceEditorToolbar)
