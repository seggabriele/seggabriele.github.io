// assets/js/custom.js

document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initMemoryGame();
});

/* ============================================
   Kontaktų forma – validacija, vidurkis, popup
   ============================================ */

function initContactForm() {
  const form = document.querySelector("#contact .php-email-form");
  if (!form) return;

  // Formos laukai
  const firstNameInput  = form.elements["first_name"];
  const lastNameInput   = form.elements["last_name"];
  const emailInput      = form.elements["email"];
  const phoneInput      = form.elements["phone"];
  const addressInput    = form.elements["address"];
  const ratingDesign    = form.elements["rating_design"];
  const ratingClarity   = form.elements["rating_clarity"];
  const ratingOverall   = form.elements["rating_overall"];
  const submitBtn       = form.querySelector("button[type='submit']");

  // Submit pradžioje neaktyvus
  if (submitBtn) submitBtn.disabled = true;

  // Rezultatų blokas po forma (4–5 užduotys)
  const resultBox = document.createElement("div");
  resultBox.id = "form-result";
  resultBox.className = "mt-3 p-3 bg-light";
  form.appendChild(resultBox);

  // Pop-up sėkmingam pateikimui (6 užduotis)
  const popup = document.createElement("div");
  popup.id = "success-popup";
  popup.className = "success-popup";
  popup.innerHTML = `
    <div class="success-popup-inner">
      <p>Duomenys pateikti sėkmingai!</p>
      <button type="button" class="btn btn-sm popup-close">Uždaryti</button>
    </div>
  `;
  document.body.appendChild(popup);

  const closeBtn = popup.querySelector(".popup-close");

  function hidePopup() {
    popup.classList.remove("show");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", hidePopup);
  }

  // Pagalbinė funkcija tekstui
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Klaidų blokeliai po laukais
  function createErrorEl(input) {
    const err = document.createElement("div");
    err.className = "field-error";
    input.insertAdjacentElement("afterend", err);
    return err;
  }

  const errors = {
    first_name: { el: createErrorEl(firstNameInput), hasError: true },
    last_name:  { el: createErrorEl(lastNameInput),  hasError: true },
    email:      { el: createErrorEl(emailInput),     hasError: true },
    address:    { el: createErrorEl(addressInput),   hasError: true },
    phone:      { el: createErrorEl(phoneInput),     hasError: true }
  };

  // Submit mygtuko aktyvumo tikrinimas
  function updateSubmitState() {
    const allOk =
      !errors.first_name.hasError &&
      !errors.last_name.hasError &&
      !errors.email.hasError &&
      !errors.address.hasError &&
      !errors.phone.hasError;

    if (submitBtn) {
      submitBtn.disabled = !allOk;
    }
  }

  // Vardas / pavardė – tik raidės
  const nameRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\-]+$/;

  function validateFirstName() {
    const v = firstNameInput.value.trim();
    let msg = "";

    if (!v) {
      msg = "Įveskite vardą.";
    } else if (!nameRegex.test(v)) {
      msg = "Vardas turi būti sudarytas tik iš raidžių.";
    }

    if (msg) {
      firstNameInput.classList.add("is-invalid");
      errors.first_name.el.textContent = msg;
      errors.first_name.hasError = true;
    } else {
      firstNameInput.classList.remove("is-invalid");
      errors.first_name.el.textContent = "";
      errors.first_name.hasError = false;
    }
    updateSubmitState();
  }

  function validateLastName() {
    const v = lastNameInput.value.trim();
    let msg = "";

    if (!v) {
      msg = "Įveskite pavardę.";
    } else if (!nameRegex.test(v)) {
      msg = "Pavardė turi būti sudaryta tik iš raidžių.";
    }

    if (msg) {
      lastNameInput.classList.add("is-invalid");
      errors.last_name.el.textContent = msg;
      errors.last_name.hasError = true;
    } else {
      lastNameInput.classList.remove("is-invalid");
      errors.last_name.el.textContent = "";
      errors.last_name.hasError = false;
    }
    updateSubmitState();
  }

  // El. paštas
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail() {
    const v = emailInput.value.trim();
    let msg = "";

    if (!v) {
      msg = "Įveskite el. pašto adresą.";
    } else if (!emailRegex.test(v)) {
      msg = "Neteisingas el. pašto formatas.";
    }

    if (msg) {
      emailInput.classList.add("is-invalid");
      errors.email.el.textContent = msg;
      errors.email.hasError = true;
    } else {
      emailInput.classList.remove("is-invalid");
      errors.email.el.textContent = "";
      errors.email.hasError = false;
    }
    updateSubmitState();
  }

  // Adresas – ne tuščias
  function validateAddress() {
    const v = addressInput.value.trim();
    let msg = "";

    if (!v) {
      msg = "Įveskite adresą.";
    }

    if (msg) {
      addressInput.classList.add("is-invalid");
      errors.address.el.textContent = msg;
      errors.address.hasError = true;
    } else {
      addressInput.classList.remove("is-invalid");
      errors.address.el.textContent = "";
      errors.address.hasError = false;
    }
    updateSubmitState();
  }

  // Telefono numerio formatavimas ir validacija
  function formatAndValidatePhone() {
    let raw = phoneInput.value;
    let digits = raw.replace(/\D/g, "");

    // 86xxxxxxx -> 3706xxxxxx
    if (digits.startsWith("86")) {
      digits = "370" + digits.slice(1);
    }

    // max 11 skaitmenų
    digits = digits.slice(0, 11);

    let formatted = "";
    if (digits.length > 0) {
      if (digits.startsWith("370")) {
        formatted = "+370";
        if (digits.length >= 4) {
          formatted += " " + digits[3]; // 6
        }
        if (digits.length >= 5) {
          const extra = digits.slice(4, Math.min(6, digits.length));
          formatted += extra;
        }
        if (digits.length >= 7) {
          formatted += " " + digits.slice(6);
        }
      } else {
        formatted = "+" + digits;
      }
    }

    phoneInput.value = formatted;

    let msg = "";
    const validFull = /^3706\d{7}$/.test(digits); // 3706 + 7 skaitmenų

    if (!digits) {
      msg = "Įveskite telefono numerį.";
    } else if (!validFull) {
      msg = "Telefono numeris turi būti formato +370 6xx xxxxx.";
    }

    if (msg) {
      phoneInput.classList.add("is-invalid");
      errors.phone.el.textContent = msg;
      errors.phone.hasError = true;
    } else {
      phoneInput.classList.remove("is-invalid");
      errors.phone.el.textContent = "";
      errors.phone.hasError = false;
    }

    updateSubmitState();
  }

  // Real-time validacija
  firstNameInput.addEventListener("input", validateFirstName);
  lastNameInput.addEventListener("input", validateLastName);
  emailInput.addEventListener("input", validateEmail);
  addressInput.addEventListener("input", validateAddress);
  phoneInput.addEventListener("input", formatAndValidatePhone);
  phoneInput.addEventListener("blur", formatAndValidatePhone);

  // Pradinė būsena
  validateFirstName();
  validateLastName();
  validateEmail();
  validateAddress();
  formatAndValidatePhone();

  // Submit įvykis – 4, 5 ir 6 užduotys
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation(); // sustabdom validate.js ir tikrą POST

    // paskutinė validacija
    validateFirstName();
    validateLastName();
    validateEmail();
    validateAddress();
    formatAndValidatePhone();

    const anyError =
      errors.first_name.hasError ||
      errors.last_name.hasError ||
      errors.email.hasError ||
      errors.address.hasError ||
      errors.phone.hasError;

    if (anyError) {
      return;
    }

    const firstName = firstNameInput.value.trim();
    const lastName  = lastNameInput.value.trim();
    const email     = emailInput.value.trim();
    const phone     = phoneInput.value.trim();
    const address   = addressInput.value.trim();

    const rDesign   = Number(ratingDesign.value || 0);
    const rClarity  = Number(ratingClarity.value || 0);
    const rOverall  = Number(ratingOverall.value || 0);

    const averageRating = ((rDesign + rClarity + rOverall) / 3).toFixed(1);

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      ratingDesign: rDesign,
      ratingClarity: rClarity,
      ratingOverall: rOverall,
      averageRating
    };

    console.log("Formos duomenys:", formData);

    const fullName = `${firstName} ${lastName}`.trim() || "Neįvestas vardas";

    resultBox.innerHTML = `
      <p><strong>Vardas:</strong> ${escapeHtml(firstName || "-")}</p>
      <p><strong>Pavardė:</strong> ${escapeHtml(lastName || "-")}</p>
      <p><strong>El. paštas:</strong> 
        <a href="mailto:${escapeHtml(email)}">${escapeHtml(email || "-")}</a>
      </p>
      <p><strong>Tel. numeris:</strong> ${escapeHtml(phone || "-")}</p>
      <p><strong>Adresas:</strong> ${escapeHtml(address || "-")}</p>
      <hr>
      <p><strong>${escapeHtml(fullName)}:</strong> vidurkis: ${averageRating}</p>
    `;

    // Parodom pop-up
    popup.classList.add("show");
    setTimeout(hidePopup, 4000);
  });
}

/* ============================================
   Atminties kortelių žaidimas
   ============================================ */

function initMemoryGame() {
  const gameSection = document.querySelector("#memory-game");
  if (!gameSection) return;

  const board       = gameSection.querySelector("#game-board");
  const movesSpan   = gameSection.querySelector("#game-moves");
  const matchesSpan = gameSection.querySelector("#game-matches");
  const timeSpan    = gameSection.querySelector("#game-time");
  const bestEasySpan = gameSection.querySelector("#best-easy");
  const bestHardSpan = gameSection.querySelector("#best-hard");

  const startBtn    = gameSection.querySelector("#game-start");
  const resetBtn    = gameSection.querySelector("#game-reset");
  const messageBox  = gameSection.querySelector("#game-message");
  const difficultyRadios = gameSection.querySelectorAll("input[name='game-difficulty']");

  // mažiausiai 6 unikalūs elementai – čia 12, kad užtektų sunkiausiam lygiui
  const symbols = ["💻","🎧","📚","☕","🎮","🛰️","📷","🎵","🧠","📱","🌌","🎓"];

  let moves = 0;
  let matches = 0;
  let totalPairs = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let started = false;

  let secondsElapsed = 0;
  let timerInterval = null;

  let currentDifficulty = "easy";

  // localStorage geriausi rezultatai
  const bestScores = {
    easy: null,
    hard: null
  };

  function getSelectedDifficulty() {
    const checked = [...difficultyRadios].find(r => r.checked);
    return checked ? checked.value : "easy";
  }

  function resetStats() {
    moves = 0;
    matches = 0;
    if (movesSpan)   movesSpan.textContent = "0";
    if (matchesSpan) matchesSpan.textContent = "0";
  }

  function updateStats() {
    if (movesSpan)   movesSpan.textContent = String(moves);
    if (matchesSpan) matchesSpan.textContent = String(matches);
  }

  function updateTime() {
    if (timeSpan) {
      timeSpan.textContent = String(secondsElapsed);
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    updateTime();
    timerInterval = setInterval(() => {
      secondsElapsed++;
      updateTime();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function clearMessage() {
    if (!messageBox) return;
    messageBox.textContent = "";
    messageBox.classList.remove("win", "info");
  }

  function showWinMessage() {
    if (!messageBox) return;
    messageBox.textContent = `Laimėjote! Visos poros surastos. Ėjimai: ${moves}, laikas: ${secondsElapsed} s 🎉`;
    messageBox.classList.add("win");
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  // localStorage – geriausi rezultatai
  function loadBestScores() {
    try {
      const easy = parseInt(localStorage.getItem("memoryBest_easy"), 10);
      const hard = parseInt(localStorage.getItem("memoryBest_hard"), 10);

      if (!isNaN(easy)) bestScores.easy = easy;
      if (!isNaN(hard)) bestScores.hard = hard;
    } catch (e) {
      // jei localStorage nepasiekiamas – tiesiog ignoruojam
    }
    refreshBestScoreUI();
  }

  function refreshBestScoreUI() {
    if (bestEasySpan) {
      bestEasySpan.textContent = bestScores.easy != null ? `${bestScores.easy} ėjimai` : "–";
    }
    if (bestHardSpan) {
      bestHardSpan.textContent = bestScores.hard != null ? `${bestScores.hard} ėjimai` : "–";
    }
  }

  function updateBestScore(difficulty, currentMoves) {
    if (!["easy", "hard"].includes(difficulty)) return;

    const existing = bestScores[difficulty];
    if (existing == null || currentMoves < existing) {
      bestScores[difficulty] = currentMoves;
      try {
        localStorage.setItem(`memoryBest_${difficulty}`, String(currentMoves));
      } catch (e) {
        // ignore
      }
      refreshBestScoreUI();
    }
  }

  function generateBoard() {
    if (!board) return;

    const difficulty = getSelectedDifficulty();
    currentDifficulty = difficulty;

    const pairs = difficulty === "hard" ? 12 : 6; // sunkus – 12 porų, lengvas – 6
    totalPairs = pairs;

    resetStats();
    clearMessage();
    resetTurn();

    // laikmatis atstatomas, bet nestartuojamas, kol nepaspaustas Start
    stopTimer();
    secondsElapsed = 0;
    updateTime();

    // Pasirenkam tiek simbolių, kiek reikia porų
    const chosen = symbols.slice(0, pairs);
    let cards = chosen.concat(chosen);
    shuffle(cards);

    // Atitinkamas grid
    board.classList.toggle("grid-easy", difficulty === "easy");
    board.classList.toggle("grid-hard", difficulty === "hard");

    // Išvalom ir sukuriam korteles
    board.innerHTML = "";

    cards.forEach(symbol => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.symbol = symbol;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">${symbol}</div>
        </div>
      `;

      card.addEventListener("click", handleCardClick);
      board.appendChild(card);
    });

    // Start dar nepradėtas
    started = false;
    if (startBtn) startBtn.disabled = false;
    if (resetBtn) resetBtn.disabled = true;
  }

  function handleCardClick(e) {
    if (!started) {
      // jei dar nepaspaustas Start – nekreipiam dėmesio
      return;
    }

    const card = e.currentTarget;
    if (lockBoard) return;
    if (card.classList.contains("matched")) return;
    if (card === firstCard) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    moves++;
    updateStats();

    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
      firstCard.classList.add("matched", "disabled");
      secondCard.classList.add("matched", "disabled");
      matches++;
      updateStats();
      resetTurn();

      if (matches === totalPairs) {
        stopTimer();
        showWinMessage();
        updateBestScore(currentDifficulty, moves);
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
      }, 900);
    }
  }

  // Sudėtingumo pakeitimas – nauja lenta, atstatoma būsena
  difficultyRadios.forEach(radio => {
    radio.addEventListener("change", function () {
      generateBoard();
    });
  });

  // Start mygtukas – pradeda žaidimą su jau sukurta lenta ir paleidžia laikmatį
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      started = true;
      clearMessage();
      if (messageBox) {
        messageBox.textContent = "Žaidimas pradėtas – surask visas poras!";
        messageBox.classList.add("info");
      }
      startBtn.disabled = true;
      if (resetBtn) resetBtn.disabled = false;

      // Laikmatis startuoja tik dabar
      startTimer();
    });
  }

  // Atnaujinti – nauja supainiota lenta ir iškart prasidedantis žaidimas
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      generateBoard();
      started = true;
      if (messageBox) {
        messageBox.textContent = "Nauja žaidimo partija pradėta.";
        messageBox.classList.add("info");
      }
      if (startBtn) startBtn.disabled = true;
      resetBtn.disabled = false;

      // naujam žaidimui laikmatį paleidžiam iš naujo
      startTimer();
    });
  }

  // Pradinė lenta (lengvas lygis) + užkraunam geriausius rezultatus iš localStorage
  loadBestScores();
  generateBoard();
}
