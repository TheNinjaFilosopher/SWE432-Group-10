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

function populatePlaytimes() {
	const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
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
		const currentDJ = djs.find(dj => dj.id == djId);
		
		// save time slots
		currentDJ.clearTimeSlots();
		for (slot of timeSlotsSection.querySelectorAll('input:checked')) {
			currentDJ.addTimeSlot(slot.value);
		}
		
		showFeedback('success', `Successfully updated time slots for ${currentDJ.firstName} ${currentDJ.lastName}.`);
	}
	
	e.preventDefault();
}

function updateInfo() {
	const djId = document.getElementById('dj').value;
	let currDJ;
	
	// clear previous checked time slots
	for (slot of timeSlotsSection.querySelectorAll('input:checked')) {
		slot.click();
	}
	
	// clear previous conflicting time slots
	for (slot of timeSlotsSection.querySelectorAll('input:disabled')) {
		slot.removeAttribute('disabled');
	}
	
	// then display current time sltos of the selected DJ
	// + disallow conflicting time slots
	for (dj of djs) {
		const timeSlots = dj.getTimeSlots();
		
		if (dj.id == djId) {
			currDJ = dj;
			for (slot of timeSlots) {
				timeSlotsSection.querySelector(`[value="${slot}"]`).click();
			}
		} else {
			for (slot of timeSlots) {
				timeSlotsSection.querySelector(`[value="${slot}"]`).disabled = true;
			}
		}
	}
	
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
	
	// const reportsSection = document.getElementById('dj-reports');
	
	// populate DJ dropdown
	/*const djDropdown = document.getElementById('dj');
	for (dj of djs) {
		const listing = document.createElement('option');
		listing.value = dj.id;
		listing.textContent = `${dj.firstName} ${dj.lastName}`;
		djDropdown.insertAdjacentElement('beforeend', listing);
	}*/
});