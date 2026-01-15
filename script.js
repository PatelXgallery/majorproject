const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");
const inputWord = document.getElementById("inp-word");

const fetchWord = async () => {
    let inpWord = inputWord.value.trim();
    if (!inpWord) {
        result.innerHTML = `<h3 class="error-msg">Please type a word first!</h3>`;
        return;
    }

    result.innerHTML = `<p class="placeholder-text">Searching...</p>`;

    try {
        const response = await fetch(`${url}${inpWord}`);
        const data = await response.json();

        if (response.status === 404) {
            result.innerHTML = `<h3 class="error-msg">Couldn't find the word.</h3>`;
            return;
        }

        // Extracting data safely
        const wordData = data[0];
        const phonetic = wordData.phonetic || (wordData.phonetics[1]?.text || "");
        const audioSrc = wordData.phonetics.find(p => p.audio)?.audio || "";
        const partOfSpeech = wordData.meanings[0].partOfSpeech;
        const definition = wordData.meanings[0].definitions[0].definition;
        const example = wordData.meanings[0].definitions[0].example || "";

        result.innerHTML = `
            <div class="word-header">
                <h2>${inpWord}</h2>
                ${audioSrc ? `<button onclick="playSound('${audioSrc}')"><i class="fas fa-volume-up"></i></button>` : ''}
            </div>
            <div class="details">
                <p>${partOfSpeech}</p>
                <p>${phonetic}</p>
            </div>
            <p class="word-meaning">${definition}</p>
            <p class="word-example">${example ? `"${example}"` : ""}</p>
        `;
    } catch (error) {
        result.innerHTML = `<h3 class="error-msg">An error occurred. Try again later.</h3>`;
    }
};

function playSound(src) {
    const audio = new Audio(src);
    audio.play();
}

btn.addEventListener("click", fetchWord);

inputWord.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWord();
    }
});