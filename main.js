import { autocomplete, searchWordHighlighter, setHistory, searchTerm, getKeyByValue, addData, makeElements } from "./utils/index.js"
import { getDefination } from "./api/index.js"


window.addEventListener('DOMContentLoaded', () => {
    const user_input = document.querySelector('#user_input')
    const submit = document.querySelector('#submit')
    const word_count = document.querySelector('#word_count')
    const char_count = document.querySelector('#char_count')
    const letter_count_el = document.querySelector('#letter_count')
    const symbol_count_el = document.querySelector('#symbol_count')
    const parrent = document.querySelector('#paragraph')
    const number_count_el = document.querySelector('#number_count')
    const paragraph = document.createElement('p')
    const search_words = document.querySelector('#search_words')
    const search_btn = document.querySelector('#search_btn')
    const searchBar = document.querySelector('.search_bar')
    //searchBar.style.display = 'none'
    const aboutParagraph = document.querySelector('#aboutParagraph')
    const container = document.querySelector('.container')
    const definitionContainer = document.querySelector('.definitionContainer')
    const definitions = document.querySelector('.definitions');
    const definitionHeader = document.querySelector('.definition-header');
    const welcomeMsg = document.querySelector('.welcome-message-container');
    const welcomeMsgBtn = document.querySelector('#welcome-msg-btn');
    let sentenceWithoutPunctuations;
    let punctuation = '–⁠!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0-9';
    let regex = new RegExp('[' + punctuation + ']', 'g');
    let words = [];
    let sentence;
    let wordsList;

    


    let testString = `Bitcoin is a digital currency which operates free of any central control or the oversight of banks or governments. Instead it relies on peer-to-peer software and cryptography.

    A public ledger records all bitcoin transactions and copies are held on servers around the world. Anyone with a spare computer can set up one of these servers, known as a node. Consensus on who owns which coins is reached cryptographically across these nodes rather than relying on a central source of trust like a bank.

    Every transaction is publicly broadcast to the network and shared from node to node. Every ten minutes or so these transactions are collected together by miners into a group called a block and added permanently to the blockchain. This is the definitive account book of bitcoin.

    In much the same way you would keep traditional coins in a physical wallet, virtual currencies are held in digital wallets and can be accessed from client software or a range of online and hardware tools.


    Bitcoins can currently be subdivided by seven decimal places: a thousandth of a bitcoin is known as a milli and a hundred millionth of a bitcoin is known as a satoshi.

    In truth there is no such thing as a bitcoin or a wallet, just agreement among the network about ownership of a coin. A private key is used to prove ownership of funds to the network when making a transaction. A person could simply memorise their private key and need nothing else to retrieve or spend their virtual cash, a concept which is known as a “brain wallet”.

    Can bitcoin be converted to cash?
    Bitcoin can be exchanged for cash just like any asset. There are numerous cryptocurrency exchanges online where people can do this but transactions can also be carried out in person or over any communications platform, allowing even small businesses to accept bitcoin. There is no official mechanism built into bitcoin to convert to another currency.


    Nothing inherently valuable underpins the bitcoin network. But this is true for many of the world’s most stable national currencies since leaving the gold standard, such as the US dollar and UK pound.

    What is the purpose of bitcoin?
    Bitcoin was created as a way for people to send money over the internet. The digital currency was intended to provide an alternative payment system that would operate free of central control but otherwise be used just like traditional currencies.

    Are bitcoins safe?
    The cryptography behind bitcoin is based on the SHA-256 algorithm designed by the US National Security Agency. Cracking this is, for all intents and purposes, impossible as there are more possible private keys that would have to be tested (2256) than there are atoms in the universe (estimated to be somewhere between 1078 to 1082).

    There have been several high profile cases of bitcoin exchanges being hacked and funds being stolen, but these services invariably stored the digital currency on behalf of customers. What was hacked in these cases was the website and not the bitcoin network.

    In theory if an attacker could control more than half of all the bitcoin nodes in existence then they could create a consensus that they owned all bitcoin, and embed that into the blockchain. But as the number of nodes grows this becomes less practical.

    A realistic problem is that bitcoin operates without any central authority. Because of this, anyone making an error with a transaction on their wallet has no recourse. If you accidentally send bitcoins to the wrong person or lose your password there is nobody to turn to.

    Of course, the eventual arrival of practical quantum computing could break it all. Much cryptography relies on mathematical calculations that are extremely hard for current computers to do, but quantum computers work very differently and may be able to execute them in a fraction of a second.`


    submit.addEventListener('click', () => {
        sentence = user_input.value;
        const first_time = localStorage.getItem("first_time");
        if (first_time) {
            welcomeMsg.style.display = 'none';
        }

        if (sentence != false) {
            historyBox.style.display = 'none';

            sentenceWithoutPunctuations = sentence.replace(regex, '')
            sentenceWithoutPunctuations = sentenceWithoutPunctuations.replace(/(\r\n|\n|\r)/gm, '')
            let symbols = sentence.replaceAll(/\w/g, '')
            symbols = symbols.replaceAll(' ', '')

            const digits = sentence.replace(/[^\d]/g, '')

            const modernSentence = sentence
            .replace(/(\r\n|\n|\r)/gm, '')
            .split(' ')
            .filter(item => item !== '')
            .map((word) => {
                return `<span class="modernWord">${word}</span>`
            }).join(' ');

            words = [];

            wordsList = sentenceWithoutPunctuations.split(' ');

            wordsList.forEach(word => {
                if (word === '') {
                    return
                } else {
                    words.push(word.toLowerCase());
                }
            })

            paragraph.innerHTML = modernSentence;
            parrent.appendChild(paragraph);
            word_count.textContent = words.length;
            char_count.textContent = sentence.replaceAll(' ', '').length;
            letter_count_el.textContent = sentenceWithoutPunctuations.replaceAll(' ', '').length;
            symbol_count_el.textContent = symbols.length;
            number_count_el.textContent = digits.length;
            user_input.value = '';
            container.style.display = 'block';

            let modernWord = document.querySelectorAll('.modernWord');
            modernWord.forEach((word) => {
                word.addEventListener('click', (e) => {
                    const targetEl = e.target;
                    let targetContent = targetEl.textContent;
                    targetContent = targetContent.replace(/\W/g, '')

                    getDefination(targetContent.toLowerCase())
                        .then((data) => {
                            
                            makeElements(data, definitions, definitionContainer, targetContent, definitionHeader);

                            const speakerIcon = document.querySelector('.speaker-icon');
                            if (speakerIcon) {
                                speakerIcon.addEventListener('click', (e) => {
                                    
                                    if (data[0].phonetics.length > 0) {
                                        if (data[0].phonetics[0].audio) {
                                            const audio = new Audio(data[0].phonetics[0].audio);
                                        audio.play();
                                        }
                                    }
                                })
                            }

                    })
                })
            })

            class History {
                constructor(date, time, paragraph, modern, word_count, char_count, letter_count, symbol_count, number_count, tracker) {
                    this.date = date;
                    this.time = time
                    this.paragraph = paragraph;
                    this.modern = modern;
                    this.word_count = word_count;
                    this.char_count = char_count;
                    this.letter_count = letter_count;
                    this.symbol_count = symbol_count;
                    this.number_count = number_count;
                    this.tracker = tracker;
                }
            }

            const timestamp = new Date();
            const date = `${timestamp.getDate()}-${timestamp.getMonth()+1}-${timestamp.getFullYear()}`;
            const time = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
            
            const historyObj = new History(
                date,
                time,
                sentence,
                modernSentence,
                words.length,
                sentence.replaceAll(' ', '').length,
                sentenceWithoutPunctuations.replaceAll(' ', '').length,
                symbols.length,
                digits.length,
                timestamp.getTime()
            );

            localStorage.setItem(`${historyObj.tracker}_history`, JSON.stringify(historyObj));

        } else {
            resultsPoint.textContent = 'Type or paste a paragraph to work with.';
            blur_bg.style.visibility = 'visible';
            resultsBox.classList.add('resultsBoxVisible');
            container.style.display = 'none';
        }
        words.sort();
        autocomplete(search_words, words.filter((item, index) => words.indexOf(item) === index));
    })

    // ============= THE ABOUT PARAGRAPH BOTTON FUNCTION ==============

    aboutParagraph.addEventListener('click', () => {

        const duplicates = words.filter((word, i, arr) => word.length > 4)
        .filter((word, i, arr) => word === arr[i-1] || word === arr[i+1]);
        
        const sameWordsCount = {};

        for (const word of duplicates) {
        sameWordsCount[word] = sameWordsCount[word] ? sameWordsCount[word] + 1 : 1;
        }

        if (words.length <= 100) {
            resultsPoint.textContent = `The paragraph is too short for the algorithm.`
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        } else {
            if (duplicates.length === 0) {
                resultsPoint.textContent = `The algorithm is not too sure what the paragraph is about.`
                blur_bg.style.visibility = 'visible'
                resultsBox.classList.add('resultsBoxVisible')
            } else {
                let occurrenceList = Object.values(sameWordsCount);
                let max = Math.max(...occurrenceList)
                let popularTerm = getKeyByValue(sameWordsCount, max)

                resultsPoint.innerHTML = `The writer talks alot about <strong style='font-size: .8rem;
                font-weight: bold'>"${popularTerm.toUpperCase()}"</strong>. So, this paragraph may be 
                about <strong style='font-size: .8rem; font-weight: bold'>"${popularTerm.toUpperCase()}"
                </strong> or is related to <strong style='font-size: .8rem; font-weight: bold'>"${popularTerm.toUpperCase()}"</strong>`;

                blur_bg.style.visibility = 'visible'
                resultsBox.classList.add('resultsBoxVisible')
            }
        }
    })

    // ============= THE END: ABOUT PARAGRAPH BUTTON FUNCTION =============

    const resultsBtn = document.querySelector('#resultsBtn')
    const resultsPoint = document.querySelector('#resultsPoint')
    const resultsBox = document.querySelector('.resultsBox')
    const blur_bg = document.querySelector('.blur_bg')
// ====================== SEARCH BTN EVENT LISTENER ======================

    const searchTermsObj = localStorage.getItem('searchTermsObj');
    if (!searchTermsObj) {
        let searchTermsArray = [];
        let searchTermsObj = {};
        localStorage.setItem('searchTermsArray', JSON.stringify(searchTermsArray));
        localStorage.setItem('searchTermsObj', JSON.stringify(searchTermsObj));
    }

    search_btn.addEventListener('click', () => {
        let search_term = search_words.value.toLowerCase().trim()
        
        const wordsObj = {};

        for (const word of words) {
            wordsObj[word] = wordsObj[word] ? wordsObj[word] + 1 : 1;
            }

        if (search_term) {
            let searchTermsArray = JSON.parse(localStorage.getItem('searchTermsArray'));
            let searchTermsObj = JSON.parse(localStorage.getItem('searchTermsObj'));

            searchTermsArray.push(search_term);
            for (const word of searchTermsArray) {
                searchTermsObj[word] = searchTermsObj[word] ? searchTermsObj[word] + 1 : 1;
            }
            localStorage.setItem('searchTermsArray', JSON.stringify(searchTermsArray));
            
            const filteredArray = searchTermsArray.filter((word, i, arr) => arr.indexOf(word) === i)
        
            const listOfObjectValues = Object.values(searchTermsObj);
            let max = Math.max(...listOfObjectValues);
            const mostSearchedTerm = getKeyByValue(searchTermsObj, max);
        }

// ================ RESULTS BOX POPUP CONDITION ==================

        if (search_term === '') {
            resultsPoint.textContent = 'Please input search term'
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        } else {
            resultsPoint.innerHTML = searchTerm(words, wordsObj, search_term)
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        }

// ================= THE END: RESULTS BOX POPUP CONDITION =================

        paragraph.innerHTML = searchWordHighlighter(sentence, search_term);

        let modernWord = document.querySelectorAll('.modernWord');
            modernWord.forEach((word) => {
                word.addEventListener('click', (e) => {
                    const targetEl = e.target;
                    let targetContent = targetEl.textContent;
                    targetContent = targetContent.replace(/\W/g, '')

                    getDefination(targetContent.toLowerCase())
                        .then((data) => {
                            const dataList = data.list
                            dataList.forEach((data) => {
                                //console.log(data)
                                //addData(data, definitions, definitionContainer, targetContent);
                            })
                    })
                })
            })

        search_words.value = ''
    })
// ================= THE END: SEARCH BTN EVENT LISTENER ==================

    resultsBtn.addEventListener('click', () => {
        resultsBox.classList.remove('resultsBoxVisible')
        blur_bg.style.visibility = 'hidden'
    })

    const closeDefinitions = document.querySelector('#closeDefinitions');
    closeDefinitions.addEventListener('click', () => {
        definitionContainer.style.display = 'none';
        const el = document.querySelectorAll('.child');
        el.forEach((el) => {
            el.remove();
        })

        const playAudio = document.querySelector('.play-audio');
        if (playAudio) {
            playAudio.remove();
        }

    })

    const firstTime = localStorage.getItem("first_time");
    const historyBox = document.querySelector('.history-box');
    let historyObjects = [];

    if(!firstTime) {

    // first time loaded!

    welcomeMsg.style.display = 'flex';
    historyBox.style.display = 'none';
    const date = new Date();

    const currentDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    const currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const newComer = {
        date: `${currentDate}`,
        time: `${currentTime}`,
        paragraph: `You joined the site on ${date.getFullYear()}`,
        tracker: date.getTime()
    }
    localStorage.setItem("first_time", JSON.stringify(newComer));

    } else {

        let storageList = Object.keys(localStorage);
        storageList.forEach(key => {
            if (key.includes('history')) {
                let history = JSON.parse(localStorage.getItem(key));
                historyObjects.push(history);
            }
        })
        historyObjects.sort((a, b) => b.tracker - a.tracker);
    }

    welcomeMsgBtn.addEventListener('click', () => {
        welcomeMsg.style.display = 'none';
    })

    const historyList = document.querySelector('.history-list');
    const numberOfHistory = document.querySelector('.number-of-history');
    setHistory(historyObjects, historyList, numberOfHistory);

    const clearHistory = document.querySelector('.clear-history');
    const openHistory = document.querySelectorAll('.open-history');
    const deleteHistory = document.querySelectorAll('.delete-history');
    const list = Object.keys(localStorage);

    clearHistory.addEventListener('click', (e) => {
        list.forEach((key, i, arr) => {
            if (key.includes('history')) {
                localStorage.removeItem(key);
            }
        })

        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach((item) => {
            item.remove();
        })
        historyObjects = [];
        historyObjects.length <= 1 ? numberOfHistory.textContent = `${historyObjects.length} Item` : numberOfHistory.textContent = `${historyObjects.length} Items`;
        clearHistory.style.background = 'gray';
    })

    if (historyObjects.length === 0) {
        clearHistory.style.background = 'gray';
    }

    const displayItems = document.querySelector('.displays');

    openHistory.forEach((button, i, arr) => {
        
        button.addEventListener('click', (e) => {
            const selected = e.target.parentNode;
            
            historyObjects.forEach((obj, i, arr) => {
                if (selected.id === `${obj.tracker}`) {

                    const p = document.createElement('span');
                    p.textContent = `Created on [${obj.date}][${obj.time}]`;
                    p.style.color = 'green';
                    p.style.fontWeight = 'bold';
                    displayItems.appendChild(p);
                    
                    paragraph.innerHTML = obj.modern;
                    parrent.appendChild(paragraph);
                    word_count.textContent = obj.word_count;
                    char_count.textContent = obj.char_count;
                    letter_count_el.textContent = obj.letter_count;
                    symbol_count_el.textContent = obj.symbol_count;
                    number_count_el.textContent = obj.number_count;
                    container.style.display = 'block';
                    historyBox.style.display = 'none';
                }
            })

        })
    })

    deleteHistory.forEach((button, i, arr) => {
       
        button.addEventListener('click', (e) => {
            const selected = e.target.parentNode;
            historyObjects.forEach((obj, i, arr) => {
                if (selected.id === `${obj.tracker}`) {
                    localStorage.removeItem(`${obj.tracker}_history`);
                    arr.splice(i, 1);
                }
            })
            
            selected.remove();
            historyObjects.length <= 1 ? numberOfHistory.textContent = `${historyObjects.length} Item` : numberOfHistory.textContent = `${historyObjects.length} Items`;
            if (historyObjects.length === 0) {
                clearHistory.style.background = 'gray';
            }
        })
    })

})