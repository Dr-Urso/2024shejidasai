import React, { useState, useEffect } from 'react';
import { Button, TextInput } from "@carbon/react";
import axios from 'axios';
import styles from './index.less';

export default function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const handleRegister = async () => {
        try {
            const response = await fetch('/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  // 告诉服务器请求体的内容类型是JSON
                },
                body: JSON.stringify({ username, password })  // 将对象转换为JSON字符串
            });

            const data = await response.json();  // 解析响应中的JSON数据
            if (response.ok) {
                console.log('Registration successful:', data);
            } else {
                setErrorMessage(`注册失败: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className={styles.Container}>
            <div className={styles.Tab}>
                <h1>欢迎注册未来教育平台</h1>
                <TextInput
                    className={styles.Text}
                    id="text-input-1"
                    labelText="邮箱地址"
                    helperText="反馈信息"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextInput
                    className={styles.Text}
                    id="text-input-2"
                    labelText="密码"
                    helperText="反馈信息"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
                <Button className={styles.Button} onClick={handleRegister}>立即注册</Button>
            </div>
        </div>
    );
}
