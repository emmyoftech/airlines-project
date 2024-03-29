import AirportModel from "../../interfaces/airportModel.js"
import BookingModel from "../../interfaces/bookingModel.js"
import FlightModel from "../../interfaces/flightModel.js"
import PlaneModel from "../../interfaces/planeModel.js"
import User from "../../interfaces/user.js"
import FloatController from "../../services/FLoatController.js"
import { env } from "../../services/env.js"
import { openButton } from "../../services/library.js"

export default class BookingCreate extends FloatController {
    #buisness_seats = new Array()

    #community_seats = new Array()

    #user = new User()

    #flight = new FlightModel()

    #plane = new PlaneModel()

    #dp_Airport = new AirportModel()

    #ar_Airport = new AirportModel()

    #booking = new BookingModel()

    #isBuisnessClass = false

    /**
     * 
     * @param { User ! number } userCred 
     * @param { FlightModel } flightMod 
     */
    constructor(userCred, flightMod){
        super("Booking=booking-create", (dom) => {
            this.#getUser(userCred, dom)
            dom.querySelector("#booking-ret").onclick = ()=> this.floatEnd()
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
                    this.#getPlaneAndSeats(fl_dom)
                }else{
                    this.dialog(this.DIALOG_ERROR, "failed to find user data", "authentication failed")
                }
            }, msg => {
                this.dialog(this.DIALOG_ERROR, msg)
            })
        }else{
            this.#user = userInfo
            this.#getPlaneAndSeats(fl_dom)
        }
    }

    /**
     * 
     * @param {HTMLElement} fl_dom 
     */
    #getPlaneAndSeats(fl_dom){
        this.api.getPlanes(planes => {
            this.#plane = planes.find(item => item.Id == this.#flight.PlaneId)
            if(this.#plane != null){
                this.api.getBuisnessSeats(this.#plane.Id, res => {
                    if(typeof res == "string"){
                        this.dialog(this.DIALOG_ERROR, res)
                    }else{
                        this.#buisness_seats = res
                        this.api.getCommunitySeats(this.#plane.Id, res => {
                            if(typeof res == "string"){
                                this.dialog(this.DIALOG_ERROR, res)
                            }else{
                                this.#community_seats = res
                                this.api.getAirports(airports => {
                                    this.#ar_Airport = airports.find(item => item.Id == this.#flight.ArrivalAirportId)
                                    this.#dp_Airport = airports.find(item => item.Id == this.#flight.DepartureAirportId)

                                    if(this.#ar_Airport && this.#dp_Airport){
                                        this.#openStage("one", fl_dom)

                                        fl_dom.querySelector("#flight-title").textContent = `${this.#dp_Airport.Location} to ${this.#ar_Airport.Location}`
                                        console.log("helo")
                                    }else{
                                        this.dialog(this.DIALOG_ERROR, "no airport matches flight")
                                    }
                                }, msg => {
                                    this.dialog(this.DIALOG_ERROR, msg)
                                })
                            }
                        })
                    }
                })
            }else{
                this.dialog(this.DIALOG_ERROR, "no plane matches flight")
            }
        }, msg => this.dialog(this.DIALOG_ERROR, msg))
    }

    /**
     * 
     * @param {string} stage 
     * @param {HTMLElement} dom
     */
    #openStage(stage, dom){
        dom.querySelectorAll(".booking-stage").forEach(item => item.style.display = "none")
        const newStageDom = dom.querySelector(".".concat(stage))

        gsap.fromTo(newStageDom, {display: "none", scale: .3, opacity: 0}, {display: "flex", scale: 1, opacity: 1, duration: .4}).then(() => {
            switch(stage){
                case "one": this.#stage1(newStageDom)
                break
                case "two": this.#stage2(newStageDom)
                break
                case "three": this.#stage3(newStageDom)
                break
                default: this.#stage4(newStageDom)
            }
        })
    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #stage1(dom){
        const 
        dp_air_Dom = dom.querySelector("#dp_air"),
        ar_air_Dom = dom.querySelector("#ar_air"),
        priceDom = dom.querySelector("#price"),
        dp_time = dom.querySelector("#dp_time"),
        dp_date = dom.querySelector("#dp_date"),
        seatsDom = dom.querySelector("#seats")

        dp_air_Dom.textContent = this.#dp_Airport.Name
        ar_air_Dom.textContent = this.#ar_Airport.Name
        priceDom.textContent = env.nairaSign.concat(" " + this.#flight.PricePerSeat)
        dp_time.textContent = this.#flight.DepartureTime
        dp_date.textContent = this.#flight.DepartureDate
        seatsDom.textContent = this.#flight.RemainingSeats

        dom.querySelector("button").onclick = ()=> this.#openStage("two", dom.closest(".booking-create-float"))
    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #stage2 = (dom) => dom.querySelectorAll("button").forEach(btn => {
        btn.onclick = ()=> {
            if(btn.classList.contains("primary-btn")){
                this.#isBuisnessClass = true
            }
            this.#openStage("three", dom.closest(".booking-create-float"))
        }
    })

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #stage3(dom){
        const listHold = dom.querySelector(".seatlist"),
        buton = listHold.parentElement.querySelector("button")

        for(const seat of this.#isBuisnessClass ? this.#buisness_seats : this.#community_seats){
            populateseat(seat, num => {
                this.#booking.SeatNumber = num
                this.#booking.Price = this.#isBuisnessClass ? this.#flight.PricePerSeat + ((this.#flight.PricePerSeat * 30) / 100) : this.#flight.PricePerSeat
                openButton(true, buton)
            })
        }

        function populateseat(seatClass, run){
            const seat = document.createElement("span")
            seat.className = `seat ${seatClass.occupied ? "fade": ""}`
            if(seatClass.seatNumber < 10){
                seat.textContent = "00"+seatClass.seatNumber 
            }else if(seatClass.seatNumber < 100){
                seat.textContent = "0"+seatClass.seatNumber 
            }else{
                seat.textContent = seatClass.seatNumber 
            }
            seat.onclick = ()=> {
                seat.classList.add("active")
                run(seatClass.seatNumber)
            }
            listHold.append(seat)
        }

        buton.onclick = () => this.#openStage("four", dom.closest(".booking-create-float"))
        openButton(false, buton)
    }

    /**
     * 
     * @param {HTMLElement} dom 
     */
    #stage4(dom){
        const
        flghtDom = dom.querySelector(".flight"),
        priceDom = dom.querySelector(".price"),
        flghtTypeDom = dom.querySelector(".flight-type"),
        seatNumberDom = dom.querySelector(".seat-number")

        this.#booking.FlightId = this.#flight.Id
        this.#booking.UserId = this.#user.Id
        this.#booking.PaymentVerfied = true


        flghtDom.textContent = `${this.#dp_Airport.Location} to ${this.#ar_Airport.Location}`
        priceDom.textContent = `${env.nairaSign} ${this.#booking.Price}`
        flghtTypeDom.textContent = this.#isBuisnessClass ? "buisness class" : "community class"
        seatNumberDom.textContent = this.#booking.SeatNumber

        dom.querySelector("button").onclick = ()=> this.#save()
    }

    #save(){
        this.floatEnd(() => {
            this.floatLoad("creating booking...")
            this.api.createBooking(this.#booking, res => {
                this.floatEnd(() => {
                    if(res == "success"){
                        const msg = `you have been successfully been booked for ${this.#dp_Airport.Location.toUpperCase()} to ${this.#ar_Airport.Location.toUpperCase()} flight`
                        this.dialog(this.DIALOG_SUCCESS, msg)
                    }else{
                        this.dialog(this.DIALOG_ERROR, res)
                    }
                })
            })
        })
    }
}