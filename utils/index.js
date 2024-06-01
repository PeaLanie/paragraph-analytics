function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  let currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    let a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function searchWordHighlighter(string, target) {
  let wordCount = 0;
  string = string.replace(/(\r\n|\n|\r)/gm, "");
  return string
    .split(" ")
    .map((word) => {
      if (word.toLowerCase() === target) {
        wordCount++;
        word = `[${wordCount}] <span title="${word}" class="modernWord" style="color: blue; text-decoration: underline">${target}</span>`;
        return word;
      } else if (word.toLowerCase().includes(target)) {
        let firstChars = word.substring(0, word.toLowerCase().indexOf(target));
        let lastChars = word.substring(target.length + firstChars.length);
        let regExStart = /^[^a-z]/i;
        let regExEnd = /[^a-z]$/i;
        if (regExEnd.test(firstChars) || regExStart.test(lastChars)) {
          wordCount++;
          let newWord = `[${wordCount}] <span title="${target}" class="modernWord" style="color: blue; text-decoration: underline">${target}</span>`;
          return firstChars + newWord + lastChars;
        } else {
          return `<span title="${word}" class="modernWord">${word}</span>`;
        }
      } else {
        if (word != "") {
          return `<span title="${word}" class="modernWord">${word}</span>`;
        }
      }
    })
    .join(" ");
}

function setHistory(arr, parent, historyCount) {
  arr.length <= 1
    ? (historyCount.textContent = `${arr.length} Item`)
    : (historyCount.textContent = `${arr.length} Items`);

  arr?.map((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.setAttribute("id", item.tracker);

    const timesContainer = document.createElement("div");
    timesContainer.className = "history-times";

    const lastOpened = document.createElement("h5");
    lastOpened.textContent = `opened: [${item.opened_date}][${item.opened_time}]`;

    const dateTime = document.createElement("h5");
    dateTime.textContent = `created: [${item.created_date}][${item.created_time}]`;

    timesContainer.appendChild(lastOpened);
    timesContainer.appendChild(dateTime);

    const p = document.createElement("p");
    p.innerHTML = `<span class= "history-element-title">Title: ${item.popular.toUpperCase()}</span> --> ${item.sentence}`;

    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.className = "open-history";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-history";

    historyItem.appendChild(timesContainer);
    historyItem.appendChild(p);
    historyItem.appendChild(openBtn);
    historyItem.appendChild(deleteBtn);

    parent.appendChild(historyItem);
  });
}

function searchTerm(arr, obj, term) {
  if (arr.includes(term)) {
    if (obj[term] === 1) {
      return `<strong style="font-size: .8rem">${term.toUpperCase()}</strong> is mentioned once`;
    } else {
      return `<strong style="font-size: .8rem">${term.toUpperCase()}</strong> is mentioned <strong>${
        obj[term]
      }</strong> times.`;
    }
  } else {
    return `${term.toUpperCase()} does not exist`;
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

const makeElements = (
  data,
  parentContainer,
  container,
  clickedWord,
  header
) => {
  container.style.display = "flex";
  const targetElement = document.querySelector(".targetEl");
  targetElement.textContent = clickedWord;
  if (data !== undefined) {
    if (data.title) {
      const el = document.createElement("div");
      el.className = "noDefinitionFoundContainer child";

      const h4 = document.createElement("h4");
      h4.textContent = data.title;
      const p2 = document.createElement("p");
      p2.textContent = data.message;
      const p3 = document.createElement("p");
      p3.textContent = data.resolution;

      el.appendChild(h4);
      el.appendChild(p2);
      el.appendChild(p3);

      parentContainer.appendChild(el);
    } else {
      const definitionsObj = data[0];
      const meanings = definitionsObj.meanings;
      const phonetics = definitionsObj.phonetics[0];

      if (definitionsObj.phonetics.length > 0) {
        const icon_text = document.createElement("div");
        icon_text.style.display = "flex";
        icon_text.style.alignItems = "center";
        icon_text.style.gap = "0.5em";
        icon_text.className = "play-audio";

        const speakerIconDiv = document.createElement("div");
        speakerIconDiv.className = "speaker-icon";

        const pronaunciationText = phonetics.text;

        if (phonetics.text) {
          const proText = document.createElement("span");
          proText.textContent = pronaunciationText;
          icon_text.appendChild(proText);
        }
        if (phonetics.audio) {
          const icon = document.createElement("i");
          icon.className = "fa-solid fa-volume-high";
          icon.style.fontSize = ".8rem";
          speakerIconDiv.appendChild(icon);
          icon_text.appendChild(speakerIconDiv);
        }

        header.appendChild(icon_text);
      }

      const mainContainer = document.createElement("div");
      mainContainer.className = "mainContainer child";

      const sitationDiv = document.createElement("div");
      sitationDiv.className = "sitationDiv child";

      const licenseEl = document.createElement("div");
      licenseEl.innerHTML = `License: <a href=${definitionsObj.license.url} target='_blank'>${definitionsObj.license.name}</a>`;

      const sourceUrlsEl = document.createElement("div");
      sourceUrlsEl.innerHTML = `Sources:${definitionsObj.sourceUrls.map(
        (source) => {
          return ` <a href=${source} target='_blank'>${source}</a>`;
        }
      )}`;

      sitationDiv.appendChild(licenseEl);
      sitationDiv.appendChild(sourceUrlsEl);

      meanings?.map((part) => {
        const partOfSpeechDiv = document.createElement("div");
        partOfSpeechDiv.className = "partOfSpeechDiv";
        const partOfSpeechHeader = document.createElement("h4");
        partOfSpeechHeader.textContent = `[${part.partOfSpeech}]`;

        partOfSpeechDiv.appendChild(partOfSpeechHeader);
        mainContainer.appendChild(partOfSpeechDiv);

        const definitions = part.definitions;

        definitions?.map((def, i) => {
          const definitionsDiv = document.createElement("div");
          definitionsDiv.className = "each-definition";
          partOfSpeechDiv.appendChild(definitionsDiv);
          const h5_def = document.createElement("h5");
          h5_def.textContent = `${i + 1}. ${def.definition}`;
          definitionsDiv.appendChild(h5_def);
          if (def.example) {
            const example = document.createElement("p");
            example.textContent = `Example: ${def.example}`;
            definitionsDiv.appendChild(example);
          }
          if (def.antonyms.length > 0) {
            const antonyms = document.createElement("h5");
            antonyms.textContent = `Antonyms: [${def.antonyms.join(", ")}]`;
            definitionsDiv.appendChild(antonyms);
          }
          if (def.synonyms.length > 0) {
            const synonyms = document.createElement("h5");
            synonyms.textContent = `Synonyms: [${def.synonyms.join(", ")}]`;
            definitionsDiv.appendChild(synonyms);
          }
        });
      });

      //mainContainer.appendChild(sitationDiv);
      parentContainer.appendChild(mainContainer);
      parentContainer.appendChild(sitationDiv);
    }
  }
};

function showAnalysis(text, el) {
  const punctuation = "–⁠!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0-9";
  const regex = new RegExp(`[${punctuation}]`, "g");
  const sentence = text.replace(/(\r\n|\n|\r)/gm, "");
  let wordList = [];
  const sentenceWithoutPunctuations = sentence.replace(regex, "");
  const chars = sentence.replaceAll(" ", "");
  const letters = sentence.replace(regex, "").replaceAll(" ", "");
  const symbols = sentence.replaceAll(/\w/g, "").replaceAll(" ", "");
  const digits = text.replace(/[^\d]/g, "");

  const sentenceWithTags = sentence
    .split(" ")
    .filter((item) => item !== "")
    .map((word) => {
      return `<span title="${word}" class="modernWord">${word}</span>`;
    })
    .join(" ");
  
  wordList = sentenceWithoutPunctuations.toLowerCase()
    .split(" ")
    .filter((word) => word != "");
  
  let paragraphContainer = document.createElement("div");
  paragraphContainer.id = "paragraph";

  let popular = getPopularTerm(wordList);
  
  let header = document.createElement("div");
  header.className = "containerHeader";
  header.textContent = popular;

  const paragraph = document.createElement("p");
  paragraph.className = "inner-paragraph";
  paragraph.innerHTML = sentenceWithTags;

  paragraphContainer.appendChild(paragraph);

  let outer_sroller = document.createElement("div");
  outer_sroller.className = "scroller";

  let displaysContainer = document.createElement("ul");
  displaysContainer.className = "displays";

  outer_sroller.appendChild(displaysContainer);

  let words = document.createElement("li");
  words.textContent = `Words: ${wordList.length}`;

  let characters = document.createElement("li");
  characters.textContent = `Characters: ${chars.length}`;

  let letters_el = document.createElement("li");
  letters_el.textContent = `Letters: ${letters.length}`;

  let symbols_el = document.createElement("li");
  symbols_el.textContent = `Symbols: ${symbols.length}`;

  let digits_el = document.createElement("li");
  digits_el.textContent = `Numbers: ${digits.length}`;

  displaysContainer.appendChild(words);
  displaysContainer.appendChild(characters);
  displaysContainer.appendChild(letters_el);
  displaysContainer.appendChild(symbols_el);
  displaysContainer.appendChild(digits_el);

  el.appendChild(header);
  el.appendChild(paragraphContainer);
  el.appendChild(outer_sroller);

  return { popular: getPopularTerm(wordList), list: wordList };
}

function getPopularTerm(list) {
  let sortedList = list.sort()
  let duplicates = sortedList
    .filter((word) => word.length > 4)
    .filter((word, i, arr) => word === arr[i - 1] || word === arr[i + 1]);

  
  const sameWordsCount = {};

  for (const word of duplicates) {
    sameWordsCount[word] = sameWordsCount[word] ? sameWordsCount[word] + 1 : 1;
  }

  let occurrenceList = Object.values(sameWordsCount);
  let max = Math.max(...occurrenceList);

  return getKeyByValue(sameWordsCount, max);
}

function addAnimation() {
  const inner_scroller = document.querySelector(".displays");
  const scroller_content = Array.from(inner_scroller.children);

  scroller_content.forEach(item => {
    const duplicatedItem = item.cloneNode(true);
    duplicatedItem.setAttribute("aria-hidden", true);
    inner_scroller.appendChild(duplicatedItem);
  })
}

export {
  autocomplete,
  searchWordHighlighter,
  setHistory,
  searchTerm,
  getKeyByValue,
  makeElements,
  showAnalysis,
  addAnimation
};
