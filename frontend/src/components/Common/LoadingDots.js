import React from "react";
import styles from "../../styles/styleObjects";

const LoadingDots = ({ darkMode }) => (
  <div style={styles(darkMode).loadingDots}>
    <div
      style={{
        ...styles(darkMode).loadingDot,
        animationDelay: "0s",
      }}
    ></div>
    <div
      style={{
        ...styles(darkMode).loadingDot,
        animationDelay: "0.2s",
      }}
    ></div>
    <div
      style={{
        ...styles(darkMode).loadingDot,
        animationDelay: "0.4s",
      }}
    ></div>
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    `}</style>
  </div>
);

export default LoadingDots;
