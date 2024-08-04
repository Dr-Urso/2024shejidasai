import { Link, Outlet } from 'umi';
import styles from './sidebar.less';
import './global.scss';
import { pkg } from '@carbon/ibm-products';
import {UserProvider} from "@/Utils/UserContext";
import {useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import { useUser,UserContext } from "@/Utils/UserContext";
import {
    Button,
    Header,
    HeaderGlobalAction,
    HeaderGlobalBar, HeaderMenuButton,
    HeaderName,
    SideNav,
    SideNavItems,
    SideNavLink, Theme
} from "@carbon/react";
import {Chat, Login, Menu, Tools, User} from "@carbon/icons-react";
import {useLocation} from "@@/exports";
export default function Layout() {
    const { student_id, teacher_id, username } = useContext(UserContext);
  pkg.component.UserAvatar = true;
     const location = useLocation();

    const navigate = useNavigate();
    const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    function toggleSideNav() {
        setIsSideNavExpanded(!isSideNavExpanded);
    }

    function handleSideNavLinkClick(path) {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsSideNavExpanded(false);
            navigate(path);
        }, 50); // 300ms 与 CSS 过渡时间一致
    }

    // console.log('这里是侧边栏的日志',{ username, student_id, teacher_id });
    return (
        <>
            <Header>
                <HeaderMenuButton aria-label="打开侧边菜单"
                                  isCollapsible
                                  onClick={toggleSideNav}
                                  isActive={isSideNavExpanded}/>
                <HeaderName href="/" prefix="智学">
                    未来
                </HeaderName>


                <HeaderGlobalBar>
                    <Button renderIcon={Login} onClick={ ()=>navigate('/register')} size="small" kind="ghost" hasIconOnly />
                    <Button renderIcon={User} onClick={ ()=>navigate('/login')} size="small" kind="ghost" hasIconOnly />

                </HeaderGlobalBar>
            </Header>
            <SideNav isFixedNav={true} expanded={isSideNavExpanded} isChildOfHeader={false} aria-label="Side navigation"
                     className={`sideNavContainer ${isSideNavExpanded ? 'sideNavExpanded' : 'sideNavCollapsed'}`}
            >
                <SideNavItems>
                    {student_id && (<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/to_do_list')}>
                        学习计划
                    </SideNavLink>)}
                    {student_id && (<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/diary')}>
                        我的日记
                    </SideNavLink>)}
                    {teacher_id && (<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/to_do_list')}>
                        教学计划
                    </SideNavLink>)}
                    {student_id && (<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/analyse')}>
                        成绩分析
                    </SideNavLink>)}
                    {student_id && (<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/composition')}>
                        作文润色
                    </SideNavLink>)}
                    {teacher_id && (<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/teaching_plan')}>
                        教案生成
                    </SideNavLink>)}
                    {teacher_id && (<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/correct')}>
                        作文批改
                    </SideNavLink>)}
                    <SideNavLink onClick={()=>handleSideNavLinkClick('/plat/text')}>
                        文本翻译
                    </SideNavLink>
                    {(<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/audio')}>
                        书籍视听
                    </SideNavLink>)}
                    {(<SideNavLink onClick={()=>handleSideNavLinkClick('/plat/image')}>
                        趣味图片
                    </SideNavLink>)}
                     <SideNavLink onClick={()=>handleSideNavLinkClick('/plat/bbs')}>
                        师生论坛
                    </SideNavLink>
                    <SideNavLink onClick={()=>handleSideNavLinkClick('/plat/documentQA')}>
                        文档问答
                    </SideNavLink>
                </SideNavItems>
            </SideNav>
            <UserProvider>
                <Outlet />
            </UserProvider>
        </>
    );
}
