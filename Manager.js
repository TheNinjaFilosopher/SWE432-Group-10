class Member {
	static #count = 0;

	constructor(lastName, firstName) {
		this.id = ++this.#count;
		this.lastName = lastName;
		this.firstName = firstName;
	}

	static validateTimeSlot(slot) {
		/* Ensure the given string is in the format day-HHMM-HHMM (24-hour format) */
		if (/^(s(un|at)|t(ue|thu)|mon|wed|fri)-([01]\d|2[0-3])(00|30)-([01]\d|2[0-3])(00|30)$/.test(slot)) {
			const tokens = slot.split('-');
			const begin = parseInt(tokens[1]);
			const end = parseInt(tokens[2]);
			return (begin < end) || (begin == 2330 && end == 0);
		}
		return false;
	}
}

class DJMember extends Member {
	constructor(lastName, firstName) {
		super(lastName, firstName);
		this.timeSlots = new Set();
		this.assocProducer = {};
	}

	getTimeSlots() {
		return Array.from(this.timeSlots.values());
	}

	addTimeSlot(slot) {
		if (Member.validateTimeSlot(slot)) {
			this.timeSlots.add(slot);
			return true;
		}
		return false;
	}

	removeTimeSlot(slot) {
		return this.timeSlots.delete(slot);
	}
}

class ProducerMember extends Member {
	constructor(lastName, firstName) {
		super(lastName, firstName);
	}
}


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

function responsiveMenu() {
	const navlist = document.querySelector('nav > ul');
	const hamburger = document.querySelector('nav > button');
	
	document.addEventListener('click', e => {
		// If a click outside the navigation bar was detected, then rehide it
		// back (except if its the hamburger)
		if (!hamburger.contains(e.target) && !navlist.contains(e.target)) {
			navlist.removeAttribute('style');
		}
	});
	
	hamburger.addEventListener('click', function() {
		navlist.style = 'left: 0 !important;'
	});
}

function confirmTimes(e) {
	const timeSlotsSection = document.getElementById('time-slots');
	const message = document.getElementById('time-slots-msg');
	
	if (timeSlotsSection.querySelectorAll('input:checked').length < 1) {
		message.textContent = ' Time slots need to be selected first.';
	} else {
		message.textContent = ' Applied successfully.';
	}
	
	setTimeout(() => message.textContent = '', 3000);
	e.preventDefault();
}

document.addEventListener('DOMContentLoaded', function() {
	responsiveMenu();
	populatePlaytimes();
	
	// const reportsSection = document.getElementById('dj-reports');
});