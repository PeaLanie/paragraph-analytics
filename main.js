window.addEventListener('DOMContentLoaded', () => {
    const user_input = document.querySelector('#user_input')
    const submit = document.querySelector('#submit')
    const word_count = document.querySelector('#word_count')
    const char_count = document.querySelector('#char_count')
    const letter_count_el = document.querySelector('#letter_count')
    const symbol_count_el = document.querySelector('#symbol_count')
    const parrent = document.querySelector('#paragraph')
    const space_count_el = document.querySelector('#space_count')
    const number_count_el = document.querySelector('#number_count')
    const paragraph = document.createElement('p')
    const search_words = document.querySelector('#search_words')
    const search_btn = document.querySelector('#search_btn')
    const body = document.querySelector('#body')
    const searchBar = document.querySelector('.search_bar')
    searchBar.style.display = 'none'
    let sentenceWithoutPunctuations

    let punctuation = '–⁠!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0-9'
    let regex = new RegExp('[' + punctuation + ']', 'g')

    let words = []
    let sentence
    //let sentence = user_input.value
    submit.addEventListener('click', () => {
        
        sentence = user_input.value
        sentenceWithoutPunctuations = sentence.replace(regex, '')
        
        if (sentence != false) {
            searchBar.style.display = 'block'
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
    const aboutParagraph = document.querySelector('#aboutParagraph')
    aboutParagraph.addEventListener('click', () => {
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
        
        let max = Math.max.apply(null, occurrenceList)
        let popularTerm = getKeyByValue(sameWordsCount, max)

        

        function filterPopularWord(popularTerm) {
            if (popularTerm.length < 5) {
                occurrenceList = []
                delete sameWordsCount[popularTerm]
    
                let indexOfPopularTerm = eachWord.indexOf(popularTerm)
                eachWord.splice(indexOfPopularTerm, 1)
                eachWord.forEach((key) => {
                    let countOfEachKey = sameWordsCount[key]
                    occurrenceList.push(countOfEachKey)
                })
                max = Math.max.apply(null, occurrenceList)
                
                popularTerm = getKeyByValue(sameWordsCount, max)
                return filterPopularWord(popularTerm)
            } else {
                return popularTerm
            }
        }


        let results = filterPopularWord(popularTerm)
        
        if (words.length <= 100) {
            resultsPoint.textContent = `The paragraph is too short for the algorithm.`
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        } else {
            resultsPoint.textContent = `The writer talks alot about "${results}". So, this paragraph may be about ${results} or is related to ${results}`
            blur_bg.style.visibility = 'visible'
            resultsBox.classList.add('resultsBoxVisible')
        }

    })

    // ============= END ===========================

    const resultsBtn = document.querySelector('#resultsBtn')
    const resultsPoint = document.querySelector('#resultsPoint')
    const resultsBox = document.querySelector('.resultsBox')
    const blur_bg = document.querySelector('.blur_bg')
    
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
                return  term + ' is mentioned ' + word_count + ' times.'
            } else {
                return term + ' does not exist'
            }
        }
        let searchWordCount = searchTerm(search_term)
        
        blur_bg.style.visibility = 'visible'

// ================ RESULTS BOX CONDITION ==================

        if (paragraph.textContent === '' && search_term === '' || paragraph.textContent === '' && search_term !== '') {
            resultsPoint.textContent = 'Type or paste a paragraph to analyse.'
            resultsBox.classList.add('resultsBoxVisible')
        } else if (searchWordCount == `${searchTerm} does not exist` && search_term !== '') {
            resultsPoint.textContent = 'Invalid or ' + '"' + search_term + '"' + ' is not available.'
            resultsBox.classList.add('resultsBoxVisible')
        } else if (search_term === '') {
            resultsPoint.textContent = 'Please input search term'
            resultsBox.classList.add('resultsBoxVisible')
        } else {
            resultsPoint.textContent = searchWordCount
            resultsBox.classList.add('resultsBoxVisible')
        }

// ================= THE END ============================

        search_words.value = ''

//=========== FUNCTION THAT HIGHLIGHTS THE SEARCH TERM ============
        
        function searchWordHighlighter(string, target) {
            return string.split(' ').map((word) => {
                if (word.toLowerCase() === target) {
                  word = `<span style="color: blue; text-decoration: underline">${target}</span>`
                  return word
                } else {
                    if (word.toLowerCase().match(target) && word.indexOf(target) !== 0 && word.substring(0, word.indexOf(target)).match(/\W/g)) {
                        let firstChars = word.substring(0, word.indexOf(target))
                        let filteredArray = word.match(target)
                        let newWord = `<span style="color: blue; text-decoration: underline">${filteredArray[0]}</span>`
                        return firstChars + newWord
                    } else if (word.toLowerCase().match(target) && word.indexOf(target) === 0 && word.substring(target.length).match(/\W/g)) {
                        let lastChars = word.substring(target.length)
                        let filteredArray = word.match(target)
                        let newWord = `<span style="color: blue; text-decoration: underline">${filteredArray[0]}</span>`
                        return newWord + lastChars
                    } else {
                        return word
                    }
                }
              }).join(' ')
        }
        paragraph.innerHTML = searchWordHighlighter(sentence, search_term)
    })
    // ===================== THE END =====================

    resultsBtn.addEventListener('click', () => {
        resultsBox.classList.remove('resultsBoxVisible')
        blur_bg.style.visibility = 'hidden'
    })
})

//const symbole = [' ', '.', ',', '!', '"', "'", '#', '$', '%', '&', '(', ')', '*', '+', '-', '/', ':', ';', '<', '>', '=', '?', '@', '[', ']', '\\', '^', '_', '`', '{', '|', '}', '~']