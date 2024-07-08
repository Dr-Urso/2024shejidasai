import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, FluidForm } from "carbon-components-react";
import { MessageResponse } from "@/interfaces/MessageResponse";
import MessageTile from "@/components/MessageCard";
import axios from "axios";

interface message {
  id: number;
  conversation: number;
  sender: number;
  sender_username: string;
  text: string;
  created_at: string;
}

export default function MessageModa({ open, setOpen, username, CurrentConversation }: { open: boolean, setOpen: (open: boolean) => void, username: string, CurrentConversation: MessageResponse }) {
  const [Messages, setMessages] = useState<message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (CurrentConversation) {
      fetchMessages();
    }
  }, [CurrentConversation]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/interactions/conversations/${CurrentConversation.id}/messages/`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
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
      <Modal open={open} onRequestClose={() => setOpen(false)} modalLabel="教师对话" modalHeading={CurrentConversation.topic}>
        <div>
          {Messages.map((message) => (
              <MessageTile
                  key={message.id}
                  avatar={message.sender_username}
                  message={message.text}
                  isUser={message.sender_username === username}
              />
          ))}
        </div>
        <FluidForm>
          <TextInput
              id="new-message"
              labelText="新消息"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>发送</Button>
        </FluidForm>
      </Modal>
  );
}