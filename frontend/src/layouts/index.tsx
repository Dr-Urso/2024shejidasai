import { Link, Outlet } from 'umi';
import styles from './index.less';
import './global.scss';
export default function Layout() {
  return (

      <Outlet />
  );
}
