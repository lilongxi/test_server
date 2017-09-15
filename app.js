import express, {Router} from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';

let app = express();
let server = http.Server(app);
let router = Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//controller
import {clientVideo} from './public/controller/client_vido';
import {download} from './public/controller/client_download';

//获取歌曲列表
router.get('/client/video', clientVideo);


//获取下载音乐列表
router.post('/client/download',download);

app.all('*', function(req, res, next) {
	//设置多个域名跨域
	if(req.headers.origin === 'http://localhost:3003'){
		res.header("Access-Control-Allow-Origin", req.headers.origin );
	    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	    res.header("X-Powered-By",' 3.2.1');
	    res.header("Content-Type", "application/json;charset=utf-8");
	}
    next();
});
app.use(express.static('public'));
app.use('/', router);

server.listen(8080, () => {
	console.log('server listening on port 8080');
})
