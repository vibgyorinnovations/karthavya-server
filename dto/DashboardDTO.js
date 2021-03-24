class DashboardDTO {
    constructor ( success, status, description, dashboardData ) {
        this._success = success;
        this._status = status;
        this._description = description;
        this._dashboardData = dashboardData;
    }

    get success () {
        return this._success;
    }

    set success (value) {
        this._success = value;
    }

    get status () {
        return this._status;
    }

    set status (value) {
        this._status = value;
    }

    get description () {
        return this._description;
    }

    set description (value) {
        this._description = value;
    }

    get dashboardData () {
        return this._dashboardData;
    }

    set dashboardData (value) {
        this._dashboardData = value;
    }

    get json() {
        return {
            success: this.success,
            status: this.status,
            description: this.description,
            dashboardData: this.dashboardData
        };
    }
}
module.exports = DashboardDTO;