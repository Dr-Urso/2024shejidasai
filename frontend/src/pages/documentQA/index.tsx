import React, {useState, useEffect, useRef} from 'react';
import { Content, Button, FileUploader, TextInput, Modal } from 'carbon-components-react';
import styles from './index.less';
import {Popover,Button as AntdButton,message} from 'antd';

export default function DocumentQA() {
    const [file, setFile] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [uploadLoading,setuploadLoading]=useState(false);
    const [qLoading,setQLoading]=useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState('');
    const [getSummary, setGetSummary] = useState(false);
    const [init,setInit]=useState(true);
    const [initChat,setInitChat]=useState(true);

    useEffect(() => {
        switch (error){
            case '请求出错':{
                message.error({
                    content: '网络请求出错，请刷新或稍后重试',
                    className: 'custom-class',
                    duration:3,
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '请先选择一个文档':{
                message.info({
                    content: '请先选择一个文档',
                    className: 'custom-class',
                    duration:3,
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '文档上传失败':{
                message.error({
                    content: '文档上传失败',
                    className: 'custom-class',
                    duration:3,
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '文档总结请求失败，正在重试':{
                message.info({
                    content: '文档总结请求失败，正在重试',
                    className: 'custom-class',
                    duration:3,
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '文档总结结果获取失败，正在重试':{
                message.info({
                    content: '文档总结结果获取失败，正在重试',
                    duration:3,
                    className: 'custom-class',
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '请先上传文档':{
                message.info({
                    content: '请先上传文档',
                    className: 'custom-class',
                    duration:3,
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '请输入问题':{
                message.info({
                    content: '请先输入问题',
                    className: 'custom-class',
                    duration:3,
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '问答失败':{
                message.error({
                    content: '回答失败，可能网络繁忙或断开连接，请刷新或稍后再试',
                    duration:3,
                    className: 'custom-class',
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '文档总结请求失败':{
                message.error({
                    content: '文档总结请求失败，请刷新或稍后重试',
                    duration:3,
                    className: 'custom-class',
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
            case '文档总结结果获取失败':{
                message.error({
                    content: '文档总结结果获取失败，请刷新或稍后重试',
                    duration:3,
                    className: 'custom-class',
                    style: {
                    marginTop: '20vh',
                    },
                });
                break;
            }
        }
    }, [error]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError('');
    };

    const handleRemoveFile = (event) => {
        setFile(null);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('请先选择一个文档');
            return;
        }

        setDocumentId(null);//清除之前的文档id

        const formData = new FormData();
        formData.append('file', file);

        try {
            setuploadLoading(true);
            const response = await fetch('/api/spark/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setDocumentId(data.document_id);
                setError('');
                setuploadLoading(false);
                setGetSummary(false);
                setInit(false);

                if(initChat){
                    //首次上传文档成功后，提示用户可以开始对话
                    const answerMessage = {
                        sender: 'bot',
                        text: '您的文档上传成功，快来尝试对文档进行提问吧~',
                        timestamp: new Date().toLocaleTimeString()
                    };
                    setMessages(prevMessages => [...prevMessages, answerMessage]);
                }else{
                    //上传文档成功后，提示用户可以开始对话
                    const answerMessage = {
                        sender: 'bot',
                        text: '您重新上传的文档已成功上传，快来对文档提问吧~',
                        timestamp: new Date().toLocaleTimeString()
                    };
                    setMessages(prevMessages => [...prevMessages, answerMessage]);
                }

                setInitChat(false);
                console.log('Document uploaded successfully, document_id:', data.document_id);

                await new Promise(resolve => setTimeout(resolve, 3000));//等待3s发起总结请求
                // 调用发起文档总结 API
                await startSummary(data.document_id);
            } else {
                setError('文档上传失败');
            }
        } catch (error) {
            setError('请求出错');
            console.error('请求出错', error);
        }
    };

    const startSummary = async (documentId) => {
        const maxAttempts = 10;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch('/api/spark/document_summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ document_id: documentId }),
                });

                if (response.ok) {
                    console.log('Summary request started successfully');
                    setError('');
                    await fetchSummary(documentId);
                    return ;
                } else {
                    setError('文档总结请求失败，正在重试');
                }
            } catch (error) {
                setError('请求出错');
                console.error('请求出错', error);
            }
            await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒后重试
        }
        setError('文档总结请求失败');
    };

    const fetchSummary = async (documentId) => {
        const maxAttempts = 10;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch('/api/spark/document_summary_result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ document_id: documentId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.summary) {
                        setSummary(data.summary);
                        console.log('Document summarized successfully:', data.summary);
                        setGetSummary(true);
                        setError('');
                        return;
                    }
                } else {
                    if(attempt>=5){
                        setError('文档总结结果获取失败，正在重试');
                    }
                }
            } catch (error) {
                setError('请求出错');
                console.error('请求出错', error);
            }
            await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒后重试
        }
        setError('文档总结结果获取失败');
        setGetSummary(false);
    };

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
        setError('');
    };

    const handleAskQuestion = async () => {
        if (!documentId) {
            setError('请先上传文档');
            return;
        }

        if (!question) {
            setError('请输入问题');
            return;
        }

        const payload = {
            document_id: documentId,
            question: question,
        };

        const newMessage = {
            sender: 'user',
            text: question,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages([...messages, newMessage]);
        setQuestion('');

        setQLoading(true);

        try {
            // console.log('payload:', payload);
            const response = await fetch('/api/spark/qanda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                const answerMessage = {
                    sender: 'bot',
                    text: data.answer,
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prevMessages => [...prevMessages, answerMessage]);
                setError('');
                // console.log('Question asked successfully, answer:', data.answer);
            } else {
                setError('问答失败');
            }
        } catch (error) {
            setError('请求出错');
            console.error('请求出错', error);
        }
        setQLoading(false);
    };

    return (
        <Content id='main-content' className={styles.Container}>
            <div className={styles.ImageUploaderWrapper}>
                <div style={{marginTop:'32px'}}>
                    <FileUploader
                    buttonLabel="选择文档"
                    labelDescription={"仅支持 .pdf .txt .doc"}
                    onChange={handleFileChange}
                    accept={['.pdf', '.txt', '.docx', '.doc']}
                    multiple={false}
                    filenameStatus="edit"
                    onDelete={handleRemoveFile}
                    size={"sm"}
                    />
                </div>
                <Button onClick={handleUpload} disabled={uploadLoading} style={{ marginTop: '16px'}} size={"sm"}>
                    {init&&'上传文档'}
                    {!init&&(uploadLoading?'上传中...':getSummary?'上传文档':'文档总结中...')}
                </Button>
                <br/>
                <Popover content={() => {return <p>{summary}</p>}}
                         title={"文档总结"}
                         trigger={"click"}
                         placement={"bottom"}
                         overlayStyle={{ width: 500 }}
                >
                    {getSummary&&<AntdButton type="primary" style={{marginTop:'16px'}} >文档总结</AntdButton>}
                </Popover>
            </div>
            <div className={styles.ContentWrapper}>
                <div className={styles.ChatSection}>
                    <div className={styles.ChatWindow}>
                        {messages.map((msg, index) => (
                            <div key={index}
                                 className={msg.sender === 'user' ? styles.UserMessage : styles.BotMessage}>
                                <span>{msg.text}</span>
                                <div className={styles.Timestamp}>{msg.timestamp}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.InputSection}>
                        <div className={styles.ChatBox}>
                            <TextInput
                                placeholder="请输入你的问题"
                                onChange={handleQuestionChange}
                                style={{height: "50px"}}
                                value={question}
                            />
                            <Button onClick={handleAskQuestion} disabled={qLoading}>
                                {qLoading ? '回答中...' : '提问'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
}
