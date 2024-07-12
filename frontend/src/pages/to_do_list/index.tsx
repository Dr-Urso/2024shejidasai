import React, { useState } from 'react';
import {Button, TextInput, Select, SelectItem, Content} from 'carbon-components-react';
import styles from './index.less'; // 样式文件

export default function TodoList() {
    const [err,setErr]=useState('');
    const [days, setDays] = useState([]);
    const [currentDay, setCurrentDay] = useState({
        date: '',
        tasks: []
    });
    const [currentTask, setCurrentTask] = useState({
        taskName: '',
        status: '未开始'
    });

    const handleDayChange = (e) => {
        const { name, value } = e.target;
        setCurrentDay(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTaskChange = (e) => {
        const { name, value } = e.target;
        setCurrentTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addTask = () => {
        if (!currentTask.taskName) {
            setErr("请输入任务名称")
            return;
        }
        if (err) {
            setErr('');
        }
        setCurrentDay(prevDay => ({
            ...prevDay,
            tasks: [...prevDay.tasks, currentTask]
        }));
        setCurrentTask({
            taskName: '',
            status: '未开始'
        });
    };

    const addDay = () => {
        if (!currentDay.date) {
            setErr("请输入日期")
            return;
        }
        if (currentDay.tasks.length===0) {
            setErr("任务不能为空")
            return;
        }
        if (err) {
            setErr('');}
        setDays(prevDays => {
            const dayIndex = prevDays.findIndex(day => day.date === currentDay.date);
            if (dayIndex !== -1) {
                // 如果找到相同日期的任务，则更新该任务列表
                const updatedDays = [...prevDays];
                updatedDays[dayIndex].tasks = [
                    ...updatedDays[dayIndex].tasks,
                    ...currentDay.tasks
                ];
                return updatedDays;
            } else {
                // 否则，添加新的任务列表
                return [...prevDays, currentDay];
            }
        });
        setCurrentDay({
            date: '',
            tasks: []
        });
    };

    const analyzeTasks = async () => {
        if (days.length === 0) {
            setErr("请添加至少一天的任务")
            return;
        }
        const daysJson = days.reduce((acc, day, index) => {
            acc[index + 1] = day;
            return acc;
        }, {});

        try {
            const response = await fetch('YOUR_BACKEND_API_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(daysJson)
            });

            if (response.ok) {
                const data = await response.json();
                alert(`AI每周总结: ${data.weeklySummary}`);
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
            <h2>学习任务管理</h2>
            <div className={styles.DayForm}>
                <TextInput
                    id="date"
                    name="date"
                    type="date"
                    labelText="日期"
                    value={currentDay.date}
                    onChange={handleDayChange}
                />
                {currentDay.tasks.map((task, index) => (
                    <div key={index} className={styles.TaskItem}>
                        <p>任务: {task.taskName}</p>
                        <p>状态: {task.status}</p>
                    </div>
                ))}
                <TextInput
                    id="taskName"
                    name="taskName"
                    labelText="任务名称"
                    value={currentTask.taskName}
                    onChange={handleTaskChange}
                />
                <Select
                    id="status"
                    name="status"
                    labelText="任务状态"
                    value={currentTask.status}
                    onChange={handleTaskChange}
                >
                    <SelectItem value="未开始" text="未开始" />
                    <SelectItem value="进行中" text="进行中" />
                    <SelectItem value="已完成" text="已完成" />
                </Select>
                <Button onClick={addTask}>添加任务</Button>
                <Button onClick={addDay}>添加当天任务</Button>
                <Button onClick={analyzeTasks}>分析任务</Button>
            </div>
            <div>{err && (
                <div className={styles.Err}>{err}</div>
            )}</div>
            <div className={styles.DayList}>
                {days.map((day, index) => (
                    <div key={index} className={styles.DayItem}>
                        <h3>日期: {day.date}</h3>
                        {day.tasks.map((task, tIndex) => (
                            <div key={tIndex} className={styles.TaskItem}>
                                <p>任务: {task.taskName}</p>
                                <Select
                                    id="status"
                                    name="status"
                                    labelText="任务状态"
                                    value={currentTask.status}
                                    onChange={handleTaskChange}
                                >
                                    <SelectItem value="未开始" text="未开始" />
                                    <SelectItem value="进行中" text="进行中" />
                                    <SelectItem value="已完成" text="已完成" />
                                </Select>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
        </Content>
    );
}
