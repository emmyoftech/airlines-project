import Api from "./api.js";
import { env } from "./env.js";
import Float from "./float.js";

export default class FloatController extends Float{
    floatName

    api = new Api()

    /**
     * 
     * @param {string} floatName 
     * @param {Function} starter 
     */
    constructor(floatName, starter){
        super()
        this.floatName = floatName
        this.#stageFloatCss()
        this.#stageBody((d) => {
            this.dynamicFloat(d, parDom => {
                const domElement = parDom.children[0]
                domElement.style.height = "max-content"
                domElement.style.minHeight = "200px"
                domElement.style.borderRadius = "var(--smallNum)"
                domElement.style.padding = "var(--smallNum)"
                domElement.style.minWidth = "320px"
                domElement.style.maxWidth = "1000px"
                starter(domElement)
            })
        })

    }

    #stageFloatCss(){
        let link = document.createElement("link")
        link.rel = "stylesheet"
        let floatlink = this.floatName.split("=")
        link.href = env.floatPartialsStyles.concat(`${floatlink[1] ? floatlink[0] + "/" + floatlink[1]: floatlink[0]}`, ".css")
        document.head.append(link)
    }

    #stageBody(runBody){
        let floatlink = this.floatName.split("=")

        fetch(env.floatPartials.concat(`${floatlink[1] ? floatlink[0] + "/" + floatlink[1]: floatlink[0]}`, ".htm"), {method: "get", cache: "no-cache"})
        .then(res => res.text())
        .then(data => {
            const name = this.floatName.includes("=") ? this.floatName.split("=")[1] : this.floatName
            runBody(`<div class="${name}-float">${data}</div>`)
        })
    }
} 