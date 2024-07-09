import { Link, Outlet } from 'umi';
import './global.scss';
import { pkg } from '@carbon/ibm-products';
import {UserProvider} from "@/Utils/UserContext";

import React, {useState} from "react";

export default function Layout() {
    pkg.component.UserAvatar = true;

    return (
        <>

            <UserProvider>
                <Outlet />
            </UserProvider>
        </>
    );
}
