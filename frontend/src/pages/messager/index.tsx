import React from 'react';
import styles from './index.less';
import MessageTile from "@/components/MessageCard";

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
  return (
      <div>
          {messages.map((msg, index) => (
              <MessageTile key={index} avatar={msg.avatar} message={msg.message} isUser={msg.isUser}/>
          ))}
      </div>
  );
}
