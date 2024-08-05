import React from "react";

export const Image = ({ title, largeImage, smallImage }) => {
  return (
    <div>
        <a href={largeImage} title={title}>
            <img src={smallImage}  alt={title}/>
        </a>
    </div>
  );
};
