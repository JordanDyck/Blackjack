const deckID = 'xtk8kamw3cw9'
let pTotal = document.getElementById('pTotal')
let cTotal = document.getElementById('cTotal')
const hit = document.getElementById('hit')
const stay = document.getElementById('stay')
const restartBtn = document.getElementById('restartBtn')
const displayPCards = document.getElementsByClassName('pCards')
const displayComCards = document.getElementsByClassName('comCards')
const cCardInHand = document.getElementsByClassName('cCardInHand')

let bust = document.getElementById('bust-text')





// fetch the deck
function getDeck() {
    fetch('https://deckofcardsapi.com/api/deck/xtk8kamw3cw9/shuffle/?deck_count=1')
    .then(res => res.json())
    // .then(data => console.log(data))
    

}

hit.style.display = 'none'
stay.style.display = 'none'
pTotal.style.visibility = 'hidden'

let pCount = 2
let comCount = 0

// fetch the cards
function playerHand() {
fetch(`https://deckofcardsapi.com/api/deck/xtk8kamw3cw9/draw/?count=${pCount}`)
    .then(res => res.json())
    .then(data => {
        comTurn = false;
        playerDraw(data)
        countCards(data, pTotal)
        countCardsInHand(pCardsInHand, pTotal)
        
        
    })
}

function computerHand() {
    fetch(`https://deckofcardsapi.com/api/deck/xtk8kamw3cw9/draw/?count=${comCount}`)
    .then(res => res.json())
    .then(data => {
        comTurn = true;
        computerDraw(data)
        countCards(data, cTotal)
        countCardsInHand(cCardsInHand, cTotal)
    })
}

let isBust = false
let isWinner = false

const displayBackCard = () => {
    let cardBack = document.createElement('img')
    cardBack.src = "/img/facedowncard.png"
    cardBack.setAttribute('class', 'cardBack')
    displayComCards[0].appendChild(cardBack)
    cardBack.classList.add('animated-reverse')

    stay.addEventListener('click', () => {
        cardBack.classList.remove('animated-reverse')
        cardBack.classList.add('animated')
        setTimeout(() => {
            cardBack.style.display = 'none'
            
        }, 295);
    })
}



const gameStart = () => {
    isBust = false
    isWinner = false
    getDeck()
    playerHand()
    computerHand()
    setTimeout(() => {
        hit.style.display = 'initial'
        stay.style.display = 'initial'
        pTotal.style.visibility = 'visible'
    }, 650);
    displayBackCard()
    displayBackCard()
    //display player cards
    for (let i = 0; i < displayPCards.length; i++) {
        displayPCards[i].style.visibility = 'visible'
    }

    // display backCards
    for (let i = 0; i < displayComCards.length; i++) {
        displayComCards[i].style.visibility = 'visible'
    }
    
}


// creates the image elements in displayPCards div
const playerDraw = (data) => {
    for (let i = 0; i < pCount; i++) {
        let cards = data.cards[i].image;
        let hand = document.createElement('img')
        hand.src = cards
        hand.setAttribute('class', 'pCardInHand')
        displayPCards[0].appendChild(hand)
        hand.classList.add('pCard-animation')
    }
}

const computerDraw = (data) => {
    for (let i = 0; i < comCount; i++) {
        let comCards = data.cards[i].image;
        let comHand = document.createElement('img')
        comHand.setAttribute('class', 'cCardInHand')
        comHand.src = comCards
        displayComCards[0].appendChild(comHand)
        comHand.classList.add('cCard-animation')
    }
}

// draws 1 card
const hitMe = () => {
    pCount = 1
    playerHand()
    
}

let comTurn = false

// click stay to end turn
const onStay = () => {
    hit.style.display = 'none'
    stay.style.display = 'none'
    // shows comCards.
    

    comTurn = true
    cTurn()
}

let pCardsInHand = []
let cCardsInHand = []

const faceCards = ['KING', 'QUEEN', 'JACK']


// adds up total value of cards
const countCardsInHand = (hand, total) => {
    let currentVal = 0
    hand.filter((card) => {
        if (!faceCards.includes(card) && card !== 'ACE') {
            currentVal += parseInt(card)
        }
    })
    // value for face cards
    hand.filter((card) => {
        if (faceCards.includes(card)) {
            currentVal += 10
        }
    })
    // value for ACE
    hand.filter((card) => {
        if (card === 'ACE') {
            if (currentVal + 11 > 21) {
                currentVal += 1
            } else {
                currentVal += 11
            }
        }
    })
    total.textContent = currentVal
    if (total.textContent > 21) {
        isBust = true
        busted()
    }
}

// puts each card into the cardsInHand arrays
const countCards = (data, total) => {
    let cardList = data.cards
    let value = parseInt(total.textContent)

    cardList.forEach((card) => {
        if (comTurn === true) {
            cCardsInHand.push(card.value)

        } else if (comTurn === false) {
            pCardsInHand.push(card.value)
        }
    })
}

const cTurn = () => {
    let intervalID
    // draws the cards
    if (comTurn === true) {
        intervalID = setInterval(() => {
            if (parseInt(cTotal.textContent) < 17 ) {
                comCount = 1
                computerHand()
            }
            if (parseInt(cTotal.textContent) >= 17) {
                comTurn = false
                clearInterval(intervalID)
            }
            if (comTurn === false) {
                cTotal.style.visibility = 'visible'
                isWinner = true
                winner()
            }
            
        }, 500);
    }
}
    

// check if total score is over 21 
const busted = () => {
    if (isBust === true) {
        if (parseInt(pTotal.textContent) > 21) {
            bust.textContent = 'you bust. computer wins!'
            bust.style.color = 'red'
            bust.style.visibility = 'visible'
            hit.style.display = 'none'
            stay.style.display = 'none'
            restartBtn.style.display = 'initial'
        }
        if (parseInt(cTotal.textContent) > 21) {
            comTurn = false
            bust.textContent = 'computer busts. you win!'
            bust.style.color = '#daf1da'
            bust.style.visibility = 'visible'
            restartBtn.style.display = 'initial'
        }
    }
}

const winner = () => {
    if (isWinner === true)
    if (parseInt(pTotal.textContent) > parseInt(cTotal.textContent) && !(parseInt(pTotal.textContent) > 21)) {
        bust.textContent = 'You win!'
        bust.style.color = '#daf1da'
        bust.style.visibility = 'visible'
        restartBtn.style.display = 'initial'
    }
    else if (parseInt(cTotal.textContent) >= parseInt(pTotal.textContent) && !(parseInt(cTotal.textContent) > 21)) {
        bust.textContent = 'Computer wins'
        bust.style.color = 'red'
        bust.style.visibility = 'visible'
        restartBtn.style.display = 'initial'
    }
}

const reShuffle = () => {
    fetch('https://deckofcardsapi.com/api/deck/xtk8kamw3cw9/return/')
    .then(res => res.json())
}

const deleteHands = () => {
    // deletes computer hand
    while (displayComCards[0].firstElementChild) {
        displayComCards[0].removeChild(displayComCards[0].lastChild)
    }
    // deletes player hand
    while (displayPCards[0].firstElementChild) {
        displayPCards[0].removeChild(displayPCards[0].lastChild)
    }
}

const resetAnimation = (hand, animation, reversed) => {
    for (let i = 0; i < hand.length; i++) {
        hand[i].classList.remove(animation)
        hand[i].classList.add(reversed)
    }
}

const restartGame = () => {

    restartBtn.style.display = 'none'
    pTotal.style.visibility = 'hidden'
    cTotal.style.visibility = 'hidden'
    bust.style.visibility = 'hidden'

    resetAnimation(
        document.getElementsByClassName('cardBack'),
        'animated-reverse',
        'animated'
    )


    resetAnimation(
        document.getElementsByClassName('cCardInHand'),
        'cCard-animation',
        'cCard-animation-reversed'
    )
    resetAnimation(
        document.getElementsByClassName('pCardInHand'),
        'pCard-animation',
        'pCard-animation-reversed'
    )
    setTimeout(() => {
        location.reload()
    }, 495);
    
}

gameStart()
