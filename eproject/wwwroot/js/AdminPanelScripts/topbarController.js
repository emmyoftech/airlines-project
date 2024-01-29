import { Controller, animateAndDo } from "../services/Controler.js"
import { animateAndDo } from "../services/library.js"
export default class TopbarController extends Controller {

    constructor(parentElement) {
        super(parentElement , "topbar", () => this.#starter())
    }

    #starter() {

    }

    navigateTo(location) {
        const navtigateView = this.domElement.querySelector(".navigator")
        animateAndDo(navtigateView, () => {
            navtigateView.textContent = location
        }, {
            anim_name: "top-to-bottom",
            anim_dur: .3,
            doFrom: "halfway"
        })
    }
}