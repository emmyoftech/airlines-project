/**
 * An object Representaion of an Airport object
 */
export default class AirportModel {
    Id

    Name
    
    Location

    NumberOfRunways

    Closed

    AvailableRunways

    /**
     * 
     * @param {number} id 
     * @param {string} Name 
     * @param {string} Location 
     * @param {number} NumberOfRunways 
     * @param {boolean} Closed
     * @param {number} AvailableRunways 
     */
    constructor (id, Name, Location, NumberOfRunways, Closed, AvailableRunways){
        this.Id = id
        this.Name = Name
        this.Location = Location
        this.NumberOfRunways = NumberOfRunways
        this.Closed = Closed
        this.AvailableRunways = AvailableRunways
    }
}