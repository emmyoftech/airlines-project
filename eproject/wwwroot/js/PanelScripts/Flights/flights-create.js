import FlightModel from "../../interfaces/flightModel.js";
import { Controller } from "../../services/Controller.js";
import { buttonLoad, dropdownGenerator, inputTaker, navBackgenerator, openButton } from "../../services/library.js";
import { inputErrLogger, inputErrloggerRemover, isInputEmpty } from "../../services/validation.js";

export default class FlightCreate extends Controller{
    #flight = new FlightModel()

    #aiports = new Array()

    #planes = new Array()

    constructor(parentDom){
        super(parentDom, "panel=flights-create=Flights", () => {
            navBackgenerator(this.domElement.querySelector(".nav"), "create flight", () => this.#toFlights())
            this.#starter(this.domElement)
        })
    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #starter(dom){
        const 
        departAirport = dom.querySelector(".departAirport"),
        arivalAirport = dom.querySelector(".arrivalAirport"),
        pricePerTicket = dom.querySelector(".pricePerTicket"),
        depertTime = dom.querySelector(".departureTime"),
        arivalTime = dom.querySelector(".arrivalTime"),
        planeOfChoice = dom.querySelector(".planeofchoice"),
        departDate = dom.querySelector(".departureDate")

        let departAirportDrop = dropdownGenerator(departAirport, "choose departure airport", "choose airport")

        let arivalDepartureDrop = dropdownGenerator(arivalAirport, "choose arrival airport", "choose airport")

        this.api.getAirports(airports => {
            this.#aiports = airports
            departAirportDrop.set(airports.map(item => item.Name),  airportName => this.#getAndSetAirprtID(airportName, "DepartureAirportId"))
            arivalDepartureDrop.set(airports.map(item => item.Name), airportName => this.#getAndSetAirprtID(airportName, "ArrivalAirportId"))
        },
        () => {
            alert("no airport")
        })

        let planeOfcoDrop = dropdownGenerator(planeOfChoice, "choose plane for flight", "choose plane")

        this.api.getPlanes(planes => {
            this.#planes = planes
            planeOfcoDrop.set(planes.map(item => item.Manufacturer.concat(" " + item.Model)), planeName => this.#setPlaneId(planeName))
        },() => {
            alert("no plane")
        })

        inputTaker(pricePerTicket, "price per seat", "enter price", dom => this.#inputModelSetter(dom.querySelector("input"), "PricePerSeat"), null, "number")

        inputTaker(depertTime, "time of departure", "enter time", dom => this.#inputModelSetter(dom.querySelector("input"), "DepartureTime"), null, "time")

        inputTaker(arivalTime, "time of arrival", "enter time", dom => this.#inputModelSetter(dom.querySelector("input"), "ArrivalTime"), null, "time")

        inputTaker(departDate, "date of departure", "enter date", dom => this.#inputModelSetter(dom.querySelector("input"), "DepartureDate"), null, "date")


        this.domElement.querySelector(".primary-btn").onclick = () => this.#save()

        openButton(this.#validateData(), this.domElement.querySelector("button"))

    }

    /**
     * 
     * @param {HTMLInputElement} inputDom 
     * @param {string} prop 
     */
    #inputModelSetter(inputDom, prop){
        inputDom.oninput = () => {
            if(!isInputEmpty(inputDom)){
                inputErrloggerRemover(inputDom)
            }else{
                inputErrLogger(inputDom, "this field cannot be empty")
            }
            this.#flight[prop] = inputDom.value
            openButton(this.#validateData(), this.domElement.querySelector("button"))
        }
    }

    #getAndSetAirprtID(airportName, prop){
        let airport = this.#aiports.find(item => item.Name == airportName)

        if(airport == null) return this.float.dialog(this.float.DIALOG_WARN, "no airport cannot be found")

        if(prop == "DepartureAirportId"){
            this.#flight.DepartureAirportId = airport.Id
        }else{
            this.#flight.ArrivalAirportId = airport.Id
        }

        if(this.#flight.DepartureAirportId == this.#flight.ArrivalAirportId) this.float.dialog(this.float.DIALOG_WARN, "departure airport and arrival airport cannot be the same")
        
        openButton(this.#validateData(), this.domElement.querySelector("button"))
    }

    #setPlaneId(planeName){
        const plane = this.#planes.find(item => item.Manufacturer.concat(" " + item.Model) == planeName)
        if(plane == null) return alert("failed")
        this.#flight.PlaneId = plane.Id
        this.#flight.Capacity = plane.SeatCapacity
        this.#flight.RemainingSeats = this.#flight.Capacity

        openButton(this.#validateData(), this.domElement.querySelector("button"))
    }

    #validateData(){
        let valid = true

        for(const key in this.#flight){
            if((this.#flight[key] == undefined || this.#flight[key] == "") && key != "Id"){
                valid = false
                break
            }
        }
        return valid
    }

    #save(){
        const bLoad = buttonLoad(this.domElement.querySelector("button"), "creating flight..")

        this.api.createFlight(this.#flight, res => {
            bLoad.stopButtonLoad(()=> {
                if(res == "success"){
                    const msg = `flight from ${this.#aiports.find(item => item.Id == this.#flight.DepartureAirportId).Name.toUpperCase()} to ${this.#aiports.find(item => item.Id == this.#flight.ArrivalAirportId).Name.toUpperCase()} has been created successfully`
                    this.float.dialog(this.float.DIALOG_SUCCESS, msg, "creation success", () => this.#toFlights())
                }else{
                    this.float.dialog(this.float.DIALOG_ERROR, res)
                }
            })
        })
    }

    #toFlights(){
        this.acquiredController.changeView("flights")
    }
}