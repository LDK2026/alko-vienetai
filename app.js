const GRAMS_PER_UNIT = 10;
const ETHANOL_DENSITY = 0.789;
const STORAGE_KEY = "alko.entries";
const SETTINGS_KEY = "alko.settings";

const DEFAULT_SETTINGS = {
  daily: 2,
  weekly: 14
};

const drinks = [
  {
    id: "beer",
    name: "Alus",
    image: "beer.svg",
    portions: [
      { label: "Mažas", detail: "330 ml", amount: 330 },
      { label: "Bokalas", detail: "500 ml", amount: 500 },
      { label: "Pinta", detail: "568 ml", amount: 568 }
    ],
    strengths: [
      { label: "Lengvas", detail: "4.5%", abv: 4.5 },
      { label: "Įprastas", detail: "5%", abv: 5 },
      { label: "Stiprus", detail: "6.5%", abv: 6.5 }
    ]
  },
  {
    id: "wine",
    name: "Vynas",
    image: "wine.svg",
    portions: [
      { label: "Maža taurė", detail: "100 ml", amount: 100 },
      { label: "Taurė", detail: "150 ml", amount: 150 },
      { label: "Didelė taurė", detail: "175 ml", amount: 175 }
    ],
    strengths: [
      { label: "Lengvas", detail: "10.5%", abv: 10.5 },
      { label: "Sausas", detail: "12%", abv: 12 },
      { label: "Stipresnis", detail: "14%", abv: 14 }
    ]
  },
  {
    id: "vodka",
    name: "Degtinė",
    image: "vodka.svg",
    portions: [
      { label: "Maža", detail: "30 ml", amount: 30 },
      { label: "Standartinė", detail: "40 ml", amount: 40 },
      { label: "Dviguba", detail: "80 ml", amount: 80 }
    ],
    strengths: [
      { label: "Įprasta", detail: "40%", abv: 40 },
      { label: "Stipri", detail: "50%", abv: 50 }
    ]
  },
  {
    id: "whiskey",
    name: "Viskis",
    image: "whiskey.svg",
    portions: [
      { label: "Mažas", detail: "30 ml", amount: 30 },
      { label: "Standartinis", detail: "40 ml", amount: 40 },
      { label: "Dvigubas", detail: "80 ml", amount: 80 }
    ],
    strengths: [
      { label: "Įprastas", detail: "40%", abv: 40 },
      { label: "Stipresnis", detail: "46%", abv: 46 }
    ]
  },
  {
    id: "champagne",
    name: "Putojantis",
    image: "champagne.svg",
    portions: [
      { label: "Fleita", detail: "100 ml", amount: 100 },
      { label: "Taurė", detail: "150 ml", amount: 150 },
      { label: "Didelė", detail: "200 ml", amount: 200 }
    ],
    strengths: [
      { label: "Lengvas", detail: "10.5%", abv: 10.5 },
      { label: "Įprastas", detail: "11%", abv: 11 },
      { label: "Sausas", detail: "12%", abv: 12 }
    ]
  },
  {
    id: "cider",
    name: "Sidras",
    image: "cider.svg",
    portions: [
      { label: "Buteliukas", detail: "330 ml", amount: 330 },
      { label: "Skardinė", detail: "440 ml", amount: 440 },
      { label: "Didelis", detail: "500 ml", amount: 500 }
    ],
    strengths: [
      { label: "Lengvas", detail: "4%", abv: 4 },
      { label: "Įprastas", detail: "4.5%", abv: 4.5 },
      { label: "Stipresnis", detail: "6%", abv: 6 }
    ]
  },
  {
    id: "liqueur",
    name: "Likeris",
    image: "liqueur.svg",
    portions: [
      { label: "Mažas", detail: "25 ml", amount: 25 },
      { label: "Taurelė", detail: "50 ml", amount: 50 },
      { label: "Didelis", detail: "75 ml", amount: 75 }
    ],
    strengths: [
      { label: "Lengvas", detail: "15%", abv: 15 },
      { label: "Įprastas", detail: "20%", abv: 20 },
      { label: "Stiprus", detail: "30%", abv: 30 }
    ]
  },
  {
    id: "other",
    name: "Kita",
    image: "other.svg",
    portions: [
      { label: "Mažai", detail: "50 ml", amount: 50 },
      { label: "Vidutiniškai", detail: "150 ml", amount: 150 },
      { label: "Daugiau", detail: "300 ml", amount: 300 }
    ],
    strengths: [
      { label: "Silpnas", detail: "4%", abv: 4 },
      { label: "Vynas", detail: "12%", abv: 12 },
      { label: "Stiprus", detail: "40%", abv: 40 }
    ]
  }
];

let selectedDrink = drinks[0];
let autoDate = true;
let entries = readJson(STORAGE_KEY, []);
let settings = { ...DEFAULT_SETTINGS, ...readJson(SETTINGS_KEY, {}) };

const els = {
  date: document.querySelector("#dateInput"),
  prevDate: document.querySelector("#prevDateButton"),
  nextDate: document.querySelector("#nextDateButton"),
  todayDate: document.querySelector("#todayDateButton"),
  amount: document.querySelector("#amountInput"),
  abv: document.querySelector("#abvInput"),
  drinkGrid: document.querySelector("#drinkGrid"),
  selectedDrinkImage: document.querySelector("#selectedDrinkImage"),
  selectedDrinkName: document.querySelector("#selectedDrinkName"),
  portionOptions: document.querySelector("#portionOptions"),
  strengthOptions: document.querySelector("#strengthOptions"),
  drinkDialog: document.querySelector("#drinkDialog"),
  closeDrinkDialog: document.querySelector("#closeDrinkDialog"),
  previewText: document.querySelector("#previewText"),
  previewUnits: document.querySelector("#previewUnits"),
  form: document.querySelector("#drinkForm"),
  tabs: document.querySelectorAll(".tab"),
  screens: document.querySelectorAll(".screen"),
  todayUnits: document.querySelector("#todayUnits"),
  weekUnits: document.querySelector("#weekUnits"),
  riskFill: document.querySelector("#riskFill"),
  riskText: document.querySelector("#riskText"),
  periodUnits: document.querySelector("#periodUnits"),
  periodGrams: document.querySelector("#periodGrams"),
  periodDays: document.querySelector("#periodDays"),
  drinkBreakdown: document.querySelector("#drinkBreakdown"),
  historyList: document.querySelector("#historyList"),
  clearHistory: document.querySelector("#clearHistoryButton"),
  dailyLimit: document.querySelector("#dailyLimitInput"),
  weeklyLimit: document.querySelector("#weeklyLimitInput"),
  saveSettings: document.querySelector("#saveSettingsButton"),
  shareButton: document.querySelector("#shareButton")
};

init();

function init() {
  els.date.value = todayIso();
  els.dailyLimit.value = settings.daily;
  els.weeklyLimit.value = settings.weekly;

  renderDrinks();
  selectDrink(selectedDrink.id);
  bindEvents();
  updateViewportMetrics();
  refresh();
  scheduleDateSync();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

function bindEvents() {
  els.form.addEventListener("submit", addEntry);
  els.amount.addEventListener("input", () => {
    markManualOption(els.portionOptions);
    updatePreview();
  });
  els.abv.addEventListener("input", () => {
    markManualOption(els.strengthOptions);
    updatePreview();
  });
  [els.amount, els.abv].forEach((input) => {
    input.addEventListener("focus", () => keepFocusedFieldVisible(input));
  });
  els.date.addEventListener("change", () => {
    autoDate = els.date.value === todayIso();
  });
  els.prevDate.addEventListener("click", () => shiftDate(-1));
  els.nextDate.addEventListener("click", () => shiftDate(1));
  els.todayDate.addEventListener("click", setToday);
  els.closeDrinkDialog.addEventListener("click", closeDrinkDialog);
  els.drinkDialog.addEventListener("click", (event) => {
    if (event.target === els.drinkDialog) {
      closeDrinkDialog();
    }
  });
  els.saveSettings.addEventListener("click", saveSettings);
  els.clearHistory.addEventListener("click", clearHistory);
  els.shareButton.addEventListener("click", share);
  window.addEventListener("resize", updateViewportMetrics);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateViewportMetrics);
    window.visualViewport.addEventListener("scroll", updateViewportMetrics);
  }

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  });
}

function renderDrinks() {
  const template = document.querySelector("#drinkCardTemplate");
  els.drinkGrid.innerHTML = "";

  drinks.forEach((drink) => {
    const fragment = template.content.cloneNode(true);
    const button = fragment.querySelector("button");
    const image = button.querySelector("img");
    const defaultPortion = drink.portions[0];
    const defaultStrength = drink.strengths[0];

    button.dataset.drink = drink.id;
    button.setAttribute("aria-pressed", "false");
    image.src = drink.image;
    image.alt = "";
    button.querySelector("span").textContent = drink.name;
    button.querySelector("small").textContent = `${defaultPortion.amount} ml / ${defaultStrength.abv}%`;
    button.addEventListener("click", () => selectDrink(drink.id, true));

    els.drinkGrid.appendChild(fragment);
  });
}

function selectDrink(drinkId, shouldOpenDialog = false) {
  selectedDrink = drinks.find((drink) => drink.id === drinkId) || drinks[0];
  const portion = selectedDrink.portions[0];
  const strength = selectedDrink.strengths[0];

  els.amount.value = portion.amount;
  els.abv.value = strength.abv;
  els.selectedDrinkImage.src = selectedDrink.image;
  els.selectedDrinkName.textContent = selectedDrink.name;

  document.querySelectorAll(".drink-card").forEach((button) => {
    const active = button.dataset.drink === selectedDrink.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderOptionButtons(els.portionOptions, selectedDrink.portions, "amount", portion.amount);
  renderOptionButtons(els.strengthOptions, selectedDrink.strengths, "abv", strength.abv);
  updatePreview();

  if (shouldOpenDialog) {
    openDrinkDialog();
  }
}

function openDrinkDialog() {
  updateViewportMetrics();

  if (typeof els.drinkDialog.showModal === "function") {
    if (!els.drinkDialog.open) {
      els.drinkDialog.showModal();
    }
    return;
  }

  els.drinkDialog.setAttribute("open", "");
}

function updateViewportMetrics() {
  const viewport = window.visualViewport;
  const height = viewport ? viewport.height : window.innerHeight;
  const offsetTop = viewport ? viewport.offsetTop : 0;
  const isCompact = window.matchMedia("(max-width: 640px)").matches;
  const keyboardOpen = Boolean(viewport && height < window.innerHeight * 0.78);
  const topGap = Math.max(isCompact ? 48 : 16, Math.round(offsetTop + 12));
  const bottomGap = keyboardOpen ? 12 : (isCompact ? 72 : 16);

  document.documentElement.style.setProperty("--viewport-height", `${Math.round(height)}px`);
  document.documentElement.style.setProperty("--dialog-top-gap", `${topGap}px`);
  document.documentElement.style.setProperty("--dialog-bottom-gap", `${bottomGap}px`);
}

function keepFocusedFieldVisible(input) {
  window.setTimeout(() => {
    updateViewportMetrics();
    input.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 120);
}

function closeDrinkDialog() {
  if (typeof els.drinkDialog.close === "function" && els.drinkDialog.open) {
    els.drinkDialog.close();
    return;
  }

  els.drinkDialog.removeAttribute("open");
}

function renderOptionButtons(container, options, type, activeValue) {
  container.innerHTML = "";

  options.forEach((option) => {
    const value = type === "amount" ? option.amount : option.abv;
    const button = document.createElement("button");
    button.className = "option-chip";
    button.type = "button";
    button.dataset.value = value;
    button.innerHTML = `<strong>${escapeHtml(option.label)}</strong><span>${escapeHtml(option.detail)}</span>`;
    button.classList.toggle("active", Number(value) === Number(activeValue));
    button.addEventListener("click", () => {
      if (type === "amount") {
        els.amount.value = value;
      } else {
        els.abv.value = value;
      }

      setActiveOption(container, value);
      updatePreview();
    });
    container.appendChild(button);
  });
}

function setActiveOption(container, value) {
  container.querySelectorAll(".option-chip").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.value) === Number(value));
  });
}

function markManualOption(container) {
  container.querySelectorAll(".option-chip").forEach((button) => {
    button.classList.toggle("active", false);
  });
}

function addEntry(event) {
  event.preventDefault();

  const amount = Number(els.amount.value);
  const abv = Number(els.abv.value);

  if (!amount || amount <= 0 || abv < 0 || abv > 96) {
    return;
  }

  const grams = calculateGrams(amount, abv);
  entries.unshift({
    id: getId(),
    date: els.date.value,
    drinkId: selectedDrink.id,
    drink: selectedDrink.name,
    amount,
    abv,
    grams,
    units: grams / GRAMS_PER_UNIT
  });

  persistEntries();
  refresh();
  closeDrinkDialog();
}

function refresh() {
  const today = todayIso();
  const weekStart = daysAgoIso(6);
  const todayEntries = entries.filter((entry) => entry.date === today);
  const weekEntries = entries.filter((entry) => entry.date >= weekStart && entry.date <= today);
  const todayUnits = sum(todayEntries, "units");
  const weekUnits = sum(weekEntries, "units");

  els.todayUnits.textContent = todayUnits.toFixed(1);
  els.weekUnits.textContent = weekUnits.toFixed(1);
  els.periodUnits.textContent = weekUnits.toFixed(1);
  els.periodGrams.textContent = `${Math.round(sum(weekEntries, "grams"))} g`;
  els.periodDays.textContent = new Set(weekEntries.map((entry) => entry.date)).size;

  renderRisk(todayUnits, weekUnits);
  renderBreakdown(weekEntries);
  renderHistory();
}

function renderRisk(todayUnits, weekUnits) {
  const dailyLimit = Number(settings.daily) || DEFAULT_SETTINGS.daily;
  const weeklyLimit = Number(settings.weekly) || DEFAULT_SETTINGS.weekly;
  const dailyRatio = dailyLimit ? todayUnits / dailyLimit : 0;
  const weeklyRatio = weeklyLimit ? weekUnits / weeklyLimit : 0;
  const ratio = Math.max(dailyRatio, weeklyRatio);
  const percent = Math.min(100, Math.round(ratio * 100));

  els.riskFill.style.width = `${percent}%`;
  els.riskFill.style.backgroundColor = ratio >= 1 ? "#b42318" : ratio >= 0.75 ? "#c77d1a" : "#0f5132";

  if (!entries.length) {
    els.riskText.textContent = "Įrašyk pirmą gėrimą.";
  } else if (ratio >= 1) {
    els.riskText.textContent = "Pasiekta arba viršyta tavo pasirinkta riba.";
  } else if (ratio >= 0.75) {
    els.riskText.textContent = "Artėji prie savo pasirinktos ribos.";
  } else {
    els.riskText.textContent = "Pagal tavo nustatytas ribas dar yra atsargos.";
  }
}

function renderBreakdown(sourceEntries) {
  if (!sourceEntries.length) {
    els.drinkBreakdown.innerHTML = '<div class="empty-state">Per paskutines 7 dienas įrašų nėra.</div>';
    return;
  }

  const totals = sourceEntries.reduce((acc, entry) => {
    acc[entry.drink] = (acc[entry.drink] || 0) + entry.units;
    return acc;
  }, {});

  els.drinkBreakdown.innerHTML = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([drink, units]) => `
      <div class="breakdown-row">
        <strong>${escapeHtml(drink)}</strong>
        <span>${units.toFixed(1)} vnt.</span>
      </div>
    `)
    .join("");
}

function renderHistory() {
  if (!entries.length) {
    els.historyList.innerHTML = '<div class="empty-state">Istorija tuščia.</div>';
    return;
  }

  els.historyList.innerHTML = entries
    .map((entry) => `
      <div class="history-item">
        <div>
          <strong>${escapeHtml(entry.drink)} · ${Number(entry.units || 0).toFixed(1)} vnt.</strong>
          <span>${entry.date} · ${entry.amount || "?"} ml · ${entry.abv || "?"}%</span>
        </div>
        <button class="secondary-button" type="button" data-delete="${entry.id}">Trinti</button>
      </div>
    `)
    .join("");

  els.historyList.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteEntry(button.dataset.delete));
  });
}

function activateTab(tabName) {
  els.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  els.screens.forEach((screen) => {
    const active = screen.id === `${tabName}Screen`;
    screen.classList.toggle("active", active);
    screen.hidden = !active;
  });
}

function updatePreview() {
  const amount = Number(els.amount.value) || 0;
  const abv = Number(els.abv.value) || 0;
  const grams = calculateGrams(amount, abv);
  const units = grams / GRAMS_PER_UNIT;

  els.previewText.textContent = `${amount} ml / ${abv}%`;
  els.previewUnits.textContent = `${units.toFixed(1)} vnt.`;
}

function saveSettings() {
  settings = {
    daily: Number(els.dailyLimit.value) || DEFAULT_SETTINGS.daily,
    weekly: Number(els.weeklyLimit.value) || DEFAULT_SETTINGS.weekly
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  refresh();
}

function clearHistory() {
  if (!entries.length || !confirm("Išvalyti visą istoriją šiame įrenginyje?")) {
    return;
  }

  entries = [];
  persistEntries();
  refresh();
}

function deleteEntry(id) {
  entries = entries.filter((entry) => String(entry.id) !== String(id));
  persistEntries();
  refresh();
}

function shiftDate(days) {
  const date = isoToDate(els.date.value || todayIso());
  date.setDate(date.getDate() + days);
  els.date.value = dateToIso(date);
  autoDate = els.date.value === todayIso();
}

function setToday() {
  els.date.value = todayIso();
  autoDate = true;
}

function scheduleDateSync() {
  window.setInterval(() => {
    if (autoDate && els.date.value !== todayIso()) {
      els.date.value = todayIso();
      refresh();
    }
  }, 60000);
}

async function share() {
  const text = `Alko Vienetai: ${entries.length} įrašų, šiandien ${els.todayUnits.textContent} vnt.`;

  if (navigator.share) {
    await navigator.share({ title: "Alko Vienetai", text });
    return;
  }

  await navigator.clipboard?.writeText(text);
}

function calculateGrams(amount, abv) {
  return amount * (abv / 100) * ETHANOL_DENSITY;
}

function persistEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function sum(items, key) {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function todayIso() {
  return dateToIso(new Date());
}

function daysAgoIso(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return dateToIso(date);
}

function dateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isoToDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
