
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