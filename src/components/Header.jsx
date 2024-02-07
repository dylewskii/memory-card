import styles from "../styles/index.module.css";

export default function Header({ currentScore, highestScore }) {
  return (
    <header>
      <h1>PokéMemory</h1>
      <div className={styles.scoreboard}>
        <p className={styles.currentScore}>Current Score: {currentScore}</p>
        <p className={styles.highestScore}>Highest Score: {highestScore}</p>
      </div>
    </header>
  );
}
