import styles from "./index.less";
import { Link } from "@@/exports";
import React, {useEffect, useState} from "react";
import {Content, TextArea, Button, TextInput, Loading} from "carbon-components-react";
import {message} from "antd";

export default function LessonPlanPage() {
    const [topic, setTopic] = useState("");
    const [lessonPlan, setLessonPlan] = useState("");
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('');

    useEffect(() => {
        switch (err) {
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
            case '请先输入教案主题': {
                message.info({
                    content: '请先输入教案主题',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '生成教案失败': {
                message.error({
                    content: '生成教案失败，请刷新或稍后重试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
             case '下载教案模板失败': {
                message.error({
                    content: '下载教案模板失败，请刷新或稍后重试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
        }
    }, [err]);

    useEffect(()=>{
        setErr('');
    },[]);

    const handleGenerateLessonPlan = async () => {
        if(topic.length===0){
            setErr('请先输入教案主题')
            return ;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/spark/teaching_plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ teaching_plan_request: topic })  // 发送教案请求到后端
            });
            if (response.ok) {
                const data = await response.json();
                // 后端返回的结果应该包含在 result 字段中
                const resultText = Array.isArray(data.result) ? data.result.join('\n') : data.result;
                setLessonPlan(resultText);
                setErr('');
            } else if (response.status === 502) {
                setErr('对不起，当前网络繁忙，请刷新或稍后再试');
            } else {
                setErr('生成教案失败');
                console.error('生成教案失败');
            }
        } catch (error) {
            setErr('网络错误')
            console.error('网络错误', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadLessonPlan = async () => {
        if(topic.length===0){
            setErr('请先输入教案主题')
            return ;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/generatedoc/gen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: topic })  // 发送教案请求到后端
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `lesson_plan_${Date.now()}.docx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setErr('');
            } else {
                setErr('下载教案模板失败');
                console.error('下载教案模板失败');
            }
        } catch (error) {
            setErr('网络错误')
            console.error('网络错误', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicChange = (e) => {
        setTopic(e.target.value);
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <Loading active={loading} />
                <div>
                    <div className={styles.Header}>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供教案生成服务</p>
                    </div>
                    <div className={styles.Generate}>
                        <TextInput
                            labelText=""
                            placeholder="请在此输入教案主题"
                            onChange={handleTopicChange}
                            id="topic-input"
                            value={topic}
                            style={{marginTop: '16px'}}
                        />
                        <Button onClick={handleGenerateLessonPlan} style={{marginTop: '16px',marginBottom:'16px'}}>生成教案模板</Button>
                        <Button className={styles.right} onClick={handleDownloadLessonPlan} style={{marginTop: '16px',marginBottom:'16px'}}>下载简版教案docx</Button>
                        <div className={styles.Trans}>
                            <TextArea
                                value={lessonPlan}
                                placeholder={"生成的教案模板将在这里显示"}
                                readOnly
                                rows={30}
                                id="lesson-plan-area"
                            />
                        </div>
                    </div>
                </div>
            </Content>
        </>
    );
}
