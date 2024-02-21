import Float from "./float.js";

export default class Http{

    #onError (err = null){
        const float = new Float()
        float.dialog(float.DIALOG_ERROR, err ?? "Oops, seems like the server ran into an error", "system crashed")
    }

    #fetcher(endpoint ,method, callback, body=null, onFail=null){
        const head = new Headers()
        head.append("Content-Type", "application/json")
        fetch(endpoint, {method: method, body: body ? JSON.stringify(body) : null, headers: method == "post"? head : undefined})
        .then(res => {
            if(res.ok){
                if(res.headers.get("content-type").includes("application/json")){
                    return res.json()
                }else{
                    return res.text()
                }
            }else{
                throw new Error()
            }
        })
        .then(data => {
            callback(data)
        })
        .catch(d => {
            if(onFail){
                onFail()
            }else{
                this.#onError(d)
            }
        })
    }

    get(endpoit, onCallBack, onfail = null){
        this.#fetcher(endpoit, "get", (d)=> onCallBack(d), null , onfail != null ? () => onfail(): null)
    }

    post(endpoit, body, onCallBack, onfail = null){
        this.#fetcher(endpoit, "post", (d)=> onCallBack(d), body, onfail != null ? () => onfail(): null)
    }

    put(endpoint, body, onCallBack, onfail = null){
        this.#fetcher(endpoint, "put", (d) => onCallBack(d), body, onfail != null ? () => onfail(): null)
    }
} 