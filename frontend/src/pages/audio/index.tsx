import React, {useEffect, useState} from 'react';
import styles from './index.less';
import {Button, Content, Loading, TextArea} from "carbon-components-react";
import ImageUploader from "@/components/ImageUploader";
import {Link} from "@@/exports";

export default function Page() {
    const [text, setText] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [textNum,setTextNum] = useState(0);
    const [language,setLanguage] = useState('');
    const [btn,setBtn]=useState(false);

    useEffect(() => {
        setTextNum(text.length)
    }, [text]);

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
            alert('请先选择语言.');
            return ;
        }
        if(text.length===0){
            alert('请先书籍内容.');
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
                console.log('长文本语音合成成功')
            } else {
                console.error('长文本语音合成失败');
                // 处理上传失败后的逻辑
            }
        } catch (error) {
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
