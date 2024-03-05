
export default class PlaneModel {
    Id

    AirportId

    Model

    Code

    Manufacturer

    YearOfManufacture

    SeatCapacity

    Status

    /**
     * 
     * @param {number} Id 
     * @param {number} AirportId 
     * @param {string} Model 
     * @param {number} Code 
     * @param {string} Manufacturer 
     * @param {number} YearOfManufacture 
     * @param {number} SeatCapacity 
     * @param {string} Status 
     */
    constructor (Id, AirportId, Model, Code, Manufacturer, YearOfManufacture, SeatCapacity, Status){
        this.Id = Id
        this.AirportId = AirportId
        this.Model = Model
        this.Code = Code
        this.Manufacturer = Manufacturer
        this.YearOfManufacture = YearOfManufacture
        this.SeatCapacity = SeatCapacity
        this.Status = Status
    }
}