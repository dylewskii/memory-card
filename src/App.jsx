import { useEffect, useState } from "react";
import "../src/styles/index.module.css";
import Header from "./components/Header";
import DescriptionHero from "./components/DescriptionHero";
import Scoreboard from "./components/Scoreboard";
import CardGrid from "./components/CardGrid";
import Card from "./components/Card";
import Footer from "./components/Footer";

// generate number between 1-1025
// Fetch PokeAPI info for that pokemon,
// -> GET https://pokeapi.co/api/v2/pokemon/bulbasaur
// .sprites.other[official-artwork][front_default]

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

  const getPokemonImageUrl = async (nameOfPokemon) => {
    const request = await fetch(`${baseUrl}${nameOfPokemon}`);
    const data = await request.json();
    const imgUrl = data.sprites.other["official-artwork"].front_default;

    return imgUrl;
  };

  // Runs gameOver() if card already selected, otherwise sets the selected flag to true & updates current score.
  const handleCardClick = (cardId) => {
    // console.log(cardId);
    const clickedPokemon = pokemons[cardId];
    // console.log(clickedPokemon);
    if (clickedPokemon.selected) {
      gameOver();
      alert("pokemon already chosen - game over.");
    } else {
      const updatedPokemons = pokemons.map((pokemon, index) =>
        index === cardId ? { ...pokemon, selected: true } : pokemon
      );
      setPokemons(updatedPokemons);
      setCurrentScore((curr) => curr + 1);
    }
  };

  // Resets current score, updates highest score & resets selected values.
  const gameOver = () => {
    if (currentScore > highestScore) {
      setHighestScore(currentScore);
    }

    setCurrentScore(0);
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
          pokemons?.map((pokemon, i) => (
            <Card key={i} onClick={() => handleCardClick(i)}>
              <Card.Image src={pokemon.imgUrl} />
              <Card.Title>{pokemon.name}</Card.Title>
            </Card>
          ))
        )}
      </CardGrid>
      <Footer />
    </>
  );
}

export default App;
