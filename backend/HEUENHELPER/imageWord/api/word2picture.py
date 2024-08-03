# encoding: UTF-8
import os
import time

import requests
from datetime import datetime
from wsgiref.handlers import format_date_time
from time import mktime
import hashlib
import base64
import hmac
from urllib.parse import urlencode
import json
from PIL import Image
from io import BytesIO

class AssembleHeaderException(Exception):
    def __init__(self, msg):
        self.message = msg


class Url:
    def __init__(this, host, path, schema):
        this.host = host
        this.path = path
        this.schema = schema
        pass


# calculate sha256 and encode to base64
def sha256base64(data):
    sha256 = hashlib.sha256()
    sha256.update(data)
    digest = base64.b64encode(sha256.digest()).decode(encoding='utf-8')
    return digest


def parse_url(requset_url):
    stidx = requset_url.index("://")
    host = requset_url[stidx + 3:]
    schema = requset_url[:stidx + 3]
    edidx = host.index("/")
    if edidx <= 0:
        raise AssembleHeaderException("invalid request url:" + requset_url)
    path = host[edidx:]
    host = host[:edidx]
    u = Url(host, path, schema)
    return u


# 生成鉴权url
def assemble_ws_auth_url(requset_url, method="GET", api_key="", api_secret=""):
    u = parse_url(requset_url)
    host = u.host
    path = u.path
    now = datetime.now()
    date = format_date_time(mktime(now.timetuple()))
    # print(date)
    # date = "Thu, 12 Dec 2019 01:57:27 GMT"
    signature_origin = "host: {}\ndate: {}\n{} {} HTTP/1.1".format(host, date, method, path)
    # print(signature_origin)
    signature_sha = hmac.new(api_secret.encode('utf-8'), signature_origin.encode('utf-8'),
                             digestmod=hashlib.sha256).digest()
    signature_sha = base64.b64encode(signature_sha).decode(encoding='utf-8')
    authorization_origin = "api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"" % (
        api_key, "hmac-sha256", "host date request-line", signature_sha)
    authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')
    # print(authorization_origin)
    values = {
        "host": host,
        "date": date,
        "authorization": authorization
    }

    return requset_url + "?" + urlencode(values)

# 生成请求body体
def getBody(appid,text):
    body= {
        "header": {
            "app_id": appid,
            "uid":"123456789"
        },
        "parameter": {
            "chat": {
                "domain": "general",
                "temperature":0.5,
                "max_tokens":4096,
                "width": 1024,
                "height": 1024
            }
        },
        "payload": {
            "message":{
                "text":[
                    {
                        "role":"user",
                        "content":text
                    }
                ]
            }
        }
    }
    return body

# 发起请求并返回结果
def imgaeWord(text='''生成一张图：远处有着高山，山上覆盖着冰雪，近处有着一片湛蓝的湖泊'''):
    #运行前请配置以下鉴权三要素，获取途径：https://console.xfyun.cn/services/tti
    APPID ='b9470671'
    APISecret = 'ZDkxNWFmZDk0NjQ2NWFmNWE5N2U3MGNj'
    APIKEY = '24b3ad387ed1dcb315e08db5b68ac72b'
    host = 'http://spark-api.cn-huabei-1.xf-yun.com/v2.1/tti'
    url = assemble_ws_auth_url(host,method='POST',api_key=APIKEY,api_secret=APISecret)
    content = getBody(APPID,text)
    print(time.time())
    response = requests.post(url,json=content,headers={'content-type': "application/json"}).text
    print(time.time())
    parser_Message(response)

#将base64 的图片数据存在本地
def base64_to_image(base64_data, filename):
    # 解码base64数据
    img_data = base64.b64decode(base64_data)

    # 将解码后的数据转换为图片
    img = Image.open(BytesIO(img_data))

    # 保存图片到本地
    # img.save(save_path)

    filepath = os.path.join('../../frontend/public/image', filename)
    img.save(filepath)


# 解析并保存到指定位置
def parser_Message(message):
    data = json.loads(message)
    # print("data" + str(message))
    code = data['header']['code']
    if code != 0:
        print(f'请求错误: {code}, {data}')
    else:
        text = data["payload"]["choices"]["text"]
        imageContent = text[0]
        # if('image' == imageContent["content_type"]):
        imageBase = imageContent["content"]
        imageName = data['header']['sid']
        # savePath = f"D://{imageName}.jpg"
        # filename=f"{imageName}.jpg"
        filename='img.jpg'
        base64_to_image(imageBase,filename)
        # print("图片保存路径：" + savePath)



