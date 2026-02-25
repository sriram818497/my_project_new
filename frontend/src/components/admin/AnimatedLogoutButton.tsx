import { useEffect, useRef, useState } from "react";
import styles from "./AnimatedLogoutButton.module.css";

interface AnimatedLogoutButtonProps {
  onLogout: () => void;
}

const ANIMATION_MS = 900;

const AnimatedLogoutButton = ({ onLogout }: AnimatedLogoutButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isAnimating) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion ? 0 : ANIMATION_MS;

    setIsAnimating(!reduceMotion);

    timeoutRef.current = window.setTimeout(() => {
      onLogout();
    }, delay);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isAnimating}
      aria-label="Log out"
      className={`${styles.logoutButton} ${isAnimating ? styles.isAnimating : ""}`}
    >
      <span className={styles.buttonText}>Log Out</span>
      <span className={styles.doorway} aria-hidden="true">
        <span className={styles.figure}>
          <span className={styles.runnerHead} />
          <span className={styles.runnerBody} />
          <span className={`${styles.runnerLeg} ${styles.runnerLegFront}`} />
          <span className={`${styles.runnerLeg} ${styles.runnerLegBack}`} />
        </span>
        <span className={styles.door} />
      </span>
    </button>
  );
};

export default AnimatedLogoutButton;
