class Data {

    constructor ( time, maskPresent, temperature ) {
        this._time = time;
        this._maskPresent = maskPresent;
        this._temperature = temperature;
    }

    get time () {
        return this._time;
    }

    set time (value) {
        this._time = value;
    }

    get maskPresent () {
        return this._maskPresent;
    }

    set maskPresent (value) {
        this._maskPresent = value;
    }

    get temperature () {
        return this._temperature;
    }

    set temperature (value) {
        this._temperature = value;
    }

    get json() {
        return {
            time: this.time,
            maskPresent: this.maskPresent,
            temperature: this.temperature
        }
    }
}

module.exports = Data;