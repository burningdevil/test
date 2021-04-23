import { Checkbox } from 'antd'
import * as React from 'react'
// import '../scss/'
import { platformType } from './HomeScreenGeneral'

// constatns 
// toolbar icon display text
const iconTypes = {
    sidebar: 'Sidebar',
    sortAndFilter: 'Library Sort and Filter',
    multiSelect: 'Multi-Select (Web and Desktop)',
    search: 'Search',
    notification: 'Notification',
    account: 'Account',
    toc: 'Table of Contents',
    bookmark: 'Bookmark',
    reset: 'Reset Dossier',
    filter: 'Filter',
    comment: 'Comments',
    share: 'Share',
    dataSearch: 'Data Search (Desktop Only)',
    hyper: 'Hyper Intelligence (Desktop Only)',
    aaFont: 'Font Size in Grid (Mobile Only)'
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


class HomeScreenComponentsRow extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const { icon } = this.props
        return (
            <div>
                <h1> 
                    {icon}
                </h1>
            </div>
        )
    }
}

const transferData = function(icons: Array<string>) {
    return icons.map( (icon, index) => (
        <div className = "home-screen-components{icon}" key={index}>
            <HomeScreenComponentsRow icon={icon} />
        </div>
    ))
}

export default class HomeScreenComponents extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    render() {
        const { mode, platform } = this.props

        let lists = mode == 1 ? dossierIconsDossierHome : libraryIcons.concat(dossierIcons)
        return (
            <div> 
                <div className = "home-screen-components-enable-feature">
                    <h1>
                        <b> Enable Features </b>
                        <div>
                            Set toolbar behaviors and enable or disable the functions below
                        </div>
                    </h1>
                </div>

                <div className = "home-screen-components-toolbar">
                    <Checkbox>Collapse toolbar by default</Checkbox>
                </div>
                    
                <div>
                    <h1>Dossier Window</h1>
                </div>

                <div className = "home-screen-components-icons"> 
                    {
                        transferData(lists)
                    }
                </div>
                {
                    // conditional render platform specified icons
                    platform.includes(platformType.desktop) && <div>
                        {
                            transferData(extraDesktopIcons)
                        }
                    </div>
                }
                {
                    platform.includes(platformType.mobile) && <div> 
                        {
                            transferData(extraMobileIcons)
                        }
                    </div>
                }
            </div>
        )
    }
}
