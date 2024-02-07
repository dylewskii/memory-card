import styles from "../styles/index.module.css";

export default function Scoreboard({ currentScore, highestScore }) {
  return (
    <div className={styles.scoreboard}>
      <p className={styles.currentScore}>Current Score: {currentScore}</p>
      <p className={styles.highestScore}>Highest Score: {highestScore}</p>
    </div>
  );
}
