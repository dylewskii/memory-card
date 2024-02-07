import styles from "../styles/index.module.css";

export default function Footer() {
  const date = new Date();
  const currYear = date.getFullYear();
  return (
    <footer>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>Copyright &copy; {currYear}</p>
        <p className={styles.credits}>Made by Alan Dylewski</p>
      </div>
    </footer>
  );
}
