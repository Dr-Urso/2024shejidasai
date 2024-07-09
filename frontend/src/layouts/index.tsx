import { Link, Outlet } from 'umi';
import styles from './index.less';
import './global.scss';
import { pkg } from '@carbon/ibm-products';
import {UserProvider} from "@/Utils/UserContext";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {Header, HeaderGlobalBar, HeaderName, SideNav, SideNavItems, SideNavLink} from "carbon-components-react";
import {Chat, Login, Menu} from "@carbon/icons-react";
import StoryContent from "@/pages/text/text";
import {useLocation} from "@@/exports";
export default function Layout() {
  pkg.component.UserAvatar = true;
    // const location = useLocation();
    // if (location.pathname === '/') {
    //     return <SimpleLayout><Outlet /></SimpleLayout>
    // }
    const navigate = useNavigate();
    const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);
    function toggleSideNav() {
        setIsSideNavExpanded(!isSideNavExpanded);
    }

    return (
        <>
            <Header>
                <HeaderName href="/" prefix="智学">
                    未来
                </HeaderName>
                <Menu onClick={toggleSideNav} size={20} />
                <Chat onClick={()=>{navigate('/message')}} size={20}/>
                <HeaderGlobalBar>
                    <Login onClick={ ()=>navigate('/login')} size={20}/>
                </HeaderGlobalBar>
            </Header>
            <SideNav isFixedNav={true} expanded={isSideNavExpanded} isChildOfHeader={false} aria-label="Side navigation">
                <SideNavItems>
                    <SideNavLink href='/text'>
                        文本翻译
                    </SideNavLink>
                    <SideNavLink href='/document'>
                        文档翻译
                    </SideNavLink>
                </SideNavItems>
            </SideNav>
            <UserProvider>
                <Outlet />
            </UserProvider>
        </>
    );
}
