import styles from './index.less';
import { Button, Content, TextInput, DatePicker, DatePickerInput, Select, SelectItem } from 'carbon-components-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill样式
import DOMPurify from 'dompurify';

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
        diary_title: '',
        diary_date: '',
        diary_mood: '平常心',
        diary_content: ''
    });

    const handleNewDiary = () => {
        setCurrentDiaryIndex(null);
        setCurrentDiary({
            diary_title: '',
            diary_date: '',
            diary_mood: '平常心',
            diary_content: ''
        });
        setValue('');
        setViewMode('edit');
    };

    const handleViewDiary = (index) => {
        const diary = diaries[index];
        setCurrentDiary({
            diary_title: diary.title,
            diary_date: diary.date,
            diary_mood: diary.mood,
            diary_content: diary.content
        });
        setValue(diary.content);
        setCurrentDiaryIndex(index);
        setViewMode('view');
    };

    const handleSave = async () => {
        if (!currentDiary.diary_title) {
            setErr("请输入日记标题");
            return;
        }
        if (!currentDiary.diary_date) {
            setErr('请选择日期');
            return;
        }
        if (!currentDiary.diary_mood) {
            setErr('请选择心情');
            return;
        }
        if (err) {
            setErr('');
        }
        const sanitizedContent = DOMPurify.sanitize(value);
        const newDiary = new DiaryEntry(
            currentDiary.diary_title,
            currentDiary.diary_date,
            currentDiary.diary_mood,
            sanitizedContent
        );

        let updatedDiaries;
        if (currentDiaryIndex === null) {
            updatedDiaries = [...diaries, newDiary];
        } else {
            updatedDiaries = diaries.map((diary, index) =>
                index === currentDiaryIndex ? newDiary : diary
            );
        }

        setDiaries(updatedDiaries);
        setViewMode('home');

        // 提交到后端
        try {
            const response = await fetch('YOUR_BACKEND_API_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDiary)
            });
            if (!response.ok) {
                console.error('保存失败');
            }
        } catch (error) {
            console.error('请求出错', error);
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
            diary_date: date[0]?.toISOString().split('T')[0] || ''
        }));
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const getSortedDiaries = () => {
        const moodOrder = { '兴奋': 1, '开心': 2, '平常心': 3, '伤心': 4, '悲伤': 5 };

        if (sortOption === 'date') {
            return [...diaries].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOption === 'mood') {
            return [...diaries].sort((a, b) => moodOrder[a.mood] - moodOrder[b.mood]);
        } else {
            return diaries;
        }
    };

    const handleAnalyzeDiaries = async () => {
        try {
            const response = await fetch('YOUR_ANALYSIS_BACKEND_API_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ diaries })
            });
            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data.analysis);
            } else {
                console.error('分析失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const sortedDiaries = getSortedDiaries();

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
                    <h2>日记本</h2>
                    <div className={styles.Tool}>
                        <Button onClick={handleNewDiary}>新建日记</Button>
                        <Button onClick={handleAnalyzeDiaries}>日记分析</Button>
                        <div className={styles.Select}>
                            <Select id="sortOption" labelText="排序方式" value={sortOption} onChange={handleSortChange}>
                                <SelectItem value="date" text="按日期排序" />
                                <SelectItem value="mood" text="按心情排序" />
                            </Select>
                        </div>
                    </div>
                    <div className={styles.Entries}>
                        {sortedDiaries.map((diary, index) => (
                            <div key={index} className={styles.Entry} onClick={() => handleViewDiary(index)}>
                                <h3>{diary.title}</h3>
                                <p>日期: {diary.date}</p>
                                <p>心情: {diary.mood}</p>
                            </div>
                        ))}
                    </div>
                    {analysisResult && (
                        <div className={styles.AnalysisResult}>
                            <h3>日记分析结果:</h3>
                            <p>{analysisResult}</p>
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
                    <h1>{currentDiary.diary_title}</h1>
                    <div className={styles.Subhead}>
                        <p>日期: {currentDiary.diary_date}</p>
                        <p>心情: {currentDiary.diary_mood}</p>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: currentDiary.diary_content }}></div>
                    <Button onClick={() => setViewMode('home')}>返回</Button>
                </div>
            </Content>
        );
    }

    return (
        <Content className={styles.Container} id='main-content'>
            <div className={styles.Box}>
                <TextInput
                    id="diary_title"
                    name="diary_title"
                    labelText="日记标题"
                    value={currentDiary.diary_title}
                    onChange={handleChange}
                />
                <DatePicker dateFormat="Y-m-d" datePickerType="single" onChange={handleDateChange}>
                    <DatePickerInput
                        id="diary_date"
                        placeholder="yyyy-mm-dd"
                        labelText="写作日期"
                        value={currentDiary.diary_date}
                    />
                </DatePicker>
                <Select
                    id="diary_mood"
                    name="diary_mood"
                    labelText="心情"
                    value={currentDiary.diary_mood}
                    onChange={handleChange}
                >
                    <SelectItem value="兴奋" text="兴奋" />
                    <SelectItem value="开心" text="开心" />
                    <SelectItem value="平常心" text="平常心" />
                    <SelectItem value="伤心" text="伤心" />
                    <SelectItem value="悲伤" text="悲伤" />
                </Select>
                <ReactQuill value={value} onChange={setValue} modules={modules} />
                <Button onClick={handleSave}>保存</Button>
                <Button onClick={() => setViewMode('home')}>取消</Button>
                <div>{err && (
                    <div className={styles.Err}>{err}</div>
                )}</div>
            </div>
        </Content>
    );
}
