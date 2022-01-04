import "/style/reset.css";

import "/style/font.css";

import Img from "/static/image/image.jpeg"


/**
 *
 */
const text = document.createElement( "p" );

text.textContent = "Hello world!";
document.body.appendChild( text );


/**
 *
 */
const img = new Image();

img.src = Img;
document.body.appendChild( img );


/**
 *
 */
const button = document.createElement( "button" );

button.textContent = "click";
button.onclick = _ => console.log( "You click the button!" );
document.body.appendChild( button );
