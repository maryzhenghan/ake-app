// reference mongoose docs: http://mongoosejs.com/docs/guide.html

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const migraineLogSchema = new Schema({
	date: { type: Date, default: Date.now },
	migraineLengthHr: Number,
	water: Number,
	skippedMeals: Array,
	sleepStartHr: Number,
	sleepStartMin: Number,
	sleepEndHr: Number,
	sleepEndMin: Number,
	notes: String
});

const migraineLog = mongoose.model('migraineLog', logSchema);


// calculates total hours of sleep for virtual 'sleepTotalHr'. sleep hours are submitted in military time
function calculateSleepTotal(startHr, startMin, endHr, endMin) {
	let calculatedSleepTotal;

	if (startHr > endHr) {
		// eg 22 > 6
		// eg 22:30 > 6:15
		calculatedSleepTotal = (24 - (startHr + (startMin / 60))) + (endHr + (endMin / 60));
	}
	else if (startHr < endHr) {
		// eg 0 < 7
		calculatedSleepTotal = ((endHr + (endMin / 60))) - (startHr + (startMin / 60));

	}
	else {
		// eg slept @ 6, woke up @6:30
		calculatedSleepTotal = ((endMin / 60) - (startMin / 60));
	}

	return calculatedSleepTotal;
}


migraineLogSchema.virtual('sleepStart').get(function () {
	return migraineLogSchema.sleepStartHr + ':' + migraineLogSchema.sleepStartMin;
});

migraineLogSchema.virtual('sleepEnd').get(function () {
	return migraineLogSchema.sleepEndHr + ':' + migraineLogSchema.sleepEndMin;
});


migraineLogSchema.virtual('sleepTotal').get(function () {
	let sleepTotal = calculateSleepTotal(migraineLogSchema.sleepStartHr, migraineLogSchema.sleepStartMin, migraineLogSchema.sleepEndHr, migraineLogSchema.sleepEndMin);

	return sleepTotal;
});


migraineLogSchema.virtual('migraine').get(function () {
	let migraine;

	if (migraineLogSchema.migraineLengthHr > 0) {
		migraine = true;
	}
	else {
		migraine = false;
	}

	return migraine;
});


migraineLogSchema.methods.serialize = function() {
	return {
		date: this.date,
		migraine: this.migraine,
		water: this.water,
		skippedMeals: this.skippedMeals,
		sleepStart: this.sleepStart,
		sleepEnd: this.sleepEnd,
		sleepTotal: this.sleepTotalHr,
		notes: this.notes
	};
};

const Migraine = mongoose.model('Migraine', migraineLogSchema);

module.exports = {Migraine};