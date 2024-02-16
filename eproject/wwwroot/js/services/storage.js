export default class Storage {
    #store = localStorage.getItem("ARS")
    #parsedData = null;

    constructor(){
        if(this.#store == null){
            localStorage.setItem("ARS", JSON.stringify({
                userId: null,
                userEmail: null
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
    getUserId(){
        return this.#parsedData.userId ?? null
    }

        /**
     *  This returns the users email or null if it is'nt available 
     * @returns {string | null}
     */
    getUserEmail(){
        return this.#parsedData.userEmail ?? null
    }

     /**
     *  This sets the users id in local storage
     * 
     * @param {string} userId 
     * 
     * @returns {void}
     */
    setUserId(userId){
        this.#parsedData.userId = userId
        this.#set(this.#parsedData)
    }

     /**
     *  This sets the users email in local storage
     * 
     * @param {string} userEmail 
     * 
     * @returns {void}
     */
    setUserEmail(userEmail){
        this.#parsedData.userEmail = userEmail
        this.#set(this.#parsedData)
    }
}