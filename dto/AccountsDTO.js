class AccountsDTO{
    constructor(success, status, description, accountData) {
        this._success = success;
        this._status = status;
        this._description = description;
        this._accountData = accountData;
    }

    get success() {
        return this._success;
    }

    set success( value ) {
        this._success = value;
    }

    get status() {
        return this._status;
    }

    set status( value ) {
        this._status = value;
    }

    get description() {
        return this._description;
    }

    set description( value ) {
        this._description = value;
    }

    get accountData() {
        return this._accountData;
    }

    set accountData( value ) {
        this._accountData = value;
    }

    json(){
        return {
            success: this.success,
            status: this.status,
            description: this.description,
            accountData: this.accountData
        };
    }

}

module.exports = AccountsDTO;