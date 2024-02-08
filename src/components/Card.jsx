import styles from "../styles/index.module.css";

export default function Card({ children, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      {children}
    </div>
  );
}

Card.Image = ({ src }) => {
  return <img src={src} className={styles.cardImage}></img>;
};

Card.Title = ({ children }) => {
  return <p className={styles.cardTitle}>{children}</p>;
};

Card.Image.displayName = "Card.Image";
Card.Title.displayName = "Card.Title";
