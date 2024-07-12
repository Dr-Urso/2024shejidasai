import React from 'react';
import styles from './index.less';
import {Content} from "carbon-components-react";

export default function Page() {
  return (
    <>
        <Content className={styles.Container} id='main-content'>
         <h1>文档翻译施工ing</h1>
        </Content>
    </>
  );
}
