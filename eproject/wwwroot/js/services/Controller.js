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
    constructor(parentDomELement = null, viewName, onInitiated) {
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
            path = ""

        switch(folder){
            case "auth":  path = env.authPartials
                break
            case "panel": path = env.panelPartials
                break
            case "float": path = env.floatPartials
                break
            default: path = env.sharredPartials
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
            path = ""

        switch(folder){
            case "auth":  path = env.authPartialsStyles
                break
            case "panel": path = env.panelPartialsStyles
                break
            case "float": path = env.floatPartialsStyles
                break
            default: path = env.sharedPartialsStyles
        }

        return path + htmlPartialName + ".css"
    }

    #setStyle(csspath){
        const linkDom = document.createElement("link")
        linkDom.rel = "stylesheet"
        linkDom.href = csspath
        document.head.append(linkDom)
    }

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
            this.parentDomELement.append(this.domElement)
            this.isInitiated = true
            this.domElement = document.querySelector(`.${this.componentName}-component`)
            if (init) init()
        }).catch((err) => console.error(err))
    }

    getController = () => this 

    setController = (controller) => this.acquiredController = controller

    _destroy(whendestroyed){
        gsap.to(this.domElement, {scale: .1, opacity: 0, duration: .3}).then(() => {
            this.domElement.remove()
            whendestroyed ? whendestroyed() : null
        })
    }
}
