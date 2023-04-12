/** -- This file is uses to check circular dependencies.
 * --- Run command "node this_file_name" to check circular dependencies
 * --- It should return empty aaray
*/

const madge = require('madge');
 
madge(`./server.js`).then((res) => {
    console.log(res.circular());
});