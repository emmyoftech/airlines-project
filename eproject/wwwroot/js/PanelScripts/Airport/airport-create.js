import AirportModel from "../../interfaces/airportModel.js";
import { Controller } from "../../services/Controller.js";
import { env } from "../../services/env.js";
import { buttonLoad, dropdownGenerator, inputLoad, inputTaker, navBackgenerator, numSetter, openButton } from "../../services/library.js";
import { inputErrLogger, inputErrloggerRemover, isInputEmpty } from "../../services/validation.js"
import Airport from "./airports.js";

export default class AirportCreate extends Controller{
    airportName

    numOfRunways = 1

    location

    nameExists = false

    constructor(parentDom, onInit = null){
        super(parentDom, "panel=airport-create=Airport", ()=> {
            if(onInit) onInit()

            const 

            label = this.domElement.querySelector("#form-dropdown"),

            label2 = this.domElement.querySelector("#num-setter"),
        
            label3 = this.domElement.querySelector("#textinp")
    
            inputTaker(label3, "airport name", "enter airport name", (dom) => this.#airportNameSet(dom))
            
            numSetter(label2, "how many runways?", num => {
                this.numOfRunways = num
            })

            let dropdown = dropdownGenerator(label, "choose location", "location")

            this.api.getAirports(airports => {
                const 
                usedairports = airports.map(item => item.Location),
                free_airports = env.locations.filter(item => usedairports.includes(item) != true)
                dropdown.set(free_airports, loc => {
                    this.location = loc
                    openButton(this.#validateInputs, this.domElement.querySelector("button"))
                })
            }, () => {
                dropdown.set(env.locations, loc => {
                    this.location = loc
                    openButton(this.#validateInputs, this.domElement.querySelector("button"))
                })
            })

            this.domElement.querySelector("button").onclick = (e) => this.#createAirport(e)


            navBackgenerator(this.domElement.querySelector(".nav"), "create new airport", ()=> this.#toAirport())
            openButton(false, this.domElement.querySelector("button"))
        })
    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #airportNameSet(dom){
        const input = dom.querySelector("input")

        input.oninput = () => {
            this.airportName = input.value
            inputErrloggerRemover(input)
            openButton(this.#validateInputs(), this.domElement.querySelector("button"))
        }

        input.onblur = () => {
            let inLoad = inputLoad(input)

            this.api.getAirports(airports => {
                for(const airport of airports){
                    if(airport.Name == input.value.toLowerCase()){
                        inputErrLogger(input, "there is already an airport of this name")
                        this.nameExists = true
                        break
                    }
                }
                openButton(this.#validateInputs(), this.domElement.querySelector("button"))
                inLoad()
            }, () => {
                inLoad()
            })
        }
    }

    #createAirport (e){
        const newAirport = new AirportModel(),
        form = this.domElement.querySelector("form"),
        bload = buttonLoad(e.target, "creating airport..")

        newAirport.Name = this.airportName.toLowerCase()
        newAirport.Location = this.location
        newAirport.NumberOfRunways = parseInt(this.numOfRunways)
        newAirport.AvailableRunways = newAirport.NumberOfRunways
        newAirport.Closed = false

        openButton(false, form)

        this.api.createAirport(newAirport, res => {
            const dialogTitle = "airport creation"
            let msg = ""
            bload.stopButtonLoad(() => {
                if(res == "success"){
                    msg = `${this.airportName.toUpperCase()} airport has been created successfully`
                    this.float.dialog(this.float.DIALOG_SUCCESS, msg, dialogTitle, () => this.#toAirport())
                }else{
                    msg = `Oops, sorry seems we had an issue creating ${this.airportName.toUpperCase()} airport`
                    this.float.dialog(this.float.DIALOG_ERROR, msg, dialogTitle)
                }
                openButton(true, form)
            })
        })
    }

    #validateInputs(){
        const airportNameInput = this.domElement.querySelector("#textinp").querySelector("input"),
        locationInput = this.domElement.querySelector("#form-dropdown").querySelector("input")

        return !isInputEmpty(airportNameInput) && !isInputEmpty(locationInput) && this.nameExists == false
    }

    #toAirport = () => this._destroy(() => this.acquiredController.changeView("airports"))
}