import { useRef } from 'react';

export function useRunOnce(fn){
    const resultRef = useRef()
    if (!resultRef.current) {
        resultRef.current = fn()
    }
    return resultRef.current
}

export default useRunOnce