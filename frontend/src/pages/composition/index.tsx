import styles from "./index.less";
import { Link } from "@@/exports";
import React, {useEffect, useState} from "react";
import { Content, TextArea, Button, Loading } from "carbon-components-react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "@/components/ImageUploader";
import {message} from "antd";

export default function TextPage() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // 新增状态变量来保存错误信息
    const [textNum,setTextNum] = useState(0);

    useEffect(() => {
        switch (error) {
            case '网络错误': {
                message.error({
                    content: '网络请求出错，请刷新或稍后重试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请先输入要修改的作文': {
                message.info({
                    content: '请先输入要修改的作文',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '对不起，当前网络繁忙，请刷新或稍后再试': {
                message.info({
                    content: '对不起，当前网络繁忙，请刷新或稍后再试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '抱歉，你的作文包含敏感内容': {
                message.error({
                    content: '抱歉，你的作文包含敏感内容',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
             case '批改失败': {
                message.error({
                    content: '批改失败，请重新点击或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
        }
    }, [error]);

     useEffect(() => {
        setTextNum(text.length);
        setError('');
    }, [text]);

     const handleKeyDown = (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            if(text.length===1||window.getSelection().toString().length===textNum){
                setText('');
            }
        }
    };

    const handleCorrection = async () => {
        if(text.length===0){
            setError('请先输入要修改的作文');
            return;
        }
        setTranslatedText('');
        setLoading(true);
        try {
            const response = await fetch('/api/essay/correction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ essay_text: text })  // 修改为 essay_text
            });
            if (response.ok) {
                const data = await response.json();
                setTranslatedText(data.choices?.[0].message.content);
                setError('');
            }else if (response.status === 502) {
                setError('对不起，当前网络繁忙，请刷新或稍后再试');
            } else {
                const data = await response.json();
                if (data.error.includes('包含敏感内容')) {
                    setError("抱歉，你的作文包含敏感内容");
                } else {
                    setError('批改失败');
                    console.error('批改失败', data.error);
                }
            }
        } catch (error) {
            setError('网络错误');
            console.error('网络错误', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <div className={styles.ImageUploaderWrapper}>
                    <ImageUploader setText={setText}/>
                </div>
                <Loading active={loading}/>
                <div className={styles.ContentWrapper}>
                    <div className={styles.Header} style={{marginBottom:'16px'}}s>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供作文修改服务</p>
                    </div>
                    <div className={styles.Content}>
                        <TextArea
                            labelText=""
                            placeholder="请在此输入作文"  // 使用 placeholder 属性
                            value={text}
                            onChange={handleTextChange}
                            onKeyDown={(text.length===1||text.length===textNum)?handleKeyDown:()=>{}}
                            counterMode="word"
                            maxCount={1000}
                            rows={15}
                            id="text-area-1"
                        />
                        <Button onClick={handleCorrection}>立即润色</Button>
                        <div className={styles.ResultContent}>
                            <TextArea
                                value={translatedText}
                                placeholder={"修改建议"}
                                readOnly
                                rows={15}
                                id="text-area-2"
                            />
                        </div>
                    </div>
                </div>
            </Content>
        </>
    );
}
