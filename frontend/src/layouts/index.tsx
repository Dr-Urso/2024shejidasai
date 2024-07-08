import { Link, Outlet } from 'umi';
import styles from './index.less';
import './global.scss';
import { pkg } from '@carbon/ibm-products';
import {UserProvider} from "@/Utils/UserContext";
export default function Layout() {
  pkg.component.UserAvatar = true;
  return (
<UserProvider>
      <Outlet />
</UserProvider>
  );
}
