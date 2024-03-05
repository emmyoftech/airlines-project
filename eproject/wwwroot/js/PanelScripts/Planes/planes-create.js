import {Controller} from "../../services/Controller.js"
import { env } from "../../services/env.js"
import { CodeGenerator, buttonLoad, dropdownGenerator, inputTaker, navBackgenerator, openButton } from "../../services/library.js"
import PlaneModel from "../../interfaces/planeModel.js"
import { inputErrLogger, inputErrloggerRemover, isInputEmpty } from "../../services/validation.js" 
import Planes from "./planes.js"

export default class PlanesCreate extends Controller{
    #plane = new PlaneModel()

    /**
     * 
     * @param {HTMLElement} parentDom 
     */
    constructor(parentDom){
        super(parentDom, "panel=planes-create=Planes", ()=> {
            navBackgenerator(this.domElement.querySelector(".nav"), "create new plane", ()=> this.#toPlanes())
            this.#starter()
        })
        this.#plane.Code = CodeGenerator(4)
        this.#plane.SeatCapacity = 150
        this.#plane.YearOfManufacture = 2020
        this.#plane.Status = env.planeStates[0]
    }

    #starter (){
        const
        planeModellabel = this.domElement.querySelector(".planeModel"),
        planeManufacturerlabel = this.domElement.querySelector(".planeManufacturer"),
        planeYearOfManulabel = this.domElement.querySelector(".planeYearOfManu"),
        planeSeatCapacity = this.domElement.querySelector(".planeSeatCapacity"),
        planeAirport = this.domElement.querySelector(".planeAirport")

        inputTaker(planeManufacturerlabel, "name of manufacturer", "enter name of manufaturer", dom => {
            const input = dom.querySelector("input")
            input.oninput = () => this.#setPlaneProperty(input, "Manufacturer")
        })

        inputTaker(planeModellabel, "model", "enter plane model", dom=> {
            const input = dom.querySelector("input")
            input.oninput = () => this.#setPlaneProperty(input, "Model")
        })

        dropdownGenerator(planeYearOfManulabel, "year of manufacturing", "choose year", 2020)
        .set(env.years.reverse(), num => {
            this.#plane.YearOfManufacture = parseInt(num)
        })

        let airportsDropdown = dropdownGenerator(planeAirport, "choose airport", "choose airport", null,)

        this.api.getAirports(airports => {
            const allowedAirports = airports.filter(item => item.AvailableRunways > 0 && !item.Closed)
            if(allowedAirports.length > 0){
                airportsDropdown.set(allowedAirports.map(item => item.Name), selectedPort => {
                    this.#plane.AirportId = airports.find(item => item.Name == selectedPort).Id
                })
            }else{
                this.float.dialog(this.float.DIALOG_WARN, "there are no airports with available runways to assign a plane", "no airport runway")
            }
        }, () => {
            this.float.dialog(this.float.DIALOG_WARN, "there are no airports to assign a plane", "no airport")
        })

        inputTaker(planeSeatCapacity, "seat capacity", "enter number of seats", dom => {
            const input = dom.querySelector("input")
            input.oninput = () => this.#setPlaneProperty(input, "SeatCapacity")
        }, 150, "number")

        let subBtn = this.domElement.querySelector("#subtn")

        openButton(this.#validateInputs(), subBtn)

        subBtn.onclick = () => this.#save()
    }

    /**
     * 
     * @param {HTMLInputElement} inputDom 
     * @param {string} property 
     */
    #setPlaneProperty(inputDom, property){
        if(isInputEmpty(inputDom)){
            inputErrLogger(inputDom, "this field cannot be empty")
        }else{
            inputErrloggerRemover(inputDom)
        }
        this.#plane[property] = inputDom.value
        openButton(this.#validateInputs(), this.domElement.querySelector("#subtn"))
    }

    #validateInputs(){
        let result = true
        for(const key in this.#plane){
            if(key != "Id" && this.#plane[key] == undefined){
                result = false
                break;
            }
        }
        return result
    }

    #save(){
        const fLoad = this.float.floatLoad("creating plane")
        this.api.createPlane(this.#plane, res => {
            if(res.includes("success")){
               let planeCode = res.split("=")[1]
               fLoad.changeText("setting seats")
                this.api.generateSeats(planeCode, subres => {
                    this.float.floatEnd(() => {
                        if(subres == "success"){
                            let msg =  `(${this.#plane.Manufacturer} ${this.#plane.Model}) has successfully been created`

                            this.float.dialog(this.float.DIALOG_SUCCESS, msg, "creation success", () => this.#toPlanes())
                        }else{
                            this.float.dialog(this.float.DIALOG_ERROR, res, "failed to create")
                        }
                    })
                })
            }else{
                this.float.dialog(this.float.DIALOG_ERROR, res)
            }
        })
    }

    #toPlanes(){
        this._destroy(() => {
            this.acquiredController.currViewController = new Planes(this.parentDomELement)
            this.acquiredController.currViewController.acquiredController = this.acquiredController
        })
    }
}