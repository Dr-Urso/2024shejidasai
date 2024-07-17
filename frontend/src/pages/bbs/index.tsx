import React, {useEffect, useState} from 'react';
import styles from './index.less';
import axios from "axios";
import {Button, ClickableTile, FluidForm, TextInput, Tile} from "@carbon/react";
import {Content, Loading, Modal} from "carbon-components-react";
import {UserAvatar} from "@carbon/ibm-products";

interface QuestionResponse {
    id: number;
    student_username: string;
    text: string;
    created_at: string;
    follow_ups: FollowUp[];
}

interface FollowUp {
    id: number;
    user_username: string;
    text: string;
    created_at: string;
    is_teacher_response: boolean;
}

function QuestionCard({question, setCurrentQuestion, setOpen}: {question: QuestionResponse, setCurrentQuestion: (question: QuestionResponse) => void, setOpen:(open: boolean) => void}) {
    const handleClick = () => {
        setCurrentQuestion(question);
        setOpen(true);
    }
    return (
        <ClickableTile id={question.id.toString()} onClick={handleClick} style={{width:"100%"}}>
            <div className="text-3xl" style={{marginLeft:"5%",marginTop:"15px"}}>{'问题内容：'+question.text}</div>
        </ClickableTile>
    );
}

interface FollowUpTileProps {
    avatar: string;
    message: string;
    isUser: boolean;
}

const FollowUpTile: React.FC<FollowUpTileProps> = ({ avatar, message, isUser }) => {
    return (
        <div className={`${styles.messageTile} ${isUser ? styles.user : styles.other}`}>
            {isUser ? (
                <>
                    <Tile className={styles.messageContent}>{message}</Tile>
                    <UserAvatar className={styles.avatar} name={avatar} renderIcon="" />
                </>
            ) : (
                <>
                    <UserAvatar className={styles.avatar} name={avatar} renderIcon="" />
                    <Tile className={styles.messageContent}>{message}</Tile>
                </>
            )}
        </div>
    );
};

function QuestionModal({ open, setOpen, username, CurrentQuestion, setCurrentQuestion }: { open: boolean, setOpen: (open: boolean) => void, username: string, CurrentQuestion: QuestionResponse, setCurrentQuestion: (question: QuestionResponse) => void }) {
    const [newFollowUp, setNewFollowUp] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (CurrentQuestion) {
            fetchQuestionDetails();
        }
    }, [open]);

    const fetchQuestionDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/forum/questions/${CurrentQuestion.id}/`);
            setCurrentQuestion(response.data);
        } catch (error) {
            console.error("Failed to fetch question details", error);
        } finally {
            setLoading(false);
        }
    };

    const sendFollowUp = async () => {
        if (newFollowUp.trim() === '') return;

        try {
            await axios.post(`/api/forum/questions/${CurrentQuestion.id}/followups/`, { text: newFollowUp });
            setNewFollowUp('');
            fetchQuestionDetails();
        } catch (error) {
            console.error("Failed to send follow-up", error);
        }
    };

    return (
        <Modal open={open} onRequestClose={() => setOpen(false)} modalLabel="问题详情" modalHeading={CurrentQuestion.text} passiveModal size={"lg"}>
            <div style={{ position: 'relative', height: '70vh' }}>
                {loading && <Loading description="加载中..." withOverlay={false} />}
                {!loading && CurrentQuestion.follow_ups.map((followUp) => (
                    <FollowUpTile
                        key={followUp.id}
                        avatar={followUp.user_username}
                        message={followUp.text}
                        isUser={followUp.user_username === username}
                    />
                ))}

                <FluidForm>
                    <TextInput
                        id="new-followup"
                        labelText="新回复"
                        value={newFollowUp}
                        onChange={(e) => setNewFollowUp(e.target.value)}
                    />
                    <Button onClick={sendFollowUp} style={{width:"100%", maxWidth:"100%"}}>发送</Button>
                </FluidForm>
            </div>
        </Modal>
    );
}

export default function ForumPage() {
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [CurrentQuestion, setCurrentQuestion] = useState<QuestionResponse | null>(null);
    const [username, setUsername] = useState('');
    const [open, setOpen] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState('');

    useEffect(() => {
        fetchUsername();
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        const response = await axios.get('/api/forum/questions/');
        setQuestions(response.data);
    }

    const fetchUsername = async () => {
        const response = await axios.get('/api/user/status');
        setUsername(response.data.detail.name);
    }

    const newQuestion = async () => {
        if(!newQuestionText){
            alert('问题内容不能为空');
            return;
        }
        await axios.post('/api/forum/questions/', { text: newQuestionText });
        setNewQuestionText('');
        fetchQuestions();
    }

    return (
        <Content id='main-content'>
            <div>
                <FluidForm style={{display: 'flex'}}>
                    <Button onClick={newQuestion}>新建问题</Button>
                    <TextInput id='new-question' labelText='问题内容' value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} />
                </FluidForm>
                <div className='h-5'/>
                <div style={{marginLeft:'5%', marginRight:'5%'}}>
                    {questions.map((question) => (
                        <div key={question.id}>
                            <QuestionCard question={question} setCurrentQuestion={setCurrentQuestion} setOpen={setOpen} />
                            <div className='h-5'/>
                        </div>
                    ))}
                    {CurrentQuestion && (
                        <QuestionModal CurrentQuestion={CurrentQuestion} setOpen={setOpen} open={open} username={username} setCurrentQuestion={setCurrentQuestion} />
                    )}
                </div>
            </div>
        </Content>
    );
}