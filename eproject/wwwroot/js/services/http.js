import { env } from "./env.js";

export default class Http{
    get(endpoit){
        return fetch(endpoit , {method: "get"})
    }

    post(endpoit, body){
        return fetch(endpoit,{body: body, method: "post"})
    }
}