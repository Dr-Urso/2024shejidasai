import React, { useState, useEffect} from 'react';
import { Button, TextInput,RadioButtonSkeleton,} from "@carbon/react";
import {Content, Header, HeaderName, RadioButton, RadioButtonGroup} from "carbon-components-react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import styles from './index.less';
import {Link} from "umi";
import bg from "@/assets/register.svg";
export default function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [id, setId] = useState("");
    const [user_type, setUser_type] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    let student_id='';
    let employee_id='';
    const handleRegister = async () => {
        if (!username || !password || !nickname || !id || !user_type) {
            setErrorMessage("请填写所有必填项");
            return;
        }
            if(user_type=='teacher')
            {employee_id=id
                try {
                    const response = await fetch('/api/user/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'  // 告诉服务器请求体的内容类型是JSON
                        },
                        body: JSON.stringify({username, password,user_type,employee_id})  // 将对象转换为JSON字符串
                    });

                    const data = await response.json();  // 解析响应中的JSON数据
                    if (response.ok) {
                        console.log('Registration successful:', data);
                        alert('注册成功，请登录');
                        navigate('/login');
                    } else {
                        setErrorMessage(`注册失败: ${data.detail}`);
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                }
            }
            else{student_id=id
                try {
                    const response = await fetch('/api/user/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'  // 告诉服务器请求体的内容类型是JSON
                        },
                        body: JSON.stringify({username, password,user_type,student_id})  // 将对象转换为JSON字符串
                    });

                    const data = await response.json();  // 解析响应中的JSON数据
                    if (response.ok) {
                        console.log('Registration successful:', data);
                        alert('注册成功，请登录');
                        navigate('/login');
                    } else {
                        setErrorMessage(`注册失败: ${data.detail}`);
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                }
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
                <div className={styles.head}>

                </div>
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
                            helperText="不能超过16位"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="h-5"/>
                        <TextInput
                            className={styles.Text}
                            id="text-input-3"
                            labelText="昵称"
                            helperText=""
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <div className="h-5"/>
                        <TextInput
                            className={styles.Text}
                            id="text-input-4"
                            labelText="ID"
                            helperText=""
                            onChange={(e) => setId(e.target.value)}
                        />
                        <div className="h-5"/>
                    </div>
                    <RadioButtonGroup legendText="您是老师还是学生" name="radio-button-default-group">
                        <RadioButton labelText="老师" value="radio-1" id="radio-1"
                                     onClick={() => setUser_type('teacher')}/>
                        <RadioButton labelText="学生" value="radio-2" id="radio-2"
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
                    这是底边
                </div>
            </div>
        </>
    );
}
