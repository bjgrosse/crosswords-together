import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
const useNavigateTo = props => {
  const history = useHistory();
  return () => {
    history.push(props);
  };
};
export default useNavigateTo;
