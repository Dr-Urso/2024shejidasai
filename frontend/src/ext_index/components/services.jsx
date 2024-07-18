import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>服务介绍</h2>
          <p>
            我们的平台结合讯飞星火大模型，为学生用户提供全面的、智能的学习解决方案，涵盖从成绩分析到作文修改的多项功能，助力学生高效学习。为老师用户提供智能的教学助手工具，涵盖从教学计划方案生成到作文批改等多项功能，帮助老师减轻教学负担。
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <i className={d.icon}></i>
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
