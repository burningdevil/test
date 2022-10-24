import { Layout } from 'antd';
import * as React from 'react';
import { localizedStrings, previewerWidth } from '../../HomeScreenConfigConstant';
import CustomEmailForm from './email-form/email-form';
import CustomEmailPreview from './email-preview/email-preview';
import './custom-email.scss'
import { CaretRightOutlined } from '@ant-design/icons';
import { CSSTransition } from 'react-transition-group';
import * as _ from 'lodash';
const classNamePrefix = 'home-screen-custom-email-setting-v2';
const CustomEmailBladeV2: React.FC<any> = (props: any) => {
    const [openPreview, setPreview] = React.useState(false);
    const nodeRef = React.useRef(null);
    return (
        <Layout className={`${classNamePrefix}`}>
            <Layout.Content className={openPreview ? `${classNamePrefix}-left` : `${classNamePrefix}-left pr30`}>
                <CustomEmailForm env = {props.env}/>
            </Layout.Content>
            {/**preview control */}
            <div className = {`${classNamePrefix}-previewBtn`} onClick = {() => {setPreview(!openPreview)}}>
                <CaretRightOutlined rotate={openPreview ? 180 : 0} />
                <span>{localizedStrings.PREVIEW}</span>
            </div>
            {/* previewer */}
            <CSSTransition
                in={openPreview}
                nodeRef={nodeRef}
                timeout={500}
                classNames="preview"
                unmountOnExit
                onEnter={_.noop}
                onExited={_.noop}
            >
                { 
                <Layout.Sider className={`${classNamePrefix}-right`} width={previewerWidth}>
                    <CustomEmailPreview />
                </Layout.Sider>
            }
            </CSSTransition> 
        </Layout>
    );
};

export default CustomEmailBladeV2;