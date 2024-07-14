# coding: utf-8
import _thread as thread
import os
import time
import base64

import base64
import datetime
import hashlib
import hmac
import json
from urllib.parse import urlparse
import ssl
from datetime import datetime
from time import mktime
from urllib.parse import urlencode
from wsgiref.handlers import format_date_time

import websocket
# import openpyxl
from concurrent.futures import ThreadPoolExecutor, as_completed
import os


class Ws_Param(object):
    # 初始化
    def __init__(self, APPID, APIKey, APISecret, gpt_url):
        self.APPID = APPID
        self.APIKey = APIKey
        self.APISecret = APISecret
        self.host = urlparse(gpt_url).netloc
        self.path = urlparse(gpt_url).path
        self.gpt_url = gpt_url

    # 生成url
    def create_url(self):
        # 生成RFC1123格式的时间戳
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))

        # 拼接字符串
        signature_origin = "host: " + self.host + "\n"
        signature_origin += "date: " + date + "\n"
        signature_origin += "GET " + self.path + " HTTP/1.1"

        # 进行hmac-sha256进行加密
        signature_sha = hmac.new(self.APISecret.encode('utf-8'), signature_origin.encode('utf-8'),
                                 digestmod=hashlib.sha256).digest()

        signature_sha_base64 = base64.b64encode(signature_sha).decode(encoding='utf-8')

        authorization_origin = f'api_key="{self.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'

        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')

        # 将请求的鉴权参数组合为字典
        v = {
            "authorization": authorization,
            "date": date,
            "host": self.host
        }
        # 拼接鉴权参数，生成url
        url = self.gpt_url + '?' + urlencode(v)
        # 此处打印出建立连接时候的url,参考本demo的时候可取消上方打印的注释，比对相同参数时生成的url与自己代码生成的url是否一致
        return url


# 收到websocket错误的处理
def on_error(ws, error):
    print("### error:", error)


# 收到websocket关闭的处理
def on_close(ws):
    print("### closed ###")


# 收到websocket连接建立的处理
def on_open(ws):
    thread.start_new_thread(run, (ws,))


def run(ws, *args):
    data = json.dumps(gen_params(appid=ws.appid, query=ws.query, domain=ws.domain))
    ws.send(data)

res=[]
# 收到websocket消息的处理
def on_message(ws, message):
    global res
    # print(message)
    data = json.loads(message)
    code = data['header']['code']
    if code != 0:
        print(f'请求错误: {code}, {data}')
        ws.close()
    else:
        choices = data["payload"]["choices"]
        status = choices["status"]
        content = choices["text"][0]["content"]
        res.append(content)
        # print(content,end='')
        if status == 2:
            print("#### 关闭会话")
            ws.close()


def gen_params(appid, query, domain):
    """
    通过appid和用户的提问来生成请参数
    """

    data = {
        "header": {
            "app_id": appid,
            "uid": "1234",           
            # "patch_id": []    #接入微调模型，对应服务发布后的resourceid          
        },
        "parameter": {
            "chat": {
                "domain": domain,
                "temperature": 0.5,
                "max_tokens": 8192,
                "auditing": "default",
            }
        },
        "payload": {
            "message": {
                "text": [
                    {"role": "system", "content": "你是一个很了解学生的老师，你现在的任务是总结学生的考试成绩情况。任务要求：1、总结每门学科考试情况，并给出详细的学习规划建议。2、以老师的口吻总结，如果成绩太差或有退步，可以给予鼓励。3、总结要以段落的形式呈现，避免显示出现分数，即将分数换一种表达方式。4、回答要亲切、地道，避免过于机械化。给出的建议要符合高中生，避免脱离实际。5、将“学生”替换为“你”，回答直接给出总结和建议。"},
                    {"role":"user","content":query}
                ]
            }
        }
    }
    return data


def main(query):
    appid = "b9470671",
    api_secret = "ZDkxNWFmZDk0NjQ2NWFmNWE5N2U3MGNj"
    api_key = "24b3ad387ed1dcb315e08db5b68ac72b"
    gpt_url = "wss://spark-api.xf-yun.com/v3.5/chat"
    domain = "generalv3.5"

    wsParam = Ws_Param(appid, api_key, api_secret, gpt_url)
    websocket.enableTrace(False)
    wsUrl = wsParam.create_url()

    ws = websocket.WebSocketApp(wsUrl, on_message=on_message, on_error=on_error, on_close=on_close, on_open=on_open)
    ws.appid = appid
    ws.query = query
    ws.domain = domain
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})


if __name__ == "__main__":
    main(
        appid="b9470671",
        api_secret="ZDkxNWFmZDk0NjQ2NWFmNWE5N2U3MGNj",
        api_key="24b3ad387ed1dcb315e08db5b68ac72b",
        #appid、api_secret、api_key三个服务认证信息请前往开放平台控制台查看（https://console.xfyun.cn/services/bm35）
        # gpt_url="wss://spark-api.xf-yun.com/v4.0/chat",      # Ultra环境的地址
        gpt_url="wss://spark-api.xf-yun.com/v3.5/chat", # Max环境的地址
        # Spark_url = "ws://spark-api.xf-yun.com/v3.1/chat"  # Pro环境的地址
        # Spark_url = "ws://spark-api.xf-yun.com/v1.1/chat"  # Lite环境的地址
        # domain="4.0Ultra",
        domain="generalv3.5",     # Max版本
        # domain = "generalv3"    # Pro版本
        # domain = "general"      # Lite版本址
        query="给我写一篇100字的作文"
    )
    print(res)
    ans="".join(res)
    print(ans)
