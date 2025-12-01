// assets/js/custom.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#contact .php-email-form");
  if (!form) return;

  // ---- Laukai ----
  const firstNameInput  = form.elements["first_name"];
  const lastNameInput   = form.elements["last_name"];
  const emailInput      = form.elements["email"];
  const phoneInput      = form.elements["phone"];
  const addressInput    = form.elements["address"];
  const ratingDesign    = form.elements["rating_design"];
  const ratingClarity   = form.elements["rating_clarity"];
  const ratingOverall   = form.elements["rating_overall"];
  const submitBtn       = form.querySelector("button[type='submit']");

  // pradiniu atveju Submit išjungtas (3 punktas)
  if (submitBtn) submitBtn.disabled = true;

  // ---- Rezultatų blokas po forma (4–5 užduotys) ----
  const resultBox = document.createElement("div");
  resultBox.id = "form-result";
  resultBox.className = "mt-3 p-3 bg-light";
  form.appendChild(resultBox);

  // ---- Sėkmingo pateikimo pop-up (6 užduotis) ----
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

  closeBtn.addEventListener("click", hidePopup);

  // ---- Pagalbinė funkcija XSS apsaugai ----
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Klaidų blokeliai prie laukų ----
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

  // ---- Bendras submit mygtuko aktyvumo atnaujinimas ----
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

  // ---- Validacija: vardas ir pavardė (tik raidės, ne tuščia) ----
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

  // ---- El. pašto formatas ----
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

  // ---- Adresas – tiesiog ne tuščias tekstas ----
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

  // ---- Telefono numerio formatavimas ir validacija (2 punktas) ----
  // Lietuviškas šablonas: +370 6xx xxxxx  -> skaitmenys: 3706 + 7 = 11
  function formatAndValidatePhone() {
    let raw = phoneInput.value;
    let digits = raw.replace(/\D/g, "");        // paliekam tik skaitmenis

    // leidžiam suvesti 86... -> konvertuojam į 3706...
    if (digits.startsWith("86")) {
      digits = "370" + digits.slice(1);        // 86xxxxxxx -> 3706xxxxxx
    }

    // apribojam max 11 skaitmenų
    digits = digits.slice(0, 11);

    // suformuojam rodymą vartotojui
    let formatted = "";
    if (digits.length > 0) {
      if (digits.startsWith("370")) {
        formatted = "+370";
        if (digits.length >= 4) {
          formatted += " " + digits[3];        // 6
        }
        if (digits.length >= 5) {
          // dar du skaitmenys po 6
          const extra = digits.slice(4, Math.min(6, digits.length));
          formatted += extra;
        }
        if (digits.length >= 7) {
          formatted += " " + digits.slice(6);  // likę 5 skaitmenys
        }
      } else {
        formatted = "+" + digits;
      }
    }

    phoneInput.value = formatted;

    // Patikrinam galutinį formatą
    let msg = "";
    const validFull = /^3706\d{7}$/.test(digits); // 3706 + 7 skaitmenys

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

  // ---- Pririšam validaciją „realiu laiku“ (1 punktas) ----
  firstNameInput.addEventListener("input", validateFirstName);
  lastNameInput.addEventListener("input", validateLastName);
  emailInput.addEventListener("input", validateEmail);
  addressInput.addEventListener("input", validateAddress);

  phoneInput.addEventListener("input", formatAndValidatePhone);
  phoneInput.addEventListener("blur", formatAndValidatePhone);

  // paleidžiam pradinei būsenai
  validateFirstName();
  validateLastName();
  validateEmail();
  validateAddress();
  formatAndValidatePhone();

  // ---- Formos submit (4–5–6 užduotys) ----
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation(); // užblokuojam validate.js ir tikrą POST

    // paskutinį kartą patikrinam, kad tikrai viskas gerai
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
      return; // jeigu yra klaidų – neapdorojam ir nerodom popup
    }

    // 📥 Surenkam visas įvestis
    const firstName = firstNameInput.value.trim();
    const lastName  = lastNameInput.value.trim();
    const email     = emailInput.value.trim();
    const phone     = phoneInput.value.trim();
    const address   = addressInput.value.trim();

    const rDesign   = Number(ratingDesign.value || 0);
    const rClarity  = Number(ratingClarity.value || 0);
    const rOverall  = Number(ratingOverall.value || 0);

    // 5 užduotis – vidurkis
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

    // 6 užduotis – parodyti pop-up tik sėkmingo pateikimo atveju
    popup.classList.add("show");
    setTimeout(hidePopup, 4000);
  });
});
