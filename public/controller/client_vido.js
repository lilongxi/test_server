import path from 'path';
import fs from 'fs';
import uuid from 'node-uuid';


const audioPath = path.join(__dirname, '../source');
const sourceURL = 'http://localhost:8080';

export async function clientVideo(req, res){
	const audioCollection = [];
	await fs.readdir(audioPath,function(err, items){
				if(err){
					res.send({status:'err', code:100, info:'获取失败'})
				}else{
					items.forEach((item) => {
						const collection = {
							name:item.split('.')[0],
							url:sourceURL + '/source/' + item,
							id:uuid.v4(),
							download: true,
							rate: 0
						}
						audioCollection.push(collection);
					});
					res.send({status:'ok', code:200, collection: audioCollection})
				}
			});
}
