const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const key = document.querySelector("#key").value;

  if (key) {
    console.log(`Print key: ${key}`);

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${key}`;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message == "Not Found") invalidUserName();
        else extractApiData(data, key);
      })
      .catch((error) => console.log(error));
  } else {
    alert("Key cannot be empty");
  }
});

function invalidUserName() {
  alert("Unable to find the word!");
  // document.querySelector(".result").style.visibility = "hidden";
  // document.querySelector("#name").style.visibility = "hidden";
}

function extractApiData(data, key) {
  let word = key;
  let pronounciation = "";
  let partOfSpeech = new Array();
  let definition = new Array();
  let synonyms = new Array();
  let antonyms = new Array();
  let sourceUrls = new Array();

  for (const item of data) {
    const phoneticsArray = item.phonetics;

    word = item.word;

    for (const phonetic of phoneticsArray) {
      if (phonetic.text) {
        pronounciation = phonetic.text;
        break;
      }
    }

    const meaningsArray = item.meanings;

    for (const meaning of meaningsArray) {
      partOfSpeech.push(meaning.partOfSpeech);
      for (const def of meaning.definitions) {
        if (def) {
          if (def.definition) definition.push(def.definition);
          if (def.synonyms) {
            for (const syn of def.synonyms) synonyms.push(syn);
          }
          if (def.antonyms) {
            for (const ant of def.antonyms) antonyms.push(def.antonyms);
          }
          break;
        }
      }

      for (const syn of meaning.synonyms) {
        if (syn) synonyms.push(syn);
      }

      for (const ant of meaning.antonyms) {
        if (ant) antonyms.push(ant);
      }
    }

    if (item.sourceUrls)
      for (const url of item.sourceUrls) sourceUrls.push(url);
  }

  showApiData(
    word,
    pronounciation,
    partOfSpeech,
    definition,
    synonyms,
    antonyms,
    sourceUrls
  );
}

function showApiData(
  word,
  pronounciation,
  partOfSpeech,
  definition,
  synonyms,
  antonyms,
  sourceUrls
) {
  const outputBox = document.querySelector(".output");
  outputBox.innerHTML = "";

  //  Word
  const urlWord = document.createElement("div");
  urlWord.className = "box";
  const addWord = document.createTextNode(`Word: ${word}`);
  urlWord.appendChild(addWord);
  urlWord.appendChild(document.createElement("br"));
  const addPronounciation = document.createTextNode(
    `Pronounciation: ${pronounciation}`
  );
  urlWord.appendChild(addPronounciation);
  outputBox.appendChild(urlWord);

  // Definitions
  const urlDefinitions = document.createElement("div");
  urlDefinitions.className = "box";

  const addDef = document.createTextNode("Definitions");
  urlDefinitions.appendChild(addDef);

  for (let i = 0; i < definition.length; i++) {
    const speech = `Part of speech: ${partOfSpeech[i]}`;
    const def = `Definition: ${definition[i]}`;

    const defDiv = document.createElement("div");
    const addSpeech = document.createTextNode(speech);
    defDiv.appendChild(addSpeech);
    defDiv.appendChild(document.createElement("br"));
    const addDef = document.createTextNode(def);
    defDiv.appendChild(addDef);

    urlDefinitions.appendChild(defDiv);
  }

  outputBox.appendChild(urlDefinitions);

  //  Synonyms
  const urlSynonym = document.createElement("div");
  urlSynonym.className = "box";

  const addSynonym = document.createTextNode("Synonyms");
  urlSynonym.appendChild(addSynonym);

  for (const synonym of synonyms) {
    const li = document.createElement("li");
    const addText = document.createTextNode(synonym);
    li.appendChild(addText);
    urlSynonym.style.padding = "10px";
    urlSynonym.appendChild(li);
  }
  outputBox.appendChild(urlSynonym);

  //  Antonyms
  const urlAntonyms = document.createElement("div");
  urlAntonyms.className = "box";

  const addAntonym = document.createTextNode("Antonyms");
  urlAntonyms.appendChild(addAntonym);

  for (const antonym of antonyms) {
    const li = document.createElement("li");
    const addText = document.createTextNode(antonym);
    li.appendChild(addText);
    urlAntonyms.style.padding = "10px";
    urlAntonyms.appendChild(li);
  }

  if (antonyms.length == 0) {
    urlAntonyms.appendChild(document.createElement("br"));
    const addAntonym = document.createTextNode("No antonyms found");
    urlAntonyms.appendChild(addAntonym);
  }

  outputBox.appendChild(urlAntonyms);

  //  Source urls
  const urlDiv = document.createElement("div");
  urlDiv.className = "box";

  const addText = document.createTextNode("Source URLs");
  urlDiv.appendChild(addText);

  for (const sourceUrl of sourceUrls) {
    const li = document.createElement("li");
    const addText = document.createTextNode(sourceUrl);
    li.appendChild(addText);
    urlDiv.style.padding = "10px";
    urlDiv.appendChild(li);
  }

  outputBox.appendChild(urlDiv);
}
