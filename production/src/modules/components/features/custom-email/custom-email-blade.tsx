import { Layout } from 'antd';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { previewerWidth } from '../../HomeScreenConfigConstant';
import CustomEmailForm from './email-form/email-form';
import CustomEmailPreview from './email-preview/email-preview';
import './custom-email.scss'
const classNamePrefix = 'home-screen-custom-email-setting';
const CustomEmailBlade: React.FC<any> = () => {
    
    return (
        
        <Layout className={`${classNamePrefix}`}>
            <Layout.Content className={`${classNamePrefix}-left`}>
                <CustomEmailForm/>
            </Layout.Content>
            {/* previewer */}
            <Layout.Sider className={`${classNamePrefix}-right`} width={previewerWidth}>
                <CustomEmailPreview />
            </Layout.Sider>
        </Layout>
    );
};

export default CustomEmailBlade;