import { useState } from 'react';
const useSafeHandler = (...args) => {
    let fn = args.find(x => x instanceof Function)
    let severity = args.find(x=>  typeof x === "string")

    let [errorState, setErrorState] = useState()

    return (...args) => {
        try {
            fn(args)
        } catch (error) {
            error.severity = severity
            setErrorState(s => {throw error})
        }
    }

}

export const safeHandler = (obj, ...args) => {  
    let fn = args.find(x => x instanceof Function)
    let severity = args.find(x=> typeof x === "string")

    let handler = function(...args) {
        try {
            fn(args)
        } catch (error) {
            error.severity = severity
            this.setState(s => {throw error})
        }
    }
    return handler.bind(obj)
}
export default useSafeHandler;