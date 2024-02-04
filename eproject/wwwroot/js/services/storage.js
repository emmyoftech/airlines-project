export default class Storage {
    #store = localStorage.getItem("ARS")
    #parsedData = null;

    constructor(){
        if(this.#store == null){
            localStorage.setItem("ARS", JSON.stringify({
                user: null
            }))
        }else{
            this.#parsedData = JSON.parse(this.#store)
        }
    }

    #set(obj){
        localStorage.setItem("ARS", JSON.stringify(obj))
    }
        

    /**
     *  This returns the users id or null if it is'nt available 
     * @returns {string | null}
     */
    getUser(){
        if(this.#parsedData == null) return null
        let storedData = this.#parsedData
        return storedData.user
    }

     /**
     *  This sets the users id
     * 
     * @param {string} userId 
     * 
     * @returns {void}
     */
    setUser(userId){
        this.#parsedData.user = userId
        this.#set(this.#parsedData)
    }
}