import AirportModel from "../../interfaces/airportModel.js"
import FlightModel from "../../interfaces/flightModel.js"
import PlaneModel from "../../interfaces/planeModel.js"
import FloatController from "../../services/FLoatController.js"
import { env } from "../../services/env.js"

export default class FlightView extends FloatController{
    #flight = new FlightModel()
    
    #plane = new PlaneModel()
    
    #departureAirport = new AirportModel()

    #arrivalAirport = new AirportModel()
    
    /**
     * 
     * @param {FlightModel} flight 
     * @param {PlaneModel} plane 
     * @param {AirportModel} departureAirport 
     * @param {AirportModel} arrivalAirport 
     */
    constructor(flight, plane, departureAirport, arrivalAirport){
        super("Flights=flight-view", dom => {
            dom.querySelector("#flighPath").textContent = departureAirport.Location + " to " + arrivalAirport.Location
            this.#organizeFlightView(dom)
            this.#organizePlaneView(dom)
            this.#organizeAirport("departure-airport", dom)
            this.#organizeAirport("arrival-airport", dom)
            dom.querySelector(".bck").onclick = () => this.floatEnd()
        })
        this.#flight = flight
        this.#plane = plane
        this.#departureAirport = departureAirport
        this.#arrivalAirport = arrivalAirport
    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #organizeFlightView(dom){
        const 
        container = dom.querySelector(".flight-detail"),
        price_dom = container.querySelector(".pr"),
        dep_time_dom = container.querySelector(".dep_time"),
        ar_time_dom = container.querySelector(".ar_time"),
        dep_date_dom = container.querySelector(".dep_date"),
        cap_dom = container.querySelector(".cap"),
        rem_dom = container.querySelector(".rem_seats")

        this.#getItag(price_dom).textContent = env.nairaSign + " " + this.#flight.PricePerSeat.toLocaleString("en-us")
        this.#getItag(dep_time_dom).textContent = this.#flight.DepartureTime
        this.#getItag(ar_time_dom).textContent = this.#flight.ArrivalTime
        this.#getItag(dep_date_dom).textContent = this.#flight.DepartureDate
        this.#getItag(cap_dom).textContent = this.#flight.Capacity
        this.#getItag(rem_dom).textContent = this.#flight.RemainingSeats
    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #organizePlaneView(dom){
        const
        container = dom.querySelector(".plane-detail"),
        pl_name_dom = container.querySelector(".pl_name"),
        pl_code_dom = container.querySelector(".pl_code"),
        pl_seat_cap_dom = container.querySelector(".pl_cap")
        
        this.#getItag(pl_name_dom).textContent = this.#plane.Manufacturer + " " + this.#plane.Model
        this.#getItag(pl_code_dom).textContent = this.#plane.Code
        this.#getItag(pl_seat_cap_dom).textContent = this.#plane.SeatCapacity
    }
    
    /**
     * 
     * @param {string} domClassName 
     * @param {HTMLElement} parentDom 
     */
    #organizeAirport(domClassName, parentDom){
        const
        airportData = domClassName.includes("arrival") ? this.#arrivalAirport : this.#departureAirport,
        container = parentDom.querySelector(".".concat(domClassName)),
        name_dom = container.querySelector(".air_name"),
        loc_dom = container.querySelector(".air_loc")

        this.#getItag(name_dom).textContent = airportData.Name
        this.#getItag(loc_dom).textContent = airportData.Location
    }

    /**
     * 
     * @param {HTMLElement} dom 
     * @returns {HTMLElement}
     */
    #getItag = (dom)=> dom.querySelector("b") 
}