let publicKey = "9d96ea0c679598a6b6d9cefa4e166d9d";
let privateKey = "27d76088afcdfa0b7807e5c769c1f774ed075609";
let input = document.getElementById("input-box");
let button = document.getElementById("submit-button");
let showContainer = document.getElementById("show-container");
let listContainer = document.querySelector(".list");

function generateHash(ts) {
  // Function to generate the hash required for Marvel API authentication
  return md5(ts + privateKey + publicKey);
}

function displayWords(value) {
  input.value = value;
  removeElements();
}

function removeElements() {
  listContainer.innerHTML = "";
}

async function fetchData(searchQuery) {
  let ts = Date.now().toString();
  let hashValue = generateHash(ts);
  const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${searchQuery}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const jsonData = await response.json();
    return jsonData.data["results"];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function displayCharacterInfo() {
  const searchQuery = input.value.trim();
  if (searchQuery.length < 1) {
    alert("Input cannot be blank");
    return;
  }
  showContainer.innerHTML = "Loading...";

  const characters = await fetchData(searchQuery);
  if (characters.length === 0) {
    showContainer.innerHTML = "No characters found.";
    return;
  }

  const character = characters[0];
  showContainer.innerHTML = `
    <div class="card-container">
      <div class="container-character-image">
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" />
      </div>
      <div class="character-name">${character.name}</div>
      <div class="character-description">${character.description || "No description available."}</div>
    </div>`;

  // Change the background color based on the superhero name
  changeBackgroundColor(character.name);
}

function changeBackgroundColor(superheroName) {
    const body = document.querySelector("body");
    switch (superheroName.toLowerCase()) {
      case "iron man":
        body.style.backgroundColor = "red";
        break;
      case "captain america":
        body.style.backgroundColor = "blue";
        break;
      case "hulk":
        body.style.backgroundColor = "green";
        break;
      case "black widow":
        body.style.backgroundColor = "black";
        break;
      case "thor":
        body.style.backgroundColor = "white";
        break;
      case "hawkeye":
        body.style.backgroundColor = "purple";
        break;
      default:
        body.style.backgroundColor = "#e01a38"; // Default background color
        break;
    }
  }
  

input.addEventListener("keyup", async () => {
  removeElements();
  if (input.value.length < 4) {
    return false;
  }

  const characters = await fetchData(input.value);
  characters.forEach((character) => {
    let name = character.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomplete-items");
    div.setAttribute("onclick", `displayWords('${name}')`);
    let word = "<b>" + name.substr(0, input.value.length) + "</b>";
    word += name.substr(input.value.length);
    div.innerHTML = `<p class="item">${word}</p>`;
    listContainer.appendChild(div);
  });
});

button.addEventListener("click", displayCharacterInfo);

window.onload = displayCharacterInfo;
