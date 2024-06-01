import {
  autocomplete,
  searchWordHighlighter,
  setHistory,
  searchTerm,
  getKeyByValue,
  makeElements,
  showAnalysis
} from "./utils/index.js";
import { getDefination } from "./api/index.js";

window.addEventListener("DOMContentLoaded", () => {
  const user_input = document.querySelector("#user_input");
  const submit = document.querySelector("#submit");
  const search_words = document.querySelector("#search_words");
  const search_btn = document.querySelector("#search_btn");
  const searchBar = document.querySelector(".search_bar");
  const container = document.querySelector(".container");
  const definitionContainer = document.querySelector(".definitionContainer");
  const definitions = document.querySelector(".definitions");
  const definitionHeader = document.querySelector(".definition-header");
  const welcomeMsg = document.querySelector(".welcome-message-container");
  const welcomeMsgBtn = document.querySelector("#welcome-msg-btn");
  const inputArea = document.querySelector(".input_area");
  const historyBox = document.querySelector(".history-box");
  let words = [];
  let sentence;
  let popular_and_listObj;
  let modernWord;
  
  submit.addEventListener("click", () => {
    sentence = user_input.value;
    const first_time = localStorage.getItem("first_time");
    if (first_time) {
      welcomeMsg.style.display = "none";
    }

    if (sentence != false) {
      historyBox.style.display = "none";
      popular_and_listObj = showAnalysis(sentence, container);
      user_input.value = "";
      
      container.style.display = "block";

      modernWord = document.querySelectorAll(".modernWord");
      modernWord.forEach((word) => {
        word.addEventListener("click", (e) => {
          const targetEl = e.target;
          let targetContent = targetEl.textContent.toLowerCase();
          targetContent = targetContent.replace(/\W/g, "");

          getDefination(targetContent, definitions).then((data) => {
            makeElements(
              data,
              definitions,
              definitionContainer,
              targetContent,
              definitionHeader
            );

            const speakerIcon = document.querySelector(".speaker-icon");
            if (speakerIcon) {
              speakerIcon.addEventListener("click", (e) => {
                if (data[0].phonetics.length > 0) {
                  if (data[0].phonetics[0].audio) {
                    const audio = new Audio(data[0].phonetics[0].audio);
                    audio.play();
                  }
                }
              });
            }
          });
        });
      });

      const timestamp = new Date();
      const date = `${timestamp.getDate()}-${
        timestamp.getMonth() + 1
      }-${timestamp.getFullYear()}`;
      const time = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
      words.sort();

      const historyObj = {};
      let objlist = [];
      if (localStorage.paragraph_analytics_history) {
        objlist = JSON.parse(localStorage.paragraph_analytics_history);
      }

      historyObj["tracker"] = timestamp.getTime();
      historyObj["sentence"] = sentence;
      historyObj["created_date"] = date;
      historyObj["created_time"] = time;
      historyObj["opened_date"] = date;
      historyObj["opened_time"] = time;
      historyObj["popular"] = popular_and_listObj.popular;
      objlist.push(historyObj);
      localStorage.setItem(
        `paragraph_analytics_history`,
        JSON.stringify(objlist)
      );

      inputArea.style.display = "none";
      searchBar.style.display = "inline-block";
    } else {
      resultsPoint.textContent = "Type or paste a paragraph to work with.";
      blur_bg.style.visibility = "visible";
      resultsBox.classList.add("resultsBoxVisible");
      container.style.display = "none";
    }
  });

  const resultsBtn = document.querySelector("#resultsBtn");
  const resultsPoint = document.querySelector("#resultsPoint");
  const resultsBox = document.querySelector(".resultsBox");
  const blur_bg = document.querySelector(".blur_bg");
  // ====================== SEARCH BTN EVENT LISTENER ======================

  let searchTermsObj = localStorage.getItem("searchTermsObj");
  let searchTermsArray = [];
  if (!searchTermsObj) {
    searchTermsObj = {};
    localStorage.setItem("searchTermsArray", JSON.stringify(searchTermsArray));
    localStorage.setItem("searchTermsObj", JSON.stringify(searchTermsObj));
  }

  search_btn.addEventListener("click", () => {
    const paragraph = document.querySelector(".inner-paragraph");
    let search_term = search_words.value.toLowerCase().trim();

    const wordsObj = {};
    
    for (const word of popular_and_listObj.list) {
      wordsObj[word] = wordsObj[word] ? wordsObj[word] + 1 : 1;
    }
    console.log(wordsObj)
    if (search_term) {
      searchTermsArray = JSON.parse(localStorage.getItem("searchTermsArray"));
      searchTermsObj = {};

      searchTermsArray.push(search_term);
      for (const word of searchTermsArray) {
        searchTermsObj[word] = searchTermsObj[word]
          ? searchTermsObj[word] + 1
          : 1;
      }
      localStorage.setItem(
        "searchTermsArray",
        JSON.stringify(searchTermsArray)
      );
      localStorage.setItem("searchTermsObj", JSON.stringify(searchTermsObj));

      // ================ RESULTS BOX POPUP CONDITION ==================
      
      resultsPoint.innerHTML = searchTerm(popular_and_listObj.list, wordsObj, search_term);
      blur_bg.style.visibility = "visible";
      resultsBox.classList.add("resultsBoxVisible");
      // ================= THE END: RESULTS BOX POPUP CONDITION =================
    } else {
      resultsPoint.textContent = "Please input search term";
      blur_bg.style.visibility = "visible";
      resultsBox.classList.add("resultsBoxVisible");
    }

    paragraph.innerHTML = searchWordHighlighter(sentence, search_term);

    let modernWord = document.querySelectorAll(".modernWord");
    modernWord.forEach((word) => {
      word.addEventListener("click", (e) => {
        const targetEl = e.target;
        let targetContent = targetEl.textContent.toLowerCase();
        targetContent = targetContent.replace(/\W/g, "");

        getDefination(targetContent, definitions).then((data) => {
          makeElements(
            data,
            definitions,
            definitionContainer,
            targetContent,
            definitionHeader
          );

          const speakerIcon = document.querySelector(".speaker-icon");
          if (speakerIcon) {
            speakerIcon.addEventListener("click", (e) => {
              if (data[0].phonetics.length > 0) {
                if (data[0].phonetics[0].audio) {
                  const audio = new Audio(data[0].phonetics[0].audio);
                  audio.play();
                }
              }
            });
          }
        });
      });
    });

    search_words.value = "";
  });
  // ================= THE END: SEARCH BTN EVENT LISTENER ==================

  resultsBtn.addEventListener("click", () => {
    resultsBox.classList.remove("resultsBoxVisible");
    blur_bg.style.visibility = "hidden";
  });

  const closeDefinitions = document.querySelector("#closeDefinitions");
  closeDefinitions.addEventListener("click", () => {
    definitionContainer.style.display = "none";
    const el = document.querySelectorAll(".child");
    el.forEach((el) => {
      el.remove();
    });

    const playAudio = document.querySelector(".play-audio");
    if (playAudio) {
      playAudio.remove();
    }

    const error = document.querySelector(".error");
    error.remove();
  });

  const firstTime = localStorage.getItem("first_time");
  let paragraph_analytics_history = [];

  if (!firstTime) {
    // first time loaded!

    welcomeMsg.style.display = "flex";
    historyBox.style.display = "none";
    const date = new Date();

    const currentDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    const currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const newComer = {
      date: `${currentDate}`,
      time: `${currentTime}`,
      paragraph: `You joined the site on ${date.getFullYear()}`,
      tracker: date.getTime(),
    };
    localStorage.setItem("first_time", JSON.stringify(newComer));
  } else {
    if (localStorage.paragraph_analytics_history) {
      paragraph_analytics_history = JSON.parse(
        localStorage.paragraph_analytics_history
      );
    }
    paragraph_analytics_history.sort((a, b) => b.tracker - a.tracker);
  }

  welcomeMsgBtn.addEventListener("click", () => {
    welcomeMsg.style.display = "none";
  });

  const historyList = document.querySelector(".history-list");
  const numberOfHistory = document.querySelector(".number-of-history");
  setHistory(paragraph_analytics_history, historyList, numberOfHistory);

  const clearHistory = document.querySelector(".clear-history");
  const openHistory = document.querySelectorAll(".open-history");
  const deleteHistory = document.querySelectorAll(".delete-history");

  clearHistory.addEventListener("click", (e) => {
    const historyItems = document.querySelectorAll(".history-item");
    historyItems.forEach((item) => {
      item.remove();
    });
    paragraph_analytics_history = [];
    localStorage.setItem(
      "paragraph_analytics_history",
      JSON.stringify(paragraph_analytics_history)
    );
    paragraph_analytics_history.length <= 1
      ? (numberOfHistory.textContent = `${paragraph_analytics_history.length} Item`)
      : (numberOfHistory.textContent = `${paragraph_analytics_history.length} Items`);
    clearHistory.style.background = "gray";
    clearHistory.style.cursor = "default";
  });

  if (paragraph_analytics_history.length === 0) {
    clearHistory.style.background = "gray";
    clearHistory.style.cursor = "default";
  }

  openHistory.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selected = e.target.parentNode;
      
      paragraph_analytics_history.forEach((obj) => {
        sentence = obj.sentence;
        if (selected.id === `${obj.tracker}`) {
          popular_and_listObj = showAnalysis(sentence, container)
          const timestamp = new Date();
          const date = `${timestamp.getDate()}-${
            timestamp.getMonth() + 1
          }-${timestamp.getFullYear()}`;
          const time = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;

          obj.opened_date = date;
          obj.opened_time = time;
          
          container.style.display = "block";
          historyBox.style.display = "none";

          localStorage.setItem("paragraph_analytics_history", JSON.stringify(paragraph_analytics_history))
        }
      });

      modernWord = document.querySelectorAll(".modernWord");
      modernWord.forEach((word) => {
        word.addEventListener("click", (e) => {
          const targetEl = e.target;
          let targetContent = targetEl.textContent.toLowerCase();
          targetContent = targetContent.replace(/\W/g, "");

          getDefination(targetContent, definitions).then((data) => {
            makeElements(
              data,
              definitions,
              definitionContainer,
              targetContent,
              definitionHeader
            );

            const speakerIcon = document.querySelector(".speaker-icon");
            if (speakerIcon) {
              speakerIcon.addEventListener("click", (e) => {
                if (data[0].phonetics.length > 0) {
                  if (data[0].phonetics[0].audio) {
                    const audio = new Audio(data[0].phonetics[0].audio);
                    audio.play();
                  }
                }
              });
            }
          });
        });
      });

      inputArea.style.display = "none";
      searchBar.style.display = "inline-block"
    });
  });

  deleteHistory.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selected = e.target.parentNode;

      paragraph_analytics_history.forEach((obj, i, arr) => {
        if (selected.id === `${obj.tracker}`) {
          arr.splice(i, 1);
          localStorage.setItem(
            `paragraph_analytics_history`,
            JSON.stringify(arr)
          );
        }
      });

      selected.remove();
      paragraph_analytics_history.length <= 1
        ? (numberOfHistory.textContent = `${paragraph_analytics_history.length} Item`)
        : (numberOfHistory.textContent = `${paragraph_analytics_history.length} Items`);
      if (paragraph_analytics_history.length === 0) {
        clearHistory.style.background = "gray";
        clearHistory.style.cursor = "default";
      }
    });
  });

  search_words.addEventListener("click", () => {
    autocomplete(
      search_words,
      popular_and_listObj.list.filter((item, index) => popular_and_listObj.list.indexOf(item) === index)
    );
  })
});
