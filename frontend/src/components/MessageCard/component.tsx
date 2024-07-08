import React from 'react'
import styles from './styles.less'
import {Tile} from "@carbon/react";
import {UserAvatar} from "@carbon/ibm-products";
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

export default MessageTile;