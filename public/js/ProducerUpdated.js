
// List of announcements
// [i].name is the name of the announcement, [i].length is the length of time
const announcements = [];

function openForm(e) {
    //Upon opening the form, make sure the labels are clear and showcase the form
	document.getElementById('announcement-name').value = '';
	document.getElementById('announcement-length').value = '';
	document.getElementById('announcement-creator').removeAttribute('style');
}
  
function submitForm(e) {
    //Upon closing the form, save the values and add them to the announcements list
	e.preventDefault();
	
	announcements.push({
		name: document.getElementById('announcement-name').value,
		length: document.getElementById('announcement-length').value
	});
	
	document.getElementById('announcement-creator').setAttribute('style', 'display: none');
	showFeedback('success', 'Announcement submitted');
}

function closeForm(e) {
	e.preventDefault();
	document.getElementById('announcement-name').value = '';
	document.getElementById('announcement-length').value = '';
	document.getElementById('announcement-creator').setAttribute('style', 'display: none');
}

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('open-add-announcement').addEventListener('click', openForm);
	document.getElementById('announcement-form').addEventListener('submit', submitForm);
	document.querySelector('.window .cancel').addEventListener('click', closeForm);
});