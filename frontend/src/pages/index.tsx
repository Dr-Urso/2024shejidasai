import indp1jpg from '../assets/index_p1.png'
import {useEffect, useState} from "react";
import {Link, Button} from "@carbon/react";
import Homepage from "@/ext_index/App";
import {Content} from "carbon-components-react";



export default function HomePage() {

  return (<Content id='main-content' >
      <Homepage/>
      </Content>
  );
}
