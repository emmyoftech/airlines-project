/**
 * @description
 *  This is a javascript representation of the user model
 */
export default class User {
    #Id
    
    #FirstName
    
    #LastName
    
    #Email
    
    #Password
    
    #EmailConfirmed

    #PhoneNumber

    #Gender

    #Role
    
    #LogStatus
    
    #RegisteredOn
    
    /**
     * 
     * @param {number} Id 
     * @param {string} FirstName 
     * @param {string} LastName 
     * @param {string} Email 
     * @param {string} Password 
     * @param {boolean} EmailConfirmed
     * @param {string} Role 
     * @param {string} LogStatus 
     * @param {string} RegisteredOn
     * @param {string} Gender 
     * @param {string} PhoneNumber 
     */
    constructor (Id, FirstName, LastName, Email, Password, EmailConfirmed, Role, LogStatus, RegisteredOn, PhoneNumber, Gender){
        this.#Id = Id
        this.#FirstName = FirstName
        this.#LastName = LastName
        this.#Email = Email
        this.#Password = Password
        this.#EmailConfirmed = EmailConfirmed
        this.#Role = Role
        this.#LogStatus = LogStatus
        this.#RegisteredOn = RegisteredOn
        this.#PhoneNumber = PhoneNumber
        this.#Gender = Gender
    }

    // GETTERS
    getId(){
        return this.#Id
    }

    getFirstName(){
        return this.#FirstName
    }

    getLastName(){
        return this.#LastName
    }

    getEmail(){
        return this.#Email
    }

    getPassword(){
        return this.#Password
    }

    getRole(){
        return this.#Role
    }

    getPhoneNumber(){
        return this.#PhoneNumber
    }

    getGender(){
        return this.#Gender
    }

    getEmailConfirmed(){
        return this.#EmailConfirmed
    }

    getLogStatus(){
        return this.#LogStatus
    }

    getRegisteredon(){
        return this.#RegisteredOn
    }
    
    // SETTERS
    setId(id){
        this.#Id = id
    }

    setFirstName(FirstName){
        this.#FirstName = FirstName
    }

    setLastName(LastName){
        this.#LastName = LastName
    }

    setEmail(Email){
        this.#Email = Email
    }

    setPassword(Password){
        this.#Password = Password
    }

    setRole(Role){
        this.#Role = Role
    }

    setEmailConfirmed(EmailConfirmed){
        this.#EmailConfirmed = EmailConfirmed
    }

    setLogStatus(LogStatus){
        this.#LogStatus = LogStatus
    }

    setRegisteredon(RegisteredOn){
        this.#RegisteredOn = RegisteredOn
    }

    setPhoneNumber(PhoneNumber){
        this.#PhoneNumber = PhoneNumber
    }

    setGender(Gender){
        this.#Gender = Gender
    }
}