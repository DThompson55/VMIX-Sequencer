const fs = require('fs')
const http = require("http");
const host = 'localhost';
const port = 8088;
const requestListener = function (req, res) {
    console.log(req.url)
    res.setHeader("Content-Type", "text/xml");
    res.writeHead(200);
    res.end(vMixCfg);
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

var vMixCfg = '';

fs.readFile( "./test/vMixCfg.xml", function(err, result) {
    if (err) {
        throw(err)
    }
    vMixCfg = (result.toString().replace(/&/g,"&amp;")) // the VMix response has some &s in it.
})
