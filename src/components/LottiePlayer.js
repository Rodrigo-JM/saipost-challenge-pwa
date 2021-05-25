import React from "react";
import Lottie from "react-lottie";

export default function LottiePlayer({ animationData, boxSize }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Lottie
      options={defaultOptions}
      height={boxSize.height}
      width={boxSize.width}
    />
  );
}
