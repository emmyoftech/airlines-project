
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
 */
export function buttonLoad(button, loadText=null){
    let i = button.querySelector("i"),
    p = button.querySelector("p"),
    formerIclass = i==null ? null : i.className,
    formerBtntext = p.textContent

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