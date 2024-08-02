import React, {useEffect, useState} from 'react';
import {Button, FileUploader, RadioButton} from "@carbon/react";
import {RadioButtonGroup} from "carbon-components-react";

const ImageUploader = ({setText,setLanguage,btn,setBtn}) => {
    const [files, setFiles] = useState([]);

    const [selectedLanguage, setSelectedLanguage] = useState('');
    //让ImageUploader中的lang与audio中的保持一致
    useEffect(() => {
        if(typeof setLanguage === 'function')setLanguage(selectedLanguage);//判断是否传递setLanguage
        if(btn===true){
            setSelectedLanguage('');
            setBtn(false);
        }
    }, [selectedLanguage,btn]);

    // 处理文件选择
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
    };

    const handleRemoveFile = (event) => {
        console.log(event);
        let label = '';
        const nodeName = event.target.nodeName.toLowerCase();
        switch (nodeName) {
            case 'path':
                label = event.target.parentElement.parentElement.ariaLabel;
                break;
            case 'svg':
                label = event.target.parentElement.ariaLabel;
                break;
            case 'button':
                label = event.target.ariaLabel;
        }
        const filename = label.replace('Delete file - ', '');
        const updatedFiles = files.filter((_, index) => files[index].name !== filename);
        setFiles(updatedFiles);
    };

    // 处理上传事件
    const handleUpload = async () => {
        if (files.length === 0) {
            alert('请先添加图片.');
            return;
        }
        if(selectedLanguage === ''){
            alert('请先选择语言.');
            return ;
        }
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file); // 'files[]' is the key used on the server side
        });
        formData.append('lang',selectedLanguage);

        setSelectedLanguage('');//上传后清空选择的语言
        try {
            // 发送POST请求到后台
            const response = await fetch('/api/imgUpload/upload', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                setText((prevState)=>prevState+data.result);
            } else {
                console.error('图片上传失败');
                // 处理上传失败后的逻辑
            }
        } catch (error) {
            console.error('网络错误:', error);
            // 处理网络错误
        }
    };

    return (
        <div className="cds--file__container">
            <FileUploader labelTitle="图片上传"
                          buttonLabel="添加图片"
                          buttonKind="primary" size="sm" filenameStatus="edit" accept={['.jpg', '.png', '.jpeg', '.bmp']}
                          multiple={true}
                          disabled={false} iconDescription="Delete file" name=""
                          onChange={handleFileChange} onDelete={handleRemoveFile}/>

            <RadioButtonGroup
                legendText="选择语言"
                name="language-group"
                onChange={setSelectedLanguage}
                valueSelected={selectedLanguage}
                style={{ marginTop: '16px'}}
            >
                <RadioButton labelText="英语" value="en" id="radio-button-1" />
                <RadioButton labelText="汉语" value="cn" id="radio-button-2" />
            </RadioButtonGroup>
            <Button onClick={handleUpload} kind="primary" size="sm" style={{ marginTop: '16px'}}>图片识别</Button>
        </div>
    );
};

export default ImageUploader;
