import express, {Router} from 'express';
import http from 'http';
import path from 'path';

let app = express();
let server = http.Server(app);
let router = Router();

app.use('/static', express.static('view'));

app.use(async function(req, res, next) {
	console.log('async middle ware!');
	await 1;
	return next();
})


router.get('/', (req, res) => {
	res.send('hello')
})

app.use('/', router);

server.listen(8080, () => {
	console.log('server listening on port 8081');
})
