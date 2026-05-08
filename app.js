const GRAMS_PER_UNIT = 10;
const ETHANOL_DENSITY = 0.789;

const STORAGE_KEY = "alko.entries";
const SETTINGS_KEY = "alko.settings";

const drinks = [
  { id: "beer", name: "Alus", abv: 5, amount: 500, image: "assets/beer.svg" },
  { id: "wine", name: "Vynas", abv: 12, amount: 150, image: "assets/wine.svg" },
  { id: "vodka", name: "Degtinė", abv: 40, amount: 40, image: "assets/vodka.svg" }
];

let selectedDrink = drinks[0];
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

const els = {
  date: document.querySelector("#dateInput"),
  amount: document.querySelector("#amountInput"),
  abv: document.querySelector("#abvInput"),
  drinkGrid: document.querySelector("#drinkGrid"),
  previewText: document.querySelector("#previewText"),
  previewUnits: document.querySelector("#previewUnits"),
  form: document.querySelector("#drinkForm"),
  todayUnits: document.querySelector("#todayUnits"),
  riskFill: document.querySelector("#riskFill"),
  riskText: document.querySelector("#riskText"),
  periodUnits: document.querySelector("#periodUnits"),
  periodGrams: document.querySelector("#periodGrams"),
  periodDays: document.querySelector("#periodDays"),
  historyList: document.querySelector("#historyList"),
  dailyLimit: document.querySelector("#dailyLimitInput"),
  weeklyLimit: document.querySelector("#weeklyLimitInput"),
  saveSettings: document.querySelector("#saveSettingsButton"),
  shareButton: document.querySelector("#shareButton")
};

init();

function init() {
  els.date.value = new Date().toISOString().slice(0, 10);
  renderDrinks();
  bind();
  refresh();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
}

function bind() {
  els.form.addEventListener("submit", addEntry);
  els.saveSettings.addEventListener("click", saveSettings);
  els.shareButton.addEventListener("click", share);
}

function renderDrinks() {
  const template = document.querySelector("#drinkCardTemplate");
  els.drinkGrid.innerHTML = "";

  drinks.forEach(d => {
    const el = template.content.cloneNode(true);
    const btn = el.querySelector("button");

    btn.querySelector("img").src = d.image;
    btn.querySelector("span").textContent = d.name;
    btn.querySelector("small").textContent = `${d.amount} ml / ${d.abv}%`;

    btn.onclick = () => select(d);

    els.drinkGrid.appendChild(btn);
  });
}

function select(d) {
  selectedDrink = d;
  els.amount.value = d.amount;
  els.abv.value = d.abv;
  updatePreview();
}

function addEntry(e) {
  e.preventDefault();

  const amount = +els.amount.value;
  const abv = +els.abv.value;

  const grams = amount * (abv / 100) * ETHANOL_DENSITY;

  entries.unshift({
    id: crypto.randomUUID?.() || Date.now(),
    date: els.date.value,
    drink: selectedDrink.name,
    grams,
    units: grams / GRAMS_PER_UNIT
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  refresh();
}

function refresh() {
  const today = new Date().toISOString().slice(0, 10);

  const todaySum = entries
    .filter(e => e.date === today)
    .reduce((a, b) => a + b.units, 0);

  els.todayUnits.textContent = todaySum.toFixed(1);

  renderHistory();
}

function renderHistory() {
  els.historyList.innerHTML = "";

  entries.forEach(e => {
    const div = document.createElement("div");
    div.textContent = `${e.date} - ${e.drink} - ${e.units.toFixed(1)} vnt`;
    els.historyList.appendChild(div);
  });
}

function updatePreview() {
  const amount = +els.amount.value || 0;
  const abv = +els.abv.value || 0;

  const grams = amount * (abv / 100) * ETHANOL_DENSITY;
  const units = grams / GRAMS_PER_UNIT;

  els.previewText.textContent = `${amount} ml / ${abv}%`;
  els.previewUnits.textContent = `${units.toFixed(1)} vnt`;
}

function saveSettings() {
  settings = {
    daily: +els.dailyLimit.value,
    weekly: +els.weeklyLimit.value
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

async function share() {
  const text = `Alko Vienetai: ${entries.length} įrašų`;

  if (navigator.share) {
    await navigator.share({ text });
  }
}
