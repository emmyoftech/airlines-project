import Http from "./http.js";
import User from "../interfaces/user.js"

export default class Api{

    #http
    constructor(){this.#http = new Http();}
    
    createUser(user, cb){
        this.#http.post("/User", JSON.stringify(user), (d) => cb(d))
    }

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
     *  The mail that will be verified  
     * @param {Function} run 
     *  The function that will be run after the fetch has completed
     */
    verifyEmail(email ,run){
        this.#http.get(`/User/verifyMail/?email=${email}`, (d)=> run(d))
    }
}