import "/style/reset.css";

import "/style/font.css";


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

img.src = "/static/image/image.jpeg";
document.body.appendChild( img );


/**
 *
 */
const button = document.createElement( "button" );

button.textContent = "click";
button.onclick = _ => console.log( "You click the button!" );
document.body.appendChild( button );
