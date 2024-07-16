# coding: utf-8
import _thread as thread
import os
import time
import base64
import datetime
import hashlib
import hmac
import json
from urllib.parse import urlparse, urlencode
import ssl
from wsgiref.handlers import format_date_time

import websocket


class Ws_Param(object):
    def __init__(self, APPID, APIKey, APISecret, gpt_url):
        self.APPID = APPID
        self.APIKey = APIKey
        self.APISecret = APISecret
        self.host = urlparse(gpt_url).netloc
        self.path = urlparse(gpt_url).path
        self.gpt_url = gpt_url

    def create_url(self):
        now = datetime.datetime.now()
        date = format_date_time(time.mktime(now.timetuple()))
        signature_origin = f"host: {self.host}\ndate: {date}\nGET {self.path} HTTP/1.1"
        signature_sha = hmac.new(self.APISecret.encode('utf-8'), signature_origin.encode('utf-8'),
                                 hashlib.sha256).digest()
        signature_sha_base64 = base64.b64encode(signature_sha).decode('utf-8')

        authorization_origin = f'api_key="{self.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode('utf-8')

        v = {"authorization": authorization, "date": date, "host": self.host}
        url = f"{self.gpt_url}?{urlencode(v)}"
        return url


def on_error(ws, error):
    print("### error:", error)


def on_close(ws, *args):
    print("### closed ###", args)


def on_open(ws):
    thread.start_new_thread(run, (ws,))


def run(ws, *args):
    data = json.dumps(gen_params(appid=ws.appid, query=ws.query, domain=ws.domain))
    ws.send(data)


res = []


def on_message(ws, message):
    global res
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
        if status == 2:
            print("#### 关闭会话")
            ws.close()


def gen_params(appid, query, domain, role):
    content = ""
    if role == 'exam':
        content = "你是一个很了解学生的老师，你现在的任务是总结学生的考试成绩情况。""任务要求：1、避免出现总结的内容与考试信息不符。2、总结每门学科考试情况，并给出详细的学习规划建议。3、以老师的口吻总结，如果成绩太差或有退步，可以给予鼓励。4、总结要以段落的形式呈现，避免显示出现分数，即将分数换一种表达方式。5、回答要亲切、地道，避免过于机械化。给出的建议要符合高中生，避免脱离实际。6、将“学生”替换为“你”，回答直接给出总结和建议。"
    elif role == 'to_do_list':
        content = "你是一个擅长总结每天任务情况的管理大师，你现在的任务是总结学生每天的任务情况。""任务要求：1、避免出现总结内容与任务内容不符。2、如果学生有很多任务未完成，提醒学生加快速度。3、如果学生任务完成的很好进行表扬。4、回答要亲切地道，避免过于机械化。"
    elif role == 'diary':
        content = "你是一个擅长总结别人日记的文学大师，你现在的任务是总结学生的日记。任务要求：1、避免出现总结内容与日记内容不符，不确定的内容加上可能。2、回答要亲切地道，避免过于机械化。3、如果发现学生的心情低落，给予鼓励进行开导和陪伴。4、避免复述日记的内容。"

    data = {
        "header": {
            "app_id": appid,
            "uid": "1234"
        },
        "parameter": {
            "chat": {
                "domain": domain,
                "temperature": 0.1,
                "max_tokens": 8192,
                "auditing": "default"
            }
        },
        "payload": {
            "message": {
                "text": [
                    {"role": "system", "content": content},
                    {"role": "user", "content": query}
                ]
            }
        }
    }
    return data


def sparkApi(query, role):
    res.clear()
    appid = "b9470671"
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
    ws.role = role
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
