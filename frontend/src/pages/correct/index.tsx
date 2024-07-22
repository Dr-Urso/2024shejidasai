import styles from "./index.less";
import { Link } from "@@/exports";
import React, { useState } from "react";
import {Content, TextArea, Button, Loading} from "carbon-components-react";

export default function TextPage() {
    const [title, setTitle] = useState("");
    const [essayText, setEssayText] = useState("");
    const [correctedText, setCorrectedText] = useState("批改结果");
    const [loading, setLoading] = useState(false)
    const handleCorrection = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/spark/writing_correction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, essay_text: essayText })
            });
            if (response.ok) {
                const data = await response.json();
                // 将数组数据转换为字符串，用换行符分隔
                const resultText = data.result.join('');
                setCorrectedText(resultText);
            } else {
                console.error('批改失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTextChange = (e) => {
        setEssayText(e.target.value);
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <Loading active={loading}/>
                <div>
                    <div className={styles.Header}>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供作文批改服务</p>
                    </div>
                    <div className={styles.Translate}>
                        <TextArea
                            labelText="请输入作文标题"
                            placeholder="请在此输入作文标题"
                            onChange={handleTitleChange}
                            counterMode="word"
                            enableCounter={true}
                            maxCount={100}
                            rows={1}
                            id="text-area-title"
                        />
                        <TextArea
                            labelText="请输入需要批改的作文"
                            placeholder="请在此输入作文"
                            onChange={handleTextChange}
                            counterMode="word"
                            enableCounter={true}
                            maxCount={1000}
                            rows={10}
                            id="text-area-1"
                        />
                        <Button onClick={handleCorrection}>立即批改</Button>
                        <div className={styles.Trans}>
                            <TextArea
                                value={correctedText}
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
