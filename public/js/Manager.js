/* ==========================
 * BEGIN - FAKE MEMBERS TEST
 * ==========================
 */

const djs = [
	new DJMember("Turner", "Alex", "Taylor Swift", "Country", 1),
	new DJMember("Turner", "John", "Jack Harlow", "Pop", 5)
];

const producers = [
	new ProducerMember("Hill", "James", 15),
	new ProducerMember("Polly", "Camellia", 10)
];

for (let i = 0; i < 2; i++) {
	djs[i].assocProducer = producers[i];
	producers[i].assocDJ = djs[i];
}

/* ==========================
 *   END - FAKE MEMBERS TEST
 * ==========================
 */

const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function populatePlaytimes() {
	const firstHalfInterval = document.getElementById("time-slots").querySelector("tbody").lastElementChild;
	// go through half-hour intervals
	for (let i = 47; i > 0; i--) {
		let currentHalfInterval = firstHalfInterval.cloneNode(true);
		
		// Get hour and minute parts. This will be in "HH:MM" format
		let firstHr = Math.trunc(i / 2), secondHr = Math.trunc((i+1) / 2);
		let firstMin = (i % 2) ? '30' : '00' , secondMin = ((i+1) % 2) ? '30' : '00';
		firstHr = firstHr.toString().padStart(2, '0');
		secondHr = secondHr.toString().padStart(2, '0');
		
		currentHalfInterval.firstElementChild.textContent = `${firstHr}:${firstMin}`;
		
		// Modify the value of all checkboxes for this half-hour interval
		const checkBoxes = currentHalfInterval.querySelectorAll('input');
		for (let j = 0; j < daysOfWeek.length; j++) {
			checkBoxes[j].value = `${daysOfWeek[j]}-${firstHr}${firstMin}-${secondHr}${secondMin}`;
		}
		
		firstHalfInterval.insertAdjacentElement('afterend', currentHalfInterval);
	}
	
	// 24:00 doesn't exist. fix that in the last child
	const lastHalfInterval = document.getElementById('time-slots').querySelector('tbody').lastElementChild;
	const checkBoxes = lastHalfInterval.querySelectorAll('input');
	for (let i = 0; i < daysOfWeek.length; i++) {
		checkBoxes[i].value = daysOfWeek[i] + '-2330-0000';
	}
}

let timeSlotsSection;

function confirmTimes(e) {
	const message = document.getElementById('time-slots-msg');
	const djId = document.getElementById('dj').value;
	
	if (!djId) {
		//message.textContent = ' A DJ needs to be selected first.';
		showFeedback('warning', 'A DJ needs to be selected first.');
	} else {
		const timeSlots = [];
		
		for (let i = 0; i < daysOfWeek.length; i++) {
			let timeStart = -1;
			let prevTimeRange;
			for (let j = 0; j < 48; j++) {
				const timeRange = offsetToTimeRange(j);
				const slot = timeSlotsSection.querySelector(`[value="${daysOfWeek[i]}-${timeRange}"]`);
				
				if (slot.checked && timeStart === -1) {
					timeStart = startFromTimeRange(timeRange);
				} else if (!slot.checked && timeStart !== -1) {
					timeSlots.push({
						day: `4/${7 + i}/2024`, // dummy date
						start: timeStart,
						end: endFromTimeRange(prevTimeRange)
					});
					timeStart = -1;
				}
				
				prevTimeRange = timeRange;
			}
		}
		
		fetch('/api/timeslots/djs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: djId,
				slots: timeSlots
			})
		})
		.then(res => res.json())
		.then(data => showFeedback(data.type, data.message));
		
	}
	
	e.preventDefault();
}

function timeToOffset(t) {
	return 2 * Math.trunc(t / 100) + !!(t % 100);
}

function offsetToTimeRange(i) {
	let firstHr, secondHr, firstMin, secondMin;
	
	if (i == 47) {
		firstHr = 23;
		secondHr = 0;
		firstMin = '30';
		secondMin = '00';
	} else {
		firstHr = Math.trunc(i / 2);
		secondHr = Math.trunc((i+1) / 2);
		firstMin = (i % 2) ? '30' : '00';
		secondMin = ((i+1) % 2) ? '30' : '00';
	}
	
	firstHr = firstHr.toString().padStart(2, '0');
	secondHr = secondHr.toString().padStart(2, '0');
	return `${firstHr}${firstMin}-${secondHr}${secondMin}`;
}

function startFromTimeRange(tr) {
	return tr.substring(0, 2) + ':' + tr.substring(2, 4);
}

function endFromTimeRange(tr) {
	return tr.substring(5, 7) + ':' + tr.substring(7, 9);
}

function updateInfo() {
	const djSelectionBar = document.getElementById('dj');
	const djId = djSelectionBar.value;
	const djName = djSelectionBar.options[djSelectionBar.selectedIndex].text;
	
	fetch(`/api/timeslots/djs/${djId}`)
	.then(res => res.json())
	.then(data => {
		// clear previous checked time slots
		for (slot of timeSlotsSection.querySelectorAll('input:checked')) {
			slot.click();
		}
		
		// this clears previous conflicting time slots, but due to time constraints the handling is left unimplemented
		/*
		for (slot of timeSlotsSection.querySelectorAll('input:disabled')) {
			slot.removeAttribute('disabled');
		}
		*/
		
		// then display current time slots of the selected DJ
		for (slot of data) {
			const day = daysOfWeek[new Date(slot.Timeslot.day).getDay()];
			const timeStart = slot.Timeslot.start.replace(':', '');
			const timeEnd = slot.Timeslot.end.replace(':', '');
			
			// select all timeslots from timeStart to timeEnd given a day
			for (let i = timeToOffset(timeStart); i < timeToOffset(timeEnd); i++) {
				const timeRange = offsetToTimeRange(i);
				timeSlotsSection.querySelector(`[value="${day}-${timeRange}"]`).click();
			}
			
		}
		
		showFeedback('success', `${djName} selected`);
	})
	.catch(() => showFeedback('error', `Failed to retrieve DJ with id ${djId}. The DJ may not exist.`));
	
	// update reports
	document.getElementById('dj-reports-aow').textContent = `Artist of the Week: ${currDJ.popularArtist}`;
	document.getElementById('dj-reports-gow').textContent = `Genre of the Week: ${currDJ.popularGenre}`;
	document.getElementById('dj-reports-prodasssigned').textContent = `# Producer-assigned songs: ${currDJ.assocProducer.songsAssigned}`;
	document.getElementById('dj-reports-songsplayed').textContent = `# Songs DJ Played: ${currDJ.songsPlayed}`;
}

document.addEventListener('DOMContentLoaded', function() {
	responsiveMenu();
	populatePlaytimes();
	timeSlotsSection = document.getElementById('time-slots');
	Object.seal(timeSlotsSection);
});