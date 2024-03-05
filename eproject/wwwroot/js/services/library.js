
export function animateAndDo(animateTarget, run, args) {
    let actionPercent,
        options = {
            animationName: args.anim_name ? args.anim_name : null,
            animationDuration: args.anim_dur ? args.anim_dur : 1,
            doFrom: args.doFrom ? args.doFrom : "end"
        }
    switch (options.doFrom) {
        case "start":
            actionPercent = 0
            break
        case "halfway":
            actionPercent = 50
            break
        case "end":
            actionPercent = 100
            break
        default: console.error("improper argument passed to ' animateAndDo '")

    }
    if (options.animationName == null) {
        animateTarget.classList.add("animate")
    } else {
        animateTarget.style.animation = `${options.animationName} ${options.animationDuration}s`
    }
    setTimeout(() => run(), ((actionPercent / 100) * options.animationDuration) * 1000)
    animateTarget.addEventListener("animationend", () => {
        if (options.animationName == null)
            animateTarget.classList.remove("animate")
        else {
            animateTarget.style.animation = ""
        }
    }, { once: true })
}

/**
 * 
 * @param {HTMLButtonElement} button 
 * @param {null|string } [loadText=null] 
 */
export function buttonLoad(button, loadText=null){
    let i = button.querySelector("i"),
    p = button.querySelector("p"),
    formerIclass = i==null ? null : i.className

    let formerBtntext = p.textContent

    button.classList.add("closed")


    if(i == null){
        let newIElement = document.createElement("i")
        newIElement.className = "fa-solid fa-spinner"
        newIElement.style.animation = "spin 1s linear infinte"
        button.append(newIElement)

        p.textContent = loadText == null ? "loading...": loadText
        i = button.querySelector("i")
    }else{
        p.textContent = "loading..."
        i.className = "fa-solid fa-spinner"
    }
    let timeline = gsap.timeline({repeat: -1, ease: "linear"})
        timeline.to(i, {rotation: 360, duration: 2})
    button.style.pointerEvents = "none"

    return {stopButtonLoad: (run=null, )=>{
        if(formerIclass != null){
            i.className = formerIclass
            i.style.transform = "rotate(0deg)"
        }else{
            button.querySelector("i").remove()
        }
        button.style.pointerEvents = "all"
        p.textContent = formerBtntext
        timeline.kill()
        button.classList.remove("closed")
        if(run) run()
    }}
}

/**
 * 
 * @param {HTMLInputElement} input 
 */
export function inputLoad(input){
    const par = input.parentElement,
    spinner = document.createElement("span")

    spinner.className = "spinner"

    spinner.innerHTML = `
        <i class="fa-solid fa-circle-notch"></i>
    `
    
    input.style.opacity = .5
    input.style.pointerEvents = "none"

    par.append(spinner)

    /**
     * @param {Function} run
     */
    return (run=null) => {
        spinner.remove()
        input.style.opacity = 1
        input.style.pointerEvents = "all"
        if(run) run()
    }
}

/**
 * This takes an object and returns a string array of the keys in the object
 * @param {Object} obj 
 * @returns {string[]}
 */
export function ObjKeysToStringArray (obj){
    const a = Array()

    for(const key in obj){
        a.push(key)
    }

    return a
}

export function openButton(isValid, ele){
    if(isValid){
        ele.classList.remove("fade")
    }else{
        ele.classList.add("fade")
    }
}

/**
 * 
 * @param {HTMLLabelElement} labelDom 
 * @param {string} title 
 * @param {string} placeholder 
 * @param {null|string} [defaultValue=null] 
 * 
 */
export function dropdownGenerator(labelDom, title, placeholder, defaultValue=null){
    const inner = `
    <h2>${title}</h2>
        <div class="select-wrap">
            <div class="select-panel">
                <input type="text" placeholder="${placeholder}.." value="${defaultValue ?? ""}">
                <span class="select-btn loading">
                    <i class="fa-solid fa-spinner"></i>
                </span>
            </div>
            <p class="err-msg"></p>
        </div>
        <ul class="select-items"></ul>

    `
    labelDom.innerHTML = inner

    labelDom.querySelector(".select-btn").onclick = ()=> toggleListHold()

    function toggleListHold() {
        const liatHold = labelDom.querySelector(".select-items")
        liatHold.classList.toggle("active")
    }

    /**
     * @param {Array} arrayData
     * @param {Function} onclc
     */
    return {
        set: (arrayData, onclc) => {
            labelDom.querySelector(".select-btn").classList.remove("loading")
            labelDom.querySelector(".fa-solid").classList.replace("fa-spinner", "fa-sort-down")
    
            for(const arr of arrayData){
                const list = document.createElement("li")
                list.textContent = arr
                list.onclick = ()=>{
                    labelDom.querySelector("input").value = arr
                    toggleListHold()
                    onclc(arr)
                }
                labelDom.querySelector(".select-items").append(list)
            }
        }
    }
}


/**
 * 
 * @param {HTMLLabelElement} labelDom 
 * @param {string} title 
 * @param {Function} onclck
 * @param {null|number} [value=null] 
 */
export function numSetter(labelDom, title, onclck, value=null){
    const inner = `
    <h2>${title}</h2>
        <div class="numHold">
            <span class="minusNum">
                <i class="fa-solid fa-minus"></i>
            </span>
            <span id="rlnumHld">${value ?? "1"}</span>
            <span class="addNum">
                <i class="fa-solid fa-plus"></i>
            </span>
        </div>
    `
    labelDom.innerHTML = inner

    labelDom.querySelectorAll("span").forEach(item => {
        item.onclick = (e)=>{
            const realNumHold = e.target.closest(".numHold").querySelector("#rlnumHld"),
            cuur_number = parseInt(realNumHold.textContent)
            
            if(item.className.includes("add")){
                if(cuur_number != 10){
                    realNumHold.textContent = cuur_number + 1
                }
            }else{
                if(cuur_number > 1){
                    realNumHold.textContent = cuur_number - 1
                }
            }
            onclck(realNumHold.textContent)
        }
    })
}


/**
 * 
 * @param {HTMLLabelElement} labelDom 
 * @param {string} title 
 * @param {string} placeholder 
 * @param {Function} onclck 
 * @param {null|string} [value=null] 
 */
export  function inputTaker(labelDom, title, placeholder, onready, value=null, type=null){
    const inner = `
        <h2>${title}</h2>
        <div class="inpCon">
            <input type="${type ?? "text"}" placeholder="${placeholder}..." value="${value ?? ""}">
        </div>
        <p class="err-msg"></p>
    `

    labelDom.innerHTML = inner

    onready(labelDom)
}

/**
 * 
 * @param {HTMLElement} domToAppend 
 * @param {string} msg 
 */
export function shownodataDom(domToAppend, msg) {
    const dom = document.createElement("div")
    dom.className = "nodata"
    dom.textContent = msg
    domToAppend.append(dom)
}

/**
 * 
 * @param {HTMLElement} navDom 
 * @param {string} title 
 * @param {Function} to 
 */
export function navBackgenerator(navDom, title, to){
    const inner = `
    <span class="backBtn">
        <i class="fa-solid fa-arrow-left"></i>
    </span>
    <h3 class="title">${title}</h3>
    `
    navDom.innerHTML = inner

    navDom.querySelector("span").onclick = () => to()
}

/**
 * 
 * @param {number} len 
 */
export function CodeGenerator(len){
    let numArray = [1,2,3,4,5,6,7,8,9],
    code = ""

    for(let i = 0; i < len; i++){
        code += numArray[Math.floor(Math.random() * numArray.length)]
    }

    return parseInt(code)
}