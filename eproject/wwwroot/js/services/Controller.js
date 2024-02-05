import { env } from "./env.js"
export class Controller {
    domElement = document.createElement("div")

    parentDomELement

    acquiredController

    componentName

    isInitiated = false

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
        let reName = ""
        if(name.includes("=")){
            let nameSplit = name.split("="),
            htmlPartialName = nameSplit[1],
            folder = nameSplit[0]

            reName = `${folder == "auth" ? env.authPartials : env.panelPartials}/${htmlPartialName}.htm`
        }else{
            reName = `/lib/partialHtmlparts/sharedpartials/${name}.htm`
        }
        return reName
    }

    /**
     * 
     * @param {string} name
     * @returns {string}
     * @description 
     *  This takes the name of the component and turns it into the correct css path
     */
    #setStylingPath(name){
        let path = ""
        if(name.includes("=")){
            const splitName = name.split("="),
            folder = splitName[0],
            stylename = splitName[1]

            path = `${folder == "auth" ? env.authPartialsStyles : env.panelPartialsStyles }${stylename}.css`
        }else{
            path = env.sharedPartialsStyles.concat(name) + ".css"
        }
        return path
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
}
