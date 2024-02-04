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
    console.log(inputDom.value)
    return !isInputEmpty(inputDom) && inputDom.value.length < 11 && inputDom.value.length > 3
}

/**
 * 
 * @param {HTMLParagraphElement} errMsg
 *  The err msg container for the input textfield
 * @param {string} msg 
 *  Message to be looed out
 */
export function inputErrLogger(inputDom, msg){
    inputDom.classList.add("fail")
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