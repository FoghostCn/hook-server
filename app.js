'use strict';

const http = require('http');
const spawn = require('child_process').spawnSync;
const url = require('url');
const basePath = process.env.HOOK_BASE_PATH || '/path/to/shell/directory/';
const gitIp = ''; // if you have a private git server(gitlab or others), only this server can trigger hook

function parseData(req) {
  return new Promise(res => {
    const data = [];
    req.on('data', chunk => {
      data.push(chunk);
    });
    req.on('end', () => {
      res(JSON.parse(Buffer.concat(data).toString()));
    })
  })
}

function checkIp(req) {
  const remoteaddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const remoteIp = remoteaddr.substr(remoteaddr.lastIndexOf(':') + 1);
  return gitIp === remoteIp;
}

function execShellFile(filename) {
  console.log(`exec file ${filename}.sh`);
  spawn('sh', [filename + '.sh'], {cwd: basePath, stdio: [null,1,1], timeout: 120000});
}

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  console.log(`pathname=${pathname}`);
  const pathArray = pathname.split('/');
  if (pathArray.length === 2 && checkIp(req)) {
    res.end();
    execShellFile(pathArray[1]);
  } else if(pathArray.length === 3) {
    const branch = pathArray[1], filename = pathArray[2];
    parseData(req).then(body => {
      if(~body.ref.indexOf(branch) && checkIp(req)) {
        res.end();
        execShellFile(filename);
      } else {
        res.end();
      }
    })
  } else {
    console.log('exec nothing');
    res.end();
  }
});

const port = 9748;
server.listen(port, () => {
  console.log('hook server start port: ' + port);
});
server.on('error', e => console.error(e.stack));
process.on('uncaughtException', e => {
  console.error(e.stack);
  process.exit(1);
});
