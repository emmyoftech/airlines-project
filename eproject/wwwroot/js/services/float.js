export default class Float{
    #mainFloatDom = document.createElement("section")

    DIALOG_SUCCESS = 121
    
    DIALOG_WARN = 14

    DIALOG_MESSAGE = 11

    DIALOG_ERROR = 151

    /**
     * @description
     *  This returns true or false depending if the dom exists in the global dom tree
     * @returns
     *  Returns true or false
     */
    #IS_FLOAT_ACTIVE(){
        if (document.querySelector(".float")) {
            return true
        }
        return false
    }

    #floatStart(domString){
        if (!this.#IS_FLOAT_ACTIVE()) {
            this.#mainFloatDom.className = "float"
            this.#mainFloatDom.innerHTML = domString
            document.body.append(this.#mainFloatDom)
            gsap.from(this.#mainFloatDom.children[0], {y: 100, opacity: 0, duration: .2})
            return this.#mainFloatDom;
        } else {
            alert("Float is still active")
        }
        return null
    }

    dynamicFloat(domString, dom){
        dom(this.#floatStart(domString));
    }

    /**
     * 
     * @param {number} dialogType
     *  Takes a number that states what kind of dialog to show 
     * @param {string} msg 
     *  Takes the messaged that is passed to the dialog box
     * @param {string | null} title
     *  Takes a string as the title of the message passed 
     * @param {Function | null} action
     *  This is triggered if given, when the button is clicked
     * @description
     *  This is a custom dialog box to show users interactive dialogs
     */
    dialog(dialogType, msg, title = null, action = null){
        let states = []

        switch(dialogType){
            case this.DIALOG_SUCCESS:
                    states = ["succ", "success", "fa-check-double"]
                break;
            case this.DIALOG_WARN:
                    states = ["warn", "warning", "fa-exclamation"]
                break;
            case this.DIALOG_ERROR:
                    states = ["err", "error", "fa-triangle-exclamation"]
                break;
            default: states = ["msg", "", ""]
        }

        let inner = `
            <div class="dialog">
                <div class="dialog-icon-hold ${states[0]}">
                     <i class="fa-solid ${states[2]}"></i>
                </div>
                <h3 class="dialog-title">${title != null ? title : states[1]}</h3>
                <p class="dialog-text">${msg}</p>
                <button class="dialog-btn">dismiss</button>
            </div>
        `

        this.dynamicFloat(inner, (dom) => {
            dom.querySelector("button").onclick = () => {
                this.floatEnd(action)
            }
        })
    }

    /**
     *  This method provides the user with an inyeractive dialog box for questions
     * @param {string} question 
     *  Takes a string and passes it as the question asked e.g "how are you?"
     * @param {Function} yAction 
     *  This is triggered when the yes button is clicked
     * @param {string | null} title
     *  This is the title of the question if passed (Optional)
     * @param {Function | null} noAction 
     *  This is an optional function which when passed will be triggered by the no button when clicked
     * @param {Object{nBtnText, yBtnText}} args 
     *  Optional properties for button text
     */
    askQuestion(question, yAction, title = null, noAction = null, args = {nBtnText: null , yBtnText: null}){
        const inner = `
            <div class="ques">
                <h3 class="ques-title">${title != null ? title : ""}</h3>
                <p class="ques-text">${question} ?</p>
                <div class="ques-btn-hold">
                    <button class="nbtn">${args.nBtnText ? args.nBtnText : "no"}</button>
                    <button class="ybtn">${args.yBtnText ? args.yBtnText : "yes"}</button>
                </div>
            </div>
        `
        this.dynamicFloat(inner, dom => {
            const allButtons = dom.querySelectorAll("button")
            allButtons.forEach(item =>{
                item.onclick = ()=>{
                    if(item.className == "ybtn"){
                        this.floatEnd(() => yAction())
                    }else{
                        this.floatEnd(noAction ? noAction(): null)
                    }
                }
            })
        })
    }

    floatLoad(loadstring = null, abort = null){
        const inner = `
            <div class="load">
                <ul class="load-sect">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <p class="load-text">${loadstring ? loadstring : "loading..."}</p>
                <button>cancel</button>
            </div>
        `
        let retFunc
        this.dynamicFloat(inner, dom => {
            const lis = dom.querySelectorAll("li")
            lis.forEach((item, index) => {
                item.style.animationDelay = `.${index}s`
            })
            gsap.set(dom.querySelector("button"), {y: 100, opacity: 0})
            setTimeout(()=> {
                const btn = dom.querySelector("button");
                gsap.to(btn, {y: 0, opacity: 1, duration: .5})
                btn.onclick = () => this.floatEnd(abort)
            }, 5000)
            retFunc = function (newLoadString){
                const textHolder = dom.querySelector(".load-text")
                gsap.from(textHolder, {y: 50, opacity: 0, duration: .1}).then(() => textHolder.textContent = newLoadString)
            }
        })
        return retFunc
    }

    /**
     *  This method removes the float from the dom tree and closes all actitvity of it
     * @param {Function | null} runAtEnd 
     *  Takes a function to invoke at the end of the animation
     */
    floatEnd(runAtEnd = null){
        let child = this.#mainFloatDom.children[0];
        gsap.to(child, {y: -100, opacity: 0, duration:.3}).then(() => {
            this.#mainFloatDom.remove()
            if(runAtEnd)runAtEnd()
        })
    }
}