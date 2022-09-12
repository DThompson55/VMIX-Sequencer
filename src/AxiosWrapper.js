const axios = require('axios').default;

var host = "http://localhost:8088"; // could parameterize this TTD

async function vMixSend(endpoint,params) {
      if (process.env["VMIX_TRACE"]) console.log(params)
      const response = axios.get(host+endpoint, {params})
      return response;
} 

exports.vMixSend = vMixSend
