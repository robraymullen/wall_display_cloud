const getTime = () => {
	return new Date().toLocaleTimeString();
};

const writeTimeToDom = (domId) => {
	const time = getTime();
	document.getElementById(domId).innerHTML = time;
	setTimeout(writeTimeToDom, 500, domId);
};

const getEvents = async (onSuccess) => {
	const response = await fetch("http://localhost:8089/events");
	const events = await response.json();
	onSuccess(events);
	setTimeout(getEvents, 10000, onSuccess);
};

const writeEvents = (events) => {
	// document.getElementById("")
	console.log(events);
}

const getBirthdays = async (onSuccess) => {
	const response = await fetch("http://localhost:8089/birthdays");
	const birthdays = await response.json();
	onSuccess(birthdays);
	setTimeout(getBirthdays, 10000, onSuccess);
};

const writeBirthdays = (birthdays) => {
	console.log(birthdays);
};

function shuffle(items) {
    for (let i=items .length-1; i>0; i-- ){
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

const getNews = async (onSuccess) => {
	const redditPostJson = await Promise.all([
                fetch("https://www.reddit.com/r/worldnews/best.json?sort=new"), 
                fetch("https://www.reddit.com/r/science/best.json?sort=new")
            ]).then(([worldNewsRes, scienceNewsRes]) =>
                Promise.all([worldNewsRes.json(), scienceNewsRes.json()])
            );
	shuffle(redditPostJson);
};

const startup = (clockDomId) => {
	writeTimeToDom(clockDomId);
	getEvents(writeEvents);
	getBirthdays(writeBirthdays);
};

