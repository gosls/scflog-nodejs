#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')

async function copyDir(src, dst) {
	const paths = await fs.readdirSync(src)
	if (!fs.existsSync(dst)) {
		await fs.mkdirSync(dst)
	}
	for (let i = 0; i < paths.length; i++) {
		const thisFileStat = await fs.statSync(path.join(src, paths[i]))
		if (thisFileStat.isFile()) {
			const readable = await fs.readFileSync(path.join(src, paths[i]))
			await fs.writeFileSync(path.join(dst, paths[i]), readable)
		} else {
			if (!fs.existsSync(path.join(dst, paths[i]))) {
				await fs.mkdirSync(path.join(dst, paths[i]))
			}
			await this.copyDir(path.join(src, paths[i]), path.join(dst, paths[i]))
		}
	}
}

program
	.option('-l, --language [language]', '编程语言，目前支持python和nodejs')
	.parse(process.argv);



if (program.language) {
	const componentPath = path.join(__dirname, 'component')
	if (program.language == "nodejs") {
		copyDir(path.join(componentPath, "nodejs"), "./")
		console.log("初始化成功：")
		console.log("｜- console.js")
		console.log("* 请导入依赖：var console = new (require('./demo').NewConsole)()")
	} else if (program.language == "python") {
		copyDir(path.join(componentPath, "python"), "./")
		console.log("初始化成功")
		console.log("｜- logging.py")
		console.log("｜- logs.py")
		console.log("* 请导入依赖：from logs import *")
	} else {
		console.log("目前language参数只支持nodejs和python")
	}
}else{
	console.log("language参数是必选的，且只支持nodejs和python")
}
