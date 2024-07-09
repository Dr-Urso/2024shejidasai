import styles from "./index.less";
import {Link} from "@@/exports";
import React, {useState} from "react";
import {
    Content,
    Header,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderName,
    SideNav,
    SideNavItems,
    SideNavLink
} from "carbon-components-react";
import {useNavigate} from "react-router-dom";
import {Login, Menu} from "@carbon/icons-react";
import StoryContent from '/src/pages/text/text'

export default function TextPage() {
    return (
        <>
            <Content id='main-content' >
                <div>
                    <h1>文本翻译ing</h1>
                </div>
            </Content>
        </>
    );
}