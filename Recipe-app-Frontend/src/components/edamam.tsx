import axios from "axios";
import  { useState, useEffect } from "react";
import "../Style/postcard.css"; // Import postcard styles

const Edamam = ({handleLogout}:{handleLogout:any}) => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState('');

  useEffect(() => {
    getRecipes();
  }, [query]);

  const getRecipes = async () => {
    const APP_ID = "c5626dcb";
    const APP_KEY = "fb1bf880fb271d5db2243fefc671ac63";
    const response = await axios.get(
      `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    setRecipes(response.data.hits);
    console.log(response.data.hits);
  };

  const updateSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(search);
  };

  const getSearch = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(search);
    setSearch("");
  };

  useEffect(() => {
    if (!handleLogout) return;
    return () => setRecipes([]);
  }, [handleLogout]);

  return (
    <div style={{ textAlign: "center" }}>
    <form onSubmit={getSearch} className="search-form">
        <input
            className="search-bar post-content"
            type="text"
            value={search}
            onChange={updateSearch}
            style={{marginTop: "120px" ,width: "200px", backgroundColor:"white"  }}
        />
        <button className="search-button post-button" type="submit" style={{backgroundColor:"darkgreen", borderRadius: "5px"}}>
            Search
        </button>
    </form>
      <div className="recipes">
        {recipes.map((recipe: any) => (
          <a
            key={recipe.recipe.label}
            href={recipe.recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
            style={{ backgroundImage: `url(${recipe.recipe.image})` }}
          >
            <div className="content-wrapper">
              <div className="post-content">
                <h2>{recipe.recipe.label}</h2>
                {/* Add more content here if needed */}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Edamam;
