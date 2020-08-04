class Reminder {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  getId() {
    return this.id;
  }

  setId(value) {
    this.id = value;
  }

  setName(value) {
    this.name = value;
  }

  getName() {
    return this.name;
  }

  setSchedule(value) {
    this.schedule = value;
  }

  getSchedule() {
    return this.schedule;
  }

  setScheduleStandard(value) {
    this.scheduleStandard = value;
  }

  getScheduleStandard() {
    return this.scheduleStandard;
  }
}

module.exports = Reminder;
