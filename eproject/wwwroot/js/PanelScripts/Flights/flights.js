import FlightView from "../../Floats/Flights/flight-view.js";
import AirportModel from "../../interfaces/airportModel.js";
import FlightModel from "../../interfaces/flightModel.js";
import PlaneModel from "../../interfaces/planeModel.js";
import User from "../../interfaces/user.js";
import { Controller } from "../../services/Controller.js";
import { env } from "../../services/env.js";
import FlightCreate from "./flights-create.js";

export default class Flights extends Controller{
    #flights = new Array()

    #airports = new Array()

    #planes = new Array()

    #flightMap = new Map()

    constructor(parentDom){
        super(parentDom, "panel=flights=Flights", () => {
           let load = this.float.floatLoad("getting planes..")
           this.api.getPlanes(planes => {
           this.#planes = planes
                load.changeText("getting airports..")
                this.api.getAirports(airports => {
                    this.#airports = airports
                    load.changeText("getting flights..")
                    this.api.getFlights(flights => {
                        this.float.floatEnd(() => {
                            this.#flights = flights
                            this.#starter()
                        })
                     })
                })
           })
        })
    }

    #starter(){
        const 
        tableSection = this.domElement.querySelector(".table")

        gsap.fromTo(tableSection, {opacity: 0, display: "none"}, {opacity: 1, display: "flex", duration: .5})
        .then(() => {
            this.#populateRows()
            this.domElement.querySelector("button").onclick = () => this.#tocreate()
            this.domElement.querySelector("#search-put").oninput = (e) => this.#search(e.target)
        })
    }

    #populateRows(){
        let count = 0
        for(const flight of this.#flights){
            const fli_plane = this.#planes.find(item => item.Id == flight.PlaneId),
            fli_de_airport = this.#airports.find(item => item.Id == flight.DepartureAirportId),
            fli_ar_airport = this.#airports.find(item => item.Id == flight.ArrivalAirportId)
            this.#createRow(flight, fli_plane, fli_de_airport, fli_ar_airport, count)
            count++
        }
    }

    /**
     * 
     * @param {FlightModel} flight 
     * @param {PlaneModel} plane 
     * @param {AirportModel} de_airport 
     * @param {AirportModel} ar_airport 
     * @param {number} count
     */
    #createRow(flight, plane, de_airport, ar_airport, count){
        const 
        row = document.createElement("div"),
        inner = `
            <span class="cell"><span class="check"></span></span>
            <span class="cell">${de_airport.Location + " to " + ar_airport.Location}</span>
            <span class="cell">${env.nairaSign} ${flight.PricePerSeat}</span>
            <span class="cell">${plane.Manufacturer + " " + plane.Model}</span>
            <span class="cell">${flight.DepartureDate}</span>
            <span class="cell">${flight.RemainingSeats}</span>
            <span class="cell">
                <span id="row-action"><i class="fa-regular fa-eye"></i></span>
            </span>
        ` 
        row.className = "row"
        row.innerHTML = inner
        this.domElement.querySelector(".lists").append(row)
        gsap.from(row, {x: 100, opacity: 0, duration: count * .3})
        row.querySelector("#row-action").onclick = () => new FlightView(flight, plane, de_airport, ar_airport)
        this.#flightMap.set(de_airport.Location + " to " + ar_airport.Location, row)
    }

    /**
     * 
     * @param {HTMLInputElement} inputDom 
     */
    #search (inputDom){
        this.#flightMap.forEach((domValue, key) => {
            if(key.includes(inputDom.value.toLowerCase())){
                gsap.fromTo(domValue, {x: -100, opacity: 0, display: "none"}, {x: 0, display: "flex", opacity: 1, duration: .1})
            }else{
                gsap.fromTo(domValue, {x: 0, display: "flex", opacity: 1}, {x: -100, opacity: 0, display: "none", duration: .1})
            }
        })
    }

    #tocreate(){
        this._destroy(() => {
            this.acquiredController.currViewController = new FlightCreate(this.parentDomELement)
            this.acquiredController.currViewController.acquiredController = this.acquiredController
        })
    }
}