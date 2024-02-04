import Float from "./float.js";
import Http from "./http.js";
import User from "../interfaces/user.js"

export default class Api{

    #http
    #float
    constructor(){this.#http = new Http(); this.#float = new Float()}
    
    getUsers(hasData, noData, onerror = null){
        this.#http.get("getUsers")
        .then(res => {if(res.ok && res.status == 200) return res.json()})
        .then(data => {
            if(data.message){
                noData(data)
            }else{
                let userModelArray = new Array();

                for(const row of data){
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
        .catch(() => {
             if(onerror == null){
                this.#float.dialog(this.#float.DIALOG_ERROR, "an error occured in the server", "system crashed")
             }else{
                onerror()
             }
        })
    }
}