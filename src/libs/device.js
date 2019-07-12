/**
 * 设置cookie
 * */
export function transferDeviceTypeConfigObject2Arr(config) {
	var ret = [];
	for (var sKey in config) {
		var fields = config[sKey];
		if (fields.length != undefined) {
			fields.map((d => { 
				d['aggs_usage']=sKey;
				ret.push(d) 
			}))
		}

	}
	return ret;
}

