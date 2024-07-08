import React from 'react'
import {ClickableTile, Tile} from "@carbon/react";
import {MessageResponse} from "@/interfaces/MessageResponse";



export default function ConversationCard({one, setCurrentConversation, setOpen}: {one: MessageResponse, setCurrentConversation: (one: MessageResponse) => void, setOpen:(open: boolean) => void}){
    const handleClick = () => {
        setCurrentConversation(one);
        setOpen(true);
    }
  return (<ClickableTile id={one.id.toString()} onClick={handleClick} style={{width:"100%"}}>
    <div className="text-3xl" style={{marginLeft:"5%",marginTop:"15px"}}>{'对话主题：'+one.topic}</div>
  </ClickableTile>)
}
