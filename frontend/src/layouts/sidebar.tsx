import { Link, Outlet } from 'umi';
import styles from './sidebar.less';
import './global.scss';
import { pkg } from '@carbon/ibm-products';
import {UserProvider} from "@/Utils/UserContext";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {
    Button,
    Header,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderName,
    SideNav,
    SideNavItems,
    SideNavLink, Theme
} from "@carbon/react";
import {Chat, Login, Menu, Tools, User} from "@carbon/icons-react";
import {useLocation} from "@@/exports";
export default function Layout() {
  pkg.component.UserAvatar = true;
     const location = useLocation();

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


                <HeaderGlobalBar>
                    <Button renderIcon={Menu} onClick={ toggleSideNav} size="small" kind="ghost" hasIconOnly />
                    <Button renderIcon={Login} onClick={ ()=>navigate('/register')} size="small" kind="ghost" hasIconOnly />
                    <Button renderIcon={User} onClick={ ()=>navigate('/login')} size="small" kind="ghost" hasIconOnly />

                </HeaderGlobalBar>
            </Header>
            <SideNav isFixedNav={true} expanded={isSideNavExpanded} isChildOfHeader={false} aria-label="Side navigation">
                <SideNavItems>
                    <SideNavLink href='/plat/text'>
                        文本翻译
                    </SideNavLink>
                    <SideNavLink href='/plat/document'>
                        音频翻译
                    </SideNavLink>
                    <SideNavLink href='/plat/bbs'>
                        师生论坛
                    </SideNavLink>
                    <SideNavLink href='/plat/message'>
                        一对一私聊
                    </SideNavLink>
                </SideNavItems>
            </SideNav>
            <UserProvider>
                <Outlet />
            </UserProvider>
        </>
    );
}
