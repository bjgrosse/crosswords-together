import { useCallback } from "react";
import { useHistory } from "react-router-dom";
/**
 * Uses history.push to navigate to the specified URL.
 *
 * @param {string} url
 *
 * Usage:
 *  <Button onClick={useNavigateTo("/start")}>Start</Button>
 */
const useNavigateTo = url => {
  const history = useHistory();
  return useCallback(() => {
    history.push(url);
  }, [url, history]);
};
export default useNavigateTo;
