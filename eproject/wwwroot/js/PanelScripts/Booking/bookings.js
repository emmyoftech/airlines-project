import BookingModel from "../../interfaces/bookingModel.js"
import User from "../../interfaces/user.js"
import {Controller} from "../../services/Controller.js"
import { env } from "../../services/env.js"
import { shownodataDom } from "../../services/library.js"

export default class Bookings extends Controller{
    #bookingsMap = new Map()

    #flights = new Array()

    #bookings = new Array()

    #airports = new Array()

    #users = new Array()

    #user = new User()

    constructor(parentDom, user){
        super(parentDom, "panel=bookings=Booking", () => {
            this.#starter()
            if(user) this.domElement.querySelector("#nnn").style.display = "none"
        })
        this.#user = user
    }

    #starter(){
        const load = this.float.floatLoad("getting flights.."),
        fail = (msg) => {
            shownodataDom(this.domElement.querySelector(".list-body"), msg)
            this.float.dialog(this.float.DIALOG_ERROR, msg, "no data")
        }

        this.api.getFlights(flights => {
            this.#flights = flights
            load.changeText("getting bookings...")
            this.api.getBookings(bookings => {
                this.#bookings = this.#user ? bookings.filter(item => item.UserId == this.#user.Id) : bookings
                if(this.#bookings.length < 1){
                    this.float.floatEnd()
                    shownodataDom(this.domElement.querySelector(".list-body"), "you haven't booked any flight yet")
                    return
                }
                load.changeText("gettings users..")
                this.api.getUsers(users => {
                    this.#users = users
                    load.changeText("getting airorts..")
                    this.api.getAirports(airports => {
                        this.#airports = airports
                        this.float.floatEnd(() => {
                            this.#populateTable()
                        })
                    }, msg => fail(msg))
                }, msg => fail(msg))
            }, msg => fail(msg))
        }, msg => fail(msg))
    }

    #populateTable(){
        const table = this.domElement.querySelector(".table")
        gsap.fromTo(table, {opacity: 0, display: "none"}, {opacity: 1, display: "flex", duration: .5}).then(() => {
            let count = 0
            for(const book of this.#bookings){
                this.#createRow(book, count)
                count++
            }
        })

        this.domElement.querySelector("input").oninput = (e)=> this.#filterBooking(e.target.value)
    }

    #filterBooking(value){
        this.#bookingsMap.forEach((domValue , bookFlight) => {
            if(bookFlight.includes(value)){
                gsap.fromTo(domValue, {x: -100, opacity: 0, display: "none"}, {x: 0, display: "flex", opacity: 1, duration: .1})
            }else{
                gsap.fromTo(domValue, {x: 0, display: "flex", opacity: 1}, {x: -100, opacity: 0, display: "none", duration: .1})
            }
        })
    }

    /**
     * 
     * @param {BookingModel} book 
     */
    #createRow(book, count){
        const newRow = document.createElement("div"),
        flight = this.#flights.find(item => item.Id == book.FlightId),
        dp_airport = this.#airports.find(item => item.Id == flight.DepartureAirportId),
        ar_airport = this.#airports.find(item => item.Id == flight.ArrivalAirportId),
        user = this.#users.find(item => item.Id == book.UserId)
        newRow.className = "row"

        newRow.innerHTML = `
            <span class="cell"></span>
            ${!this.#user ? `<span class="cell">${user.FirstName} ${user.LastName}</span>` : ""}
            <span class="cell">${dp_airport.Location} to ${ar_airport.Location}</span>
            <span class="cell">${book.SeatNumber}</span>
            <span class="cell">${env.nairaSign} ${book.Price}</span>
            <span class="cell">${book.PaymentVerfied ? "paid" : "pending"}</span>
        `
        this.domElement.querySelector(".lists").append(newRow)
        this.#bookingsMap.set(dp_airport.Location + "to" +ar_airport.Location, newRow)
        gsap.from(newRow, {x: 100, opacity: 0, duration: count * .3})
    }
}