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

        //aliases 
        const wantedAliases = document.createElement("p")
        const aliasesContent = document.createTextNode("Aliases: " + wanted.aliases)
        wantedAliases.appendChild(aliasesContent)

        //height 
        const wantedHeight = document.createElement('p')
        const heightContent = document.createTextNode('Max Height: ' + wanted.height_max + ' inches Min Height: ' + wanted.height_min + ' inches')
        wantedHeight.appendChild(heightContent)

        //weight 
        const wantedWeight = document.createElement('p')
        const weightContent = document.createTextNode('Weight: ' + wanted.weight)
        wantedWeight.appendChild(weightContent)

        //age range
        const wantedAge = document.createElement('p')
        const ageContent = document.createTextNode('Age Range: ' + wanted.age_range)
        wantedAge.appendChild(ageContent)

        //location
        const wantedLocation = document.createElement('p')
        const locationContent = document.createTextNode('Possible Countries: ' + wanted.possible_countries + ' Possible States: ' + wanted.possible_states)
        wantedLocation.appendChild(locationContent)

        //scars and marks
        const wantedMarks = document.createElement('p')
        const marksContent = document.createTextNode('Scars and Marks: ' + wanted.scars_and_marks)
        wantedMarks.appendChild(marksContent)

        //subject 
        const wantedSubject = document.createElement('p')
        const subjectContent = document.createTextNode('Subject: ' + wanted.subject)
        wantedSubject.appendChild(subjectContent)        

        //warning 
        const wantedWarning = document.createElement('p')
        const warningContent = document.createTextNode('Warning: ' + wanted.warning)
        wantedWarning.appendChild(warningContent)

        //description 
        const wantedDescription = document.createElement('p')
        const descriptionContent = document.createTextNode('Description: ' + wanted.description)
        wantedDescription.appendChild(descriptionContent)

        //reward
        const wantedReward = document.createElement('p')
        const rewardContent = document.createTextNode('Reward: ' + wanted.reward_text)
        wantedReward.appendChild(rewardContent)

        //url
        const url = document.createElement('a')
        const urlContent = document.createTextNode('More Info ›')
        url.appendChild(urlContent)
        url.href = wanted.url
        
        //appends everything to card content div
        cardContent.appendChild(wantedName)
        cardContent.appendChild(wantedAliases)
        cardContent.appendChild(wantedHeight)
        cardContent.appendChild(wantedWeight)
        cardContent.appendChild(wantedAge)
        cardContent.appendChild(wantedLocation)
        cardContent.appendChild(wantedMarks)
        cardContent.appendChild(wantedSubject)
        cardContent.appendChild(wantedWarning)
        cardContent.appendChild(wantedDescription)
        cardContent.appendChild(wantedReward)
        cardContent.appendChild(url)

        //appends everything to card
        wantedCard.appendChild(wantedImage)
        wantedCard.appendChild(cardContent)
        
        //appends card to container
        wantedContainer.appendChild(wantedCard)
    });
}

