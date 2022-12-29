    const http = require('http');
    const url = require('url');
    const path = require('path');
    const fs = require('fs');
    const mime = require('mime');
    
    const server = http.createServer((req, res) => {
      // 获取文件名
      const { pathname } = url.parse(req.url, true);
      // 获取文件路径
      const filepath = path.join(__dirname, pathname);
    
      /**
       * 判断文件是否存在
       */
      fs.stat(filepath, (err, stat) => {
        if (err) {
          res.end('not found');
        } else {
          // 获取if-modified-since这个请求头
          const ifModifiedSince = req.headers['if-modified-since'];
          // 获取资源最后修改时间
          let lastModified = stat.ctime.toGMTString();
          // 验证资源是否被修改过，如果相同则返回304让浏览器读取缓存
          if (ifModifiedSince === lastModified) {
            res.writeHead(304);
            res.end();
          }
          // 缓存没有通过则返回资源，并加上 last-modified响应头，下次浏览器就会在请求头中带着 if-modified-since
          else {
            // res.setHeader('Content-Type', mime.getType(filepath));
            res.setHeader('Last-Modified', stat.ctime.toGMTString());
            fs.createReadStream(filepath).pipe(res);
          }
        }
      });
    });
    
    server.listen(8001, () => {
      console.log('listen to 8000 port');
    });
    