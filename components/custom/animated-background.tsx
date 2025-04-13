"use client";

import Script from "next/script";

const AnimatedBackground = () => {
  return (
    <div className={"w-full h-full absolute top-0 left-0"}>
      <div id="homepage-background" className={"w-full h-full opacity-60"} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        strategy="beforeInteractive"
      />
      <Script id="script">
        {`VANTA.NET({
          el: "#homepage-background",
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: "black",
          backgroundAlpha: 0,
          color: "white"
        });`}
      </Script>
    </div>
  );
};

export default AnimatedBackground;
