import { useEffect, useState } from "react";
import "../src/styles/index.module.css";
import Header from "./components/Header";
import DescriptionHero from "./components/DescriptionHero";
import Scoreboard from "./components/Scoreboard";
import CardGrid from "./components/CardGrid";
import Card from "./components/Card";
import Footer from "./components/Footer";

function App() {
  const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

  // Img URL below requires ID or Name at the end
  // .sprites.other[official-artwork][front_default]
  // "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
  const [requestStatus, setRequestStatus] = useState(true);

  const [currentScore, setCurrentScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  const [pokemons, setPokemons] = useState([]);

  // Fetches pokemon data from API - sets pokemons state to returned object.
  useEffect(() => {
    async function getPokemonData() {
      const request = await fetch(baseUrl);
      if (!request.ok) return setRequestStatus(false);

      const data = await request.json();
      const pokemonResults = await data.results;

      const pokemonData = pokemonResults.map((poke, i) => {
        const name = poke.name;
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
          i + 1
        }.png`;
        const selected = false;
        return { name, imgUrl, selected };
      });

      setPokemons(pokemonData);
    }
    getPokemonData();
  }, []);

  // Runs gameOver() if card already selected, otherwise sets the selected flag to true & updates current score.
  const handleCardClick = (cardId) => {
    if (pokemons[cardId].selected) {
      gameOver();
      alert("pokemon already chosen - game over.");
      return "lost";
    }

    pokemons[cardId].selected = true;
    setCurrentScore((curr) => curr + 1);
  };

  // Resets current score, updates highest score & resets selected values.
  const gameOver = () => {
    setCurrentScore(0);

    if (currentScore > highestScore) {
      setHighestScore(currentScore);
      return;
    }

    setPokemons((pokemons) => pokemons.map((p) => ({ ...p, selected: false })));
  };

  return (
    <>
      <Header currentScore={currentScore} highestScore={highestScore} />
      <DescriptionHero />
      <Scoreboard currentScore={currentScore} highestScore={highestScore} />
      <CardGrid>
        {!requestStatus ? (
          <p>Failed to Retrieve Data :( </p>
        ) : (
          pokemons.map((pokemon, i) => (
            <Card key={i} onClick={() => handleCardClick(i + 1)}>
              <Card.Title>{pokemon.name}</Card.Title>
              <Card.Image src={pokemon.imgUrl} />
            </Card>
          ))
        )}
      </CardGrid>
      <Footer />
    </>
  );
}

export default App;
