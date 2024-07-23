import styles from "./index.less";
import { Link } from "@@/exports";
import React, { useState, useEffect, useRef } from "react";
import {Content, Select, SelectItem, TextArea} from "carbon-components-react";
import { useNavigate } from "react-router-dom";

export default function TextPage() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("翻译");
    const typingTimeoutRef = useRef(null);
    const [fromTo,setFromTo]=useState('en-cn');
    const handleTranslate = async (textToTranslate) => {
        try {
            const response = await fetch('/api/trans/trans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: textToTranslate,fromTo:fromTo })
            });
            if (response.ok) {
                const data = await response.json();
                setTranslatedText(data.result);  // 假设后端返回的键名为 result
            } else {
                console.error('翻译失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };
    const handleTransChange = (e) => {
        setFromTo(e.target.value);
    };
    const handleTextChange = (e) => {
        setText(e.target.value);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            handleTranslate(e.target.value);
        }, 1000);  // 停止输入 1 秒后进行翻译
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <div>
                    <div className={styles.Header}>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供翻译服务</p>
                        <div className={styles.Select}>
                        <Select id="sortOption" labelText="翻译语言" value={fromTo} onChange={handleTransChange}>
                            <SelectItem value="en-cn" text="英译汉" />
                            <SelectItem value="cn-en" text="汉译英" />
                        </Select>
                        </div>
                    </div>
                    <div className={styles.Translate}>
                        <div className={styles.Input}>
                        <TextArea
                            labelText="请输入需要翻译的文本"
                            placeholder="请在此输入文本"  // 使用 placeholder 属性
                            onChange={handleTextChange}
                            counterMode="word"
                            enableCounter={true}
                            maxCount={1000}
                            rows={30}
                            id="text-area-1"
                        />
                        </div>
                        <div className={styles.Trans}>
                            <TextArea
                                labelText="  "
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
