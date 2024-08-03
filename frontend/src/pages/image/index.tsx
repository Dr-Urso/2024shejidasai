import React, {useEffect, useRef, useState} from 'react';
import styles from './index.less';
import {Button, Content, Loading} from "carbon-components-react";
import {TextInput} from "@carbon/react";
import { Image } from 'antd';

export default function Page() {
    const [showImg, setShowImg] = useState(false);
    const [text,setText]=useState('');
    const [imageUrl, setImageUrl] = useState("");
    const [click,setClick]=useState(false);
    const [init,setInit]=useState(true);
    const downloadLink = useRef(null);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        if (downloadLink.current) {
            downloadLink.current.click();
        }
    };

    const handleSubmit = async () => {
        if(text.length===0){
            alert('请先输入图片描述.');
            return ;
        }
        const formData = new FormData();
        formData.append('text',text);

        setShowImg(false);
        setClick(true);
        setInit(false);

        try {
            // 发送POST请求到后台
            const response = await fetch('/api/imageWord/Gen', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const timestamp = new Date().getTime(); // 获取当前时间戳
                const updatedImageUrl = `/image/img.jpg?t=${timestamp}`; // 添加时间戳作为查询参数
                setImageUrl(updatedImageUrl); // 更新图片文件URL
                setShowImg(true);
                setClick(false);
                console.log('图片生成成功')
            } else {
                console.error('图片生成失败');
                // 处理上传失败后的逻辑
            }
        } catch (error) {
            console.error('网络错误:', error);
            // 处理网络错误
        }
    };
    return (
        <>
            <Content className={styles.Container} id='main-content'>
                <div className={styles.inputGroup}>
                    <TextInput id="text-input-1" type="text" labelText="" size="md" placeholder="输入图片的描述"
                               maxLength={200} onChange={handleTextChange}/>
                    <Button onClick={handleSubmit} kind="primary" size="md">趣图生成</Button>
                    <Button onClick={handleDownload} kind="primary" size="md"
                            style={{marginLeft: '16px'}}>下载图片</Button>
                    <a ref={downloadLink} href={imageUrl} download="generated-image.jpg"
                       style={{display: 'none'}}>下载</a>
                </div>
                <div className={styles.centerContent}>
                    {init && <h2>图片将会在此处显示</h2>}
                    {click && <Loading className={'some-class'} withOverlay={false}/>}
                    {click && <h2>生成中</h2>}
                    {showImg && <Image width={512} src={imageUrl} className={styles.image}/>}
                </div>
            </Content>
        </>
    );
}
