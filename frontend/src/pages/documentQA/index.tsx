import React, { useState, useEffect } from 'react';
import { Content, Button, FileUploader, TextInput, Modal } from 'carbon-components-react';
import styles from './index.less';

export default function DocumentQA() {
    const [file, setFile] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [getSummary, setGetSummary] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('请先选择一个文件');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await fetch('/api/spark/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setDocumentId(data.document_id);
                setError('');
                console.log('Document uploaded successfully, document_id:', data.document_id);

                // 调用发起文档总结 API
                await startSummary(data.document_id);
            } else {
                setError('文件上传失败');
            }
        } catch (error) {
            setError('请求出错');
            console.error('请求出错', error);
        } finally {
            setLoading(false);
        }
    };

    const startSummary = async (documentId) => {
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
                await fetchSummary(documentId);
            } else {
                setError('文档总结请求失败');
            }
        } catch (error) {
            setError('请求出错');
            console.error('请求出错', error);
        }
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
                    setError('文档总结结果获取失败');
                }
            } catch (error) {
                setError('请求出错');
                console.error('请求出错', error);
            }
            await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒后重试
        }
        setError('无法获取文档总结结果');
    };

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
        setError('');
    };

    const handleAskQuestion = async () => {
        if (!documentId) {
            setError('请先上传一个文件');
            return;
        }

        if (!question) {
            setError('请输入一个问题');
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

        try {
            console.log('payload:', payload);
            setLoading(true);
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
                console.log('Question asked successfully, answer:', data.answer);
            } else {
                setError('问答失败');
            }
        } catch (error) {
            setError('请求出错');
            console.error('请求出错', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Content id='main-content'>
            <div className={styles.Container}>
                <div className={styles.Header}>
                    <p>上传文档并进行问答</p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <div className={styles.UploadSection}>
                    <FileUploader
                        buttonLabel="选择文件"
                        onChange={handleFileChange}
                        accept={['.pdf', '.txt']}
                        style={{ height: "35px" }}
                    />
                    <Button onClick={handleUpload} disabled={loading} style={{ height: "15px", marginTop: '10px' }}>
                        {loading ? '上传中...' : '上传'}
                    </Button>
                    { getSummary && <Button onClick={openModal} style={{ height: "15px", marginTop: '10px' }}>
                        查看文档总结
                    </Button>}
                </div>
                {documentId && (
                    <div className={styles.ChatSection}>
                        <div className={styles.ChatWindow}>
                            {messages.map((msg, index) => (
                                <div key={index} className={msg.sender === 'user' ? styles.UserMessage : styles.BotMessage}>
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
                                    style={{ height: "50px" }}
                                    value={question}
                                />
                                <Button onClick={handleAskQuestion} disabled={loading} >
                                    {loading ? '提问中...' : '提问'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                open={isModalOpen}
                modalHeading="文档总结"
                primaryButtonText="关闭"
                onRequestClose={closeModal}
                onRequestSubmit={closeModal}
            >
                <p>{summary}</p>
            </Modal>
        </Content>
    );
}
