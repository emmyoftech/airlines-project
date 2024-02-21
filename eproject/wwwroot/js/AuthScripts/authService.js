/**
 * 
 * @param {HTMLElement} parentDom 
 * @param {string} msg 
 */
export function authMainError(parentDom, msg){
    if(document.querySelector(".authMainErrMsg")) return
    const mainErrorDom = document.createElement("p")
    mainErrorDom.className = "authMainErrMsg"
    mainErrorDom.textContent = msg
    parentDom.insertAdjacentElement("afterbegin", mainErrorDom)

    gsap.set(mainErrorDom, {x: 0, opacity: 1})
    gsap.from(mainErrorDom, {x: 100, opacity: 0, duration: .5})

    setTimeout(()=>{
        gsap.to(mainErrorDom, {x: -100, opacity: 0, duration: .5}).then(() => mainErrorDom.remove())
    }, 2000)
}