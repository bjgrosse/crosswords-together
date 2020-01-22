import { useState, useCallback } from "react";

const handleError = function(error, severity, setState) {
  error.severity = severity;

  switch (severity) {
    case "ignore":
      return;
    default:
      setState.call(this, x => {
        throw error;
      });
  }
};
export const useSafeHandler = (...args) => {
  let fn = args.find(x => x instanceof Function);
  let severity = args.find(x => typeof x === "string");

  let [errorState, setErrorState] = useState();

  return useCallback(
    (...args) => {
      try {
        fn(...args);
      } catch (error) {
        handleError(error, severity, setErrorState);
      }
    },
    [fn, severity]
  );
};

export const useSafeHandlerWarn = (...args) => useSafeHandler("warn", ...args);
export const useSafeHandlerSilent = (...args) =>
  useSafeHandler("silent", ...args);
export const useSafeHandlerIgnore = (...args) =>
  useSafeHandler("ignore", ...args);

export const safeHandler = (obj, ...args) => {
  let fn = args.find(x => x instanceof Function);
  let severity = args.find(x => typeof x === "string");

  let handler = function(...args) {
    try {
      fn.apply(this, args);
    } catch (error) {
      handleError.call(this, error, severity, this.setState);
    }
  };
  return handler.bind(obj);
};

export const safeHandlerWarn = (obj, ...args) =>
  safeHandler(obj, "warn", ...args);
export const safeHandlerSilent = (obj, ...args) =>
  safeHandler(obj, "silent", ...args);
export const safeHandlerIgnore = (obj, ...args) =>
  safeHandler(obj, "ignore", ...args);

export default useSafeHandler;
