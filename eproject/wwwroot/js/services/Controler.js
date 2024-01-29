import { env } from "./env.js"
export class Controller {
    domElement = document.createElement("div")

    parentDomELement

    acquiredController

    componentName

    isInitiated = false
    constructor(parentDomELement, viewName, initiated) {
        this.parentDomELement = parentDomELement
        this.componentName = viewName
        this.#initializer(initiated)
    }

    #initializer = (init) => {
        fetch(env.adminpanelComponentDomLocation.concat(this.componentName, ".htm"), {
            method: "get",
            cache: "no-cache"
        }).then((res) => {
            if (res.ok) return res.text()
            throw new Error("dom processing failed")
        }).then(data => {
            this.domElement.className = this.componentName + "-component"
            this.domElement.innerHTML = data
            this.parentDomELement.append(this.domElement)
            this.isInitiated = true
            if (init) init()
        }).catch((err) => console.error(err))
    }

    getController = () => this 

    setController = (controller) => this.acquiredController = controller
}
