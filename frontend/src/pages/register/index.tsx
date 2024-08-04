import React, {useEffect, useState} from 'react';
import { Button, TextInput, RadioButton } from "@carbon/react";
import { Content, Header, HeaderName, RadioButtonGroup } from "carbon-components-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from './index.less';
import { Link } from "umi";
import bg from "@/assets/register.svg";
import {message} from "antd";

export default function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [user_type, setUser_type] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [mesg,setMessage]=useState('');
    const navigate = useNavigate();

    useEffect(() => {
        switch (mesg) {
            case '注册成功，请登录': {
                message.success({
                    content: '注册成功，请登录',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
        }
    }, [mesg]);

    const handleRegister = async () => {
        if (!username || !password || !id || !user_type) {
            setErrorMessage("请填写所有必填项");
            return;
        }

        let payload = { username, password, user_type };
        if (user_type === 'teacher') {
            payload.employee_id = id;
        } else {
            payload.student_id = id;
        }
        setMessage('');
        try {
            const response = await axios.post('/api/user/create', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;  // 获取响应数据
            if (response.status === 200 && data.detail === 'OK') {
                console.log('Registration successful:', data);
                setMessage('注册成功，请登录');

                // 延迟导航
                setTimeout(() => {
                    navigate('/login');
                }, 500); // 500毫秒延迟
            } else {
                setErrorMessage(`注册失败: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('请求失败，请稍后再试');
        }
    };


    return (
        <>
            <Header>
                <HeaderName href="/" prefix="智学">
                    未来
                </HeaderName>
            </Header>
            <div className={styles.Container}>
                <div className={styles.illustration_canva} style={{backgroundImage: `url(${bg})`}}></div>
                <div className={styles.head}></div>
                <div className={styles.formArea}>
                    <h1>创建账户</h1>
                    <div className="h-5"/>
                    <div className={styles.Jump}>
                        已有账户？
                        <Link to="/login">登录</Link>
                    </div>
                    <div className="h-5"/>
                    <div className={styles.Input}>
                        <TextInput
                            className={styles.Text}
                            id="text-input-1"
                            labelText="用户名"
                            helperText="不能超过16位"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="h-5"/>
                        <TextInput
                            className={styles.Text}
                            id="text-input-2"
                            labelText="密码"
                            type="password"
                            helperText="不能超过16位"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="h-5"/>
                        <TextInput
                            className={styles.Text}
                            id="text-input-3"
                            labelText="ID"
                            helperText=""
                            onChange={(e) => setId(e.target.value)}
                        />
                        <div className="h-5"/>
                    </div>
                    <RadioButtonGroup legendText="您是老师还是学生" name="radio-button-default-group">
                        <RadioButton labelText="老师" value="teacher" id="radio-1"
                                     onClick={() => setUser_type('teacher')}/>
                        <RadioButton labelText="学生" value="student" id="radio-2"
                                     onClick={() => setUser_type('student')}/>
                    </RadioButtonGroup>
                    <div className="h-5"/>
                    {errorMessage && <div style={{color: 'red', marginBottom: '10px'}}>{errorMessage}</div>}
                    <Button className={styles.Button} onClick={handleRegister}>立即注册</Button>
                </div>
                <div style={{position: 'absolute', left: '3%', top: '6em'}}>
                    <h1>欢迎访问未来教育平台</h1>
                    <div className="h-10"/>
                    <h2>创建账户以访问平台服务</h2>
                </div>
                <div className={styles.bottomBorder}>
                    ©2024 by 智学未来
                </div>
            </div>
        </>
    );
}
