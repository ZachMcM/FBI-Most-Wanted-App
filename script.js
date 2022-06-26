//document elements
const searchContainer = document.querySelector('.search-container')
const searchBar = document.querySelector('.search-bar')
const suggestions = document.querySelector('.suggestions')

const wantedContainer = document.querySelector('.wanted-container')

//code for search bar
searchBar.onkeyup = (e) => {
    let userData = e.target.value
    let emptyArray = []
    if (userData) {
        emptyArray = officesList.filter((data) => {
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
        })
        emptyArray = emptyArray.map((data) => {
            return data = '<li>' + data + '</li>'
        })
        displaySuggestions(emptyArray)
        searchContainer.classList.add('active')
        let allList = suggestions.querySelectorAll('li')
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute('onclick', 'select(this)')
        }
    } else {
        searchContainer.classList.remove('active')
    }
}

//displays the suggestions
function displaySuggestions(list) {
    let listData
    if (!list.length) {
        searchContainer.classList.remove('active')
        userValue = searchBar.value
        listData = '<li>' + userValue + '</li>'
    } else {
        listData = list.join('')
    }
    suggestions.innerHTML = listData
}

function select(element) {
    let pickUserData = element.textContent
    searchBar.value = pickUserData
    searchContainer.classList.remove('active')
    clearUi()
    getWanted(pickUserData)
}

//clear ui
function clearUi() {
    while (wantedContainer.firstChild) {
        wantedContainer.removeChild(wantedContainer.lastChild);
      }
}

//get request for selected office
function getWanted(pickUserData) {
    const userOffice = pickUserData.split(" ").join("").toLocaleLowerCase()
    requestURL = 'https://api.fbi.gov/@wanted?pageSize=20&page=1&sort_on=modified&sort_order=desc&field_offices=' + userOffice
    axios.get(requestURL).then(function(response) {
        if (!response.data.items.length) {
            console.log("Array empty")
            alert("No wanted people for this office")
        }   
        displayWanted(response.data.items)
        console.log(response.data.items)
    })
}

function displayWanted(items) {
    items.forEach(wanted => {
        //creates a card
        const wantedCard = document.createElement("div")
        wantedCard.classList.add('wanted-card')
        
        //creates an image and adds the source
        const wantedImage = document.createElement("img")
        wantedImage.src = wanted.images[0].original
        
        //creats the content div
        const cardContent = document.createElement("div")
        cardContent.classList.add('card-content')
        
        //name
        const wantedName = document.createElement("h2")
        const nameContent = document.createTextNode('Name: ' + wanted.title)
        wantedName.appendChild(nameContent)
        cardContent.appendChild(wantedName)

        //the variable that stores the name of the item being displayed
        let itemName

        //calls function that adds items to document
        addItem('Aliases: ' + wanted.aliases, cardContent)
        addItem('Max Height: ' + wanted.height_max + ' inches Min Height: ' + wanted.height_min + ' inches', cardContent)
        addItem('Weight: ' + wanted.weight, cardContent)
        addItem('Age Range: ' + wanted.age_range, cardContent)
        addItem('Possible Countries: ' + wanted.possible_countries + ' Possible States: ' + wanted.possible_states, cardContent)
        addItem('Scars and Marks: ' + wanted.scars_and_marks, cardContent)
        addItem('Subject: ' + wanted.subject, cardContent)
        addItem('Warning: ' + wanted.warning, cardContent)
        addItem('Description: ' + wanted.description, cardContent)
        addItem('Reward: ' + wanted.reward_text, cardContent)

        //url
        const url = document.createElement('a')
        const urlContent = document.createTextNode('More Info ›')
        url.appendChild(urlContent)
        url.href = wanted.url
        cardContent.appendChild(url)

        //appends everything to card
        wantedCard.appendChild(wantedImage)
        wantedCard.appendChild(cardContent)
        
        //appends card to container
        wantedContainer.appendChild(wantedCard)
    });
}

function addItem(content, cardContent) {
    const wantedElement = document.createElement('p')
    const wantedContent = document.createTextNode(content)
    wantedElement.appendChild(wantedContent)
    cardContent.appendChild(wantedElement)
}

