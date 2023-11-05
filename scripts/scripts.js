const cardValues = { 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13, A: 14 };
const cardCounts = {};

const cardClicked = (event) => {
  clickedCard = event.target;
  clickedCardRank = cardValues[clickedCard.dataset.rank];

  // ignore click if card is already faded
  if (clickedCard.classList.contains("fade")) {
    return;
  }

  // de-select if card is already highlighted
  if (isHighlighted(clickedCard, clickedCardRank)) {
    return;
  }

  // highlight clicked card and fade any already-highlighted cards
  highlightAndFade(clickedCard);

  // remove clicked card from active counts
  cardCounts[clickedCardRank] -= 1;

  // update and display statistics
  updateStatistics(clickedCardRank);
};

/**
 * @description counts the number of cards greater than, equal to and less than the passed rank
 * @param {string} clickedCardRank rank of the card - 2-10, J, Q, K or A
 * @return {{ higher: number, lower: number, equal: number}, }}
 */
const getRankCounts = (clickedCardRank) => {
  // initialise total counts
  const totals = { higher: 0, lower: 0, equal: 0 };

  // for each entry in the cardsCounts object (2-14), add the counts for the value to the appropriate totals object,
  // depending on whether the entry is higher, lower or equal to the passed rank
  for (const [key, count] of Object.entries(cardCounts)) {
    // cardValues converts the cards (including J, Q, K, A to numeric) equivalents
    if (key > clickedCardRank) {
      totals.higher += count;
    } else if (key < clickedCardRank) {
      totals.lower += count;
    } else {
      totals.equal += count;
    }
  }
  return totals;
};

/**
 * @description checks if selected card is already highlighted and if so undoes selection
 * @param {HTMLElement} card card element
 * @param {number} rank card rank - number from 2 to 14
 * @returns true if card was already highlighted, otherwise false
 */
const isHighlighted = (card, rank) => {
  // undo selection if card is already highlighted
  if (card.classList.contains("highlight")) {
    card.classList.remove("highlight");

    // add card back to active counts
    cardCounts[rank] += 1;

    // remove statistics from screen as there is now no selected card
    document.querySelector(".higher").textContent = "";
    document.querySelector(".lower").textContent = "";
    return true;
  }
  return false;
};

/**
 * @description highlights the clicked card and fades any previously highlighted cards
 * @param {HTMLElement} clickedCard card element clicked by user
 */
const highlightAndFade = (clickedCard) => {
  document.querySelectorAll(".highlight").forEach((card) => {
    card.classList.remove("highlight");
    card.classList.add("fade");
  });

  clickedCard.classList.add("highlight");
};

/**
 * @description calculates higher and lower statistics and updates on screen
 */
const updateStatistics = (clickedCardRank) => {
  const totals = getRankCounts(clickedCardRank);
  const cardTotals = totals.higher + totals.lower;
  document.querySelector(".higher").textContent = `${((totals.higher / cardTotals) * 100).toFixed(2)}%`;
  document.querySelector(".lower").textContent = `${((totals.lower / cardTotals) * 100).toFixed(2)}%`;
};

/**
 * @description Initialise the card counts object to contain the count of each rank of card
 */
const initialiseCardCounts = () => {
  for (let i = 2; i <= 14; i++) {
    cardCounts[i] = 4;
  }
};

const fadeInCards = () => {
  gsap.from(".card", { opacity: 0, duration: 4 });
};

const initialise = () => {
  initialiseCardCounts();
  updateStatistics(8);
  fadeInCards();
};

const addEventListeners = () => {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", cardClicked);
  });

  document.querySelector(".instructions").addEventListener("click", () => {
    document.getElementById(".popup-container").style.display = "block";
  });
};

initialise();
addEventListeners();
