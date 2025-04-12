import * as React from "react";

// By: tabler
// See: https://v0.app/icon/tabler/flare
// Example: <IconTablerFlare width="24px" height="24px" style={{color: "#000000"}} />

export const Feature = ({
  height = "1em",
  strokeWidth = "2",
  fill = "none",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="m12 3l3 6l6 3l-6 3l-3 6l-3-6l-6-3l6-3z"
    />
  </svg>
);
