import path from 'path';
import fs from 'fs';
import {v4} from 'node-uuid';
//压缩
//import archiver from 'archiver';
import zipper from 'zip-local';
//
import moment from 'moment';

export async function download(req, res){
	let content = req.body.content || '';
	let data = [],
		_id = v4();
	//默认路径
	const _fName = `bc_source_${_id}`;
	const PATH = path.join(__dirname, `../zip/${_fName}`);
	
	try{
		data = JSON.parse(content);
	}catch(err){
		data = [];
	}
	
	if(data.length === 0){return}
	
	//类型转换成功，创建文件夹
	if(fs.existsSync(PATH)){return}
	await fs.mkdir(PATH, (err) => {
			if(err){
				res.send({status:'err', code:100, info:'下载失败'});
				return;
			}
		});
	
	//循环检查歌曲
	try{
		data.forEach(item => {
			copyAudio(item.name, _fName, data.length, res);
		})
	}catch(err){
		res.send({status:'err', code:100, info:'下载失败'});
		return;
	}
	
//	res.send({status:'success', code:200, content: data})
}


//被拷贝的目录
const copyedFile = "../source/",
	  savedFile = "../zip/";
let count = 0;
	  
//拷贝歌曲函数
async function copyAudio(fileName, _fName, length, res){
	//fileName需要下载的文件名称, _fName对应的文件夹
	var _fileName = copyedFile + fileName + '.mp3',
		_copyName = fileName + '.mp3';
	
	//获取资源路径
	var sourceFile = path.join(__dirname, _fileName);
	//存放资源的路径
	var	destPath = path.join(__dirname, savedFile + _fName, _copyName);
	
	//拷贝文件
	var readStream = await fs.createReadStream(sourceFile);
	var writeStream = await fs.createWriteStream(destPath);

	readStream.pipe(writeStream);
	
	readStream.on('end', (chunk) => {
		if(length === ++count){
			try{
				zipper.sync.zip(path.join(__dirname, `../zip/${_fName}`))
				.compress().save(path.join(__dirname, `../zip/${_fName}/${_fName}.zip`));
				res.send({status:'success', code:200, info:`http://localhost:8080/zip/${_fName}/${_fName}.zip`});
			}catch(err){
				res.send({status:'err', code:100, info:'下载失败'});
			}
		}
	})
}
