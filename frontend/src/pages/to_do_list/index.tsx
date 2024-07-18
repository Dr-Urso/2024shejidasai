import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, SelectItem, Content } from 'carbon-components-react';
import styles from './index.less'; // 样式文件

export default function TodoList() {
    const [err, setErr] = useState('');
    const [days, setDays] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState('');
    const [currentDay, setCurrentDay] = useState({
        date: '',
        tasks: []
    });
    const [currentTask, setCurrentTask] = useState({
        task_name: '',
        status: '未开始'
    });

    useEffect(() => {
        fetchDays();
    }, []);

    const fetchDays = async () => {
        try {
            const response = await fetch('/api/todolist/days/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDays(data);
            } else {
                console.error('获取天数据失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

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

    const handleTaskStatusChange = async (dayIndex, taskIndex, newStatus) => {
        const updatedDays = [...days];
        updatedDays[dayIndex].tasks[taskIndex].status = newStatus;

        const taskId = updatedDays[dayIndex].tasks[taskIndex].id;
        try {
            const response = await fetch(`/api/todolist/tasks/${taskId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setDays(updatedDays);
            } else {
                console.error('更新任务状态失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const addTask = () => {
        if (!currentTask.task_name) {
            setErr("请输入任务名称");
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
            task_name: '',
            status: '未开始'
        });
    };

    const addDay = async () => {
        if (!currentDay.date) {
            setErr("请输入日期");
            return;
        }
        if (currentDay.tasks.length === 0) {
            setErr("任务不能为空");
            return;
        }
        if (err) {
            setErr('');
        }
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
        try {
            const response = await fetch('/api/todolist/days/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentDay)
            });

            if (response.ok) {
                fetchDays(); // 更新天数据
                setCurrentDay({
                    date: '',
                    tasks: []
                });
            } else {
                console.error('添加天失败');
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const analyzeTasks = async () => {
        if (days.length === 0) {
            setErr("请添加至少一天的任务");
            return;
        }
        const daysJson = days.reduce((acc, day, index) => {
            acc[index + 1] = day;
            return acc;
        }, {});

        try {
            const response = await fetch('/api/todolist/analyze/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(daysJson)
            });

            if (response.ok) {
                const data = await response.json();
                setAiSuggestions(data.weeklySummary);
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
                            <p>任务: {task.task_name}</p>
                            <p>状态: {task.status}</p>
                        </div>
                    ))}
                    <TextInput
                        id="task_name"
                        name="task_name"
                        labelText="任务名称"
                        value={currentTask.task_name}
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
                    <Button onClick={addTask} style={{marginRight:"20px"}}>添加任务</Button>
                    <Button onClick={addDay} style={{marginRight:"20px"}}>添加当天任务</Button>
                    <Button onClick={analyzeTasks}>分析任务</Button>
                </div>
                <div>{err && (
                    <div className={styles.Err}>{err}</div>
                )}</div>
                <div className={styles.DayList}>
                    {days.map((day, dayIndex) => (
                        <div key={dayIndex} className={styles.DayItem}>
                            <h3>日期: {day.date}</h3>
                            {day.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className={styles.TaskItem}>
                                    <p>任务: {task.task_name}</p>
                                    <Select
                                        id={`status-${dayIndex}-${taskIndex}`}
                                        name="status"
                                        labelText="任务状态"
                                        value={task.status}
                                        onChange={(e) => handleTaskStatusChange(dayIndex, taskIndex, e.target.value)}
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