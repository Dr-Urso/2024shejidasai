import React from 'react';
import styles from './index.less';
import {TextInput, Form} from "@carbon/react";

export default function Page() {
  return (
    <div className={styles.container}>
        <div className={styles.header}>

        </div>
        <div className={styles.formArea}>
            <div className="text-5xl" style={{marginBottom: "7%"}}>用户登录</div>
            <div className={styles.greyline}/>
            <TextInput id="username" labelText="用户名" type="text"/>
        </div>
    </div>
  );
}
