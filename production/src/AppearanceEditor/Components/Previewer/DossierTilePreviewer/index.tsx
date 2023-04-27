import * as React from 'react';
import classnames from 'classnames';
import { localizedStrings } from '../../../../modules/components/HomeScreenConfigConstant';
import './styles.scss';

type DossierTilePreviewerType = {
    deviceType: string,
    isNoTheme: boolean,
    isDarkTheme: boolean,
    previewerClassName(deviceType: string, appender: string): string
}

const DossierTilePreviewer: React.FC<DossierTilePreviewerType> = ({ deviceType, isNoTheme, isDarkTheme, previewerClassName }) => {
    return <div className={previewerClassName(deviceType, '-library-dossier-tile')}>
        <div className='dossier-background' />
        <div className={classnames('dossier-name', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
            Dossier Name
        </div>
    </div>
};

export default DossierTilePreviewer;