export const Fetch = (opt, fn) => {
	const {
		url,
		method,
		data
	} = opt
	const searchStr = obj2String(data)
	let initObj = {}
	if (method === 'GET' || method === 'get') {
		searchStr ?
			url += '?' + searchStr : url
		initObj = {
			method
		}
	} else {
		initObj = {
			method: method,
			headers: new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			body: searchStr
		}
	}
	fetch(url, initObj).then((res) => {
		return res.json().then((data) => {
			fn(data)
		})
	}).then((res) => {
		return res
	}).catch(error => {
		console.log(error)
	})
}

const obj2String = (obj, arr = [], idx = 0) => {
	for (let item in obj) {
		arr[idx++] = [item, obj[item]]
	}
	return new URLSearchParams(arr).toString()
}