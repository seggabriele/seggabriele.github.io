// assets/js/custom.js

// Viską paleidžiam tik tada, kai DOM jau paruoštas
document.addEventListener("DOMContentLoaded", function () {
  // Susirandam kontaktų formą (Contact skiltyje)
  const form = document.querySelector("#contact .php-email-form");
  if (!form) return;

  // --- Sėkmingo pateikimo „pop-up“ pranešimas ---
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


  // Sukuriam bloką rezultatams parodyti – po forma
  const resultBox = document.createElement("div");
  resultBox.id = "form-result";
  resultBox.className = "mt-4 p-3 bg-light"; // Bootstrap klasės vizualiai tvarkingam blokui
  form.appendChild(resultBox);

  // Pagalbinė funkcija saugiam tekstui (kad nelūžtų HTML, jei kas įrašys < > ir pan.)
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Reagojam į formos „Submit“
form.addEventListener("submit", function (e) {
    e.preventDefault();              // nestandartinis formos siuntimas
    e.stopImmediatePropagation();    // NEBELEIDŽIAM jokių kitų submit handler'ių (validate.js)

    // 📥 Surenkam visas įvestis
    const firstName = form.elements["first_name"]?.value.trim() || "";
    const lastName  = form.elements["last_name"]?.value.trim() || "";
    const email     = form.elements["email"]?.value.trim() || "";
    const phone     = form.elements["phone"]?.value.trim() || "";
    const address   = form.elements["address"]?.value.trim() || "";

    const ratingDesign  = Number(form.elements["rating_design"]?.value || 0);
    const ratingClarity = Number(form.elements["rating_clarity"]?.value || 0);
    const ratingOverall = Number(form.elements["rating_overall"]?.value || 0);

    const averageRating = ((ratingDesign + ratingClarity + ratingOverall) / 3).toFixed(1);

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      ratingDesign,
      ratingClarity,
      ratingOverall,
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
        // Parodom „sėkmingai pateikta“ pranešimą
    popup.classList.add("show");
    // automatiškai paslėpti po 4 sek.
    setTimeout(hidePopup, 4000);

});

});
