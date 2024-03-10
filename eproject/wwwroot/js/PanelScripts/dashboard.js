import FlightModel from "../interfaces/flightModel.js"
import Message from "../interfaces/messageModule.js"
import {Controller} from "../services/Controller.js"
import { env } from "../services/env.js"

export default class Dashboard extends Controller{
    #planes = new Array()
    
    #flights = new Array()

    #bookings = new Array()

    #messages = new Array()

    #airports = new Array()

    constructor(parentDom){
        super(parentDom, "panel=dashboard", ()=> {
            this.float.floatLoad("setting up...")
            this.api.getPlanes(planes => {
                this.#planes = planes
                this.api.getFlights(flights => {
                    this.#flights = flights
                    this.api.getBookings(bookings => {
                        this.#bookings = bookings
                        this.api.getMessages(messages => {
                            this.#messages = messages
                            this.api.getAirports(airports => {
                                this.#airports = airports
                                this.float.floatEnd(() => this.#setup())
                            })
                        })
                    })
                })
            })
        })
    }

    #setup(){
        const
        totPlaneDom = this.domElement.querySelector("#planesNum"),
        totRevDom = this.domElement.querySelector("#revNum"),
        totAirportDom = this.domElement.querySelector("#airportNum")

        totPlaneDom.textContent = this.#planes.length

        totRevDom.textContent = env.nairaSign + " " + this.#bookings.map(item => item.Price).reduce((prev , curr) => prev + curr)
    
        totAirportDom.textContent = this.#airports.length

        this.#popoulateFlight()
        this.#populateMessages()
    }

    #popoulateFlight(){

        for(const flight of this.#flights){
            createRow(flight, this)
        }

        /**
         * 
         * @param {FlightModel} flight
         * @param {Dashboard} ctrl
         */
        function createRow(flight, ctrl){
            const 
            row = document.createElement("div"),
            plane = ctrl.#planes.find(item => item.Id == flight.PlaneId),
            dp_Airport = ctrl.#airports.find(item => item.Id == flight.DepartureAirportId),
            ar_Airport = ctrl.#airports.find(item => item.Id == flight.ArrivalAirportId),
            inner = `
                <span class="cell"></span>
                <span class="cell">${dp_Airport.Location} to ${ar_Airport.Location}</span>
                <span class="cell">${env.nairaSign + " " + flight.PricePerSeat.toLocaleString()}</span>
                <span class="cell">${plane.Manufacturer} ${plane.Model}</span>
                <span class="cell">${flight.DepartureDate}</span>
                <span class="cell">${flight.RemainingSeats}</span>
            `
            row.className = "row"
            row.innerHTML = inner

            ctrl.domElement.querySelector(".lists").append(row)
        }
    }

    #populateMessages(){
        for(const msg of this.#messages){
            createRow(msg, this)
        }

        /**
         * 
         * @param {Message} message 
         * @param {Dashboard} ctrl
         */
        function createRow(message, ctrl){
            const
            row = document.createElement("div"),
            inner = `
            <b>${message.FirstName} ${message.LastName}</b>
            <p>${message.Text}</p>
            `

            row.className = "msgBox"
            row.innerHTML = inner

            ctrl.domElement.querySelector(".msgList").append(row)
        }
    }
}