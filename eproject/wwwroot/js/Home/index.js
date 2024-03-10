import Api from "../services/api.js"
import { env } from "../services/env.js"
import NavBarComponent from "../shared/navbar.js"
import BookingCreate from "../Floats/Booking/booking-create.js"
import Storage from "../services/storage.js"
import Float from "../services/float.js"
import { buttonLoad, inputTaker } from "../services/library.js"
import {authMainError} from "../AuthScripts/authService.js"
import Message from "../interfaces/messageModule.js"

const main = document.querySelector("main"),

nav = new NavBarComponent(main),

api = new Api(),

storage = new Storage(),

float = new Float()

populate_flight()
setupContact()



function populate_flight(){
    const
    container = document.querySelector(".list"),
    loader = container.querySelector(".loader"),
    table = container.querySelector(".table")

    let airports = new Array(),
    filghts = new Array()

    api.getAirports(airportsDb => {
        airports = airportsDb
        api.getFlights(filghtsDb => {
            filghts = filghtsDb
            setFlights()
        }, () => alert("fail flights"))
    }, () => alert("fail airports"))

    function setFlights (){
        if(filghts.length > 0 && airports.length > 0){
            loader.remove()
            gsap.fromTo(table, {scale: .1, opacity: 0, display: "none"}, {scale: 1, opacity: 1, display: "flex", duration: .5}).then(() => {
                const tableRow = table.querySelector(".table-body")

                for(const flight of filghts){
                    const row = document.createElement("div"),
                    dp_airport = airports.find(item => item.Id == flight.DepartureAirportId),
                    ar_airport = airports.find(item => item.Id == flight.ArrivalAirportId)

                    row.className = "b-row"
                    row.innerHTML = `
                        <span class="cell">${dp_airport.Location} to ${ar_airport.Location}</span>
                        <span class="cell">${env.nairaSign.concat(" " + flight.PricePerSeat)}</span>
                        <span class="cell">${flight.DepartureDate}</span>
                        <span class="cell">${flight.RemainingSeats}</span>
                        <span class="cell">
                            <button>book</button>
                        </span>
                    `

                    tableRow.append(row)
                    row.querySelector("button").onclick = ()=> {
                        if(storage.getUserId() == null){
                            float.askQuestion("you cant book flight without being a member, u need to sign up",
                            () => location.href= "/Auth/signup", "cant book flight", null, {nBtnText: "later",yBtnText: "sign me up"})
                        }else{
                            new BookingCreate(parseInt(storage.getUserId()), flight)
                        }
                    }
                }
            })
        }else{
            alert("fail to set flight")
        }
    }
}

function setupContact(){
    const container = document.querySelector(".comInput"),
    message = new Message()

    inputTaker(container.querySelector("#fname"), 'first name', "enter firstname", dom =>{
        dom.querySelector("input").oninput = (e) => message.FirstName = e.target.value
    })

    inputTaker(container.querySelector("#lname"), 'last name', "enter lastname", dom =>{
        dom.querySelector("input").oninput = (e) => message.LastName = e.target.value
    })

    inputTaker(container.querySelector("#email"), 'email', "enter mail", dom =>{
        dom.querySelector("input").oninput = (e) => message.Email = e.target.value
    }, null, "email")

    container.querySelector("textarea").oninput = (e) => {
        message.Text = e.target.value
    }

    container.querySelector("button").onclick = (e) => {
        if(storage.getUserId() !== null) message.IsMember = true
        let bload = buttonLoad(e.target, "submitting..")
        
        api.createMessage(message, res => {
            if(res == "success"){
                authMainError(container, "Message sent successfully", true)
                bload.stopButtonLoad()
                container.querySelectorAll("input").forEach(item => item.value = "")
                container.querySelector("textarea").value = ""
            }else{
                authMainError(container, res)
            }
        })
        setTimeout(() => {
            
        }, 2000)
    }
}

// $(".portslist").owlCarousel({
//     loop: true,
//     margin: 10,
//     nav: false,
//     responsive: {
//         0: {
//             items: 1
//         },
//         600: {
//             items: 3
//         },
//         1000: {
//             items: 5
//         }
//     }
//    })