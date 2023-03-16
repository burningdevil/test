import * as React from 'react';
import classnames from 'classnames';
import { Popover } from 'antd';
import './styles.scss';

type NotificationPanelPreviewerType = {
    deviceType: string,
    isNoTheme: boolean,
    previewerClassName(deviceType: string, appender: string): string
}

const NotificationPanelPreviewer: React.FC<NotificationPanelPreviewerType> = ({ deviceType, isNoTheme, previewerClassName }) => {
    const notificationDate = '08/24/2021';
    const popoverContent = <React.Fragment>
        <div className='notification-list'>
            <div className='notification-wrapper'>
                <div className={classnames('notification', 'n1', { 'no-theme': isNoTheme })}>
                    <div className={classnames('notification-icn', 'n1')} />
                    <div className={classnames('notification-content', { 'no-theme': isNoTheme })}>
                        <div className='header'>
                            You have 1 new message in a discussion in <span>ITS</span>.
                        </div>
                        <div className='date'>{notificationDate}</div>
                    </div>
                </div>
            </div>
            <div className='notification-wrapper'>
                <div className={classnames('notification', 'n2', { 'no-theme': isNoTheme })}>
                    <div className={classnames('notification-icn', 'n2')} />
                        <div className={classnames('notification-content', { 'no-theme': isNoTheme })}>
                            <div className='header'>
                                <span>Xiao, Qing</span> shared <span>TEC.PD</span> with you.
                            </div>
                            <div className='subheader'>
                                Hi, here is the information I mentioned in our discussion earlier today. Thanks!
                            </div>
                        <div className='date'>{notificationDate}</div>
                    </div>
                </div>
            </div>
            <div className='notification-wrapper'>
                <div className={classnames('notification', 'n3', { 'no-theme': isNoTheme })}>
                    <div className={classnames('notification-icn', 'n3')} />
                        <div className={classnames('notification-content', { 'no-theme': isNoTheme })}>
                            <div className='header'>
                                <span>Kelley, Alan</span> shared <span>TEC.PD</span> with you.
                            </div>
                            <div className='subheader'>
                                Here's the bookmark to find our features.
                            </div>
                            <div className='btn-row'>
                                <div className={classnames('accept-btn', { 'no-theme': isNoTheme })}>Accept</div>
                                <div className={classnames('ignore-btn', { 'no-theme': isNoTheme })}>Ignore</div>
                            </div>
                        <div className='date'>{notificationDate}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className={classnames('clear-btn', { 'no-theme': isNoTheme })}>Clear All</div>
    </React.Fragment>

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
};

export default NotificationPanelPreviewer;