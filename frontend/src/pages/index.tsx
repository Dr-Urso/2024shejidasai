import indp1jpg from '../assets/index_p1.png'
import React, {useEffect, useState} from "react";
import {Link, Button} from "@carbon/react";
import Homepage from "@/ext_index/App";
import {Content, Header, HeaderName} from "carbon-components-react";
import {Chat, Tools} from "@carbon/icons-react";
import {useNavigate} from "react-router-dom";



export default function HomePage() {
    const navigate = useNavigate();
  return (
      <div>

      <Homepage/>
      </div>
  );
}
