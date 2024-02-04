import { env } from "./env.js";

export default class Http{
    get(endpoit){
        return fetch(env.api_endpoint.concat(endpoit), {method: "get"})
    }

    post(endpoit, body){
        return fetch(env.api_endpoint.concat(endpoit),{body: body, method: "post"})
    }
}