class Devices {
    constructor ( deviceId, dateData ) {
        this._deviceId = deviceId;
        this._dateData = dateData;
    }

    get deviceId () {
        return this._deviceId;
    }

    set deviceId (value) {
        this._deviceId = value;
    }

    get dateData () {
        return this._dateData;
    }

    set dateData (value) {
        this._dateData = value;
    }

    get json() {
        return {
            deviceId: this.deviceId,
            dateData: this.dateData
        }
    }
}

module.exports = Devices;