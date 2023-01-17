
export const getDefination = async (term) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
    
}

// export const getDefination = async (term) => {
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': '56dec330famsh9bc7fe8100c97c4p1415aajsnd701309b5384',
//             'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com'
//         }
//     };
    
//     const response = await fetch(`https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${term}`, options);
//     const data = await response.json();

//     return data;
// }
