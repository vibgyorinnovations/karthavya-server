class Accounts {

    constructor ( accountId, name, email, deviceCount, password, contact, devices ) {
        this._accountId = accountId;
        this._name = name;
        this._email = email;
        this._deviceCount = deviceCount;
        this._password = password;
        this._contact = contact;
        this._devices = devices;
    }

    get accountId () {
        return this._accountId;
    }

    set accountId (value) {
        this._accountId = value;
    }

    get name () {
        return this._name;
    }

    set name (value) {
        this._name = value;
    }

    get email () {
        return this._email;
    }

    set email (value) {
        this._email = value;
    }

    get deviceCount () {
        return this._deviceCount;
    }

    set deviceCount (value) {
        this._deviceCount = value;
    }

    get password () {
        return this._password;
    }

    set password (value) {
        this._password = value;
    }

    get contact () {
        return this._contact;
    }

    set contact (value) {
        this._contact = value;
    }

    get devices () {
        return this._devices;
    }

    set devices (value) {
        this._devices = value;
    }

    get json() {
        return {
            accountId: this.accountId,
            name: this.name,
            email: this.email,
            deviceCount: this.deviceCount,
            password: this.password,
            contact: this.contact,
            devices: this.devices
        }
    }
}
module.exports = Accounts;