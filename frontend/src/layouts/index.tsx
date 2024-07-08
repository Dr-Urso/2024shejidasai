import { Link, Outlet } from 'umi';
import styles from './index.less';
import './global.scss';
import { pkg } from '@carbon/ibm-products';
export default function Layout() {
  pkg.component.UserAvatar = true;
  return (

      <Outlet />
  );
}
