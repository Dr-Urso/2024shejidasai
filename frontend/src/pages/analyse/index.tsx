import React, { useState } from 'react';
import {Button, TextArea, TextInput, Select, SelectItem, Checkbox, Content, Loading} from 'carbon-components-react';
import styles from './index.less'; // 样式文件
import { useUser } from "@/Utils/UserContext";

export default function ScoreAnalysis() {
    const [loading, setLoading] = useState(false);
    const { username, student_id, teacher_id } = useUser();
    console.log({ username, student_id, teacher_id });
    const [exams, setExams] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [subjects, setSubjects] = useState({
        Physics: false,
        Chemistry: false,
        Biology: false,
        Geography: false,
        History: false,
        Politics: false,
    });
    const [currentExam, setCurrentExam] = useState({
        examType: '',
        scores: {
            Chinese: '',
            Math: '',
            English: '',
            Physics: '',
            Chemistry: '',
            Biology: '',
            Geography: '',
            History: '',
            Politics: ''
        },
        totalScores: {
            Chinese: '',
            Math: '',
            English: '',
            Physics: '',
            Chemistry: '',
            Biology: '',
            Geography: '',
            History: '',
            Politics: ''
        },
        selfEvaluation: ''
    });

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

    const handleTotalScoreChange = (e) => {
        const { name, value } = e.target;
        setCurrentExam(prevState => ({
            ...prevState,
            totalScores: {
                ...prevState.totalScores,
                [name]: value
            }
        }));
    };

    const handleSubjectChange = (e) => {
        const { name, checked } = e.target;
        setSubjects(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const saveBaseInfo = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/spark/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    student_id: student_id,  // 使用 student_id 或 teacher_id
                    education_level: educationLevel,
                    subject: '总分信息', // 固定一个描述
                    fullMark: currentExam.totalScores
                })
            });
            console.log({
                student_id: student_id,  // 使用 student_id 或 teacher_id
                education_level: educationLevel,
                subject: '总分信息', // 固定一个描述
                fullMark: currentExam.totalScores
            })
            if (!response.ok) {
                console.error('保存基础信息失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        } finally {
            setLoading(false);  // 隐藏loading效果
        }
    };

    const saveExamInfo = async () => {
        try {
            const response = await fetch('/api/spark/exam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    student_id: student_id,  // 使用 student_id 或 teacher_id
                    examName: currentExam.examType,
                    examType: educationLevel,
                    examScore: currentExam.scores,
                    totalScore: currentExam.totalScores,
                    selfEvaluation: currentExam.selfEvaluation
                })
            });
            console.log({
                student_id: student_id,  // 使用 student_id 或 teacher_id
                examName: currentExam.examType,
                examType: educationLevel,
                examScore: currentExam.scores,
                totalScore: currentExam.totalScores,
                selfEvaluation: currentExam.selfEvaluation
            })
            if (!response.ok) {
                console.error('保存考试信息失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };
    const addExam = async () => {
        await saveBaseInfo(); // 保存基础信息
        await saveExamInfo(); // 保存考试信息

        setExams(prevExams => [...prevExams, currentExam]);
        setCurrentExam({
            examType: '',
            scores: {
                Chinese: '',
                Math: '',
                English: '',
                Physics: '',
                Chemistry: '',
                Biology: '',
                Geography: '',
                History: '',
                Politics: ''
            },
            totalScores: {
                Chinese: '',
                Math: '',
                English: '',
                Physics: '',
                Chemistry: '',
                Biology: '',
                Geography: '',
                History: '',
                Politics: ''
            },
            selfEvaluation: ''
        });
    };

    const analyzeExams = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/spark/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAiSuggestions(data.result);
            } else {
                console.error('分析失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        } finally {
            setLoading(false)
        }
    };


    return (

        <Content className={styles.Container} id='main-content'>
            {loading&&<Loading />}
            <div className={styles.Box}>
                <h2>成绩分析</h2>
                <div className={styles.ExamForm}>
                    <Select
                        id="educationLevel"
                        name="educationLevel"
                        labelText="选择教育阶段"
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                    >
                        <SelectItem value="" text="请选择" />
                        <SelectItem value="小学" text="小学" />
                        <SelectItem value="初中" text="初中" />
                        <SelectItem value="高中" text="高中" />
                    </Select>

                    <TextInput
                        id="examType"
                        name="examType"
                        labelText="考试名称"
                        value={currentExam.examType}
                        onChange={handleChange}
                    />
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

                    <h3>选择额外科目</h3>
                    {['Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Politics'].map(subject => (
                        <Checkbox
                            key={subject}
                            id={subject}
                            name={subject}
                            labelText={subject}
                            checked={subjects[subject]}
                            onChange={handleSubjectChange}
                        />
                    ))}

                    {subjects.Physics && (
                        <TextInput
                            id="Physics"
                            name="Physics"
                            labelText="物理"
                            value={currentExam.scores.Physics}
                            onChange={handleScoreChange}
                        />
                    )}
                    {subjects.Chemistry && (
                        <TextInput
                            id="Chemistry"
                            name="Chemistry"
                            labelText="化学"
                            value={currentExam.scores.Chemistry}
                            onChange={handleScoreChange}
                        />
                    )}
                    {subjects.Biology && (
                        <TextInput
                            id="Biology"
                            name="Biology"
                            labelText="生物"
                            value={currentExam.scores.Biology}
                            onChange={handleScoreChange}
                        />
                    )}
                    {subjects.Geography && (
                        <TextInput
                            id="Geography"
                            name="Geography"
                            labelText="地理"
                            value={currentExam.scores.Geography}
                            onChange={handleScoreChange}
                        />
                    )}
                    {subjects.History && (
                        <TextInput
                            id="History"
                            name="History"
                            labelText="历史"
                            value={currentExam.scores.History}
                            onChange={handleScoreChange}
                        />
                    )}
                    {subjects.Politics && (
                        <TextInput
                            id="Politics"
                            name="Politics"
                            labelText="政治"
                            value={currentExam.scores.Politics}
                            onChange={handleScoreChange}
                        />
                    )}

                    <h3>输入科目总分</h3>
                    <TextInput
                        id="ChineseTotal"
                        name="Chinese"
                        labelText="语文总分"
                        value={currentExam.totalScores.Chinese}
                        onChange={handleTotalScoreChange}
                    />
                    <TextInput
                        id="MathTotal"
                        name="Math"
                        labelText="数学总分"
                        value={currentExam.totalScores.Math}
                        onChange={handleTotalScoreChange}
                    />
                    <TextInput
                        id="EnglishTotal"
                        name="English"
                        labelText="英语总分"
                        value={currentExam.totalScores.English}
                        onChange={handleTotalScoreChange}
                    />
                    {subjects.Physics && (
                        <TextInput
                            id="PhysicsTotal"
                            name="Physics"
                            labelText="物理总分"
                            value={currentExam.totalScores.Physics}
                            onChange={handleTotalScoreChange}
                        />
                    )}
                    {subjects.Chemistry && (
                        <TextInput
                            id="ChemistryTotal"
                            name="Chemistry"
                            labelText="化学总分"
                            value={currentExam.totalScores.Chemistry}
                            onChange={handleTotalScoreChange}
                        />
                    )}
                    {subjects.Biology && (
                        <TextInput
                            id="BiologyTotal"
                            name="Biology"
                            labelText="生物总分"
                            value={currentExam.totalScores.Biology}
                            onChange={handleTotalScoreChange}
                        />
                    )}
                    {subjects.Geography && (
                        <TextInput
                            id="GeographyTotal"
                            name="Geography"
                            labelText="地理总分"
                            value={currentExam.totalScores.Geography}
                            onChange={handleTotalScoreChange}
                        />
                    )}
                    {subjects.History && (
                        <TextInput
                            id="HistoryTotal"
                            name="History"
                            labelText="历史总分"
                            value={currentExam.totalScores.History}
                            onChange={handleTotalScoreChange}
                        />
                    )}
                    {subjects.Politics && (
                        <TextInput
                            id="PoliticsTotal"
                            name="Politics"
                            labelText="政治总分"
                            value={currentExam.totalScores.Politics}
                            onChange={handleTotalScoreChange}
                        />
                    )}

                    <TextArea
                        id="selfEvaluation"
                        name="selfEvaluation"
                        labelText="自我评价"
                        value={currentExam.selfEvaluation}
                        onChange={handleChange}
                        rows={4}
                    />
                    <Button onClick={addExam} style={{marginRight:"20px"}} >添加考试成绩</Button>
                    <Button onClick={analyzeExams}>分析成绩</Button>
                </div>
                <div className={styles.ExamList}>
                    {exams.map((exam, index) => (
                        <div key={index} className={styles.ExamItem}>
                            <h3>考试名称 {exam.examType}</h3>
                            <p>语文: {exam.scores.Chinese}</p>
                            <p>数学: {exam.scores.Math}</p>
                            <p>英语: {exam.scores.English}</p>
                            {subjects.Physics && <p>物理: {exam.scores.Physics}</p>}
                            {subjects.Chemistry && <p>化学: {exam.scores.Chemistry}</p>}
                            {subjects.Biology && <p>生物: {exam.scores.Biology}</p>}
                            {subjects.Geography && <p>地理: {exam.scores.Geography}</p>}
                            {subjects.History && <p>历史: {exam.scores.History}</p>}
                            {subjects.Politics && <p>政治: {exam.scores.Politics}</p>}
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
