import { useState } from "react";
import "../src/styles/index.module.css";
import Header from "./components/Header";
import DescriptionHero from "./components/DescriptionHero";
import CardGrid from "./components/CardGrid";
import Card from "./components/Card";
import Footer from "./components/Footer";

function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  return (
    <>
      <Header currentScore={currentScore} highestScore={highestScore} />
      <DescriptionHero />
      <CardGrid></CardGrid>
      <Footer />
    </>
  );
}

export default App;
