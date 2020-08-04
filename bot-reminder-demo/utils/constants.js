class Constants {
    
    constructor() {
    }

    static get REGEX_ALL() { return '(.*)' }
    static get PARAM_REPLACE() { return '{?}'}
    
    static get COMMAND_NEW() { return '/new' }
    static get COMMAND_LIST() { return '/list' }
    static get COMMAND_EDIT() { return '/edit' }
    static get COMMAND_DELETE() { return '/delete' }
    static get COMMAND_START() { return '/start' }
    static get COMMAND_ABOUT() { return '/about' }

    static get STATE_REMINDER_NEW_NAME() { return `${this.COMMAND_NEW}/name` }
    static get STATE_REMINDER_NEW_SCHEDULE() { return `${this.COMMAND_NEW}/schedule` }

    static get STATE_REMINDER_EDIT_SELECT() { return `${this.COMMAND_EDIT}/select` }
    static get STATE_REMINDER_EDIT_NAME() { return `${this.COMMAND_EDIT}/name` }
    static get STATE_REMINDER_EDIT_SCHEDULE() { return `${this.COMMAND_EDIT}/schedule` }

    static get STATE_REMINDER_DELETE_SELECT() { return `${this.COMMAND_DELETE}/select` }

    static get KEY_GENERATE_ID() { return `key:reminder` }

    static get KEY_SET_CTX_REQUEST() { return `${this.PARAM_REPLACE}:key:set:ctx:request` }
    static get KEY_SET_REMINDER_OBJ() { return `${this.PARAM_REPLACE}:key:set:reminder:obj` }
    static get KEY_HSET_REMINDER_OBJ() { return `${this.PARAM_REPLACE}:key:hset:reminder:obj` }

    static replaceOne(str, val) {
        return str.replace(this.PARAM_REPLACE, val);
    }
    
    static get CONTENT_REMINDER_SCHEDULE() {
        return `<b>You can use the following formats:</b>
dd.MM HH:mm
dd HH:mm
HH:mm`
    }

    static get DATE_TYPE() {
        return { INVALID : -1, YEAR : 1, MONTH : 2, DAY : 3, HOUR : 4, MINUTE : 5, SECOND : 6 }
    }

    static get DB_ACTION() {
        return { NEW : 1, EDIT : 2, DELETE : 3}
    }
}

Object.freeze(Constants);
module.exports = Constants;

// console.log(Constants.STATE_REMINDER_NEW_NAME);