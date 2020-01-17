import red from "@material-ui/core/colors/red";
import pink from "@material-ui/core/colors/pink";
import purple from "@material-ui/core/colors/purple";
import deepPurple from "@material-ui/core/colors/deepPurple";
import indigo from "@material-ui/core/colors/indigo";
import blue from "@material-ui/core/colors/blue";
import lightBlue from "@material-ui/core/colors/lightBlue";
import cyan from "@material-ui/core/colors/cyan";
import teal from "@material-ui/core/colors/teal";
import green from "@material-ui/core/colors/green";
import lightGreen from "@material-ui/core/colors/lightGreen";
import lime from "@material-ui/core/colors/lime";
import yellow from "@material-ui/core/colors/yellow";
import amber from "@material-ui/core/colors/amber";
import orange from "@material-ui/core/colors/orange";
import deepOrange from "@material-ui/core/colors/deepOrange";
import brown from "@material-ui/core/colors/brown";
import grey from "@material-ui/core/colors/grey";
import blueGrey from "@material-ui/core/colors/blueGrey";

export const levelColors = {
  beginner: orange,
  easy: green,
  medium: cyan,
  hard: deepPurple,
  expert: red
};

export const colors = {
  Red: red,
  Pink: pink,
  Purple: purple,
  "Deep Purple": deepPurple,
  Indigo: indigo,
  Blue: blue,
  "Light Blue": lightBlue,
  Cyan: cyan,
  Teal: teal,
  Green: green,
  "Light Green": lightGreen,
  Lime: lime,
  Yellow: yellow,
  Amber: amber,
  Orange: orange,
  "Deep Orange": deepOrange,
  Brown: brown,
  Grey: grey,
  "Blue Grey": blueGrey
};

export const playerColors = {
  //Red: red,
  Pink: pink,
  //Purple: purple,
  "Deep Purple": deepPurple,
  //Indigo: indigo,
  Blue: blue,
  //"Light Blue": lightBlue,
  Cyan: cyan,
  // Teal: teal,
  Green: green,
  //"Light Green": lightGreen,
  Lime: lime,
  //Yellow: yellow,
  Amber: amber,
  //Orange: orange,
  "Deep Orange": deepOrange
};
export const getRandomPlayerColor = () => {
  return playerColors[Math.floor(Math.random() * playerColors.length)];
};

export default colors;
