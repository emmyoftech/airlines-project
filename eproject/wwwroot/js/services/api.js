import Http from "./http.js";
import User from "../interfaces/user.js"
import AirportModel from "../interfaces/airportModel.js"
import PlaneModel from "../interfaces/planeModel.js";
import FlightModel from "../interfaces/flightModel.js";

export default class Api{

    #http
    constructor(){this.#http = new Http();}
    
    
    // USER API METHODS 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    createUser(user, cb){
        this.#http.post("/User", user, (d) => cb(d))
    }

    /**
     * 
     * @param {Function} hasData 
     * @param {Function} noData 
     */
    getUsers(hasData, noData){
        this.#http.get("/User?all=true", (d) => {
            if(typeof d == "string"){
                noData(d)
            }else{
                let userModelArray = new Array();

                for(const row of d){
                    userModelArray.push(
                        new User(
                            row.id, 
                            row.firstName, 
                            row.lastName, 
                            row.email, 
                            row.password, 
                            row.emailConfirmed, 
                            row.role, 
                            row.logStatus, 
                            row.registeredOn, 
                            row.phoneNumber, 
                            row.gender
                        ))
                }
                hasData(userModelArray)
            }
        })
    }

    /**
     * 
     * @param {string} email 
     * @param {object} obj 
     * @param {Function} cb 
     */
    changePassword(email, obj, cb){
        this.#http.put(`/User/ChangePwd?email=${email}`, obj, (d) => cb(d))
    }

    /**
     * 
     * @param {User} user 
     * @param {Function} cb 
     */
    editUser(user, cb){
        this.#http.put("/User?id=" + user.Id, user, (d) => cb(d))
    }

    /**
     * 
     * @param {string} email
     *  The mail that will be verified  
     * @param {Function} run 
     *  The function that will be run after the fetch has completed
     */
    verifyEmail(email, run){
        this.#http.get(`/User/verifyMail/?email=${email}`, (d)=> run(d))
    }

    /**
     * 
     * @param {string} endpoint 
     * @param {FormData} formData 
     * @param {Function} cb 
     * @param {Function} fail 
     */
    sendProfileImage(formData, cb, fail = null){
        const xhr = new XMLHttpRequest()
        xhr.open("post",("/User/sendImage"), true)

        xhr.onload = () => {
            if(xhr.status == 200 && xhr.readyState == 4){
                cb(xhr.response)
            }else{
                if(fail)
                    fail()
                else
                    console.error("Error failed to store image")
            }
        }

        xhr.send(formData)
    }

    /**
     * 
     * @param {number} userId 
     * @param {Function} cb 
     */
    getProfileImage(userId , cb){
        this.#http.get("/User/getImage?userId="+userId, d => cb(d))
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //


    // AIRPORT API METHODS 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    /**
     * 
     * @param {Function} hasData 
     * @param {Function} noData 
     */
    getAirports(hasData, noData){
        this.#http.get("/Airport?all=true", (d) => {
            if (typeof d == "string"){
                noData(d)
            }else{
                const airports = new Array()
                for(const airport of d){
                    airports.push(new AirportModel(airport.id, airport.name, airport.location, airport.numberOfRunways, airport.closed, airport.availableRunways))
                }
                hasData(airports)
            }
        })
    }

    /**
     * 
     * @param {AirportModel} airport 
     * @param {Function} cb 
     */
    createAirport(airport, cb){
        this.#http.post("/Airport", airport, res => cb(res))
    }

    /**
     * 
     * @param {number} airpotId 
     * @param {Function} cb 
     */
    deleteAirport(airpotId, cb){
        this.#http.delete("/Airport?id=" + airpotId, res => cb(res))
    }


    /**
     * 
     * @param {AirportModel} airport 
     * @param {Function} cb 
     */
    editAirport(airport, cb){
        this.#http.put("/Airport?id=" + airport.Id, airport, res => cb(res))
    }
    /**
     * 
     * @param {AirportModel[]} airports 
     * @param {Function} cb 
     */
    deleteMultipleAirports(airports, cb){
        if(airports == null){
            this.#http.post("/Airport/DeleteMultiple?all=true", null, (d) => cb(d))
        }else{
            this.#http.post("/Airport/DeleteMultiple", airports, (d) => cb(d))
        }
    }
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

      // PLANES API METHODS 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    /**
     * 
     * @param {Function} hasData 
     * @param {Function} noData 
     */
    getPlanes(hasData, noData){
        this.#http.get("/Planes?all=true", res => {
            if(typeof res != "string"){
                const planes = new Array()
                
                for(const plane of res){
                    planes.push(new PlaneModel(plane.id, plane.airportId, plane.model, plane.code, plane.manufacturer, plane.yearOfManufacture, plane.seatCapacity, plane.status))
                }

                hasData(planes)
            }else{
                noData(res)
            }
        })
    }

    /**
     * 
     * @param {PlaneModel} plane 
     * @param {Function} cb 
     */
    createPlane(plane, cb){
        this.#http.post("/Planes", plane, res => cb(res))
    }

    /**
     * 
     * @param {number} planeCode 
     * @param {Function} cb 
     */
    generateSeats (planeCode, cb){
        this.#http.get("/Planes/GenerateSeats?planeCode=" + planeCode, res => cb(res))
    }
    getBuisnessSeats(planeId, cb){
        this.#http.get("/Planes/GetBuisnessSeats?planeId=" + planeId, res => cb(res))
    }
    getCommunitySeats(planeId, cb){
        this.#http.get("/Planes/GetCommunitySeats?planeId=" + planeId, res => cb(res))
    }
    
    /**
     * 
     * @param {number} planeId 
     * @param {Function} cb 
     */
    deletePlane(planeId, cb){
        this.#http.delete("/Planes?planeId=" + planeId, res => cb(res))
    }

    /**
     * 
     * @param {number} planeId 
     * @param {Function} cb 
     */
    deleteSeats(planeId, cb){
       this.#http.delete("/Planes/DeleteSeats?planeId=" + planeId, res => cb(res))
    }

    deleteAllPlane(cb){
        this.#http.delete("/Planes/DeleteAll", res => cb(res))
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

   // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    /**
     * 
     * @param {Function} hasData 
     * @param {Function} noData 
     */
    getFlights(hasData, noData){
        this.#http.get("/Flight?all=true", res => {
            if(typeof res == "string"){
                noData(res)
            }else{
                const flights = new Array()
                
                for(const flight of res){
                    flights.push(new FlightModel(flight.id, flight.departureAirportId, flight.arrivalAirportId, flight.planeId, flight.pricePerSeat, flight.departureTime, flight.arrivalTime, flight.departureDate, flight.capacity, flight.remainingSeats))
                }

                hasData(flights)
            }
        })
    }

    /**
     * 
     * @param {FlightModel} flight 
     * @param {Function} cb 
     */
    createFlight(flight, cb){
        this.#http.post("/Flight", flight, res => cb(res))
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
}