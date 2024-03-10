import Api from "./api.js"
import { env } from "./env.js"
import Float from "./float.js"
import Storage  from "./storage.js"

export class Controller {
    domElement = document.createElement("div")

    parentDomELement

    acquiredController

    componentName

    isInitiated = false

    api = new Api()

    float = new Float()

    storage = new Storage()

    /**
     * 
     * @param {Element} parentDomELement  
     *  This is the Element that the component is going to be appended to
     * @param {string} viewName 
     *  This is the name of the component
     * @param {Function} onInitiated
     *  This is function that will be run after component has been initialised
     */
    constructor(parentDomELement, viewName, onInitiated) {
        this.parentDomELement = parentDomELement
        this.componentName = viewName.includes("=") ? viewName.split("=")[1] : viewName
        this.#setStyle(this.#setStylingPath(viewName))
        this.#initializer(this.#formishCompHtmFilePath(viewName),onInitiated)
    }

    /**
     * 
     * @param {string} name 
     * @returns {string}
     * 
     * @description
     *  THis takes the component name that is passed and turns it into a path 
     *  for where the .htm file is located
     */
    #formishCompHtmFilePath(name){
        let nameSplit = name.split("="),
            htmlPartialName = nameSplit[1],
            folder = nameSplit[0],
            innerFolder = nameSplit[2],
            path = ""

        switch(folder){
            case "auth":  path = `${env.authPartials}${innerFolder ? innerFolder + "/" : ""}`
                break
            case "panel": path = `${env.panelPartials}${innerFolder ? innerFolder + "/" : ""}`
                break
            case "float": path = `${env.floatPartials}${innerFolder ? innerFolder + "/" : ""}`
                break
            default: path = env.sharedPartials
        }

        return path + htmlPartialName + ".htm"
    }

    /**
     * 
     * @param {string} name
     * @returns {string}
     * @description 
     *  This takes the name of the component and turns it into the correct css path
     */
    #setStylingPath(name){
        let nameSplit = name.split("="),
            htmlPartialName = nameSplit[1],
            folder = nameSplit[0],
            innerFolder = nameSplit[2],
            path = ""

        switch(folder){
            case "auth":  path = `${env.authPartialsStyles}${innerFolder ? innerFolder + "/" : ""}`
                break
            case "panel": path = `${env.panelPartialsStyles}${innerFolder ? innerFolder + "/" : ""}`
                break
            case "float": path = `${env.floatPartialsStyles}${innerFolder ? innerFolder + "/" : ""}`
                break
            default: path = env.sharedPartialsStyles
        }

        return path + htmlPartialName + ".css"
    }

    /**
     * This a string as the path to where the css is located, creates a link element 
     * and appends it to the head of the document
     * @param {string} csspath 
     */
    #setStyle(csspath){
        const linkDom = document.createElement("link")
        linkDom.rel = "stylesheet"
        linkDom.href = csspath
        document.head.append(linkDom)
    }

    /**
     * This gets the html data from the path ( partiallocation ) and imbeds it into the created
     * contaner
     * @param {string} partiallocation 
     * @param {Function} init 
     */
    #initializer = (partiallocation ,init) => {
        fetch(partiallocation, {
            method: "get",
            cache: "no-cache"
        }).then((res) => {
            if (res.ok) return res.text()
            throw new Error("dom processing failed")
        }).then(data => {
            this.domElement.className = this.componentName + "-component"
            this.domElement.innerHTML = data
            this.domElement.style.gridArea = this.componentName
            this.domElement.style.overflow = "hidden"
            this.parentDomELement.append(this.domElement)
            this.isInitiated = true
            this.domElement = document.querySelector(`.${this.componentName}-component`)
            if (init) init()
        }).catch((err) => console.error(err))
    }

    /**
     * Returns this controller
     * @returns Controller
     */
    getController = () => this 

    /**
     * Sets the acquiredController property with a initialized Controller so that the 
     * this controller can access the functionality of the acquired controller
     * @param {Controller} controller 
     * @returns 
     */
    setController = (controller) => this.acquiredController = controller

    /**
     * This destroys the controller and runs a function if provided
     * after the animation is complete
     * @param {Function | null} whendestroyed 
     */
    _destroy(whendestroyed = null){
        gsap.to(this.domElement, {scale: .1, opacity: 0, duration: .1}).then(() => {
            this.domElement.remove()
            document.head.querySelectorAll("link").forEach(item => {
                if(item.href.includes(this.componentName)) item.remove()
            })
            delete this
            whendestroyed ? whendestroyed() : null
        })
    }
}
