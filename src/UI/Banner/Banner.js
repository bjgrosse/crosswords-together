import React, { useContext, useState, useEffect } from "react";
import { Div, Paper } from "../StyledComponents";
import CloseButton from "../CloseButton";
import posed, { PoseGroup } from "react-pose";

const BannerDiv = posed(Div)({
  show: {
    height: "auto",
    transition: { ease: "easeIn" },
    opacity: 1
  },
  hide: {
    height: 0,
    transition: { ease: "easeOut" },
    opacity: 0
  }
});
const Banner = props => {
  return (
    <BannerDiv
      pose={props.show ? "show" : "hide"}
      key="banner"
      flex
      flexWrap
      fullWidth
      alignCenter
      justifyEnd
      zIndex={20}
      className={props.className}
    >
      <Div grow flex p={[1, 1, 2]}>
        <Div grow color="text.secondary">
          {props.content}
        </Div>
        {props.handleClose && (
          <CloseButton size="small" handleClick={props.handleClose} />
        )}
      </Div>
      <Div flex justifyEnd px={[1, 1, 2]}>
        <>{props.actions}</>
      </Div>
    </BannerDiv>
  );
};
export default Banner;
