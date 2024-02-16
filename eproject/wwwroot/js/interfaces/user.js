/**
 * @description
 *  This is a javascript representation of the user model
 */
export default class User {
    Id
    
    FirstName
    
    LastName
    
    Email
    
    Password
    
    EmailConfirmed

    PhoneNumber

    Gender

    Role
    
    LogStatus
    
    RegisteredOn
    
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
        this.Id = Id
        this.FirstName = FirstName
        this.LastName = LastName
        this.Email = Email
        this.Password = Password
        this.EmailConfirmed = EmailConfirmed
        this.Role = Role
        this.LogStatus = LogStatus
        this.RegisteredOn = RegisteredOn
        this.PhoneNumber = PhoneNumber
        this.Gender = Gender
    }
}