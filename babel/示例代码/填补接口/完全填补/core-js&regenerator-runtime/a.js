// core-js和regeneratpr-runtime的引入没有先后顺序要求
import "core-js/stable";

import "regenerator-runtime/runtime";

Promise.resolve( 1 ).then( v => console.log( v ) );
