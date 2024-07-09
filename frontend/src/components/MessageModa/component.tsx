import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, FluidForm, Loading } from "carbon-components-react";
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