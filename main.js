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
    searchBar.style.display = 'none'
    const aboutParagraph = document.querySelector('#aboutParagraph')
    aboutParagraph.style.display = 'none'
    const container = document.querySelector('.container')
    container.style.display = 'none'
    let sentenceWithoutPunctuations
    let punctuation = '–⁠!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0-9'
    let regex = new RegExp('[' + punctuation + ']', 'g')
    let words = []
    let sentence

    submit.addEventListener('click', () => {
        
        sentence = user_input.value
        sentenceWithoutPunctuations = sentence.replace(regex, '')
        sentenceWithoutPunctuations = sentenceWithoutPunctuations.replace(/(\r\n|\n|\r)/gm, '')
        
        if (sentence != false) {
            searchBar.style.display = 'block'
            aboutParagraph.style.display = 'block'
            container.style.display = 'block'
        } else {
            resultsPoint.textContent = 'Type or paste a paragraph to work with.'
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        }
        
        let symbols = sentence.replaceAll(/\w/g, '')
        symbols = symbols.replaceAll(' ', '')
        
        const digits = sentence.replace(/[^\d]/g, '')
        
        words = []

        wordsList = sentenceWithoutPunctuations.split(' ')
        wordsList.forEach(word => {
            if (word === '') {
                return
            } else {
                words.push(word.toLowerCase())
            }
        })
        paragraph.textContent = sentence
        parrent.appendChild(paragraph)
        word_count.textContent = words.length
        char_count.textContent = sentence.replaceAll(' ', '').length
        letter_count_el.textContent = sentenceWithoutPunctuations.replaceAll(' ', '').length
        symbol_count_el.textContent = symbols.length
        number_count_el.textContent = digits.length
        user_input.value = ''
    })

    // ============= THE ABOUT PARAGRAPH BOTTON FUNCTION ==============
    aboutParagraph.addEventListener('click', () => {
        
        function filterPopularWord(term) {
            if (term.length < 5) {
                occurrenceList = []
                delete sameWordsCount[term]
    
                let indexOfPopularTerm = eachWord.indexOf(term)
                eachWord.splice(indexOfPopularTerm, 1)
                eachWord.forEach((key) => {
                    let countOfEachKey = sameWordsCount[key]
                    occurrenceList.push(countOfEachKey)
                })
                max = Math.max.apply(null, occurrenceList)
                
                term = getKeyByValue(sameWordsCount, max)
                return filterPopularWord(term)
            } else {
                return term
            }
        }
        let sameWords = []
        let sortedWords = words.sort()
        for (let i = 0; i < sortedWords.length; i++) {
            let prevWord = sortedWords[i-1]
            let eachWord = sortedWords[i]
            let nextWord = sortedWords[i+1]
            if (eachWord === nextWord) {
                sameWords.push(eachWord)
            } else if (prevWord === eachWord) {
                sameWords.push(eachWord)
            }
        }
        
        const sameWordsCount = {};

        for (const num of sameWords) {
        sameWordsCount[num] = sameWordsCount[num] ? sameWordsCount[num] + 1 : 1;
        }

        const eachWord = Object.keys(sameWordsCount)

        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
          }
        let occurrenceList = []
        eachWord.forEach((key) => {
            let countOfEachKey = sameWordsCount[key]
            occurrenceList.push(countOfEachKey)
        })
        
        if (words.length <= 100) {
            resultsPoint.textContent = `The paragraph is too short for the algorithm.`
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        } else {
            if (sameWords.length === 0) {
                resultsPoint.textContent = `The algorithm is not too sure what the paragraph is about.`
                blur_bg.style.visibility = 'visible'
                resultsBox.classList.add('resultsBoxVisible')
            } else {
                let max = Math.max.apply(null, occurrenceList)
                let popularTerm = getKeyByValue(sameWordsCount, max)
                let results = filterPopularWord(popularTerm)

                resultsPoint.textContent = `The writer talks alot about "${results.toUpperCase()}". So, this paragraph may be about "${results.toUpperCase()}" or is related to "${results.toUpperCase()}"`
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
    search_btn.addEventListener('click', () => {
        let search_term = search_words.value.toLowerCase().trim()
        let word_count = 0
        function searchTerm(term) {
            if (words.includes(term)) {
                words.forEach(word => {
                    if (word === term) {
                        word_count++
                    }
                })
                return  term.toUpperCase() + ' is mentioned ' + word_count + ' times.'
            } else {
                return term.toUpperCase() + ' does not exist'
            }
        }
//=========== FUNCTION THAT HIGHLIGHTS THE SEARCH TERM ============
        function searchWordHighlighter(string, target) {
            string = string.replace(/(\r\n|\n|\r)/gm, '')
            return string.split(' ').map((word) => {
                if (word.toLowerCase() === target) {
                  word = `<span style="color: blue; text-decoration: underline; font-size: .8rem">${target}</span>`
                  return word.toUpperCase()
                } else if (word.toLowerCase().includes(target)) {
                    let firstChars = word.substring(0, word.toLowerCase().indexOf(target))
                    let lastChars = word.substring(target.length + firstChars.length)
                    let regExStart = /^[^a-z]/i
                    let regExEnd = /[^a-z]$/i
                    if (regExEnd.test(firstChars) || regExStart.test(lastChars)) {
                        let newWord = `<span style="color: blue; text-decoration: underline; font-size: .8rem">${target}</span>`
                        return firstChars + newWord.toUpperCase() + lastChars
                    }
                    return word
                } else {
                    return word
                }
            }).join(' ')
        }
// ===================== THE END =====================
        
        let searchWordCount = searchTerm(search_term)
        

// ================ RESULTS BOX POPUP CONDITION ==================

        if (searchWordCount == `${search_term} does not exist` && search_term !== '') {
            resultsPoint.textContent = 'Invalid or ' + '"' + search_term.toUpperCase() + '"' + ' is not available.'
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        } else if (search_term === '') {
            resultsPoint.textContent = 'Please input search term'
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        } else {
            resultsPoint.textContent = searchWordCount
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        }

// ================= THE END: RESULTS BOX POPUP CONDITION =================

        paragraph.innerHTML = searchWordHighlighter(sentence, search_term)
        search_words.value = ''
    })
// ================= THE END: SEARCH BTN EVENT LISTENER ==================
    
    resultsBtn.addEventListener('click', () => {
        resultsBox.classList.remove('resultsBoxVisible')
        blur_bg.style.visibility = 'hidden'
    })
})