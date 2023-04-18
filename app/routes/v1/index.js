'use strict';

/********************************
 ********* Import All routes ***********
 ********************************/
let v1Routes = [
    ...require('./userRoutes'),
    ...require('./postRouter')
];

module.exports = v1Routes;
