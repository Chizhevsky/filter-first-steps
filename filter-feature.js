function filterArrayOfObjectsByOptions(array = [], options = {}, filterCbs = [], sortCbs = []) {
	let filteredArray = array;
	try {
		if (array.constructor !== Array) {
			throw new Error('First argument should be not empty array');
		} else if (array.length === 0) {
			return [];
		} else {
			if (filterCbs.constructor !== Array) {
				throw new Error('Third argument should be array');
			} else {
				filteredArray = filterByFilterArray(filteredArray, filterCbs);
			}
			if (options.constructor !== Object) {
				throw new Error('Second argument should be object');
			} else {
				filteredArray = filterByOptions(filteredArray, options);
			}
			if (sortCbs.constructor !== Array) {
				throw new Error('Fourt argument should be array');
			} else {
				filteredArray = sortBySortArray(filteredArray, sortCbs);
			}
		}
		return filteredArray;
	} catch (e) {
		console.error(e);
	}

}

function filterByOptions(filteredArray, options) {
	if (Object.keys(options).length > 0) {
		return filteredArray
			.filter(
				(item) => {
					return Object.keys(options)
						.every((key) => {
							return compareObjects(item, options[key]);
						})
				}
			);
	} else {
		return filteredArray;
	}
}

function filterByFilterArray(filteredArray, filterCbs) {
	if (filterCbs.length > 0) {
		let filteredArrayByFilters = filteredArray;
		filterCbs.forEach(cb => {
			if (cb.constructor === Function) {
				filteredArrayByFilters = filteredArrayByFilters.filter(cb);
			} else {
				throw new Error('Provided callback for filtering isn\'t a function');
			}
		});
		return filteredArrayByFilters;
	} else {
		return filteredArray;
	}
}

function sortBySortArray(filteredArray, sortCbs) {
	if (sortCbs.length > 0) {
		let sortedArray = filteredArray;
		sortCbs.forEach(cb => {
			if (cb.constructor === Function) {
				sortedArray.sort(cb);
			} else {
				throw new Error('Provided callback for sorting isn\'t a function');
			}
		});
		return sortedArray;
	} else {
		return filteredArray;
	}
}

function compareObjects(item, option) {
	switch (option.type) {
		case 'number':
			return numberCaseComparing(item, option);
		case 'string':
			return stringCaseComparing(item, option);
		case 'date':
			return dateCaseComparing(item, option);
		case 'boolean':
			return booleanCaseComparing(item, option);
	}
}

function booleanCaseComparing(item, option) {
	const value = getValue(item, option.path);
	if (value && typeof value === 'boolean') {
		return value === option.value;
	} else {
		throw new Error('Not right path or type was provided');
	}
}

function numberCaseComparing(item, option) {
	const value = getValue(item, option.path);
	if (value && typeof value === 'number') {
		return value === option.value;
	} else {
		throw new Error('Not right path or type was provided');
	}
}

function stringCaseComparing(item, option) {
	const value = getValue(item, option.path);
	if (value && typeof value === 'string') {
		if (option.strict) {
			return value === option.value;
		} else {
			return value.indexOf(option.value) > -1;
		}
	} else {
		throw new Error('Not right path or type was provided');
	}
}

function dateCaseComparing(item, option) {
	const value = getValue(item, option.path);
	if (value) {
		return new Date(value).getTime() === new Date(value).getTime(option.value);
	} else {
		throw new Error('Not right path or type was provided');
	}
}

function getValue(nestedObj, pathArr) {
	return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

// Example of array
const arr = [
	{
		country: {
			name: 'Barcelona',
			code: 1
		},
		startDate: {
			date: new Date()
		},
		endDate: {
			date: new Date()
		},
		adults: 2,
		children: 3,
		rooms: 4
	},
	{
		country: {
			name: 'Madrid',
			code: 1
		},
		startDate: {
			date: new Date()
		},
		endDate: {
			date: new Date()
		},
		adults: 2,
		children: 2,
		rooms: 10
	},
];

// Example of options
const object = {
	name: {
		path: ['country', 'name'],
		value: 'Bar',
		strict: false,
		type: 'string'
	},
	startDate: {
		path: ['startDate'],
		value: '2019-06-04T12:52:40.077Z',
		strict: true,
		type: 'date'
	},
	adults: {
		path: ['adults'],
		value: 2,
		strict: true,
		type: 'number'
	},
	children: {
		path: ['children'],
		value: 2,
		strict: true,
		type: 'number'
	},
	rooms: {
		path: ['rooms'],
		value: 1,
		strict: true,
		type: 'number'
	}
}

// Examples:

console.log(filterArrayOfObjectsByOptions(
	arr, // array ro filter
	{}, //options
	[ 
		(item) => !!item.country
	], // filter callbacks
	[] // sort callback
));

console.log(filterArrayOfObjectsByOptions(
	arr,
	{},
	[
		(item) => !!item.name
	],
	[]
));

console.log(filterArrayOfObjectsByOptions(arr,
	{
		name: {
			path: ['country', 'name'],
			value: 'Bar',
			strict: false,
			type: 'string'
		}
	},
	[],
	[]
));

console.log(filterArrayOfObjectsByOptions(arr, 
	{
		rooms: {
			path: ['rooms'],
			value: 10,
			strict: true,
			type: 'number'
		}
	},
	[],
	[]
));
