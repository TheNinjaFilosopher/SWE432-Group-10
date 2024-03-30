// This file is shared between Manager, Producer, and DJ

let feedbackTimeoutId;

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

function showFeedback(type, message) {
	const feedback = document.getElementById('action-feedback');
	if (/^(success|warning|error)$/i.test(type)) {
		feedback.className = type.toLowerCase();
	} else {
		feedback.className = '';
	}
	document.getElementById('action-feedback-msg-header').textContent = type;
	document.getElementById('action-feedback-msg-text').textContent = message;
	feedback.setAttribute('style', 'bottom: 0');
	feedbackTimeoutId = setTimeout(() => feedback.removeAttribute('style'), 3000);
}

function closeFeedback() {
	const feedback = document.getElementById('action-feedback');
	clearTimeout(feedbackTimeoutId);
	feedback.removeAttribute('style');
}

document.addEventListener('DOMContentLoaded', () => {
	responsiveMenu();
	
	// apply close functionality to all windows
	document.querySelectorAll('.window').forEach(el => {
		el.querySelector('.window-form-titlebar > span:nth-child(2)')
		.addEventListener('click', () => el.setAttribute('style', 'display: none'));
	});
});