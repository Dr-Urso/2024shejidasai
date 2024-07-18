import React, { useEffect, useState,useContext} from 'react';
import { Link } from 'umi';
import styles from './index.less';
import { TextInput, Button, Checkbox } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import axios from "axios";
import { useUser,UserContext } from "@/Utils/UserContext";
import { Content, Header, HeaderName } from "carbon-components-react";
import bg from '@/assets/login_illustration.svg'
import {useNavigate} from "react-router-dom";

export default function Page() {
    const { student_id, teacher_id, clearUserInfo } = useContext(UserContext);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [password, setPassword] = useState(localStorage.getItem('password') || '');
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberMe'));
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setUserInfo } = useUser();

    useEffect(() => {
        if (rememberMe) {
            setUsername(localStorage.getItem('username') || '');
            setPassword(localStorage.getItem('password') || '');
        }
    }, []);

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
        if (!rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
    };

    const onLogin = async () => {
        try {
            const response = await axios.post('/api/user/login', {
                username,
                password
            });

            if (response.data.detail === "OK") {
                setErrorMessage('');
                const { student_id, teacher_id } = response.data;
                console.log({ username, student_id, teacher_id });
                setUserInfo({ username, student_id, teacher_id });
                if (rememberMe) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }
                navigate('/plat');
                window.location.reload();
            } else {
                setErrorMessage('用户名或密码错误');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('请求失败，请稍后再试');
        }
    };
    const onLogout = async () => {

console.log({student_id,teacher_id})

        try {
            const response = await axios.get('/api/user/logout');
            if (response.data.detail === "未登录"){
              setErrorMessage('未登录');
                return;
            }
            if (response.data.detail === "OK") {
                setErrorMessage('');
                // 清除用户信息
                clearUserInfo();
                // 跳转到登录页面或主页
                navigate('/plat'); // 根据需求调整跳转页面
                window.location.reload();
            } else {
                setErrorMessage('注销失败，请稍后再试');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('请求失败，请稍后再试');
        }
    };
    const tourist=async ()=>{
if(student_id||teacher_id){
    try{
        const response = await axios.get('/api/user/logout');
        if (response.data.detail === "OK") {
            setErrorMessage('');
            // 清除用户信息
            clearUserInfo();
            // 跳转到登录页面或主页
            navigate('/plat'); // 根据需求调整跳转页面
            window.location.reload();
        }
    } catch (error) {console.log(error);
        setErrorMessage('请求失败，请稍后再试');}
}
else{       navigate('/plat'); // 根据需求调整跳转页面
        window.location.reload();
}
    }

    return (
        <div className={styles.container}>
            <Header>
                <HeaderName href="/" prefix="智学">
                    未来
                </HeaderName>
            </Header>
            <div className={styles.illustration_canva} style={{ backgroundImage: `url(${bg})` }}></div>
            <div className={styles.formArea}>
                <div className={styles.Top}>
                <div className="text-5xl" style={{ marginBottom: "5%" }}>用户登录</div>
                    <Button kind='tertiary' onClick={tourist} style={{
                        width: '200px', // 根据需要调整宽度
                        height: '24px', // 根据需要调整高度
                        fontSize: '10px', // 调整字体大小
                        padding: '4px' // 调整内边距
                    }}>
                        <div className="text-2xl" style={{marginBottom: "5%"}}>
                            游客登录
                            </div>
                    </Button>

                </div>
                <div className={styles.greyline} style={{ marginBottom: "2%" }} />
                <div className="text-xl text-gray-500" style={{ marginBottom: "2%", marginTop: "2%" }}>用户名</div>
                <TextInput id="username" type="text" size="lg" onChange={(e) => setUsername(e.target.value)} value={username} />
                <div className="text-xl text-gray-500" style={{ marginBottom: "2%", marginTop: "2%" }}>密码</div>
                <TextInput id="password" type="password" size="lg" onChange={(e) => setPassword(e.target.value)} value={password} />
                {errorMessage && <div style={{ color: 'red', marginBottom: '0%', marginTop: "2%" }}>{errorMessage}</div>}
                <Button style={{
                    marginTop: "3%",
                    width: "100%",
                    boxSizing: "border-box",
                    maxWidth: "1000px",
                    textAlign: "center",
                    marginBottom: "4%"
                }} size="2xl" onClick={onLogin}>
                    <div style={{ marginTop: "9px", fontSize: "25px" }}>继续</div>
                    <div style={{ marginTop: "5px", fontSize: "40px" }}><ArrowRight size={40}></ArrowRight></div>
                </Button>
                <Checkbox id="remember-me" labelText="记住我" style={{ marginBottom: '5%' }} checked={rememberMe} onChange={handleRememberMeChange} />
                <div className={styles.greyline} style={{ marginBottom: "5%", marginTop: "6%" }} />
                <div className="text-3xl" style={{ marginBottom: "5%" }}>没有账户？</div>
                <Link to="/register">
                    <Button kind="tertiary" style={{
                        width: "100%",
                        boxSizing: "border-box",
                        maxWidth: "1000px"
                    }}>创建账户</Button>
                </Link>
                <div className={styles.greyline} style={{ marginBottom: "5%", marginTop: "6%" }} />
                <div>忘记账号密码？<a href="#">联系我们</a></div>
                <div style={{
                    height:'10px'
                }}></div>
                <Button kind="tertiary" onClick={onLogout} style={{
                    width: "100%",
                    boxSizing: "border-box",
                    maxWidth: "1000px"
                }}>退出登录</Button>
            </div>
            <div className={styles.bottomBorder}>
                ©2024 by 智学未来
            </div>
        </div>
    );
}
