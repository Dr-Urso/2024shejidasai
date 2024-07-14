from sparkAPI import Ws_Param,main,res
from test_json import score_json,subject_json,data_json

query="评分标准："+score_json+"\n考试科目名称："+subject_json+"\n学生要分析的考试信息："+data_json
main(
    appid="b9470671",
    api_secret="ZDkxNWFmZDk0NjQ2NWFmNWE5N2U3MGNj",
    api_key="24b3ad387ed1dcb315e08db5b68ac72b",
    # appid、api_secret、api_key三个服务认证信息请前往开放平台控制台查看（https://console.xfyun.cn/service，s/bm35）
    # gpt_url="wss://spark-api.xf-yun.com/v4.0/chat",      # Ultra环境的地址
    gpt_url="wss://spark-api.xf-yun.com/v3.5/chat",  # Max环境的地址
    # gpt_url = "ws://spark-api.xf-yun.com/v3.1/chat" , # Pro环境的地址
    # Spark_url = "ws://spark-api.xf-yun.com/v1.1/chat"  # Lite环境的地址
    # domain="4.0Ultra",
    domain="generalv3.5",  # Max版本
    # domain = "generalv3" ,   # Pro版本
    # domain = "general"      # Lite版本址
    query=query
)

ans = "".join(res)

