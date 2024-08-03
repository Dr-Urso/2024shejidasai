import styles from "./index.less";
import { Link } from "@@/exports";
import React, {useEffect, useState} from "react";
import { Content, TextArea, Button, Loading } from "carbon-components-react";
import ImageUploader from "@/components/ImageUploader";

export default function TextPage() {
    const [title, setTitle] = useState("");
    const [essayText, setEssayText] = useState("");
    const [correctedText, setCorrectedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // 新增状态变量来保存错误信息
    const [textNum,setTextNum] = useState(0);
    useEffect(()=>{
        setError('');
    },[]);

    useEffect(() => {
        setTextNum(essayText.length)
    }, [essayText]);

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            if(essayText.length===1||window.getSelection().toString().length===textNum){
                setEssayText('');
            }
        }
    };

    const handleCorrection = async () => {
        setLoading(true);
        setError(""); // 请求前清空错误信息
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
            } else if (response.status === 502) {
                setError('对不起，当前网络繁忙，请刷新或稍后再试');
            }else {
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

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTextChange = (e) => {
        setEssayText(e.target.value);
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <div className={styles.ImageUploaderWrapper}>
                    <ImageUploader setText={setEssayText}/>
                </div>
                <Loading active={loading}/>
                <div className={styles.ContentWrapper}>
                    <div className={styles.Header}>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供作文批改服务</p>
                    </div>
                    <div className={styles.Translate}>
                        <TextArea
                            labelText=""
                            placeholder="请在此输入作文标题"
                            onChange={handleTitleChange}
                            counterMode="word"
                            maxCount={100}
                            rows={1}
                            id="text-area-title"
                            style={{marginTop:'16px'}}
                        />
                        <TextArea
                            labelText=""
                            placeholder="请在此输入作文"
                            value={essayText}
                            onChange={handleTextChange}
                            onKeyDown={(essayText.length===1||essayText.length===textNum)?handleKeyDown:()=>{}}
                            counterMode="word"
                            maxCount={1500}
                            rows={15}
                            id="text-area-1"
                        />
                        <Button onClick={handleCorrection}>立即批改</Button>
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        <div className={styles.Trans}>
                            <TextArea
                                value={correctedText}
                                placeholder={"批改结果"}
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
