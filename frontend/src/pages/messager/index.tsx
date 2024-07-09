import React, {useEffect, useState} from 'react';
import styles from './index.less';
import axios from "axios";
import {Button, ClickableTile, FluidForm, TextInput, Tile} from "@carbon/react";
import {MessageResponse} from "@/interfaces/MessageResponse";
import {Content, Loading, Modal} from "carbon-components-react";
import {UserAvatar} from "@carbon/ibm-products";

interface Message {
    avatar: string;
    message: string;
    isUser: boolean;
}


const messages: Message[] = [
    { avatar: 'path/to/avatar1.jpg', message: 'Hello!', isUser: false },
    { avatar: 'path/to/avatar2.jpg', message: 'Hi there!', isUser: true },
    { avatar: 'path/to/avatar1.jpg', message: 'How are you?', isUser: false },
    { avatar: 'path/to/avatar2.jpg', message: 'I am good, thanks!', isUser: true },
];

function ConversationCard({one, setCurrentConversation, setOpen}: {one: MessageResponse, setCurrentConversation: (one: MessageResponse) => void, setOpen:(open: boolean) => void}){
    const handleClick = () => {
        setCurrentConversation(one);
        setOpen(true);
    }
    return (<ClickableTile id={one.id.toString()} onClick={handleClick} style={{width:"100%"}}>
        <div className="text-3xl" style={{marginLeft:"5%",marginTop:"15px"}}>{'对话主题：'+one.topic}</div>
    </ClickableTile>)
}

interface MessageTileProps {
    avatar: string;
    message: string;
    isUser: boolean;
}

const MessageTile: React.FC<MessageTileProps> = ({ avatar, message, isUser }) => {
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

interface message {
    id: number;
    conversation: number;
    sender: number;
    sender_username: string;
    text: string;
    created_at: string;
}

function MessageModa({ open, setOpen, username, CurrentConversation }: { open: boolean, setOpen: (open: boolean) => void, username: string, CurrentConversation: MessageResponse }) {
    const [Messages, setMessages] = useState<message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (CurrentConversation) {
            const interval = setInterval(() => {
                fetchMessageLoop();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [CurrentConversation]);

    useEffect(() => {
        fetchMessages();
    }, [open]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/interactions/conversations/${CurrentConversation.id}/messages/`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessageLoop = async () => {
        try {
            const response = await axios.get(`/api/interactions/conversations/${CurrentConversation.id}/messages/`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };


    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            await axios.post(`/api/interactions/conversations/${CurrentConversation.id}/messages/`, { text: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <Modal open={open} onRequestClose={() => setOpen(false)} modalLabel="教师对话" modalHeading={CurrentConversation.topic} passiveModal size={"lg"}>
            <div style={{ position: 'relative', height: '70vh' }}>
                {loading && <Loading description="加载中..." withOverlay={false} />}
                {!loading && Messages.map((message) => (
                    <MessageTile
                        key={message.id}
                        avatar={message.sender_username}
                        message={message.text}
                        isUser={message.sender_username === username}
                    />
                ))}

                <FluidForm>
                    <TextInput
                        id="new-message"
                        labelText="新消息"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button onClick={sendMessage} style={{width:"100%", maxWidth:"100%"}}>发送</Button>
                </FluidForm>
            </div>
        </Modal>
    );
}



export default function Page() {
    const [ErrorMessage, setErrorMessage] = useState('');
    const [MessageResponse, setMessageResponse] = useState<MessageResponse[]>();
    const [CurrentConversation, setCurrentConversation] = useState<MessageResponse>();
    const [username, setUsername] = useState('');
    const [open, setOpen] = useState(false);
    const [NewConversationTopic, setNewConversationTopic] = useState('');
    useEffect(() => {
        fetchUsername();
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const response = await axios.get('/api/interactions/conversations/');
        setMessageResponse(response.data);

    }

    const fetchUsername = async () => {
        const response = await axios.get('/api/user/status');
        setUsername(response.data.detail.name);

    }

    const newConversation = async () => {
        const response = await axios.post('/api/interactions/conversations/', {topic: NewConversationTopic});
        fetchMessages();
    }


  return (
      <Content id='main-content' >
          <div>


              <FluidForm style={{display: 'flex'}}>
                  <Button onClick={newConversation}>新建对话</Button>
                  <TextInput id='new' labelText='对话主题' onChange={(e) => {
                      setNewConversationTopic(e.target.value)
                  }}/>
              </FluidForm>
              <div className='h-5'/>
              <div style={{marginLeft:'5%', marginRight:'5%'}}>
              {MessageResponse?.map((one) => {
                  return (<><ConversationCard one={one} setCurrentConversation={setCurrentConversation}
                                              setOpen={setOpen}/>
                      <div className='h-5'/>
                  </>)
              })}
              {CurrentConversation &&
                  <MessageModa CurrentConversation={CurrentConversation as MessageResponse} setOpen={setOpen}
                               open={open} username={username}/>}
              </div>
          </div>
      </Content>
  );
}
