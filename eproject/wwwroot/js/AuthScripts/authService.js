/**
 * 
 * @param {HTMLElement} parentDom 
 * @param {string} msg 
 * @param {boolean} [notError=false] 
 */
export function authMainError(parentDom, msg, notError=false){
    if(document.querySelector(".authMainErrMsg")) return
    const mainErrorDom = document.createElement("p")
    mainErrorDom.className = `authMainErrMsg ${notError ? "succ" : null}`
    mainErrorDom.textContent = msg
    parentDom.insertAdjacentElement("afterbegin", mainErrorDom)

    gsap.set(mainErrorDom, {x: 0, opacity: 1})
    gsap.from(mainErrorDom, {x: 100, opacity: 0, duration: .5})

    setTimeout(()=>{
        gsap.to(mainErrorDom, {x: -100, opacity: 0, duration: .5}).then(() => mainErrorDom.remove())
    }, 2000)
}