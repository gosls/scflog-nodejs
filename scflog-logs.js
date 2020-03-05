#!/usr/bin/env node

const program = require('commander')
const WebSocketClient = require('websocket').client;
const path = require('path')
const fs = require('fs')
const os = require('os')

program
	.option('-f, --funtion [funtion]', '函数名称')
	.option('-r, --region [region]', '常用函数的区域（非必选，默认ap-guangzhou）')
	.option('-n, --namespace [namespace]', '常用函数的命名空间（非必选，默认default）')
	.parse(process.argv);

if(program.funtion){
	const configurePath = path.join(os.homedir(), ".scf_python_logs")
	let configureData
	if (fs.existsSync(configurePath)) {
		try {
			configureData = JSON.parse(fs.readFileSync(configurePath, 'utf-8'))
			const url = `${configureData.websocket}?name=${program.funtion}&namespace=${program.namespace || configureData.namespace}&region=${program.region || configureData.region}`
			console.log(url)
			const client = new WebSocketClient()
			client.on('connectFailed', function(error) {
				throw new Error("链接失败: " + error.toString());
			});

			client.on('connect', function(connection) {
				console.log('链接成功');
				connection.on('error', function(error) {
					console.log("连击错误: " + error.toString());
				});
				connection.on('close', function() {
					console.log('关闭链接');
				});
				connection.on('message', function(message) {
					if (message.type === 'utf8') {
						console.log(message.utf8Data + "'");
					}
				})
			});
			client.connect(url, 'echo-protocol');
		} catch (e) {
			console.log(e)
			console.log("配置文件异常，请使用scflog configure指令重新进行配置")
		}
	}
	if (!configureData) {
		console.log("未找到配置文件，请使用scflog configure指令进行配置")
	}
}else{
	console.log("name字段必须填写")
}

