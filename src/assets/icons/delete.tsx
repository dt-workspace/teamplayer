import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    fill="#000000"
    width={props.width || "800px"}
    height={props.height || "800px"}
    viewBox="0 0 24 24"
    id="delete"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <Path
      id="secondary"
      d="M16,7V4a1,1,0,0,0-1-1H9A1,1,0,0,0,8,4V7"
      style={{
        fill: "none",
        stroke: "rgb(44, 169, 188)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary"
      d="M18,20V7H6V20a1,1,0,0,0,1,1H17A1,1,0,0,0,18,20ZM4,7H20"
      style={{
        fill: "none",
        stroke: "rgb(0, 0, 0)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </Svg>
);
export default SVGComponent;
