/**
 * 
 * @param {string} msg 
 * @returns 
 */
export function authMainError(msg){
    let mainErrorDom = document.querySelector(".authMainErrMsg")
    if(mainErrorDom == null) return alert("Error dom not found")
    mainErrorDom.style.display = "flex"
    mainErrorDom.textContent = msg
    gsap.set(mainErrorDom, {x: 0, opacity: 1})
    gsap.from(mainErrorDom, {x: 100, opacity: 0, duration: .5})

    setTimeout(()=>{
        gsap.to(mainErrorDom, {x: -100, opacity: 0, duration: .5})
    }, 2000)
}