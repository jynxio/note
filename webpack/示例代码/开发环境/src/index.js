import _ from "lodash";

import printMe from "./print.js";

function component() {

    const element = document.createElement("div");
    element.innerHTML = _.join(["Hello", "webpack"], " ");

    const button = document.createElement("button");
    button.innerHTML = "Click me and check the console!";
    button.onclick = printMe;

    element.appendChild(button);

    return element;

}

document.body.appendChild(component());