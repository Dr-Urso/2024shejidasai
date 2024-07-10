import styles from "./index.less";
import { Link } from "@@/exports";
import React, { useState } from "react";
import { Content, TextArea, Button } from "carbon-components-react";
import { useNavigate } from "react-router-dom";

export default function TextPage() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("翻译");

    const handleTranslate = async () => {
        try {
            const response = await fetch('YOUR_BACKEND_API', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            if (response.ok) {
                const data = await response.json();
                setTranslatedText(data.translatedText);  // 假设后端返回的键名为 translatedText
            } else {
                console.error('翻译失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <div>
                    <div className={styles.Header}>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供翻译服务</p>
                    </div>
                    <div className={styles.Translate}>
                        <TextArea
                            labelText="请输入需要翻译的英语文本"
                            placeholder="请在此输入文本"  // 使用 placeholder 属性
                            onChange={handleTextChange}
                            counterMode="word"
                            enableCounter={true}
                            maxCount={1000}
                            rows={10}
                            id="text-area-1"
                        />
                        <Button onClick={handleTranslate}>立即翻译</Button>
                        <div className={styles.Trans}>
                            <TextArea
                                value={translatedText}
                                readOnly
                                rows={10}
                                id="text-area-2"
                            />
                        </div>
                    </div>
                </div>
            </Content>
        </>
    );
}
