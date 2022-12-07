import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationLogos } from '../../../types/data-model/HomeScreenConfigModels';
import { t } from '../../../i18n/i18next';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentThemeLogos } from '../../../store/selectors/AppearanceEditorSelector';
import LogoCustomizer from './LogoCustomizer';
import './styles.scss';

type LogosProps = {
    logos: ApplicationLogos;
};

const Logos: React.FC<LogosProps> = ({ logos }) => {
    const {
        web = { type: 'URL', value: '' },
        favicon = { type: 'URL', value: '' },
        mobile = { type: 'URL', value: '' },
    } = logos || {};

    // list of logo types and their respective context
    const appThemeLogos = [
        {
            category: 'web',
            defn: web,
            subtitle: t('libraryWebSubtitle'),
            desc: t('libraryWebDesc'),
        },
        {
            category: 'favicon',
            defn: favicon,
            subtitle: t('libraryFaviconSubtitle'),
            desc: t('libraryFaviconDesc'),
        },
        {
            category: 'mobile',
            defn: mobile,
            subtitle: t('libraryMobileSubtitle'),
            desc: t('libraryMobileDesc'),
        },
    ];

    return (
        <div className="mstr-app-theme-logos">
            <div className="theme-logos-title">{t('appLogoTitle')}</div>
            {appThemeLogos.map((logo, index) => (
                <LogoCustomizer logo={logo} key={index} />
            ))}
        </div>
    );
};

const mapState = (state: RootState) => ({
    logos: selectCurrentThemeLogos(state),
});

const connector = connect(mapState, {});

export default connector(Logos);
