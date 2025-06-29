import json

score = {
    "评分标准": {
        "语文": 150,
        "数学": 150,
        "英语": 150,
        "物理": 150,
        "化学": 150,
        "生物": 150
    }
}
subject = {
    "科目名称": ["语文", "数学", "英语", "物理", "化学", "生物"]
}
data = {
    "考试信息": [
        {
            "考试名称": "高一下二月月考",
            "考试类型": "月考",
            "成绩详情": {
                "语文": 90,
                "数学": 99,
                "英语": 100,
                "物理": 90,
                "化学": 89,
                "生物": 93
            },
            "自我评价": "这次考试不难，考试时有些小问题没注意到，希望下次考试可以进步。"
        },
        {
            "考试名称": "高一下四月期中",
            "考试类型": "期中",
            "成绩详情": {
                "语文": 100,
                "数学": 110,
                "英语": 120,
                "物理": 85,
                "化学": 91,
                "生物": 90
            },
            "自我评价": "这次考试相较于上次考试有进步。"
        },
        {
            "考试名称": "高一下五月月考",
            "考试类型": "月考",
            "成绩详情": {
                "语文": 105,
                "数学": 125,
                "英语": 130,
                "物理": 95,
                "化学": 87,
                "生物": 92
            },
            "自我评价": "这次月考成绩相对于期中考试，语文数学英语很稳定，物理有进步，化学和生物也比较稳定"
        },
        {
            "考试名称": "高一下六月期末",
            "考试类型": "期末",
            "成绩详情": {
                "语文": 110,
                "数学": 130,
                "英语": 125,
                "物理": 90,
                "化学": 89,
                "生物": 88
            },
            "自我评价": "这次考试相语文和数学取得进步较大，满意，继续努力。"
        }
    ]
}

data2 = {
    "考试信息": [{
        "考试名称": "高一一月月考",
        "考试类型": "月考",
        "考试成绩": {
            "语文": 98,
            "数学": 120,
            "英语": 90,
            "物理": 88,
            "化学": 98,
            "生物": 90,
        },
        "自我评价": "这次考试不难，考试时间也很充裕，但成绩不理想，希望下次能有所改进。"

    }, {
        "考试名称": "高一二月月考",
        "考试类型": "月考",
        "考试成绩": {
            "语文": 94,
            "数学": 145,
            "英语": 98,
            "物理": 79,
            "化学": 98,
            "生物": 95,
        },
        "自我评价": "这次发挥的不错，但是物理没考好"

    }, {
        "考试名称": "高一三月月考",
        "考试类型": "月考",
        "考试成绩": {
            "语文": 96,
            "数学": 126,
            "英语": 100,
            "物理": 90,
            "化学": 95,
            "生物": 89,
        },
        "自我评价": "这次正常发挥了。"

    }, {
        "考试名称": "高一四月月考",
        "考试类型": "月考",
        "考试成绩": {
            "语文": 105,
            "数学": 130,
            "英语": 99,
            "物理": 73,
            "化学": 97,
            "生物": 95,
        },
        "自我评价": "这次物理很难，语文有进步。"

    }, {
        "考试名称": "高一五月月考",
        "考试类型": "月考",
        "考试成绩": {
            "语文": 98,
            "数学": 128,
            "英语": 95,
            "物理": 72,
            "化学": 98,
            "生物": 96,
        },
        "自我评价": "这次考的不理想，我会继续努力。"
    }]
}

score_json = json.dumps(score)
subject_json = json.dumps(subject)
data_json = json.dumps(data)
