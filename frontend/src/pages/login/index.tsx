import React, {useEffect, useState} from 'react';
import {Link} from 'umi';
import styles from './index.less';
import {TextInput, Form,Button,Checkbox} from "@carbon/react";
import {ArrowRight, Chat, Login, Menu} from "@carbon/icons-react";
import bg from '@/assets/login_illustration.svg'
import axios from "axios";
import '@/Utils/axiosInstance'
import axiosInstance from "@/Utils/axiosInstance";
import {useUser} from "@/Utils/UserContext";
import {Content, Header, HeaderGlobalBar, HeaderName} from "carbon-components-react";
export default function Page() {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [password, setPassword] = useState(localStorage.getItem('password') || '');
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberMe'));
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (rememberMe) {
            setUsername(localStorage.getItem('username') || '');
            setPassword(localStorage.getItem('password') || '');
        }
    }, [rememberMe]);
    useEffect(() => {
        console.log(username);
    }, [username]);
    const onLogin = async () => {
        try {
            const response = await axios.post('/api/user/login', {
                    username,
                    password
            });

            if (response.data.detail == "OK") {
                setErrorMessage('');
                const {username, setUserInfo} = useUser();
                setUserInfo({username});
                if (rememberMe) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                    localStorage.removeItem('rememberMe');
                }
                // handle successful login (e.g., redirect to another page)
            } else {
                setErrorMessage('用户名或密码错误');
            }
        } catch (error) {
            setErrorMessage('请求失败，请稍后再试');
        }
    };


  return (
      <div className={styles.container}>
          <Header>
              <HeaderName href="/" prefix="智学">
                  未来
              </HeaderName>
          </Header>
          <Content id='main-content' >
<div className={styles.illustration_canva} style={{backgroundImage:`url(${bg})`}}></div>
          <div className={styles.formArea}>
              <div className="text-5xl" style={{marginBottom: "5%"}}>用户登录</div>
              <div className={styles.greyline} style={{marginBottom: "2%"}}/>
              <div className="text-xl text-gray-500" style={{marginBottom: "2%", marginTop: "2%"}}>用户名</div>
              <TextInput id="username" type="text" size="lg" onChange={(e) => setUsername(e.target.value)}/>
              <div className="text-xl text-gray-500" style={{marginBottom: "2%", marginTop: "2%"}}>密码</div>
              <TextInput id="username" type="text" size="lg" onChange={(e) => setPassword(e.target.value)}/>
              {errorMessage && <div style={{ color: 'red', marginBottom: '0%',marginTop:"2%" }}>{errorMessage}</div>}
              <Button style={{
                  marginTop: "3%",
                  width: "100%",
                  boxSizing: "border-box",
                  maxWidth: "1000px",

                  textAlign: "center",
                  marginBottom: "4%"
              }} size="2xl" onClick={onLogin}>
                  <div style={{marginTop:"9px",fontSize:"25px"}}>继续</div>
                  <div style={{marginTop:"5px",fontSize:"40px"}}><ArrowRight size={40}></ArrowRight></div>
              </Button>
              <Checkbox id="remember-me" labelText="记住我" style={{marginBottom: '5%'}}/>
              <div className={styles.greyline} style={{marginBottom: "5%", marginTop: "6%"}}/>
              <div className="text-3xl" style={{marginBottom: "5%"}}>没有账户？</div>
              <Link to="/register">
              <Button kind="tertiary" style={{
                  width: "100%",
                  boxSizing: "border-box",
                  maxWidth: "1000px"
              }}>创建账户</Button>
              </Link>
              <div className={styles.greyline} style={{marginBottom: "5%", marginTop: "6%"}}/>
              <div>忘记账号密码？<a href="#">联系我们</a></div>
          </div>
          <div className={styles.bottomBorder}>
              这是底边
          </div>
              </Content>
      </div>
  );
}
