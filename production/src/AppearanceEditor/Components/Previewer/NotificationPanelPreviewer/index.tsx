import * as React from 'react';
import classnames from 'classnames';
import { Popover } from 'antd';
import { reviewType } from '../../../../modules/components/HomeScreenConfigConstant';
import './styles.scss';

type NotificationPanelPreviewerType = {
    deviceType: string,
    isNoTheme: boolean,
    isDarkTheme: boolean,
    previewerClassName(deviceType: string, appender: string): string
}

const NotificationPanelPreviewer: React.FC<NotificationPanelPreviewerType> = ({ deviceType, isNoTheme, isDarkTheme, previewerClassName }) => {
    const renderNotificationPanelPreview = (deviceType: string) => {
        const notificationDate = '08/24/2021';
        const notificationListDiv = (
            <div className='notification-list'>
                <div className={classnames('notification-wrapper', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                    <div className={classnames('notification', 'n1', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                        <div className={classnames('notification-icn', 'n1')} />
                        <div className={classnames('notification-content', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>
                            <div className='header'>
                                You have 1 new message in a discussion in <span>Discussion</span>.
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
                                    <span>User A</span> shared <span>Dossier A</span> with you.
                                </div>
                                <div className='subheader'>
                                    Hi, here is the information I mentioned in our discussion earlier today. Thanks!
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
                                    <span>User B</span> shared <span>Dossier B</span> with you.
                                </div>
                                <div className='subheader'>
                                    Here's the bookmark to find our features.
                                </div>
                                <div className='btn-row'>
                                    <div className={classnames('accept-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>Accept</div>
                                    <div className={classnames('ignore-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>Ignore</div>
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
                        <div className={classnames('clear-btn', { 'no-theme': isNoTheme })}>Clear All</div>
                    </React.Fragment>
                );
                return (
                    <Popover
                        className={previewerClassName(deviceType, '-notification-panel')}
                        overlayClassName={classnames(previewerClassName(deviceType, '-notification-panel-overlay'), { 'no-theme': isNoTheme })}
                        content={popoverContent}
                        title='Notifications'
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
                            <div className={classnames('close-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>Close</div>
                            <div className={classnames('edit-btn', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>Edit</div>
                            <div className={classnames('title-text', { 'no-theme': isNoTheme }, { 'dark-theme': isDarkTheme })}>Notifications</div>
                        </div>
                        {notificationListDiv}
                    </div>
                );
        };
    };

    return renderNotificationPanelPreview(deviceType);
};

export default NotificationPanelPreviewer;