import { useEffect, useState } from "react";
import "../src/styles/index.module.css";
import Header from "./components/Header";
import DescriptionHero from "./components/DescriptionHero";
import Scoreboard from "./components/Scoreboard";
import CardGrid from "./components/CardGrid";
import Card from "./components/Card";
import Footer from "./components/Footer";

// POKEMON SPRITES PATH
// -> GET https://pokeapi.co/api/v2/pokemon/bulbasaur
// .sprites.other[official-artwork][front_default]

// ALL POKEMON
// https://pokeapi.co/api/v2/pokemon/?limit=1025

function App() {
  const [requestStatus, setRequestStatus] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [pokemons, setPokemons] = useState([]);
  const [hasLost, setHasLost] = useState(false);
  const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

  // On currentScore change - adds an additional Pokemon.
  useEffect(() => {
    const addNewPokemon = async () => {
      try {
        // ensure score has changed and not just initial render
        if (currentScore > 0) {
          const allPokemonNames = await getPokemonNameList();
          // generate a new random index to fetch a new Pokémon
          const newRandomIndex = generateRandomIndex(allPokemonNames.length);
          const newPokemonName = allPokemonNames[newRandomIndex];
          const newPokemonImgUrl = await getPokemonImageUrl(newPokemonName);

          const newPokemon = {
            name: newPokemonName,
            imgUrl: newPokemonImgUrl,
            selected: false,
          };

          // update state to include the new Pokémon
          setPokemons((prevPokemons) => {
            // check if the Pokémon already exists in the list to avoid duplicates
            const exists = prevPokemons.some(
              (pokemon) => pokemon.name === newPokemonName
            );
            if (!exists) return [...prevPokemons, newPokemon];

            return prevPokemons;
          });
        }
      } catch (error) {
        console.error("Error adding new Pokémon:", error);
        setRequestStatus(false);
      }
    };

    addNewPokemon();
  }, [currentScore]);

  // On Mount - Fetches pokemon data from API - sets pokemons state to returned object.
  useEffect(() => {
    const getPokemonData = async () => {
      try {
        const randomIndexList = generateRandomIndexList();
        const allPokemonNames = await getPokemonNameList();
        let startingPokemons = randomIndexList.map(
          (index) => allPokemonNames[index]
        );

        const pokemonDataPromises = startingPokemons.map(
          async (pokemonName) => {
            const name = pokemonName;
            const imgUrl = await getPokemonImageUrl(name);
            const selected = false;
            return { name, imgUrl, selected };
          }
        );

        const pokemonData = await Promise.all(pokemonDataPromises);
        setPokemons(pokemonData);
      } catch (err) {
        console.error("Error fetching Pokémon data:", err);
        setRequestStatus(false);
      }
    };
    getPokemonData();
  }, [hasLost]);

  // Returns a list of all 1025 Pokemons
  const getPokemonNameList = async () => {
    try {
      const request = await fetch(`${baseUrl}?limit=1025`);
      const data = await request.json();
      const results = data.results;
      let pokemonNameList = [];

      results.forEach((result) => pokemonNameList.push(result.name));

      return pokemonNameList;
    } catch (err) {
      return "An error occured whilst fetching/parsing the Pokemon Name List";
    }
  };

  // Returns a random index up to a
  const generateRandomIndex = (length) => Math.floor(Math.random() * length);

  // Returns an array of (5-20) indexes, depending on difficulty provided.
  const generateRandomIndexList = (difficulty = "easy") => {
    const difficultyLevels = {
      easy: 5,
      medium: 10,
      hard: 20,
    };

    // fallback to 'easy' if difficulty invalid
    const count = difficultyLevels[difficulty] || difficultyLevels.easy;
    let randomIndexes = [];

    for (let i = 0; i < count; i++) {
      const randomNum = Math.floor(Math.random() * 1025 + 1);
      randomIndexes.push(randomNum);
    }

    return randomIndexes;
  };

  // Return the provided Pokemons official artwork image URL.
  const getPokemonImageUrl = async (nameOfPokemon) => {
    try {
      const request = await fetch(`${baseUrl}${nameOfPokemon}`);
      const data = await request.json();
      const imgUrl = data.sprites.other["official-artwork"].front_default;
      return imgUrl;
    } catch (err) {
      return "An error occured whilst fetching/parsing the Pokemon Image URL";
    }
  };

  // Runs gameOver() if card already selected, otherwise sets the selected flag to true & updates current score.
  const handleCardClick = (cardId) => {
    const clickedPokemon = pokemons[cardId];
    if (clickedPokemon.selected) {
      gameOver();
      alert("pokemon already chosen - game over.");
    } else {
      const updatedPokemons = pokemons.map((pokemon, index) =>
        index === cardId ? { ...pokemon, selected: true } : pokemon
      );
      const shuffledPokemons = shuffleArray([...updatedPokemons]);
      setPokemons(shuffledPokemons);
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
    setHasLost(true);
  };

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
