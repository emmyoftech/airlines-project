import AirportEdit from "../../Floats/Airport/airport-edit.js";
import AirportModel from "../../interfaces/airportModel.js";
import { Controller } from "../../services/Controller.js";
import { shownodataDom } from "../../services/library.js";
import AirportCreate from "./airport-create.js";

export default class Airport extends Controller{

    #data_dom_kv = new Map()
    
    #selected_to_delete = new Array()

    constructor(parentDom, onInit = null){
        super(parentDom, "panel=airport=Airport", ()=> {
            if(onInit) onInit()
            this.#populateTabble()
            this.domElement.querySelector("#toceate").onclick = () => {
                this._destroy(() => {
                    this.acquiredController.currViewController = new AirportCreate(this.parentDomELement)
                    this.acquiredController.currViewController.setController(this.acquiredController)
                })
            }
            this.domElement.querySelector("#search-put").oninput = (e)=>{
                const value = e.target.value
                this.#data_dom_kv.forEach((domValue , key) => {
                    if(key.includes(value.trim())){
                        gsap.fromTo(domValue, {x: -100, opacity: 0, display: "none"}, {x: 0, display: "flex", opacity: 1, duration: .1})
                    }else{
                        gsap.fromTo(domValue, {x: 0, display: "flex", opacity: 1}, {x: -100, opacity: 0, display: "none", duration: .1})
                    }
                })
            
            }
            this.domElement.querySelector("#select-all").onclick = (e) =>  {
                if(this.#data_dom_kv.size < 1){
                    return this.float.dialog(this.float.DIALOG_WARN, "no airport to select", "no airport")
                }
                const iChild = e.target.querySelector("i")
                if(iChild.className.includes("fa-arrow-pointer")){
                    this.#openmultipleAction()
                    iChild.classList.replace("fa-arrow-pointer", "fa-circle-xmark")
                }else{
                    iChild.classList.replace("fa-circle-xmark", "fa-arrow-pointer")
                    this.domElement.querySelectorAll(".check").forEach(item => item.className = "check")
                    this.#selected_to_delete = new Array()
                    gsap.to(this.domElement.querySelector(".bottomBtnAction"), {x: -100, opacity: 0, display: "none", duration: .2})
                }
            }
            this.domElement.querySelector("#delete-all").onclick = () => this.#deleteAll()
        })
    }     
    
    
    #populateTabble(){
        this.float.floatLoad("getting airports...")
        this.api.getAirports(airports => {
        this.float.floatEnd()
            let count = 0
            for(const airport of airports.reverse()){
                this.#createAirportListRow(airport, count)
                count++ 
            }
        }, () => {
             this.#showNoData()
        })
    }

    /**
     * @param {AirportModel} airport 
     */
    #createAirportListRow(airport, count){
        const
        row = document.createElement("div"),
        inner = `
        <span class="cell"><span class="check"></span></span>
        <span class="cell">${airport.Name}</span>
        <span class="cell">${airport.Location}</span>
        <span class="cell ${airport.Closed ? "cls": "opn"}">${airport.Closed ? "closed": "open"}</span>
        <span class="cell">
            <span id="edit-row"><i class="fa-regular fa-pen-to-square"></i></span>
            <span id="delete-row"><i class="fa-regular fa-trash-can" title="delete all"></i></span>
        </span>
        `
        row.className = "row"
        row.innerHTML = inner
        this.domElement.querySelector(".lists").append(row)
        gsap.from(row, {x: 100, opacity: 0, duration: count * .2,})
        this.#data_dom_kv.set(airport.Name, row)

        row.querySelector(".check").onclick = (e) => {
            if(e.target.classList.contains("active")){
                const pos = this.#selected_to_delete.findIndex(item => airport.Id == item.Id)
                this.#selected_to_delete.splice(pos, 1)
                e.target.classList.remove("active")
            }else{
                this.#selected_to_delete.push(airport)
                e.target.classList.add("active")
            }
        }

        row.querySelector("#edit-row").onclick = (e)=> new AirportEdit(airport, ()=> this.#reload())
        row.querySelector("#delete-row").onclick = ()=> {
            this.float.askQuestion(`are you sure you want to delete ${airport.Name.toUpperCase()}`, () => {
                this.float.floatLoad("deleting " + airport.Name.toUpperCase())
                this.api.deleteAirport(airport.Id, res => {
                    this.float.floatEnd(() => {
                        if(res == "success"){
                            this.float.dialog(
                                this.float.DIALOG_SUCCESS,
                                 `${airport.Name.toUpperCase()} has been deleted successfully`,
                                 null, () => {
                                    gsap.to(row, {x: -100, opacity: 0, duration: .2}).then(() => {
                                        row.remove()
                                    })
                                 }
                                )
                        }else{
                            this.float.dialog(this.float.DIALOG_ERROR, res, "failed to delete")
                        }
                    })
                })
            })
        }
    }

    #openmultipleAction (){ 
       const par = this.domElement.querySelector(".bottomBtnAction")
       let anim =  gsap.fromTo(par, 
        {
            x: -100,
            opacity: 0,
            display: "none"
        },
        {
            x: 0,
            opacity: 1,
            display: "flex",
            duration: .1
        }
        )
        this.domElement.querySelectorAll(".check").forEach(item => item.classList.add("show"))
        par.querySelector("#del").onclick = ()=> {
            if(this.#selected_to_delete.length > 0){
                this.float.floatLoad("deleting airports data..")
                this.api.deleteMultipleAirports(this.#selected_to_delete, res => {
                    this.float.floatEnd(() => {
                        if(res == "success"){
                            this.float.dialog(this.float.DIALOG_SUCCESS,
                                 "airports data have been deleted successfully",
                                 null,
                                 () => {
                                    this.#data_dom_kv.forEach((domValue, key) => {
                                        if(this.#selected_to_delete.findIndex(item => item.Name == key) > -1){
                                            domValue.remove()
                                            this.#data_dom_kv.delete(key)
                                        }
                                    })
                                    this.domElement.querySelectorAll(".check").forEach(item => item.className = "check")
                                    anim.reverse()
                                    this.#selected_to_delete = new Array()
                                 }
                                 )
                        }else{
                            this.float.dialog(this.float.DIALOG_ERROR, res)
                        }
                    })
                })
            }
        }
    }

    #deleteAll(){
        if(this.#data_dom_kv.size > 0){
            this.float.askQuestion("are you sure you want to delete all airport data", () => {
                this.float.floatLoad("deleting all airport data")
                this.api.deleteMultipleAirports(null, res => {
                    this.float.floatEnd(() => {
                        if(res == "success"){
                            this.#data_dom_kv.clear()
                            this.#showNoData()
                        }else{
                            this.float.dialog(this.float.DIALOG_ERROR, res)
                        }
                    })
                })
            })
        }else{
            this.float.dialog(this.float.DIALOG_WARN, "there are no airports to delete", "no airport data")
        }
    }

    #showNoData (){
        const par = this.domElement.querySelector(".airport-list"),
        table = this.domElement.querySelector(".table")
        gsap.to(table, {scale: .3, opacity: 0, display: "none", duration: .2}).then(() => {
            shownodataDom(par, "no airport created")
        })
    }

    #reload(){
        this.domElement.querySelector(".lists").innerHTML = ""
        this.#populateTabble()
    }
}