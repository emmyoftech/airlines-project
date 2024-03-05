import FlightModel from "../../interfaces/flightModel.js"
import PlaneModel from "../../interfaces/planeModel.js"
import User from "../../interfaces/user.js"
import FloatController from "../../services/FLoatController.js"

export default class BookingCreate extends FloatController {
    #buisness_seats = new Array()

    #community_seats = new Array()

    #user = new User()

    #flight = new FlightModel()

    #plane = new PlaneModel()

    /**
     * 
     * @param { User ! number } userCred 
     * @param { FlightModel } flightMod 
     */
    constructor(userCred, flightMod){
        super("Booking=booking-create", (dom) => {
            this.#getUser(userCred, dom)
        })
        this.#flight = flightMod
    }

    /**
     * 
     * @param {User|number} userInfo 
     * @param {HTMLElement} fl_dom 
     */
    #getUser(userInfo, fl_dom){
        if(typeof userInfo == "number"){
            this.api.getUsers(users => {
                this.#user = users.find(user => user.Id == userInfo)

                if(this.#user != null){
                    fl_dom.querySelector("h1").textContent = this.#user.FirstName
                }else{
                    alert("no user")
                }
            }, msg => {
                alert(msg)
            })
        }else{
            this.#user = userInfo
        }
    }

    #getPlaneAndSeats(){
        this.api.getPlanes(planes => {
            this.#plane = planes.find(item => item.Id == this.#flight.PlaneId)
            if(this.#plane != null){
                this.api.getBuisnessSeats(this.#plane.Id, res => {
                    this.#buisness_seats = typeof res "string" ? 
                    this.api.getCommunitySeats(this.#plane.Id, res => {
                         
                    })
                })
            }else{
                alert("no plane found")
            }
        }, msg => alert(msg))
    }
}