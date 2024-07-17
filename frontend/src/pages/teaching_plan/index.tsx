import styles from "./index.less";
import { Link } from "@@/exports";
import React, { useState } from "react";
import { Content, TextArea, Button, TextInput } from "carbon-components-react";
import { useNavigate } from "react-router-dom";

export default function LessonPlanPage() {
    const [topic, setTopic] = useState("");
    const [lessonPlan, setLessonPlan] = useState("生成的教案模板将在这里显示");

    const handleGenerateLessonPlan = async () => {
        try {
            const response = await fetch('/api/lesson/plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic })  // 发送主题到后端
            });
            if (response.ok) {
                const data = await response.json();
                setLessonPlan(data.choices?.[0].message.content);  // 假设后端返回的键名为 choices
            } else {
                console.error('生成教案模板失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const handleTopicChange = (e) => {
        setTopic(e.target.value);
    };

    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <div>
                    <div className={styles.Header}>
                        <p>当前由</p>
                        <Link to='https://fanyi.xfyun.cn/console/trans/doc'>讯飞星火大模型</Link>
                        <p>为您提供教案生成服务</p>
                    </div>
                    <div className={styles.Generate}>
                        <TextInput
                            labelText="请输入教案的主题"
                            placeholder="请在此输入教案主题"
                            onChange={handleTopicChange}
                            id="topic-input"
                        />
                        <Button onClick={handleGenerateLessonPlan}>生成教案模板</Button>
                        <div className={styles.Trans}>
                            <TextArea
                                value={lessonPlan}
                                readOnly
                                rows={10}
                                id="lesson-plan-area"
                            />
                        </div>
                    </div>
                </div>
            </Content>
        </>
    );
}
