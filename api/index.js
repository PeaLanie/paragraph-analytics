
export const getDefination = async (term, el) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
        const data = await response.json();
        return data;
    } catch (err) {
        
        const div = document.createElement('div');
        div.textContent = err;
        div.className = 'error';
        div.style.color = 'red';
        div.style.fontSize = '1.5rem';
        div.style.fontWeight = 'bold';
        el.appendChild(div);
    }
    
}
