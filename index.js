const fetch = require('node-fetch')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('db.json')



low(adapter).then(db => {
	db.defaults({ letters: [] }).write();

	let cache = []

	function checkStatus(res) {
		if (res.ok) {
			return res;
		} else {
			throw new Error(err);
		}
	}

	function get_letter(){
		fetch('https://www.thiswebsitewillselfdestruct.com/api/get_letter')
			.then(checkStatus)
			.then(res => res.json())
			.then(body => {
				if (!cache.includes(body.id)) {
					if(db.get('letters').find({ id: body.id }).value() == undefined){
						db.get('letters').push(body).write();
						cache.push(body.id);
						console.log(`Wrote letter id #${body.id} to file`);
					}
				}
			});
	}

	let interval = 5 * 1000;

	setInterval(function () {
		get_letter();
	}, interval);

})
