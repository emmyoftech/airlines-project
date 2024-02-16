import Float from "./float.js";

export default class Http{

    #onError (err = null){
        const float = new Float()
        float.dialog(float.DIALOG_ERROR, err ?? "Oops, seems like the server ran into an error", "system crashed")
    }

    #fetcher(endpoint ,method, callback, body=null){
        const head = new Headers()
        head.append("Content-Type", "application/json")
        fetch(endpoint, {method: method, body, headers: method == "post"? head : undefined})
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
        .catch(d => this.#onError(d))
    }

    get(endpoit, onCallBack){
        this.#fetcher(endpoit, "get", (d)=> onCallBack(d))
    }

    post(endpoit, body, onCallBack){
        this.#fetcher(endpoit, "post", (d)=> onCallBack(d), body)
    }
}