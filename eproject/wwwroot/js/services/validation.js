/**
 * 
 * @param {HTMLInputElement} inputDom 
 * @returns {boolean}
 */
export function isInputEmpty(inputDom){
    return (inputDom.value.length < 1 || inputDom.value == " ")
}

/**
 * 
 * @param { HTMLInputElement } inputDom 
 * @returns {boolean}
 */
export function isEmailValid(inputDom){
    return !isInputEmpty(inputDom) && inputDom.value.includes("@")
}

export function isPhoneNumberValid(inputDom){
    return !isInputEmpty(inputDom) && inputDom.value.length == 10
}

/**
 * 
 * @param {HTMLParagraphElement} errMsg
 *  The err msg container for the input textfield
 * @param {string} msg 
 *  Message to be looed out
 */
export function inputErrLogger(inputDom, msg, noFail = null){
    if(noFail == null)inputDom.classList.add("fail")
    getErrMsgContainer(inputDom).textContent = msg
}

/**
 * 
 * @param {HTMLParagraphElement} errMsg
 * @description
 *  Hides the err msg container and removes the text 
 */
export function inputErrloggerRemover(inputDom){
    inputDom.classList.remove("fail")
    getErrMsgContainer(inputDom).textContent = ""
}

function getErrMsgContainer(inputDom){
    return inputDom.closest("label").querySelector(".err-msg")
}

export function isPasswordValid(inputDom){
    const value = inputDom.value,
    passRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/,
    pass = !isInputEmpty(inputDom) && value.length > 5 && passRegex.test(value)
    console.log(pass)
    return pass
}

export function enableEyeToggle(inputDom){
    let eye = inputDom.parentElement.querySelector("i")
    eye.onclick = ()=>{
        if(inputDom.type == "text"){
            inputDom.type = "password"
            eye.classList.replace("fa-eye-slash", "fa-eye")
        }else{
            inputDom.type = "text"
            eye.classList.replace("fa-eye", "fa-eye-slash")   
        }
    }
}