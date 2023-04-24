import * as React from 'react';
import classnames from 'classnames';
import { Popover } from 'antd';
import { reviewType, localizedStrings } from '../../../../modules/components/HomeScreenConfigConstant';
import './styles.scss';

type NotificationPanelPreviewerType = {
    deviceType: string,
    isNoTheme: boolean,
    isDarkTheme: boolean,
    previewerClassName(deviceType: string, appender: string): string
}

const NotificationPanelPreviewer: React.FC<NotificationPanelPreviewerType> = ({ deviceType, isNoTheme, isDarkTheme, previewerClassName }) => {
    // replaces placeholders in string with a JSX bold span element 
    const replacePlaceholdersWithBoldString = (originalString: string, replacementStrings: Array<string>) => {
        const placeholderRegex = /{{[a-zA-Z]+}}/;
        const splitString = originalString.split(placeholderRegex);
        let replacedStringArr = [];
        for (let i = 0; i < replacementStrings.length; i++) {
            replacedStringArr.push([
                splitString[i],
                <span style={{ fontWeight: '600' }} key={i}>{replacementStrings[i]}</span>
            ]);
        };

        return replacedStringArr;
    };

    const renderNotificationPanelPreview = (deviceType: string) => {
        const notificationDate = '08/24/2021';
        const notificationListDiv = (
            <div className='notification-list'>
                <div className={classnames('notification-wrapper', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                    <div className={classnames('notification', 'n1', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                        <div className={classnames('notification-icn', 'n1')} />
                        <div className={classnames('notification-content', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                            <div className='header'>
                                {replacePlaceholdersWithBoldString(localizedStrings.SAMPLE_NOTIFICATION_TITLE_1, ['Travel Agency Transactions'])}
                            </div>
                            <div className={classnames('date', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{notificationDate}</div>
                        </div>
                    </div>
                </div>
                <div className={classnames('notification-wrapper', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                    <div className={classnames('notification', 'n2', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                        <div className={classnames('notification-icn', 'n2')} />
                            <div className={classnames('notification-content', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                                <div className='header'>
                                    {replacePlaceholdersWithBoldString(localizedStrings.SAMPLE_NOTIFICATION_TITLE_2, ['Smith, Cassie', 'Bitcoin Analytics'])}
                                </div>
                                <div className='subheader'>
                                    {localizedStrings.SAMPLE_NOTIFICATION_SUBTITLE_1}
                                </div>
                                <div className={classnames('date', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{notificationDate}</div>
                        </div>
                    </div>
                </div>
                <div className={classnames('notification-wrapper', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                    <div className={classnames('notification', 'n3', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                        <div className={classnames('notification-icn', 'n3')} />
                            <div className={classnames('notification-content', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                                <div className='header'>
                                    {replacePlaceholdersWithBoldString(localizedStrings.SAMPLE_NOTIFICATION_TITLE_2, ['Hurtt, Mike', 'Retail Insights'])}
                                </div>
                                <div className='subheader'>
                                    {localizedStrings.SAMPLE_NOTIFICATION_SUBTITLE_2}
                                </div>
                                <div className='btn-row'>
                                    <div className={classnames('accept-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{localizedStrings.ACCEPT}</div>
                                    <div className={classnames('ignore-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{localizedStrings.IGNORE}</div>
                                </div>
                            <div className={classnames('date', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{notificationDate}</div>
                        </div>
                    </div>
                </div>
            </div>
        );

        switch(deviceType) {
            case reviewType.WEB:
                const popoverContent = (
                    <React.Fragment>
                        {notificationListDiv}
                        <div className={classnames('clear-btn', { 'no-theme': isNoTheme })}>{localizedStrings.CLEAR_ALL}</div>
                    </React.Fragment>
                );
                return (
                    <Popover
                        className={previewerClassName(deviceType, '-notification-panel')}
                        overlayClassName={classnames(previewerClassName(deviceType, '-notification-panel-overlay'), { 'no-theme': isNoTheme })}
                        content={popoverContent}
                        title={(
                            <React.Fragment>
                                <div className='title-text' title={localizedStrings.NOTIFICATIONS}>{localizedStrings.NOTIFICATIONS}</div>
                                <div className='icon-pnl_close' />
                            </React.Fragment>
                        )}
                        placement='bottom'
                        transitionName='none'
                        open
                    >
                        <div />
                    </Popover>
                );
            case reviewType.PHONE:
                return (
                    <div className={classnames(
                        previewerClassName(deviceType, '-notification-panel'),
                        { 'no-theme': isNoTheme },
                        { 'dark-theme': isDarkTheme }
                    )}>
                        <div className={classnames('notification-panel-title-section', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                            <div className={classnames('close-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{localizedStrings.CLOSE}</div>
                            <div className={classnames('edit-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{localizedStrings.EDIT}</div>
                            <div className={classnames('title-text', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>{localizedStrings.NOTIFICATIONS}</div>
                        </div>
                        {notificationListDiv}
                    </div>
                );
        };
    };

    return renderNotificationPanelPreview(deviceType);
};

export default NotificationPanelPreviewer;