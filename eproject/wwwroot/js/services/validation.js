
export const hasSymbolReg = /^(?=.*[^A-Za-z0-9]).+$/
export const hasCapitalLetterReg = /.*[A-Z].*/
export const hasNumberReg = /^(?=.*[0-9]).+$/

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
    const errMsg = getErrMsgContainer(inputDom)
    errMsg.textContent = msg
    errMsg.style.display = "block"
}

/**
 * 
 * @param {HTMLParagraphElement} errMsg
 * @description
 *  Hides the err msg container and removes the text 
 */
export function inputErrloggerRemover(inputDom){
    inputDom.classList.remove("fail")
    const errMsg = getErrMsgContainer(inputDom)
    errMsg.textContent = ""
    errMsg.style.display = "none"
}

function getErrMsgContainer(inputDom){
    return inputDom.closest("label").querySelector(".err-msg")
}

export function isPasswordValid(inputDom){
    const value = inputDom.value,
    passRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/,
    pass = !isInputEmpty(inputDom) && value.length > 5 && passRegex.test(value)
    return pass
}

export function enableEyeToggle(inputDom){
    let eye = document.createElement("i")
    
    eye.className = "fa-regular fa-eye"

    eye.style.cursor = "pointer"

    eye.onclick = ()=>{
        if(inputDom.type == "text"){
            inputDom.type = "password"
            eye.classList.replace("fa-eye-slash", "fa-eye")
        }else{
            inputDom.type = "text"
            eye.classList.replace("fa-eye", "fa-eye-slash")   
        }
    }

    inputDom.insertAdjacentElement("afterend", eye)
}

/**
 * 
 * @param {File} file 
 * 
 * @returns {Object}
 */
export function isImageValid(file){
    const res = {
        value: null,
        error: null
    },
    fileNameAndExtension = file.name.split("."),
    AllowedExtensions = ["jpg","jpeg","png","webp"]

    if(file.size > 2_000_000){
        res.error = "image is to big, Allowed image size is 2MB"
    }else if(!file.type.includes("image")){
        res.error = "file type must be of image and not " + file.type
    }else if(AllowedExtensions.indexOf(fileNameAndExtension[1].toLowerCase()) < 0){
        res.error = `.${fileNameAndExtension[1].toUpperCase()} is not an allowed image formart, instead use, ${AllowedExtensions.join(",").toUpperCase()}`
    }else{
        const data = new FormData()
        data.append("Name", fileNameAndExtension[0])
        data.append("Ext", fileNameAndExtension[1])
        data.append("Image", file)
        res.value = data
    }

    return res
}