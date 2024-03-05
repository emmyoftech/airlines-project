export default class BookingModel{
    Id

    UserId

    FlightId

    SeatNumber
        
    Price

    PaymentVerfied


    /**
     * 
     * @param {number} Id 
     * @param {number} UserId 
     * @param {number} FlightId 
     * @param {number} SeatNumber 
     * @param {number} Price 
     * @param {boolean} PaymentVerfied 
     */
    constructor (Id, UserId, FlightId, SeatNumber, Price, PaymentVerfied){
        this.Id = Id
        this.UserId = UserId
        this.FlightId = FlightId
        this.SeatNumber = SeatNumber
        this.Price = Price
        this.PaymentVerfied = PaymentVerfied
    }
}