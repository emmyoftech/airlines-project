import PlaneModel from "../../interfaces/planeModel.js";
import { Controller } from "../../services/Controller.js";
import { env } from "../../services/env.js";
import { shownodataDom } from "../../services/library.js";
import PlanesCreate from "./planes-create.js";

export default class Planes extends Controller{

    #planeMap = new Map()

    constructor(parentDom, onInit=null){
        if(onInit != null) onInit()

        super(parentDom, "panel=planes=Planes", () => {            
            this.api.getPlanes(planes => {
                this.#poppulateTable(planes.reverse())
            }, msg => {
                shownodataDom(this.domElement.querySelector(".planes-list"), msg)
            })
            this.#tocreate()
        })
    }

    /**
     * 
     * @param {PlaneModel[]} planes 
     */
    #poppulateTable(planes){
        gsap.to(this.domElement.querySelector(".table"), {opacity: 1, display: "flex", duration: .3}).then(() => {
            let count = 0
            for(const plane of planes){
                this.#createRow(plane, count)
                count++
            }
            this.domElement.querySelector("#search-put").oninput = (e) => this.#serachFilter(e.target)
            this.domElement.querySelector("#delete-all").onclick = ()  => this.#deleteAll()
        })
    }

    /**
     * 
     * @param {PlaneModel} plane 
     * @param {number} count
     */
    #createRow(plane, count){
        const 
        row = document.createElement("div"),
        parDom = this.domElement.querySelector(".lists") 

        row.className = "row"
        row.innerHTML = `
            <span class="cell"><span class="check"></span></span>
            <span class="cell">${plane.Manufacturer + " " + plane.Model}</span>
            <span class="cell">${plane.Code}</span>
            <span class="cell">${plane.Status}</span>
            <span class="cell">
                <span id="delete-row"><i class="fa-regular fa-trash-can"></i></span>
            </span>
        `
        parDom.append(row)
        gsap.from(row, {x: 100, opacity: 0, duration: count * .2})
        row.querySelector("#delete-row").onclick = () => this.$deleteRow(plane)
        this.#planeMap.set(plane, row)
    }

    /**
     * 
     * @param {HTMLInputElement} inputDom 
     */
    #serachFilter(inputDom){
        this.#planeMap.forEach((domValue, planeObj) => {
            if(planeObj.Manufacturer.toLowerCase().includes(inputDom.value.toLowerCase())){
                gsap.fromTo(domValue, {x: -100, opacity: 0, display: "none"}, {x: 0, display: "flex", opacity: 1, duration: .1})
            }else{
                gsap.fromTo(domValue, {x: 0, display: "flex", opacity: 1}, {x: -100, opacity: 0, display: "none", duration: .1})
            }
        })
    }

    /**
     * 
     * @param {PlaneModel} plane
     */
    $deleteRow(plane){
        if(plane.Status != env.planeStates[1]){
            this.float.askQuestion(`are you sure you want to delete (${plane.Manufacturer} ${plane.Model})`, () => {
                let fload = this.float.floatLoad(`deleting ${plane.Manufacturer + " " + plane.Model}`)
    
                this.api.deletePlane(plane.Id, res => {
                    if(res == "success"){
                        fload.changeText("deleting seats..")
                        
                        this.api.deleteSeats(plane.Id, res => {
                            if(res != "success"){
                                this.float.floatEnd(() => this.float.dialog(this.float.DIALOG_ERROR, res))
                            }else{
                                this.float.floatEnd(() => this.float.dialog(
                                    this.float.DIALOG_SUCCESS, 
                                    `(${plane.Manufacturer} ${plane.Model}) has been deleted successfully`,
                                    "delete success",
                                    () => this.#ondeleteRowSuccess(plane.Id)
                                    ))
                            }
                        })
                    }else{
                        this.float.floatEnd(() => this.float.dialog(this.float.DIALOG_ERROR, res))
                    }
                })
            })
        }else{
            this.float.dialog(this.float.DIALOG_WARN, "you can't delete plane while in flight")
        }
    }

    /**
     * 
     * @param {number} planeId 
     */
    #ondeleteRowSuccess(planeId){
        this.#planeMap.forEach((domValue, planeObj) => {
            if(planeObj.Id == planeId){
                gsap.to(domValue, {x: -100, opacity: 0, duration: .1}).then(() => domValue.remove())
            }
        }) 
    }

    #deleteAll(){
        let allClear = true
        for(let plane of this.#planeMap.keys()){
            if(plane.Status == env.planeStates[1]){
                allClear = false
                break
            }
        }

        if(allClear){
            this.float.askQuestion("are you sure you want to delete all planes", () => {
                this.float.floatLoad("deleting all planes")
    
                this.api.deleteAllPlane(res => {
                    this.float.floatEnd(() => {
                        if(res == "success"){
                            this.float.dialog(this.float.DIALOG_SUCCESS, "all planes has been deleted successfully", null, () => this.#removeAll())
                        }else{
                            this.float.dialog(this.float.DIALOG_ERROR, res, "failed to empty planes database")
                        }
                    })
                })
            })
        }else{
            this.float.dialog(this.float.DIALOG_WARN, "you cant delete all planes while some are in flight")
        }
    }

    #tocreate(){
        this.domElement.querySelector("#toceate").onclick = () => this._destroy(() => {
            this.acquiredController.currViewController = new PlanesCreate(this.parentDomELement)
            this.acquiredController.currViewController.acquiredController = this.acquiredController
        })
    }

    #removeAll(){
        this.domElement.querySelector(".table").remove()
        this.#planeMap.clear()
        shownodataDom(this.domElement.querySelector(".planes-list"), "no planes in server")
    }
}