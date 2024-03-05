export default class BuisnessClassSeat{
    Id 

    PlaneId
    
    SeatNumber

    Occupied

    /**
     * 
     * @param {number} Id 
     * @param {number} PlaneId 
     * @param {number} SeatNumber 
     * @param {boolean} Occupied 
     */
    constructor(Id, PlaneId, SeatNumber, Occupied){
        this.id = Id
        this.PlaneId = PlaneId
        this.SeatNumber = SeatNumber
        this.Occupied = Occupied
    }
}