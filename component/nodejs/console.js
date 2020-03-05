const util = require('util')
const http = require('http')
const oldConsole = global.console

class NewConsole {
	async doLogs(tempData) {
		try {
			const url = process.env.real_time_log_url
			const cid = process.env.real_time_log_id
			if (url && cid) {
				const data = {
					coid: cid,
					data: logs,
				}
				const requestData = JSON.stringify(data)
				const options = {
					host: url.replace('http://', '').replace('/test/report', ''),
					port: '80',
					path: '/test/report',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
				}

				return await new Promise(function (resolve, reject) {
					const req = http.request(options, function (res) {
						res.setEncoding('utf8')
						res.on('data', function (chunk) {
							resolve(chunk)
						})
					})
					req.on('error', function (e) {
						reject(e.message)
					})
					req.write(requestData)
					req.end()
				})
			}
		} catch (e) {
			return null
		}
	}

	async log(...args) {
		const data = util.format(...args)
		oldConsole.log(data)
		await this.doLogs(data)
	}

	async trace(...args) {
		const data = util.format(...args)
		oldConsole.trace(data)
		await this.doLogs(data)
	}

	async info(...args) {
		const data = util.format(...args)
		oldConsole.info(data)
		await this.doLogs(data)
	}

	async warn(...args) {
		const data = util.format(...args)
		oldConsole.warn(data)
		await this.doLogs(data)
	}

	async error(...args) {
		const data = util.format(...args)
		oldConsole.error(data)
		await this.doLogs(data)
	}

	async debug(...args) {
		const data = util.format(...args)
		oldConsole.debug(data)
		await this.doLogs(data)
	}
}

module.exports = {
	NewConsole
}
