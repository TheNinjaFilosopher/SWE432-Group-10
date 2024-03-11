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

document.addEventListener('DOMContentLoaded', function() {
	responsiveMenu();
	populatePlaytimes();
	
	const timeSlotsSection = document.getElementById('time-slots');
	const reportsSection = document.getElementById('dj-reports');
	const timeSlotConfirm = timeSlotsSection.querySelector('[type="submit"]');
	
	timeSlotConfirm.addEventListener('click', e => {
		const message = document.getElementById('time-slots-msg');
		
		// FIXME this should be a conditional check to see if any changes have
		// been actually made instead.
		if (timeSlotsSection.querySelectorAll('input:checked').length < 1) {
			message.textContent = ' Time slots need to be selected first.';
		} else {
			message.textContent = ' Applied successfully.';
		}
		
		setTimeout(() => message.textContent = '', 3000);
		e.preventDefault();
	});
	
});