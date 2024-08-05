import { Image } from "./image";
import React from "react";
import {Carousel} from "antd";

export const Gallery = (props) => {
  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>功能展示</h2>
          <p>

          </p>
        </div>
        <div className="row">
          <div className="portfolio-items" >
                 {props.data ? (
                    <Carousel autoplay className="custom-carousel">
                      {props.data.map((d, i) => (
                          <div key={`${d.title}-${i}`}>
                            <Image
                                title={d.title}
                                largeImage={d.largeImage}
                                smallImage={d.smallImage}
                            />
                          </div>
                      ))}
                    </Carousel>
                 ) : ("Loading...")}
          </div>
        </div>
      </div>
    </div>
  );
};
