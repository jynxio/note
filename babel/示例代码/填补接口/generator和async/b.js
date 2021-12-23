import "core-js/stable";

import "regenerator-runtime/runtime";

async function f() { return 1 }

f().then( v => console.log( v ) );
