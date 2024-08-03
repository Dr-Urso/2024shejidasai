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
    function toggleSideNav() {
        setIsSideNavExpanded(!isSideNavExpanded);
    }
    console.log('这里是侧边栏的日志',{ username, student_id, teacher_id });
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
            <SideNav isFixedNav={true} expanded={isSideNavExpanded} isChildOfHeader={false} aria-label="Side navigation">
                <SideNavItems>
                    {student_id && (<SideNavLink href='/plat/analyse'>
                        成绩分析
                    </SideNavLink>)}
                    {student_id && (<SideNavLink href='/plat/to_do_list'>
                        学习计划
                    </SideNavLink>)}
                    {student_id && (<SideNavLink href='/plat/diary'>
                        日记本
                    </SideNavLink>)}
                    {teacher_id && (<SideNavLink href='/plat/to_do_list'>
                        教学计划
                    </SideNavLink>)}
                    <SideNavLink href='/plat/text'>
                        文本翻译
                    </SideNavLink>
                    <SideNavLink href='/plat/bbs'>
                        师生论坛
                    </SideNavLink>
                    {student_id && (<SideNavLink href='/plat/composition'>
                        作文润色
                    </SideNavLink>)}
                    {teacher_id && (<SideNavLink href='/plat/teaching_plan'>
                        教案生成
                    </SideNavLink>)}
                    {teacher_id && (<SideNavLink href='/plat/correct'>
                        作文批改
                    </SideNavLink>)}
                    {(<SideNavLink href='/plat/audio'>
                        书籍视听
                    </SideNavLink>)}
                    {(<SideNavLink href='/plat/image'>
                        趣味图片
                    </SideNavLink>)}
                </SideNavItems>
            </SideNav>
            <UserProvider>
                <Outlet />
            </UserProvider>
        </>
    );
}
