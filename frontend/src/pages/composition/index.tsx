import styles from "./index.less";
import { Link } from "@@/exports";
import React, {useEffect, useState} from "react";
import { Content, TextArea, Button, Loading } from "carbon-components-react";
import { useNavigate } from "react-router-dom";

export default function TextPage() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("修改建议");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // 新增状态变量来保存错误信息
useEffect(()=>{
    setError('');
},[]);
    const handleCorrection = async () => {
        setLoading(true);
        setError(""); // 请求前清空错误信息
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
            }else if (response.status === 502) {
                setError('对不起，网络繁忙，请稍后再试');
            } else {
                const data = await response.json();
                if (data.error.includes('包含敏感内容')) {
                    setError("抱歉，你的作文包含敏感内容。");
                } else {
                    console.error('批改失败', data.error);
                }
            }
        } catch (error) {
            console.error('请求出错', error);
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
                <Loading active={loading} />
                <div>
                    <div className={styles.Header}>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供作文修改服务</p>
                    </div>
                    <div className={styles.Translate}>
                        <TextArea
                            labelText="请输入需要润色的作文"
                            placeholder="请在此输入作文"  // 使用 placeholder 属性
                            onChange={handleTextChange}
                            counterMode="word"
                            enableCounter={true}
                            maxCount={1000}
                            rows={10}
                            id="text-area-1"
                        />
                        <Button onClick={handleCorrection}>立即润色</Button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
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
