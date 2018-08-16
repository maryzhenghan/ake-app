'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const migraineLogSchema = new Schema({
  date: { type: Date, default: Date.now },
  migraineLengthHr: Number,
  weather: String,
  water: Number,
  skippedMeals: [String],
  sleepStartHr: Number,
  sleepStartMin: Number,
  sleepEndHr: Number,
  sleepEndMin: Number,
  notes: String
});

// MISC FUNCTIONS

function calculateSleepTotal(startHr, startMin, endHr, endMin) {
  let calculatedSleepTotal;

  if (startHr > endHr) {
    // eg. 22 > 6
    // eg. 22:30 > 6:15
    calculatedSleepTotal =
      24 - (startHr + startMin / 60) + (endHr + endMin / 60);
  } else if (startHr < endHr) {
    // eg. 0 < 7
    calculatedSleepTotal = endHr + endMin / 60 - (startHr + startMin / 60);
  } else {
    // eg. slept @ 6, woke up @6:30
    calculatedSleepTotal = endMin / 60 - startMin / 60;
  }

  calculatedSleepTotal = calculatedSleepTotal.toFixed(2);
  return calculatedSleepTotal;
}

// VIRTUALS

migraineLogSchema.virtual('sleepStart').get(function() {
  return this.sleepStartHr + ':' + this.sleepStartMin;
});

migraineLogSchema.virtual('sleepEnd').get(function() {
  return this.sleepEndHr + ':' + this.sleepEndMin;
});

migraineLogSchema.virtual('sleepTotal').get(function() {
  let sleepTotal = calculateSleepTotal(
    this.sleepStartHr,
    this.sleepStartMin,
    this.sleepEndHr,
    this.sleepEndMin
  );
  return sleepTotal;
});

migraineLogSchema.virtual('migraine').get(function() {
  let migraine;

  if (this.migraineLengthHr > 0) {
    migraine = true;
  } else {
    migraine = false;
  }

  return migraine;
});

migraineLogSchema.virtual('dateAdjusted').get(function() {
  let today = this.date;

  let dd = today.getUTCDate();
  let mm = today.getUTCMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  let dateAdjusted = mm + '/' + dd + '/' + yyyy;
  return dateAdjusted;
});

// SERIALIZE

migraineLogSchema.methods.serialize = function() {
  return {
    id: this._id,
    dateAdjusted: this.dateAdjusted,
    migraine: this.migraine,
    migraineLengthHr: this.migraineLengthHr,
    weather: this.weather,
    water: this.water,
    skippedMeals: this.skippedMeals,
    sleepStart: this.sleepStart,
    sleepEnd: this.sleepEnd,
    sleepTotal: this.sleepTotal,
    notes: this.notes
  };
};

const Log = mongoose.model('Log', migraineLogSchema);

module.exports = { Log };
