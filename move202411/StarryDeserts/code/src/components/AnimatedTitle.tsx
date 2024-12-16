"use client";

import { useEffect, useRef } from "react";

export default function AnimatedTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const letters = title.textContent!.split("");
    title.textContent = "";
    letters.forEach((letter, i) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.opacity = "0";
      span.style.transition = `opacity 0.5s ease ${i * 0.1}s`;
      title.appendChild(span);
    });

    setTimeout(() => {
      Array.from(title.children).forEach((span) => {
        (span as HTMLElement).style.opacity = "1";
      });
    }, 100);

    const glowAnimation = () => {
      title.style.textShadow =
        "2px 2px 4px rgba(102, 51, 153, 0.5), -2px -2px 4px rgba(102, 51, 153, 0.5)";
      setTimeout(() => {
        title.style.textShadow =
          "1px 1px 2px rgba(102, 51, 153, 0.3), -1px -1px 2px rgba(102, 51, 153, 0.3)";
      }, 2000);
    };

    const intervalId = setInterval(glowAnimation, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const titleStyle = {
    fontFamily: "'Brush Script MT', cursive",
    letterSpacing: "0.05em",
    textShadow:
      "1px 1px 2px rgba(102, 51, 153, 0.3), -1px -1px 2px rgba(102, 51, 153, 0.3)",
  };

  return (
    <h1
      ref={titleRef}
      style={{
        fontSize: "128px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#7A288A",
        marginBottom: "32px",
        ...titleStyle,
      }}
    >
      PixelTape
    </h1>
  );
}
