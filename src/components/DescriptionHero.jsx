import styles from "../styles/index.module.css";

export default function DescriptionHero() {
  return (
    <section className={styles.descriptionHero}>
      <h2>How to Play</h2>
      <p>
        Avoid clicking the same Pokémon in a single game. The more unique
        Pokémon you select, the higher your score. You can begin the game by
        clicking on any Pokémon.
      </p>
    </section>
  );
}
