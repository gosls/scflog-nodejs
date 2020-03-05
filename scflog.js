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
	.command('init', '初始化文档')
	.command('configure', '信息配置')
	.command('logs', '开启实时日志')
	.parse(process.argv)
