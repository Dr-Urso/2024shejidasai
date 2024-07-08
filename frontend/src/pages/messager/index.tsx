import React, {useEffect, useState} from 'react';
import styles from './index.less';
import MessageTile from "@/components/MessageCard";
import axios from "axios";
import {Button, FluidForm, TextInput, Tile} from "@carbon/react";
import {MessageResponse} from "@/interfaces/MessageResponse";
import ConversationCard from "@/components/ConversationCard";
import MessageModa from "@/components/MessageModa";

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
      <div>

          <FluidForm style={{display:'flex'}}>
              <Button onClick={newConversation}>新建对话</Button>
          <TextInput id='new' labelText='对话主题' onChange={(e)=>{setNewConversationTopic(e.target.value)}}/>
          </FluidForm>
              {MessageResponse?.map((one) => {
              return (<ConversationCard one={one} setCurrentConversation={setCurrentConversation} setOpen={setOpen} />)
          })}
          {CurrentConversation&&<MessageModa CurrentConversation={CurrentConversation as MessageResponse} setOpen={setOpen} open={open} username={username}/>}
      </div>
  );
}
