import React, {useState, useEffect, useContext, useRef} from 'react';
import { Button, TextInput, Select, SelectItem, Content, Loading } from 'carbon-components-react';
import styles from './index.less'; // 样式文件
import { useUser,UserContext } from "@/Utils/UserContext";
import {message} from "antd";

export default function TodoList() {
    const { student_id, teacher_id, clearUserInfo } = useContext(UserContext);
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

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
            case '请输入任务名称': {
                message.info({
                    content: '请输入任务名称',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请输入日期': {
                message.info({
                    content: '请输入日期',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '任务不能为空': {
                message.info({
                    content: '任务不能为空',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '请添加至少一天的计划': {
                message.info({
                    content: '请添加至少一天的计划',
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
            case '获取天数据失败': {
                message.error({
                    content: '获取天数据失败，请刷新或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '更新任务状态失败': {
                message.error({
                    content: '更新任务状态失败，请刷新或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '添加天失败': {
                message.error({
                    content: '添加天失败，请刷新或稍后再尝试',
                    className: 'custom-class',
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });
                break;
            }
            case '当天计划总结失败': {
                message.error({
                    content: '当天计划总结失败，请刷新或稍后再尝试',
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
                setErr('');
            } else {
                setErr('获取天数据失败');
                console.error('获取天数据失败');
            }
        } catch (error) {
            setErr('网络错误');
            console.error('网络错误', error);
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
                setErr('');
                setDays(updatedDays);
            } else {
                setErr('更新任务状态失败');
                console.error('更新任务状态失败');
            }
        } catch (error) {
            setErr('网络错误');
            console.error('网络错误', error);
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
                setErr('');
            } else {
                setErr('添加当天计划失败');
                console.error('添加当天计划失败');
            }
        } catch (error) {
            setErr('网络错误')
            console.error('网络错误', error);
        }
    };

    //定位到每日计划总结
    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (aiSuggestions) {
            scrollToBottom();
        }
    }, [aiSuggestions]);

    const [loading, setLoading] = useState(false);
    const analyzeTasks = async () => {
        if (days.length === 0) {
            setErr("请添加至少一天的计划");
            return;
        }
        const daysJson = days.reduce((acc, day, index) => {
            acc[index + 1] = day;
            return acc;
        }, {});
        setLoading(true);
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
                setErr('');
            } else {
                setErr('当天计划总结失败')
                console.error('当天计划总结失败');
            }
        } catch (error) {
            console.error('网络错误', error);
            setErr('网络错误');
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

    const indexOfLastDay = currentPage * itemsPerPage;
    const indexOfFirstDay = indexOfLastDay - itemsPerPage;
    const currentDays = days.slice(indexOfFirstDay, indexOfLastDay);

    return (
        <Content className={styles.Container} id='main-content'>
            <Loading active={loading} />
            <div className={styles.Box}>
                {/*{student_id === null ? (<h2>教学计划管理</h2>):(<h2>学习计划管理</h2>)}*/}
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
                    <Button onClick={addTask} style={{ marginRight: "20px",marginBottom:'16px',marginTop:'16px'}}>添加任务</Button>
                    <Button onClick={addDay} style={{ marginRight: "20px",marginBottom:'16px',marginTop:'16px'}}>添加当天计划</Button>
                    {currentDays.length!==0&&<Button onClick={analyzeTasks} style={{ marginRight: "20px",marginBottom:'16px',marginTop:'16px'}}>当天计划总结</Button>}
                </div>
                <div className={styles.DayList}>
                    {currentDays.map((day, dayIndex) => (
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
                {currentDays.length!==0&&<div className={styles.Pagination}>
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>上一页</Button>
                    <span>{currentPage}</span>
                    <Button onClick={handleNextPage} disabled={indexOfLastDay >= days.length}>下一页</Button>
                </div>}
                {aiSuggestions && (
                    <div className={styles.AiSuggestions}>
                        {student_id === null ? (<h3>每日教学计划总结</h3>):(<h3>每日学习计划总结</h3>)}
                        <p ref={bottomRef}>{aiSuggestions}</p>
                    </div>
                )}
            </div>
        </Content>
    );
}
