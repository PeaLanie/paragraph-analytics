window.addEventListener('DOMContentLoaded', () => {
    const user_input = document.querySelector('#user_input')
    const submit = document.querySelector('#submit')
    const word_count = document.querySelector('#word_count')
    const char_count = document.querySelector('#char_count')
    const letter_count_el = document.querySelector('#letter_count')
    const symbol_count_el = document.querySelector('#symbol_count')
    const parrent = document.querySelector('#paragraph')
    const space_count_el = document.querySelector('#space_count')
    const paste_btn = document.querySelector('#paste_btn')
    

    submit.addEventListener('click', () => {
    
        let sentence = user_input.value
        const new_sentence = sentence + ' '
        const words = []
        let word = ''
        let letter_count = 0
        let symbol_count = 0
        let space_count = 0

        for (let i = 0; i < new_sentence.length; i++) {
        
            let char = new_sentence[i]
            
            
            if (char !== ' ') {
                char = sentence[i].toLowerCase()
                
                if (char == '.' || char == ',' || char == ';' || char == ':' || char == '!' || char == '(' || char == ')' || char == '-' || char == '_') {
                    symbol_count++
                    continue
                } else {
                    word += char
                    letter_count++
                }
        
            } else if (char == ' ') {

                space_count++
                if (word == false) {
                    continue
                } else {
                    words.push(word)
                    word = ''
                } 
            }
        }

        const paragraph = document.createElement('p')
        paragraph.textContent = sentence

        parrent.appendChild(paragraph)

        word_count.textContent = words.length
        char_count.textContent = sentence.length
        letter_count_el.textContent = letter_count
        symbol_count_el.textContent = symbol_count
        space_count_el.textContent = space_count-1



        user_input.value = ''
        console.log(words)
    })

    user_input.addEventListener('mouseover', () => {
        paste_btn.classList.add('visible')
        console.log()
        console.log('Show paste text!')
    })
    user_input.addEventListener('mouseleave', () => {
        paste_btn.classList.remove('visible')
    })

    
    console.log()
})




