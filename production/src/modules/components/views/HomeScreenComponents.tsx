import { Checkbox, Switch, Table, Layout } from 'antd'
import * as React from 'react'
import '../../../../src/assets/fonts/webfonts/css/dossier.css'
import { platformType } from './HomeScreenGeneral'

// constatns 
// toolbar icon [display text, icon-name]
const iconTypes = {
    sidebar: ['Sidebar', ' icon-listview'],
    sortAndFilter: ['Library Sort and Filter', 'icon-filter'],
    multiSelect: ['Multi-Select (Web and Desktop)', 'icon-tb_select_a'],
    search: ['Search', 'icon-search'],
    notification: ['Notification', 'icon-tb_notif_n'],
    account: ['Account', 'icon-account-resp'],
    toc: ['Table of Contents', 'icon-toc'],
    bookmark: ['Bookmark', 'icon-bookmark'],
    reset: ['Reset Dossier', 'icon-resetfile'],
    filter: ['Filter', 'icon-tb_filter_n'],
    comment: ['Comments', 'icon-lv_comments_i'],
    share: ['Share', 'icon-tb_share_n'],
    // platform specified
    dataSearch: ['Data Search (Desktop Only)', 'icon-searchfilter'],
    hyper: ['Hyper Intelligence (Desktop Only)', 'icon-checkmark2'],
    aaFont: ['Font Size in Grid (Mobile Only)', 'icon-pnl_shared'],
    // sidebar children
    test: ['test', 'icon-searchfilter'],
}

// library icons when mode is Libary as home
const libraryIcons = [iconTypes.sidebar, iconTypes.sortAndFilter, iconTypes.multiSelect, 
    iconTypes.search, iconTypes.notification, iconTypes.account]

// dossier icons when mode is Library as home
const dossierIcons = [iconTypes.toc, iconTypes.bookmark, iconTypes.reset, 
    iconTypes.filter, iconTypes.comment, iconTypes.share]

// dossier icons when mode is dossier as home
const dossierIconsDossierHome = dossierIcons.concat([iconTypes.notification, iconTypes.account])

// extra icons for specified platforms
const extraDesktopIcons = [iconTypes.dataSearch, iconTypes.hyper]
const extraMobileIcons = [iconTypes.aaFont]

// children icons for sidebar
const childrenIcons = [iconTypes.test]
interface RowData {
    key: number;
    image: string;
    name: string;
    selected: boolean;
}

const columns = [
    {
        title: "",
        key: "image",
        dataIndex: "image",
        size: "small",
        render: (iconName: string) => (<div className={iconName}/>)
    },
    {
        title: "",
        key: "name",
        dataIndex: "name"
    },
    {
        title: "",
        key: "selected",
        dataIndex: "selected",
        align: "right",
        render: (selected: boolean) => (< Switch  defaultChecked={selected} />)
    }
];

export default class HomeScreenComponents extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    renderTable(icons: Array<Array<string>>) {
        let expandChildren = childrenIcons.map( (icon, index) => 
            ({key: 100+index, image: icon[1], name: icon[0], selected: true})
        )

        let data = icons.map( (icon, index) => 
            {
                const hasChildren = icon === iconTypes.sidebar;
                return (  
                    hasChildren ? {key: index, image: icon[1], name: icon[0], selected: true, children: expandChildren} : {key: index, image: icon[1], name: icon[0], selected: true}
                )
            }
        )
        
        return <Table className="home-screen-components-table" dataSource={data} columns={columns} pagination={false} showHeader={false} scroll={{y: true, x: false}}/>
    }

    render() { 
        const { mode, platform } = this.props
        const dossierAsHome = mode === 1

        return (
            <Layout className="home-screen-components">
                <Layout.Content className="home-screen-components-left"> 
                    <div className = "home-screen-components-enable-feature">
                        Enable Features
                        <div className="home-screen-components-enable-feature-description">
                            Set toolbar behaviors and enable or disable the functions below
                        </div>
                    </div>

                    <div className = "home-screen-components-toolbar">
                        <Checkbox>Collapse toolbar by default</Checkbox>
                    </div>

                    {
                        // dossier as home group
                        dossierAsHome && <div className="home-screen-components-icons">
                            Library Window
                            {
                                this.renderTable(dossierIconsDossierHome)
                            }
                        </div>
                    }

                    {
                        // library as home group
                        !dossierAsHome && <div className="home-screen-components-icons">
                            Library Window (Home)
                            {
                                this.renderTable(libraryIcons)
                            }
                            Dossier Window
                            {
                                this.renderTable(dossierIcons)
                            }
                        </div>
                    }
                    
                    {
                        // conditional render platform specified icons
                        platform.includes(platformType.desktop) && <div>
                            {
                                this.renderTable(extraDesktopIcons)
                            }
                        </div>
                    }
                    {
                        platform.includes(platformType.mobile) && <div> 
                            {
                                this.renderTable(extraMobileIcons)
                            }
                        </div>
                    }
                </Layout.Content>
                {/* previewer */}
                <Layout.Sider className="home-screen-components-right">
                </Layout.Sider>
            </Layout>
        )
    }
}
