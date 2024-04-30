function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
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
            b.addEventListener("click", function(e) {
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
    inp.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
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
      if (currentFocus < 0) currentFocus = (x.length - 1);
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
  let wordCount = 0
    string = string.replace(/(\r\n|\n|\r)/gm, '')
    return string.split(' ').map((word, index) => {
      if (word.toLowerCase() === target) {
          wordCount++
          word = `[${wordCount}] <span class="modernWord" style="color: blue; text-decoration: underline">${target}</span>`
          return word
        } else if (word.toLowerCase().includes(target)) {
          let firstChars = word.substring(0, word.toLowerCase().indexOf(target))
          let lastChars = word.substring(target.length + firstChars.length)
          let regExStart = /^[^a-z]/i
          let regExEnd = /[^a-z]$/i
          if (regExEnd.test(firstChars) || regExStart.test(lastChars)) {
              wordCount++
              let newWord = `[${wordCount}] <span class="modernWord" style="color: blue; text-decoration: underline">${target}</span>`
              return firstChars + newWord + lastChars
          } else {
            return `<span class="modernWord">${word}</span>`
          }
        } else {
          if (word != '') {
            return `<span class="modernWord">${word}</span>`
          }
        }
    }).join(' ')
}

function setHistory(arr, parent, historyCount) {
  arr.length <= 1 ? historyCount.textContent = `${arr.length} Item` : historyCount.textContent = `${arr.length} Items`;

  arr?.map((item) => {

      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.setAttribute('id', item.tracker)

      const timesContainer = document.createElement('div');
      timesContainer.style.display = 'flex';
      timesContainer.style.justifyContent = 'space-between';
      timesContainer.style.flexWrap = 'wrap';

      const lastOpened = document.createElement('h5');
      lastOpened.textContent = `last opened: [${item.last_opened_date}][${item.last_opened_time}]`;

      const dateTime = document.createElement('h5');
      dateTime.textContent = `created: [${item.created_date}][${item.created_time}]`;

      timesContainer.appendChild(lastOpened);
      timesContainer.appendChild(dateTime);

      const p = document.createElement('p');
      p.textContent = item.paragraph;
      p.style.color = 'gray'

      const containingDiv = document.createElement('div');
      containingDiv.style.display = 'flex';
      containingDiv.style.padding = '.3rem';
      containingDiv.style.flexWrap = 'wrap';
      containingDiv.style.color = 'black';
      containingDiv.style.fontSize = '.5rem'
      containingDiv.style.borderTop = '1px solid #afafaf';
      containingDiv.style.borderBottom = '1px solid #afafaf';
      containingDiv.style.marginBottom = '.5rem';
      containingDiv.style.justifyContent = 'space-between';

      const div1 = document.createElement('div');
      div1.textContent = `Words: ${item.word_count}`;

      const div2 = document.createElement('div');
      div2.textContent = `Chars: ${item.char_count}`;

      const div3 = document.createElement('div');
      div3.textContent = `Letters: ${item.letter_count}`;

      const div4 = document.createElement('div');
      div4.textContent = `Symbols: ${item.symbol_count}`;

      const div5 = document.createElement('div');
      div5.textContent = `Numbers: ${item.number_count}`;

      containingDiv.appendChild(div1);
      containingDiv.appendChild(div2);
      containingDiv.appendChild(div3);
      containingDiv.appendChild(div4);
      containingDiv.appendChild(div5);

      const openBtn = document.createElement('button');
      openBtn.textContent = 'Open';
      openBtn.className = 'open-history';

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-history';

      historyItem.appendChild(timesContainer);
      historyItem.appendChild(p);
      historyItem.appendChild(containingDiv);
      historyItem.appendChild(openBtn);
      historyItem.appendChild(deleteBtn);

      parent.appendChild(historyItem);
  })
}

function searchTerm(arr, obj, term) {
  if (arr.includes(term)) {

      if (obj[term] === 1) {
          return  `<strong style="font-weight: bold; font-size: .8rem">${term.toUpperCase()}</strong> is mentioned once`;
      } else {
          return  `<strong style="font-weight: bold; font-size: .8rem">${term.toUpperCase()}</strong> is mentioned <strong>${obj[term]}</strong> times.`
      }
  } else {
      return `${term.toUpperCase()} does not exist`;
  }

}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

const makeElements = (data, parentContainer, container, clickedWord, header) => {
  container.style.display = 'flex';
  const targetElement = document.querySelector('.targetEl');
  targetElement.textContent = clickedWord;
  if (data !== undefined) {
    if (data.title) {
        
        const el = document.createElement('div');
        el.className = 'noDefinitionFoundContainer child';
        
  
        const h4 = document.createElement('h4');
        h4.textContent = data.title;
        const p2 = document.createElement('p');
        p2.textContent = data.message;
        const p3 = document.createElement('p');
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
        const icon_text = document.createElement('div');
        icon_text.style.display = 'flex';
        icon_text.style.alignItems = 'center';
        icon_text.style.gap = '0.5em';
        icon_text.className = 'play-audio'
  
        const speakerIconDiv = document.createElement('div');
        speakerIconDiv.className = 'speaker-icon';
  
        const pronaunciationText = phonetics.text;
        
        if (phonetics.text) {
          const proText = document.createElement('span');
          proText.textContent = pronaunciationText;
          icon_text.appendChild(proText);
        }
        if (phonetics.audio) {
          const icon = document.createElement('i');
          icon.className = 'fa-solid fa-volume-high';
          icon.style.fontSize = '.8rem'
          speakerIconDiv.appendChild(icon);
          icon_text.appendChild(speakerIconDiv);
        }
        
        header.appendChild(icon_text);
      }
  
        const mainContainer = document.createElement('div');
        mainContainer.className = 'mainContainer child';
  
        const sitationDiv = document.createElement('div');
        sitationDiv.className = 'sitationDiv child';
  
        const licenseEl = document.createElement('div');
        licenseEl.innerHTML = `License: <a href=${definitionsObj.license.url} target='_blank'>${
          definitionsObj.license.name
        }</a>`;
  
        const sourceUrlsEl = document.createElement('div');
        sourceUrlsEl.innerHTML = `Sources:${
          definitionsObj.sourceUrls.map((source) => {
            return ` <a href=${source} target='_blank'>${source}</a>`;
          })
        }`;
  
        sitationDiv.appendChild(licenseEl);
        sitationDiv.appendChild(sourceUrlsEl);
        
        meanings?.map((part) => {
          const partOfSpeechDiv = document.createElement('div');
          partOfSpeechDiv.className = 'partOfSpeechDiv'
          const partOfSpeechHeader = document.createElement('h4');
          partOfSpeechHeader.textContent = `[${part.partOfSpeech}]`;
          
          partOfSpeechDiv.appendChild(partOfSpeechHeader);
          mainContainer.appendChild(partOfSpeechDiv);
  
          const definitions = part.definitions;
          
          definitions?.map((def, i) => {
            
            const definitionsDiv = document.createElement('div');
            definitionsDiv.className = 'each-definition';
            partOfSpeechDiv.appendChild(definitionsDiv);
            const h5_def = document.createElement('h5');
            h5_def.textContent = `${i+1}. ${def.definition}`;
            definitionsDiv.appendChild(h5_def);
            if (def.example) {
              const example = document.createElement('p');
              example.textContent = `Example: ${def.example}`;
              definitionsDiv.appendChild(example);
            }
            if (def.antonyms.length > 0) {
              const antonyms = document.createElement('h5');
              antonyms.textContent = `Antonyms: [${def.antonyms.join(', ')}]`;
              definitionsDiv.appendChild(antonyms);
            }
            if (def.synonyms.length > 0) {
              const synonyms = document.createElement('h5');
              synonyms.textContent = `Synonyms: [${def.synonyms.join(', ')}]`;
              definitionsDiv.appendChild(synonyms);
            }
          })
          
        })
        
        //mainContainer.appendChild(sitationDiv);
        parentContainer.appendChild(mainContainer); 
        parentContainer.appendChild(sitationDiv); 
    }
  }
}


  export { autocomplete, searchWordHighlighter, setHistory, searchTerm, getKeyByValue, makeElements };