class DateData {
    constructor ( date, data ) {
        this._date = date;
        this._data = data;
    }

    get date () {
        return this._date;
    }

    set date (value) {
        this._date = value;
    }

    get data () {
        return this._data;
    }

    set data (value) {
        this._data = value;
    }

    get json(){
        return {
            date: this._date,
            data: this._data
        }
    }
}

module.exports = DateData;