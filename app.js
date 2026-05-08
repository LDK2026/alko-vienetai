const GRAMS_PER_UNIT = 10;
const ETHANOL_DENSITY = 0.789;
const STORAGE_KEY = "alko.entries";
const SETTINGS_KEY = "alko.settings";

const DEFAULT_SETTINGS = {
  daily: 2,
  weekly: 14
};

const drinks = [
  { id: "beer", name: "Alus", abv: 5, amount: 500, image: "beer.svg" },
  { id: "wine", name: "Vynas", abv: 12, amount: 150, image: "wine.svg" },
  { id: "vodka", name: "Degtinė", abv: 40, amount: 40, image: "vodka.svg" },
  { id: "whiskey", name: "Viskis", abv: 40, amount: 40, image: "whiskey.svg" },
  { id: "champagne", name: "Putojantis", abv: 11, amount: 150, image: "champagne.svg" },
  { id: "cider", name: "Sidras", abv: 4.5, amount: 500, image: "cider.svg" },
  { id: "liqueur", name: "Likeris", abv: 20, amount: 50, image: "liqueur.svg" },
  { id: "other", name: "Kita", abv: 0, amount: 100, image: "other.svg" }
];

let selectedDrink = drinks[0];
let entries = readJson(STORAGE_KEY, []);
let settings = { ...DEFAULT_SETTINGS, ...readJson(SETTINGS_KEY, {}) };

const els = {
  date: document.querySelector("#dateInput"),
  amount: document.querySelector("#amountInput"),
  abv: document.querySelector("#abvInput"),
  drinkGrid: document.querySelector("#drinkGrid"),
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
  refresh();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

function bindEvents() {
  els.form.addEventListener("submit", addEntry);
  els.amount.addEventListener("input", updatePreview);
  els.abv.addEventListener("input", updatePreview);
  els.saveSettings.addEventListener("click", saveSettings);
  els.clearHistory.addEventListener("click", clearHistory);
  els.shareButton.addEventListener("click", share);

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

    button.dataset.drink = drink.id;
    button.setAttribute("aria-pressed", "false");
    image.src = drink.image;
    image.alt = "";
    button.querySelector("span").textContent = drink.name;
    button.querySelector("small").textContent = drink.abv
      ? `${drink.amount} ml / ${drink.abv}%`
      : "Įvesk pats";
    button.addEventListener("click", () => selectDrink(drink.id));

    els.drinkGrid.appendChild(fragment);
  });
}

function selectDrink(drinkId) {
  selectedDrink = drinks.find((drink) => drink.id === drinkId) || drinks[0];
  els.amount.value = selectedDrink.amount || "";
  els.abv.value = selectedDrink.abv || "";

  document.querySelectorAll(".drink-card").forEach((button) => {
    const active = button.dataset.drink === selectedDrink.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  updatePreview();
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
          <strong>${escapeHtml(entry.drink)} · ${entry.units.toFixed(1)} vnt.</strong>
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
  return new Date().toISOString().slice(0, 10);
}

function daysAgoIso(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
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
