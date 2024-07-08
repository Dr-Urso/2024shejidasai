import styles from "./index.less";
import {Link, Outlet} from "@@/exports";
import React from "react";

export default function TextPage() {
    return (
        <>
            <div className={styles.Index}>
                <div className={styles.Header}>
                    <div className={styles.Logo}>星火翻译</div>
                    <div className={styles.Goback}>
                        <Link to="/"><p>回到首页</p></Link>
                        <Link to="/login"><p>登录</p></Link>
                    </div>
                </div>
                <div className={styles.Content}>
                    <div className={styles.Left}>
                        <Link to="/text"><p>文本翻译</p></Link>
                        <Link to="/document"><p>文档翻译</p></Link>
                    </div>
                    <div className={styles.Right}>
                        <div>文本翻译</div>
                    </div>
                </div>

            </div>
        </>
    );
}