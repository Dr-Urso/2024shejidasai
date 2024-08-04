import React, {useEffect, useState} from 'react';
import styles from './index.less';
import {Button, Content, Loading, TextArea} from "carbon-components-react";
import ImageUploader from "@/components/ImageUploader";
import {Link} from "@@/exports";
import {message} from "antd";

export default function Page() {
    const [text, setText] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [textNum,setTextNum] = useState(0);
    const [language,setLanguage] = useState('');
    const [btn,setBtn]=useState(false);
    const [error,setError]=useState('');

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
            case '请先选择语言': {
                message.info({
                    content: '请先选择语言',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请先输入书籍内容': {
                message.info({
                    content: '请先输入书籍内容',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '长文本语音合成失败': {
                message.error({
                    content: '长文本语音合成失败，请重新点击或稍后再尝试',
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
        setTextNum(text.length)
        setError('');
    }, [text]);

    useEffect(() => {
        if(language!=='')setError('');
    }, [language]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            if(text.length===1||window.getSelection().toString().length===textNum){
                setText('');
            }
        }
    };

    const handleSubmit = async () => {
        if(language === ''){
            setError('请先选择语言');
            return ;
        }
        if(text.length===0){
            setError('请先输入书籍内容')
            return ;
        }
        const formData = new FormData();
        formData.append('text',text);
        formData.append('lang',language);
        setBtn(true);//清空选择的语言
        try {
            // 发送POST请求到后台
            const response = await fetch('/api/audioText/Gen', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const timestamp = new Date().getTime(); // 获取当前时间戳
                const updatedAudioUrl = `/audio/tts.mp3?t=${timestamp}`; // 添加时间戳作为查询参数
                setAudioUrl(updatedAudioUrl); // 更新音频文件URL
                setLanguage('');
                setError('');
                console.log('长文本语音合成成功')
            } else {
                setError('长文本语音合成失败');
                console.error('长文本语音合成失败');
                // 处理上传失败后的逻辑
            }
        } catch (error) {
            setError('网络错误');
            console.error('网络错误:', error);
            // 处理网络错误
        }
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
            <div className={styles.ImageUploaderWrapper}>
                <ImageUploader setText={setText} setLanguage={setLanguage} btn={btn} setBtn={setBtn}/>
                <Button onClick={handleSubmit} kind="primary" size="sm" style={{ marginTop: '16px'}}>听书</Button>
                <audio src={audioUrl} controls style={{ marginTop: '16px'}}/>
            </div>
            <div className={styles.ContentWrapper}>
                <div className={styles.Header} style={{ marginBottom: '16px'}}>
                    <p>当前由</p>
                    <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞智能语音</Link>
                    <p>为您提供服务</p>
                </div>
                <div className={styles.Text}>
                    <TextArea
                        placeholder="请在此输入书本内容"
                        value={text}
                        counterMode="word"
                        enableCounter={true}
                        onChange={handleTextChange}
                        onKeyDown={(text.length===1||text.length===textNum)?handleKeyDown:()=>{}}
                        rows={30}
                        id="text-area-1"
                    />
                </div>
            </div>
        </Content>
        </>
    );
}
