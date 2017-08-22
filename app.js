import express, {Router} from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import uuid from 'node-uuid';

const audioPath = path.join(__dirname, './public/source');
const sourceURL = 'http://localhost:8080';

let app = express();
let server = http.Server(app);
let router = Router();

router.get('/client/video', async (req, res) => {
	const audioCollection = [];
	await fs.readdir(audioPath,function(err, items){
				if(err){
					res.send({status:'err', code:100, info:'获取失败'})
				}else{
					items.forEach((item) => {
						const collection = {
							name:item.split('.')[0],
							url:sourceURL + '/source/' + item,
							id:uuid.v4()
						}
						audioCollection.push(collection);
					});
					res.send({status:'ok', code:200, collection: audioCollection})
				}
			});
});

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
