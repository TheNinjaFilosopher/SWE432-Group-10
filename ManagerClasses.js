class Member {
	static #count = 0;

	constructor(lastName, firstName) {
		this.id = ++Member.#count;
		this.lastName = lastName;
		this.firstName = firstName;
	}

	static validateTimeSlot(slot) {
		/* Ensure the given string is in the format day-HHMM-HHMM (24-hour format) */
		if (/^(s(un|at)|t(ue|hu)|mon|wed|fri)-([01]\d|2[0-3])(00|30)-([01]\d|2[0-3])(00|30)$/.test(slot)) {
			const tokens = slot.split('-');
			const begin = parseInt(tokens[1]);
			const end = parseInt(tokens[2]);
			return (begin < end) || (begin == 2330 && end == 0);
		}
		return false;
	}
}

class DJMember extends Member {
	constructor(lastName, firstName, popularArtist, popularGenre, songsPlayed) {
		super(lastName, firstName);
		this.popularArtist = popularArtist;
		this.popularGenre = popularGenre;
		this.songsPlayed = songsPlayed;
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
	
	clearTimeSlots() {
		this.timeSlots.clear();
	}
	
	assignProducer(producer) {
		this.assocProducer = producer;
	}

	/*
	removeTimeSlot(slot) {
		return this.timeSlots.delete(slot);
	}
	*/
}

class ProducerMember extends Member {
	constructor(lastName, firstName, songsAssigned) {
		super(lastName, firstName);
		this.songsAssigned = songsAssigned;
		this.assocDJ = {};
	}
}
