import _ from "lodash";

import "./style.css";

import Icon from "./image.jpeg";

import json_data from "./json.json";

import xml_data from "./xml.xml";

import csv_data from "./csv.csv";

function component() {

    const element = document.createElement("div");
    element.innerHTML = _.join(["Hello", "webpack"], " ");
    element.classList.add("hello");

    const my_icon = new Image();
    my_icon.src = Icon;

    element.appendChild(my_icon);

    console.log(json_data);
    console.log(xml_data);
    console.log(csv_data);

    return element;

}

document.body.appendChild(component());