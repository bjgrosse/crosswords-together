
window.alert("test")
const supportedBrowsers = require('./supportedBrowsers.js');
console.log(navigator.userAgent)
if (!supportedBrowsers.test(navigator.userAgent)) {
    // let node = document.createElement("div")
    // node.innerHTML="browser not supported"
    // document.getElementById('root').appendChild(node)
}
