import React from "react";
import posed from "react-pose";
import styled from "styled-components";

const ScrumDiv = styled.div`
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    background: rgb(0,0,0,.3);
    z-index: 100
    will-change: opacity;
`;
//display: ${(p) => p.show ? 'block' : 'none'};
const PosedDiv = posed(ScrumDiv)({
  show: {
    applyAtStart: { transform: "translateX(0)" },
    opacity: 1,
    transition: { duration: 100, ease: "easeIn" }
  },
  hide: {
    applyAtEnd: { transform: "translateX(-10000px)" },
    opacity: 0,
    transition: { duration: 100, ease: "easeOut" }
  }
});
const Scrum = ({ show, children, onClick }) => {
  return (
    <>
      <PosedDiv
        show={show}
        pose={show ? "show" : "hide"}
        onClick={onClick}
        id="Scrum"
      >
        {children}
      </PosedDiv>
    </>
  );
};
export default Scrum;
