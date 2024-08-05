import styles from './index.less';
import { Button, Content, TextInput, DatePicker, DatePickerInput, Select, SelectItem } from 'carbon-components-react';
import React, {useState, useEffect, useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill样式
import DOMPurify from 'dompurify';
import {message} from "antd";

message.config({
    zIndex:9999
})

class DiaryEntry {
    private title: any;
    private date: any;
    private mood: any;
    private content: any;
    constructor(title, date, mood, content) {
        this.title = title;
        this.date = date;
        this.mood = mood;
        this.content = content; // HTML content as a string
    }
}

export default function Page() {
    const [diaries, setDiaries] = useState([]);
    const [viewMode, setViewMode] = useState('home'); // 'home', 'edit', 'view'
    const [currentDiaryIndex, setCurrentDiaryIndex] = useState(null);
    const [value, setValue] = useState('');
    const [err, setErr] = useState('');
    const [sortOption, setSortOption] = useState('date'); // 'date' or 'mood'
    const [analysisResult, setAnalysisResult] = useState(null);
    const [currentDiary, setCurrentDiary] = useState({
        title: '',
        date: '',
        mood: '正常',
        content: ''
    });

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
            case '请输入日记标题': {
                message.info({
                    content: '请输入日记标题',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请选择日期': {
                message.info({
                    content: '请选择日期',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请选择心情': {
                message.info({
                    content: '请输入日记标题',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请输入日记内容': {
                message.info({
                    content: '请输入日记内容',
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
            case '获取日记失败': {
                message.error({
                    content: '获取日记失败，请刷新或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '保存日记失败': {
                message.error({
                    content: '保存日记失败，请刷新或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
             case '日记总结失败': {
                message.error({
                    content: '日记总结失败，请刷新或稍后再尝试',
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        // 获取数据库中的所有日记
        const fetchDiaries = async () => {
            try {
                const response = await fetch('/api/spark/diary_list');
                if (response.ok) {
                    const data = await response.json();
                    setDiaries(data);
                    setErr('');
                } else {
                    setErr('获取日记失败');
                    console.error('获取日记失败');
                }
            } catch (error) {
                setErr('网络错误')
                console.error('网络错误', error);
            }
        };
        fetchDiaries();
    }, []);

    const handleNewDiary = () => {
        setCurrentDiaryIndex(null);
        setCurrentDiary({
            title: '',
            date: '',
            mood: '正常',
            content: ''
        });
        setValue('');
        setViewMode('edit');
    };

    const handleViewDiary = (diary) => {
        setCurrentDiary({
            title: diary.title,
            date: diary.date,
            mood: diary.mood,
            content: diary.content
        });
        setValue(diary.content);
        setViewMode('view');
    };

    const handleSave = async (e) => {
        if (!currentDiary.title) {
            setErr("请输入日记标题");
            return;
        }
        if (!currentDiary.date) {
            setErr('请选择日期');
            return;
        }
        if (!currentDiary.mood) {
            setErr('请选择心情');
            return;
        }
        if (value==='') {
            setErr('请输入日记内容');
            return;
        }
        const sanitizedContent = DOMPurify.sanitize(value);
        const newDiary = new DiaryEntry(
            currentDiary.title,
            currentDiary.date,
            currentDiary.mood,
            sanitizedContent
        );

        // 提交到后端
        try {
            const response = await fetch('/api/spark/diary_list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDiary)
            });
            if (response.ok) {
                const savedDiary = await response.json();
                setDiaries([...diaries, savedDiary]);
                setViewMode('home');
                setErr('');
            } else {
                const errorData = await response.json();
                console.error('保存日记失败', errorData);
                setErr('保存日记失败');
            }
        } catch (error) {
            console.error('网络错误', error);
            setErr('网络错误');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDiary(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setCurrentDiary(prevState => ({
            ...prevState,
            date: date[0]?.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') || ''
        }));
    };


    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const getSortedDiaries = () => {
        const moodOrder = { '兴奋': 1, '开心': 2, '正常': 3, '伤心': 4, '悲伤': 5 };

        if (sortOption === 'date') {
            return [...diaries].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOption === 'mood') {
            return [...diaries].sort((a, b) => moodOrder[a.mood] - moodOrder[b.mood]);
        } else {
            return diaries;
        }
    };

    //定位到每日日记总结
    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (analysisResult) {
            scrollToBottom();
        }
    }, [analysisResult]);

    const handleAnalyzeDiaries = async () => {
        try {
            const response = await fetch('/api/spark/diary_summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data.result);
                setErr('');
            }else if (response.status === 502) {
                setErr('对不起，当前网络繁忙，请刷新或稍后再试');
            } else {
                setErr('日记总结失败')
                console.error('日记总结失败');
            }
        } catch (error) {
            setErr('网络错误');
            console.error('网络错误', error);
        }
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const sortedDiaries = getSortedDiaries();
    const indexOfLastDiary = currentPage * itemsPerPage;
    const indexOfFirstDiary = indexOfLastDiary - itemsPerPage;
    const currentDiaries = sortedDiaries.slice(indexOfFirstDiary, indexOfLastDiary);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }], // Dropdown with defaults from theme
            [{ 'align': [] }],
            ['clean']
        ],
    };

    if (viewMode === 'home') {
        return (
            <Content className={styles.Container} id='main-content'>
                <div className={styles.Box}>
                    <h2>我的日记本</h2>
                    <div className={styles.Tool} style={{marginBottom:'16px',marginTop:'16px'}}>
                        <Button onClick={handleNewDiary} style={{marginTop:'3px'}}>新建日记</Button>
                        {currentDiaries.length!==0&&<Button onClick={handleAnalyzeDiaries} style={{marginTop:'3px'}}>每周日记总结</Button>}
                        {currentDiaries.length!==0&&<div className={styles.Select}>
                            <Select id="sortOption" labelText="" value={sortOption} onChange={handleSortChange}>
                                <SelectItem value="date" text="按日期排序"/>
                                <SelectItem value="mood" text="按心情排序"/>
                            </Select>
                        </div>}
                    </div>
                    <div className={styles.Entries}>
                        {currentDiaries.map((diary, index) => (
                            <div key={index} className={styles.Entry} onClick={() => handleViewDiary(diary)}>
                                <h3>{diary.title}</h3>
                                <p>日期: {diary.date}</p>
                                <p>心情: {diary.mood}</p>
                                <p className={styles.Underline}>-------------------</p>
                            </div>
                        ))}
                    </div>
                    {currentDiaries.length!==0&&<div className={styles.Pagination} style={{marginTop:'16px'}}>
                        <Button onClick={handlePrevPage} disabled={currentPage === 1}>上一页</Button>
                        <span>{currentPage}</span>
                        <Button onClick={handleNextPage}
                                disabled={indexOfLastDiary >= sortedDiaries.length}>下一页</Button>
                    </div>}
                    {analysisResult && (
                        <div className={styles.AnalysisResult} style={{marginTop:'16px'}}>
                            <h3>每周日记总结</h3>
                            <p ref={bottomRef}>{analysisResult}</p>
                        </div>
                    )}
                </div>
            </Content>
        );
    }

    if (viewMode === 'view') {
        return (
            <Content className={styles.Container} id='main-content'>
                <div className={styles.Box}>
                    <h1>{currentDiary.title}</h1>
                    <div className={styles.Subhead} style={{marginTop:'16px'}}>
                        <p>日期: {currentDiary.date} 心情: {currentDiary.mood}</p>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: currentDiary.content }}></div>
                    <Button onClick={() => setViewMode('home')} style={{marginTop:'32px'}}>返回</Button>
                </div>
            </Content>
        );
    }

    return (
        <Content className={styles.Container} id='main-content'>
            <div className={styles.Box}>
                <TextInput
                    id="title"
                    name="title"
                    labelText="日记标题"
                    value={currentDiary.title}
                    onChange={handleChange}
                    style={{marginBottom:'16px'}}
                />
                <DatePicker dateFormat="Y-m-d" datePickerType="single" onChange={handleDateChange} style={{marginBottom:'16px'}}>
                    <DatePickerInput
                        id="date"
                        placeholder="yyyy-mm-dd"
                        labelText="写作日期"
                        value={currentDiary.date}
                    />
                </DatePicker>
                <Select
                    id="mood"
                    name="mood"
                    labelText="心情"
                    value={currentDiary.mood}
                    onChange={handleChange}
                >
                    <SelectItem value="兴奋" text="兴奋" />
                    <SelectItem value="开心" text="开心" />
                    <SelectItem value="正常" text="正常" />
                    <SelectItem value="伤心" text="伤心" />
                    <SelectItem value="悲伤" text="悲伤" />
                </Select>
                <ReactQuill value={value} onChange={setValue} modules={modules} style={{marginTop:'16px'}}/>
                <Button onClick={handleSave} style={{marginTop:'16px',marginRight:'16px'}}>保存</Button>
                <Button onClick={() => setViewMode('home')} style={{marginTop:'16px',marginRight:'16px'}}>取消</Button>
            </div>
        </Content>
    );
}
