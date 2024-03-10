export default class Message{
    Id

    IsMember

    FirstName

    LastName

    Email

    Text

    /**
     * 
     * @param {number} Id 
     * @param {boolean} IsMember 
     * @param {string} FirstName 
     * @param {string} LastName 
     * @param {string} Email 
     * @param {string} Text 
     */
    constructor(Id, IsMember, FirstName, LastName, Email, Text){
        this.Id = Id
        this.IsMember = IsMember
        this.FirstName = FirstName
        this.LastName = LastName
        this.Email = Email
        this.Text = Text
    }
}