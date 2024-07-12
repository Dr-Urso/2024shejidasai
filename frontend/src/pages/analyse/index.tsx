import React, { useState } from 'react';
import {Button, TextArea, TextInput, Select, SelectItem, Content} from 'carbon-components-react';
import styles from './index.less'; // 样式文件

export default function ScoreAnalysis() {
    const [exams, setExams] = useState([]);
    const [currentExam, setCurrentExam] = useState({
        examType: '',
        difficulty: '',
        scores: {
            Chinese: '',
            Math: '',
            English: '',
            Physics: '',
            Chemistry: '',
            Biology: ''
        },
        selfEvaluation: ''
    });
    const [aiSuggestions, setAiSuggestions] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentExam(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleScoreChange = (e) => {
        const { name, value } = e.target;
        setCurrentExam(prevState => ({
            ...prevState,
            scores: {
                ...prevState.scores,
                [name]: value
            }
        }));
    };

    const addExam = () => {
        setExams(prevExams => [...prevExams, currentExam]);
        setCurrentExam({
            examType: '',
            difficulty: '',
            scores: {
                Chinese: '',
                Math: '',
                English: '',
                Physics: '',
                Chemistry: '',
                Biology: ''
            },
            selfEvaluation: ''
        });
    };

    const analyzeExams = async () => {
        const examsJson = exams.reduce((acc, exam, index) => {
            acc[index + 1] = exam;
            return acc;
        }, {});

        try {
            const response = await fetch('YOUR_BACKEND_API_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(examsJson)
            });

            if (response.ok) {
                const data = await response.json();
                setAiSuggestions(data.suggestions);
            } else {
                console.error('分析失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    return (
        <Content className={styles.Container} id='main-content'>
        <div className={styles.Box}>
            <h2>成绩分析</h2>
            <div className={styles.ExamForm}>
                <TextInput
                    id="examType"
                    name="examType"
                    labelText="考试类型"
                    value={currentExam.examType}
                    onChange={handleChange}
                />
                <Select
                    id="difficulty"
                    name="difficulty"
                    labelText="考试难度"
                    value={currentExam.difficulty}
                    onChange={handleChange}
                >
                    <SelectItem value="" text="请选择难度" />
                    <SelectItem value="easy" text="简单" />
                    <SelectItem value="medium" text="中等" />
                    <SelectItem value="hard" text="难" />
                </Select>
                <TextInput
                    id="Chinese"
                    name="Chinese"
                    labelText="语文"
                    value={currentExam.scores.Chinese}
                    onChange={handleScoreChange}
                />
                <TextInput
                    id="Math"
                    name="Math"
                    labelText="数学"
                    value={currentExam.scores.Math}
                    onChange={handleScoreChange}
                />
                <TextInput
                    id="English"
                    name="English"
                    labelText="英语"
                    value={currentExam.scores.English}
                    onChange={handleScoreChange}
                />
                <TextInput
                    id="Physics"
                    name="Physics"
                    labelText="物理"
                    value={currentExam.scores.Physics}
                    onChange={handleScoreChange}
                />
                <TextInput
                    id="Chemistry"
                    name="Chemistry"
                    labelText="化学"
                    value={currentExam.scores.Chemistry}
                    onChange={handleScoreChange}
                />
                <TextInput
                    id="Biology"
                    name="Biology"
                    labelText="生物"
                    value={currentExam.scores.Biology}
                    onChange={handleScoreChange}
                />
                <TextArea
                    id="selfEvaluation"
                    name="selfEvaluation"
                    labelText="自我评价"
                    value={currentExam.selfEvaluation}
                    onChange={handleChange}
                    rows={4}
                />
                <Button onClick={addExam}>添加考试成绩</Button>
                <Button onClick={analyzeExams}>分析成绩</Button>
            </div>
            <div className={styles.ExamList}>
                {exams.map((exam, index) => (
                    <div key={index} className={styles.ExamItem}>
                        <h3>考试 {index + 1}</h3>
                        <p>考试类型: {exam.examType}</p>
                        <p>考试难度: {exam.difficulty}</p>
                        <p>语文: {exam.scores.Chinese}</p>
                        <p>数学: {exam.scores.Math}</p>
                        <p>英语: {exam.scores.English}</p>
                        <p>物理: {exam.scores.Physics}</p>
                        <p>化学: {exam.scores.Chemistry}</p>
                        <p>生物: {exam.scores.Biology}</p>
                        <p>自我评价: {exam.selfEvaluation}</p>
                    </div>
                ))}
            </div>
            {aiSuggestions && (
                <div className={styles.AiSuggestions}>
                    <h3>AI 大模型的建议</h3>
                    <p>{aiSuggestions}</p>
                </div>
            )}
        </div>
        </Content>
    );
}
