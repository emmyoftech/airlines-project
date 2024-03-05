export default class FlightModel {
    Id

    DepartureAirportId
   
    ArrivalAirportId

    PlaneId
   
    PricePerSeat
   
    DepartureTime
   
    ArrivalTime
   
    DepartureDate
      
    Capacity
   
    RemainingSeats

    /**
     * 
     * @param {number} Id 
     * @param {number} DepartureAirportId 
     * @param {number} ArrivalAirportId 
     * @param {number} PricePerSeat 
     * @param {string} DepartureTime 
     * @param {string} ArrivalTime 
     * @param {string} DepartureDate 
     * @param {number} Capacity 
     * @param {number} RemainingSeats 
     */
    constructor(Id, DepartureAirportId, ArrivalAirportId, PlaneId, PricePerSeat, DepartureTime, ArrivalTime, DepartureDate, Capacity, RemainingSeats){
        this.Id = Id
        this.DepartureAirportId = DepartureAirportId
        this.ArrivalAirportId = ArrivalAirportId
        this.PlaneId = PlaneId
        this.PricePerSeat = PricePerSeat
        this.DepartureTime = DepartureTime
        this.ArrivalTime = ArrivalTime
        this.DepartureDate =  DepartureDate
        this.Capacity = Capacity
        this.RemainingSeats = RemainingSeats
    }
}