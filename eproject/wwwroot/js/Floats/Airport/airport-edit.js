import AirportModel from "../../interfaces/airportModel.js";
import FloatController from "../../services/FLoatController.js";
import { env } from "../../services/env.js";
import { inputErrLogger, inputErrloggerRemover, isInputEmpty } from "../../services/validation.js"
import  { authMainError } from "../../AuthScripts/authService.js";
import { buttonLoad, dropdownGenerator, inputTaker, numSetter, openButton} from "../../services/library.js";

export default class AirportEdit extends FloatController{
    #airport

    #savedChanges = false
    #onSaved

    /**
     * 
     * @param {AirportModel} airportData 
     * @param {Function} onsaved 
     */
    constructor(airportData, onsaved = null){
        super("Airport=airport-edit", dom => {
            this.#starter(dom, onsaved)
            this.#setTitleName(dom, airportData.Name)
        })
        this.#airport = airportData
        this.#onSaved = onsaved
    } 

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #starter(dom){
        const 
        airportnameLabel = dom.querySelector(".airport-name"),
        airportNumLabel = dom.querySelector(".airport-num"),
        airportdroplocLabel = dom.querySelector(".airport-loc"),
        saveButton = dom.querySelector("#subtn"),
        clsbtn = dom.querySelector("#clsbtn")

        inputTaker(airportnameLabel, "new airport name", "enter new name", domCon => {
            let inputDom = domCon.querySelector("input")
            inputDom.oninput = () => this.#verifyAirportNamOnInput(inputDom, dom)
        }, this.#airport.Name)

        numSetter(airportNumLabel, "number of runways", num => {
            this.#airport.NumberOfRunways = num
        }, this.#airport.NumberOfRunways)


        let drop = dropdownGenerator(airportdroplocLabel, "new location", "choose new location", this.#airport.Location)

        this.api.getAirports(airports => {
            const freeLocations = env.locations.filter(item => airports.findIndex(subItem => subItem.Location == item) == -1 || item == this.#airport.Location)
            drop.set(freeLocations, selected => this.#airport.Location = selected)
        }, msg => {
            this.floatEnd(() => {
                this.dialog(this.DIALOG_ERROR, msg, "no airport data")
            })
        })

        saveButton.onclick = (e)=> this.#save(e.target, dom)

        clsbtn.onclick = ()=> this.floatEnd(() => this.#savedChanges ? this.#onSaved() : null)

        openButton(false, saveButton)
    }

    /**
     * 
     * @param {HTMLElement} dom 
     * @param {string} name 
     */
    #setTitleName(dom, name){
        dom.querySelector("#airport-title-name").textContent = name
    }

    /**
     * 
     * @param {HTMLInputElement} inputDom 
     * @param {HTMLElement} dom 
     */
    #verifyAirportNamOnInput(inputDom, dom){
        const subbtn = dom.querySelector("#subtn")

        if(isInputEmpty(inputDom)){
            inputErrLogger(inputDom, "this field cannot be empty")
            openButton(false, subbtn)
        }else{
            inputErrloggerRemover(inputDom)
            openButton(true, subbtn)
        }
        this.#airport.Name = inputDom.value
    }

    /**
     * 
     * @param {HTMLButtonElement} button 
     * @param {HTMLElement} parentDom 
     */
    #save(button, parentDom){
        let bLoad = buttonLoad(button)

        this.api.editAirport(this.#airport, res => {
            bLoad.stopButtonLoad(() => {
                if(res == "success"){
                    openButton(false, button)
                    this.#savedChanges = true
                    authMainError(parentDom, "changes have been successfully saved", true)
                }else{
                    authMainError(parentDom, res)
                }
            })
        })
    }
}