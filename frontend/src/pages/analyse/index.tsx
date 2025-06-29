import React, { useEffect, useRef, useState } from 'react';
import { Button, TextArea, TextInput, Select, SelectItem, Checkbox, Content, Loading, Modal } from 'carbon-components-react'; // 引入 Modal 组件
import styles from './index.less'; // 样式文件
import { useUser } from "@/Utils/UserContext";
import { Line } from '@ant-design/charts';
import {message} from "antd";

message.config(
    {zIndex:9999}
)

export default function ScoreAnalysis() {
    const [edit, setEdit] = useState('0');
    const [view, setView] = useState('0');
    const [loading, setLoading] = useState(false);
    const { username, student_id, teacher_id } = useUser();
    console.log({ username, student_id, teacher_id });
    const [exams, setExams] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const indexOfLastExam = currentPage * itemsPerPage;
    const indexOfFirstExam = indexOfLastExam - itemsPerPage;
    const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);
    const [errorMessage, setErrorMessage] = useState('');
    const [showScoreForm, setShowScoreForm] = useState(false); // 控制模态框显示的状态变量
    const [showEditForm, setShowEditForm] = useState(false); // 新的状态变量，用于控制编辑科目信息模态框的显示
    const [subjects, setSubjects] = useState({
        Physics: false,
        Chemistry: false,
        Biology: false,
        Geography: false,
        History: false,
        Politics: false,
    });
    const [totalScores, setTotalScores] = useState({
        Chinese: '',
        Math: '',
        English: '',
        Physics: '',
        Chemistry: '',
        Biology: '',
        Geography: '',
        History: '',
        Politics: ''
    });
    const [baseInfoSaved, setBaseInfoSaved] = useState(false);
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
        selfEvaluation: ''
    });

    const subjectNames = {
        Physics: '物理',
        Chemistry: '化学',
        Biology: '生物',
        Geography: '地理',
        History: '历史',
        Politics: '政治',
    };

    const [TData, setTData] = useState([]);
    const [TotalData, setTotalData] = useState([]);

    useEffect(() => {
        switch (errorMessage) {
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
            case '请选择教育阶段': {
                message.info({
                    content: '请选择教育阶段',
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
            case '获取成绩信息失败': {
                message.error({
                    content: '获取成绩信息失败，请刷新或稍后再试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '保存基础信息失败': {
                message.error({
                    content: '保存基础信息失败，请重新保存或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '添加考试信息失败': {
                message.error({
                    content: '添加考试信息失败，请重新添加或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '分析失败，请稍后再试': {
                message.error({
                    content: ' 分析失败，请重新分析或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '获取基础信息失败': {
                message.error({
                    content: '获取基础信息失败，请刷新或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请填写考试名称': {
                message.info({
                    content: '请填写考试名称',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写语文成绩': {
                message.info({
                    content: '请填写语文成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写数学成绩': {
                message.info({
                    content: '请填写数学成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写英语成绩': {
                message.info({
                    content: '请填写英语成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写物理成绩': {
                message.info({
                    content: '请填写物理成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写化学成绩': {
                message.info({
                    content: '请填写化学成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写生物成绩': {
                message.info({
                    content: '请填写生物成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写历史成绩': {
                message.info({
                    content: '请填写历史成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写政治成绩': {
                message.info({
                    content: '请填写政治成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
           case '请填写地理成绩': {
                message.info({
                    content: '请填写地理成绩',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
           }
        }
    }, [errorMessage]);

    useEffect(() => {
        fetchScores();
        fetchBaseInfo();
        setErrorMessage('');
    }, []);

    const fetchScores = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/spark/scores', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched data:', data);  // 调试输出
                console.log('edit', edit);
                console.log('view', view);
                // 格式化数据以匹配前端期望的结构
                const formattedData = data.map(exam => ({
                    examType: exam.examType,
                    examName: exam.examName,
                    scores: exam.examScore,
                    selfEvaluation: exam.selfEvaluation
                }));

                setExams(formattedData);
                console.log('Exams set:', formattedData);  // 确认 exams 数据已设置
                let temp = [];
                let temp2 = [];
                let dict = {
                    "Chinese": "语文",
                    "Math": "数学",
                    "English": "英语",
                    "Physics": "物理",
                    "Chemistry": "化学",
                    "Biology": "生物",
                    "Geography": "地理",
                    "History": "历史",
                    "Politics": "政治"
                };
                data.forEach(exam => {
                    Object.entries(exam.examScore).forEach(([subject, score]) => {
                        if (score) {
                            if (typeof score === "string") {
                                temp.push({
                                    examName: exam.examName,
                                    value: parseInt(score, 10),
                                    subject: dict[subject]
                                });
                            }
                        }
                    });
                    let total = 0;

                    Object.values(exam.examScore).forEach(score => {
                        if (score) {
                            if (typeof score === "string") {
                                total += parseInt(score, 10);
                            }
                        }
                    });

                    temp2.push({
                        examName: exam.examName,
                        subject: '总分',
                        value: total,
                    })
                });
                setTData(temp);
                setTotalData(temp2);
                setErrorMessage('');
                // console.log(temp);
            } else {
                setErrorMessage('获取成绩信息失败');
                console.error('获取成绩信息失败');
            }
        } catch (error) {
            setErrorMessage('网络错误');
            console.error('网络错误', error);
        } finally {
            setLoading(false);
        }
    };

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
        setTotalScores(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubjectChange = (e) => {
        const { name, checked } = e.target;
        setSubjects(prevState => ({
            ...prevState,
            [name]: checked
        }));

        // 如果取消勾选，清空对应的成绩
        if (!checked) {
            setTotalScores(prevState => ({
                ...prevState,
                [name]: ''
            }));
            setCurrentExam(prevState => ({
                ...prevState,
                scores: {
                    ...prevState.scores,
                    [name]: ''
                }
            }));
        }
    };

    const saveBaseInfo = async () => {
        if (!educationLevel) {
            setErrorMessage('请选择教育阶段');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/spark/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    student_id: student_id,
                    education_level: educationLevel,
                    subject: Object.keys(subjects).filter(subject => subjects[subject]).join(', '), // 将勾选的科目转换为字符串
                    fullMark: totalScores
                })
            });
            console.log({
                student_id: student_id,
                education_level: educationLevel,
                subject: Object.keys(subjects).filter(subject => subjects[subject]).join(', '), // 将勾选的科目转换为字符串
                fullMark: totalScores
            });
            setErrorMessage('');
            if (!response.ok) {
                setErrorMessage('保存基础信息失败');
                console.error('保存基础信息失败');
            } else {
                setBaseInfoSaved(true);
                setEdit('0'); // 保存后切换回查看模式
                setShowEditForm(false); // 关闭编辑科目信息模态框
            }
        } catch (error) {
            setErrorMessage('网络错误');
            console.error('网络错误', error);
        } finally {
            setLoading(false); // 隐藏loading效果
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
                    totalScore: totalScores,
                    selfEvaluation: currentExam.selfEvaluation
                })
            });
            console.log({
                student_id: student_id,  // 使用 student_id 或 teacher_id
                examName: currentExam.examType,
                examType: educationLevel,
                examScore: currentExam.scores,
                totalScore: totalScores,
                selfEvaluation: currentExam.selfEvaluation
            })
            setErrorMessage('');
            if (!response.ok) {
                setErrorMessage('添加考试信息失败');
                console.error('添加考试信息失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const addExam = async () => {
        if (!currentExam.examType) {
            setErrorMessage('请填写考试名称');
            return;
        }
        if (!currentExam.scores.Chinese) {
            setErrorMessage('请填写语文成绩');
            return;
        }
        if (!currentExam.scores.Math) {
            setErrorMessage('请填写数学成绩');
            return;
        }
        if (!currentExam.scores.English) {
            setErrorMessage('请填写英语成绩');
            return;
        }
        if (subjects.Physics && !currentExam.scores.Physics) {
            setErrorMessage('请填写物理成绩');
            return;
        }
        if (subjects.Chemistry && !currentExam.scores.Chemistry) {
            setErrorMessage('请填写化学成绩');
            return;
        }
        if (subjects.Biology && !currentExam.scores.Biology) {
            setErrorMessage('请填写生物成绩');
            return;
        }
        if (subjects.Geography && !currentExam.scores.Geography) {
            setErrorMessage('请填写地理成绩');
            return;
        }
        if (subjects.History && !currentExam.scores.History) {
            setErrorMessage('请填写历史成绩');
            return;
        }
        if (subjects.Politics && !currentExam.scores.Politics) {
            setErrorMessage('请填写政治成绩');
            return;
        }
        if (!baseInfoSaved) {
            await saveBaseInfo(); // 保存基础信息
        }
        await saveExamInfo(); // 保存考试信息

        setExams(prevExams => [...prevExams, {
            examType: educationLevel, // 确保 examType 设置正确
            examName: currentExam.examType, // 确保 examName 设置正确
            scores: currentExam.scores,
            selfEvaluation: currentExam.selfEvaluation
        }]);
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
            selfEvaluation: ''
        });
        setShowScoreForm(false); // 关闭模态框
    };

    // 定位到成绩分析总结
    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (aiSuggestions) {
            scrollToBottom();
        }
    }, [aiSuggestions]);

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
                setErrorMessage('');
                const data = await response.json();
                setAiSuggestions(data.result);
            } else if (response.status === 502) {
                setErrorMessage('对不起，当前网络繁忙，请刷新或稍后再试');
            } else {
                console.error('分析失败');
                setErrorMessage('分析失败，请稍后再试');
            }
        } catch (error) {
            console.error('请求出错', error);
            setErrorMessage('网络错误');
        } finally {
            setLoading(false);
        }
    };
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const fetchBaseInfo = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/spark/baseInfo?student_id=${student_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    const subjectsArray = data.subject.split(', ').map(subject => subject.trim());
                    const subjectsObject = {
                        Physics: subjectsArray.includes('Physics'),
                        Chemistry: subjectsArray.includes('Chemistry'),
                        Biology: subjectsArray.includes('Biology'),
                        Geography: subjectsArray.includes('Geography'),
                        History: subjectsArray.includes('History'),
                        Politics: subjectsArray.includes('Politics')
                    };

                    setEducationLevel(data.education_level);
                    setSubjects(subjectsObject);
                    setTotalScores(data.fullMark);
                    setBaseInfoSaved(true);
                    setErrorMessage('');

                    // 更新 currentExam 状态中的 scores 属性
                    setCurrentExam(prevState => ({
                        ...prevState,
                        scores: {
                            Chinese: '',
                            Math: '',
                            English: '',
                            Physics: '',
                            Chemistry: '',
                            Biology: '',
                            Geography: '',
                            History: '',
                            Politics: '',
                            //...data.fullMark
                        }
                    }));
                }
            } else {
                setErrorMessage('获取基础信息失败');
                console.error('获取基础信息失败');
            }
        } catch (error) {
            setErrorMessage('网络错误')
            console.error('网络错误', error);
        } finally {
            setLoading(false);
        }
    };
    const chartRef = useRef<any>(null);
    const [ChartisChecked, setChartisChecked] = useState(false)

    return (
        <Content className={styles.Container} id='main-content'>
            {loading && <Loading />}

            <div className={styles.Box}>
                {/*<h2>成绩分析</h2>*/}
                {!baseInfoSaved ? (
                    <Button onClick={() => setShowEditForm(true)}>编辑科目信息</Button>
                ) : (
                    view === '0' ? (
                        <Button onClick={() => setView('1')} style={{ marginRight: "20px",marginBottom:'16px' ,marginTop:'8px'}} >查看信息</Button>
                    ) : (
                        <div className={styles.FixedInfo}>
                            <h3>教育阶段: {educationLevel}</h3>
                            <h3>选修科目: {Object.keys(subjects).filter(subject => subjects[subject]).map(subject => subjectNames[subject]).join(', ')}</h3>
                            <h3 style={{display:"inline"}}>各科总分:</h3>
                            <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>语文: {totalScores.Chinese}</span>
                            <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>数学: {totalScores.Math}</span>
                            <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>英语: {totalScores.English}</span>
                            {subjects.Physics && <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>物理: {totalScores.Physics}</span>}
                            {subjects.Chemistry && <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>化学: {totalScores.Chemistry}</span>}
                            {subjects.Biology && <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>生物: {totalScores.Biology}</span>}
                            {subjects.Geography && <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>地理: {totalScores.Geography}</span>}
                            {subjects.History && <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>历史: {totalScores.History}</span>}
                            {subjects.Politics && <span className={styles.InlineParagraph} style={{fontSize:"24px"}}>政治: {totalScores.Politics}</span>}
                            <br/>
                            <Button onClick={() => setShowEditForm(true)} style={{ marginRight: "16px" ,marginTop:'16px'}}>编辑信息</Button>
                            <Button onClick={() => setView('0')} style={{marginTop:'16px'}}>收起信息</Button>
                        </div>
                    )
                )}
                {view === '0' && <Button onClick={() => setShowScoreForm(true)} style={{ marginBottom: '16px' ,marginTop:'8px'}}>添加成绩</Button>}
                {currentExams.length!==0&&view === '0'&&<Button onClick={analyzeExams} style={{marginLeft:'16px', marginBottom:'16px',marginTop:'8px'}}>分析成绩</Button>}
                <div style={{height:'5px'}}></div>

                {currentExams.length!==0&&<Line
                    data={ChartisChecked ? TotalData : TData}
                    xField="examName"
                    yField="value"
                    colorField="subject"
                    onReady={(chart) => { chartRef.current = chart; }}
                />}
                {currentExams.length!==0&&<Checkbox id="checkbox" labelText="查看总分趋势" checked={ChartisChecked} onChange={(_, { checked }) => setChartisChecked(checked)} />}

                <Modal
                    open={showEditForm}
                    modalHeading="编辑科目信息"
                    passiveModal
                    onRequestClose={() => setShowEditForm(false)}
                    style={{ zIndex: 1000 }}
                >
                    <div className={styles.BaseInfoForm}>
                        <Select
                            id="educationLevel"
                            name="educationLevel"
                            labelText="选择教育阶段"
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            style={{marginBottom:'8px'}}
                        >
                            <SelectItem value="" text="请选择" />
                            <SelectItem value="小学" text="小学" />
                            <SelectItem value="初中" text="初中" />
                            <SelectItem value="高中" text="高中" />
                        </Select>

                        <h3 >选择选修科目</h3>
                        {['Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Politics'].map(subject => {
                            let cn;
                            if (subject === 'Physics') { cn = '物理'; }
                            if (subject === 'Chemistry') { cn = '化学'; }
                            if (subject === 'Biology') { cn = '生物'; }
                            if (subject === 'Geography') { cn = '地理'; }
                            if (subject === 'History') { cn = '历史'; }
                            if (subject === 'Politics') { cn = '政治'; }

                            return (
                                <Checkbox
                                    key={subject}
                                    id={subject}
                                    name={subject}
                                    labelText={cn}
                                    checked={subjects[subject]}
                                    onChange={handleSubjectChange}
                                />
                            );
                        })}


                        <h3 style={{marginBottom:'8px'}}>各科目总分</h3>
                        <TextInput
                            id="ChineseTotal"
                            name="Chinese"
                            labelText="语文总分"
                            value={totalScores.Chinese}
                            onChange={handleTotalScoreChange}
                            style={{marginBottom:'8px'}}s
                        />
                        <TextInput
                            id="MathTotal"
                            name="Math"
                            labelText="数学总分"
                            value={totalScores.Math}
                            onChange={handleTotalScoreChange}
                            style={{marginBottom:'8px'}}
                        />
                        <TextInput
                            id="EnglishTotal"
                            name="English"
                            labelText="英语总分"
                            value={totalScores.English}
                            onChange={handleTotalScoreChange}
                            style={{marginBottom:'8px'}}
                        />
                        {subjects.Physics && (
                            <TextInput
                                id="PhysicsTotal"
                                name="Physics"
                                labelText="物理总分"
                                value={totalScores.Physics}
                                onChange={handleTotalScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Chemistry && (
                            <TextInput
                                id="ChemistryTotal"
                                name="Chemistry"
                                labelText="化学总分"
                                value={totalScores.Chemistry}
                                onChange={handleTotalScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Biology && (
                            <TextInput
                                id="BiologyTotal"
                                name="Biology"
                                labelText="生物总分"
                                value={totalScores.Biology}
                                onChange={handleTotalScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Geography && (
                            <TextInput
                                id="GeographyTotal"
                                name="Geography"
                                labelText="地理总分"
                                value={totalScores.Geography}
                                onChange={handleTotalScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.History && (
                            <TextInput
                                id="HistoryTotal"
                                name="History"
                                labelText="历史总分"
                                value={totalScores.History}
                                onChange={handleTotalScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Politics && (
                            <TextInput
                                id="PoliticsTotal"
                                name="Politics"
                                labelText="政治总分"
                                value={totalScores.Politics}
                                onChange={handleTotalScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        <Button onClick={saveBaseInfo} style={{marginTop:'16px'}}>保存信息</Button>
                    </div>
                </Modal>

                <Modal
                    open={showScoreForm}
                    modalHeading="添加成绩"
                    passiveModal
                    onRequestClose={() => setShowScoreForm(false)}
                    style={{ zIndex: 1000 }}
                >
                    <div className={styles.ExamForm}>
                        <TextInput
                            id="examType"
                            name="examType"
                            labelText="考试名称"
                            value={currentExam.examType}
                            onChange={handleChange}
                            style={{marginBottom:'8px'}}
                        />
                        <TextInput
                            id="Chinese"
                            name="Chinese"
                            labelText="语文"
                            value={currentExam.scores.Chinese}
                            onChange={handleScoreChange}
                            style={{marginBottom:'8px'}}
                        />
                        <TextInput
                            id="Math"
                            name="Math"
                            labelText="数学"
                            value={currentExam.scores.Math}
                            onChange={handleScoreChange}
                            style={{marginBottom:'8px'}}
                        />
                        <TextInput
                            id="English"
                            name="English"
                            labelText="英语"
                            value={currentExam.scores.English}
                            onChange={handleScoreChange}
                            style={{marginBottom:'8px'}}
                        />
                        {subjects.Physics && (
                            <TextInput
                                id="Physics"
                                name="Physics"
                                labelText="物理"
                                value={currentExam.scores.Physics}
                                onChange={handleScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Chemistry && (
                            <TextInput
                                id="Chemistry"
                                name="Chemistry"
                                labelText="化学"
                                value={currentExam.scores.Chemistry}
                                onChange={handleScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Biology && (
                            <TextInput
                                id="Biology"
                                name="Biology"
                                labelText="生物"
                                value={currentExam.scores.Biology}
                                onChange={handleScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Geography && (
                            <TextInput
                                id="Geography"
                                name="Geography"
                                labelText="地理"
                                value={currentExam.scores.Geography}
                                onChange={handleScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.History && (
                            <TextInput
                                id="History"
                                name="History"
                                labelText="历史"
                                value={currentExam.scores.History}
                                onChange={handleScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        {subjects.Politics && (
                            <TextInput
                                id="Politics"
                                name="Politics"
                                labelText="政治"
                                value={currentExam.scores.Politics}
                                onChange={handleScoreChange}
                                style={{marginBottom:'8px'}}
                            />
                        )}
                        <TextArea
                            id="selfEvaluation"
                            name="selfEvaluation"
                            labelText="自我评价"
                            value={currentExam.selfEvaluation}
                            onChange={handleChange}
                            style={{marginBottom:'16px'}}
                            rows={4}
                        />
                        <Button onClick={addExam} style={{ marginRight: "20px" }}>添加考试成绩</Button>
                        <Button onClick={() => setShowScoreForm(false)}>取消</Button>
                    </div>
                </Modal>

                <div className={styles.ExamList} style={{marginTop:'16px'}}>
                    {currentExams.map((exam, index) => (
                        <div key={index} className={styles.ExamItem}>
                            <h3 style={{marginBottom:'8px'}}>{exam.examName}</h3>
                            <span className={styles.InlineParagraph}>语文: {exam.scores.Chinese}</span>
                            <span className={styles.InlineParagraph}>数学: {exam.scores.Math}</span>
                            <span className={styles.InlineParagraph}>英语: {exam.scores.English}</span>
                            {exam.scores.Physics && <span className={styles.InlineParagraph}>物理: {exam.scores.Physics}</span>}
                            {exam.scores.Chemistry && <span className={styles.InlineParagraph}>化学: {exam.scores.Chemistry}</span>}
                            {exam.scores.Biology && <span className={styles.InlineParagraph}>生物: {exam.scores.Biology}</span>}
                            {exam.scores.Geography && <span className={styles.InlineParagraph}>地理: {exam.scores.Geography}</span>}
                            {exam.scores.History && <span className={styles.InlineParagraph}>历史: {exam.scores.History}</span>}
                            {exam.scores.Politics && <span className={styles.InlineParagraph}>政治: {exam.scores.Politics}</span>}
                            <p style={{marginTop:'8px'}}>自我评价: {exam.selfEvaluation}</p>
                        </div>
                    ))}
                </div>
                {currentExams.length!==0&&<div className={styles.Pagination} style={{marginTop:'16px'}}>
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>上一页</Button>
                    <span>{currentPage}</span>
                    <Button onClick={handleNextPage} disabled={indexOfLastExam >= exams.length}>下一页</Button>
                </div>}
                {aiSuggestions && (
                    <div className={styles.AiSuggestions}>
                        <h3>成绩分析总结</h3>
                        <p ref={bottomRef}>{aiSuggestions}</p>
                    </div>
                )}
            </div>
        </Content>
    );
}
