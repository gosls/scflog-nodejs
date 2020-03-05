#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const os = require('os')

program
	.option('-w, --websocket [websocket]', 'Websocket地址')
	.option('-r, --region [region]', '常用函数的区域（非必选，默认ap-guangzhou）')
	.option('-n, --namespace [namespace]', '常用函数的命名空间（非必选，默认default）')
	.parse(process.argv);


const configurePath = path.join(os.homedir(), ".scf_python_logs")
let configureData
if (fs.existsSync(configurePath)) {
	try {
		configureData = JSON.parse(fs.readFileSync(configurePath, 'utf-8'))
	} catch (e) {

	}
}
if (!configureData) {
	configureData = {
		websocket: "",
		region: 'ap-guangzhou',
		namespace: 'default'
	}
}

if (program.websocket) {
	configureData.websocket = program.websocket
	console.log("更新websocket成功")
}
if (program.region) {
	configureData.region = program.region
	console.log("更新region成功")
}
if (program.namespace) {
	configureData.namespace = program.namespace
	console.log("更新namespace成功")
}
fs.writeFileSync(configurePath, JSON.stringify(configureData))
console.log("目前配置：")
console.log(`    websocket: ${configureData.websocket}`)
console.log(`    region: ${configureData.region}`)
console.log(`    namespace: ${configureData.namespace}`)

