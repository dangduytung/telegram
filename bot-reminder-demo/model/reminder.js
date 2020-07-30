class Reminder {
  constructor(id, name) {
    this.id = id;
    this.name = name;
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

  getId() {
    return this.id;
  }

  setId(value) {
    this.id = value;
  }
}

module.exports = Reminder;
