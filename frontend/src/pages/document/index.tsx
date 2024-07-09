import React, { useState } from 'react';
import { Content, Button, TextArea } from 'carbon-components-react';
import { ReactMic } from 'react-mic';
import styles from './index.less';

export default function VoiceTranslate() {
    const [isRecording, setIsRecording] = useState(false);
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('翻译结果');

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    };

    const onStop = async (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);

        const formData = new FormData();
        formData.append('file', recordedBlob.blob, 'voice.wav');
         console.log('formData is: ', formData);
        try {
            const response = await fetch('YOUR_BACKEND_API_URL', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                setTranslatedText(data.translatedText);
            } else {
                console.error('翻译失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };
    // const onStop = async (recordedBlob) => {
    //     console.log('recordedBlob is: ', recordedBlob);
    //
    //     const formData = new FormData();
    //     formData.append('file', recordedBlob.blob, 'voice.wav');
    //     // 创建下载链接并自动点击
    //     const url = URL.createObjectURL(recordedBlob.blob);
    //     const a = document.createElement('a');
    //     a.style.display = 'none';
    //     a.href = url;
    //     a.download = 'recording.wav';
    //     document.body.appendChild(a);
    //     a.click();
    //     URL.revokeObjectURL(url);
    //测试能否可以正常获取音频，经测试可以
    // };

    return (
        <Content id='main-content'>
            <div className={styles.Container}>
                <div className={styles.Header}>
                    <p>当前由</p>
                    <a href='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</a>
                    <p>为您提供翻译服务</p>
                </div>
                <div className={styles.Translate}>
                    <ReactMic
                        record={isRecording}
                        className="sound-wave"
                        onStop={onStop}
                        onData={onData}
                        strokeColor="#0000ff"
                        backgroundColor="#dfd2f7"
                    />
                    <Button onClick={startRecording} disabled={isRecording}>开始录音</Button>
                    <Button onClick={stopRecording} disabled={!isRecording}>停止录音</Button>
                    <div>
                    <TextArea className={styles.Trans}
                        labelText="翻译结果"
                        value={translatedText}
                        readOnly
                        rows={10}
                        id="text-area-2"
                    />
                    </div>
                </div>
            </div>
        </Content>
    );
}
