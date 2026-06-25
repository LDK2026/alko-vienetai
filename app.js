const GRAMS_PER_UNIT = 10;
const ETHANOL_DENSITY = 0.789;
const STORAGE_KEY = "alko.entries";
const SETTINGS_KEY = "alko.settings";
const EXPORT_VERSION = 1;

const DEFAULT_SETTINGS = {
  daily: 2,
  weekly: 14,
  monthly: 60,
  yearly: 730
};

const STATS_PERIOD_LABELS = {
  week: "Savaitės vienetai",
  month: "Mėnesio vienetai",
  year: "Metų vienetai"
};

const STATS_CURRENT_LABELS = {
  week: "Ši savaitė",
  month: "Šis mėnuo",
  year: "Šie metai"
};

const STATS_EMPTY_TEXT = {
  week: "Pasirinktą savaitę įrašų nėra.",
  month: "Pasirinktą mėnesį įrašų nėra.",
  year: "Pasirinktais metais įrašų nėra."
};

const MONTH_NAMES = [
  "sausis",
  "vasaris",
  "kovas",
  "balandis",
  "gegužė",
  "birželis",
  "liepa",
  "rugpjūtis",
  "rugsėjis",
  "spalis",
  "lapkritis",
  "gruodis"
];

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
let statsPeriodType = "week";
let statsAnchorDate = new Date();

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
  monthUnits: document.querySelector("#monthUnits"),
  yearUnits: document.querySelector("#yearUnits"),
  todayRiskFill: document.querySelector("#todayRiskFill"),
  weekRiskFill: document.querySelector("#weekRiskFill"),
  monthRiskFill: document.querySelector("#monthRiskFill"),
  yearRiskFill: document.querySelector("#yearRiskFill"),
  riskText: document.querySelector("#riskText"),
  statsPeriodButtons: document.querySelectorAll("[data-stats-period]"),
  statsPrev: document.querySelector("#statsPrevButton"),
  statsNext: document.querySelector("#statsNextButton"),
  statsCurrent: document.querySelector("#statsCurrentButton"),
  statsPeriodRange: document.querySelector("#statsPeriodRange"),
  periodUnitsLabel: document.querySelector("#periodUnitsLabel"),
  periodUnits: document.querySelector("#periodUnits"),
  periodGrams: document.querySelector("#periodGrams"),
  periodDays: document.querySelector("#periodDays"),
  drinkBreakdown: document.querySelector("#drinkBreakdown"),
  historyList: document.querySelector("#historyList"),
  clearHistory: document.querySelector("#clearHistoryButton"),
  dailyLimit: document.querySelector("#dailyLimitInput"),
  weeklyLimit: document.querySelector("#weeklyLimitInput"),
  monthlyLimit: document.querySelector("#monthlyLimitInput"),
  yearlyLimit: document.querySelector("#yearlyLimitInput"),
  saveSettings: document.querySelector("#saveSettingsButton"),
  exportData: document.querySelector("#exportDataButton"),
  importData: document.querySelector("#importDataInput"),
  backupText: document.querySelector("#backupText"),
  importText: document.querySelector("#importTextInput"),
  importTextButton: document.querySelector("#importTextButton"),
  dataStatus: document.querySelector("#dataStatus"),
  shareButton: document.querySelector("#shareButton")
};

init();

function init() {
  els.date.value = todayIso();
  els.dailyLimit.value = settings.daily;
  els.weeklyLimit.value = settings.weekly;
  els.monthlyLimit.value = settings.monthly;
  els.yearlyLimit.value = settings.yearly;

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
  els.exportData.addEventListener("click", exportData);
  els.importData.addEventListener("change", importData);
  els.importTextButton.addEventListener("click", importTextData);
  els.shareButton.addEventListener("click", share);
  window.addEventListener("resize", updateViewportMetrics);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateViewportMetrics);
    window.visualViewport.addEventListener("scroll", updateViewportMetrics);
  }

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  });

  els.statsPeriodButtons.forEach((button) => {
    button.addEventListener("click", () => setStatsPeriod(button.dataset.statsPeriod));
  });
  els.statsPrev.addEventListener("click", () => shiftStatsPeriod(-1));
  els.statsNext.addEventListener("click", () => shiftStatsPeriod(1));
  els.statsCurrent.addEventListener("click", setCurrentStatsPeriod);
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
  const currentDate = new Date();
  const weekRange = getPeriodRange("week", currentDate);
  const monthRange = getPeriodRange("month", currentDate);
  const yearRange = getPeriodRange("year", currentDate);
  const todayEntries = entries.filter((entry) => entry.date === today);
  const weekEntries = filterEntriesByRange(weekRange);
  const monthEntries = filterEntriesByRange(monthRange);
  const yearEntries = filterEntriesByRange(yearRange);
  const todayUnits = sum(todayEntries, "units");
  const weekUnits = sum(weekEntries, "units");
  const monthUnits = sum(monthEntries, "units");
  const yearUnits = sum(yearEntries, "units");
  const statsRange = getStatsRange();
  const statsEntries = filterEntriesByRange(statsRange);
  const statsUnits = sum(statsEntries, "units");

  els.todayUnits.textContent = todayUnits.toFixed(1);
  els.weekUnits.textContent = weekUnits.toFixed(1);
  els.monthUnits.textContent = monthUnits.toFixed(1);
  els.yearUnits.textContent = yearUnits.toFixed(1);
  els.periodUnits.textContent = statsUnits.toFixed(1);
  els.periodGrams.textContent = `${Math.round(sum(statsEntries, "grams"))} g`;
  els.periodDays.textContent = new Set(statsEntries.map((entry) => entry.date)).size;
  renderStatsControls(statsRange);

  renderRisk({ today: todayUnits, week: weekUnits, month: monthUnits, year: yearUnits });
  renderBreakdown(statsEntries, STATS_EMPTY_TEXT[statsPeriodType]);
  renderHistory();
}

function renderRisk(periodUnits) {
  const limits = {
    today: Number(settings.daily) || DEFAULT_SETTINGS.daily,
    week: Number(settings.weekly) || DEFAULT_SETTINGS.weekly,
    month: Number(settings.monthly) || DEFAULT_SETTINGS.monthly,
    year: Number(settings.yearly) || DEFAULT_SETTINGS.yearly
  };

  setRiskMeter(els.todayRiskFill, periodUnits.today, limits.today);
  setRiskMeter(els.weekRiskFill, periodUnits.week, limits.week);
  setRiskMeter(els.monthRiskFill, periodUnits.month, limits.month);
  setRiskMeter(els.yearRiskFill, periodUnits.year, limits.year);

  const reachedLimit = Object.keys(limits).some((key) => {
    const units = Number(periodUnits[key]) || 0;
    return units >= limits[key];
  });

  if (!entries.length) {
    els.riskText.textContent = "Įrašyk pirmą gėrimą.";
  } else if (reachedLimit) {
    els.riskText.textContent = "Pasiekta arba viršyta bent viena pasirinkta riba.";
  } else {
    els.riskText.textContent = "Pasirinktos ribos dar nepasiektos.";
  }
}

function setRiskMeter(element, units, limit) {
  const value = Number(units) || 0;
  const max = Number(limit) || 0;
  const ratio = max > 0 ? value / max : 0;
  const percent = Math.min(100, Math.round(ratio * 100));

  element.style.width = `${percent}%`;
  element.style.backgroundColor = ratio >= 1 ? "#b42318" : "#0f5132";
}

function renderBreakdown(sourceEntries, emptyText = "Šiuo laikotarpiu įrašų nėra.") {
  if (!sourceEntries.length) {
    els.drinkBreakdown.innerHTML = `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
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

function setStatsPeriod(periodType) {
  if (!STATS_PERIOD_LABELS[periodType]) {
    return;
  }

  statsPeriodType = periodType;
  refresh();
}

function shiftStatsPeriod(direction) {
  const date = cloneDate(statsAnchorDate);

  if (statsPeriodType === "week") {
    date.setDate(date.getDate() + direction * 7);
  } else if (statsPeriodType === "month") {
    date.setMonth(date.getMonth() + direction);
  } else {
    date.setFullYear(date.getFullYear() + direction);
  }

  statsAnchorDate = date;
  refresh();
}

function setCurrentStatsPeriod() {
  statsAnchorDate = new Date();
  refresh();
}

function renderStatsControls(range) {
  els.periodUnitsLabel.textContent = STATS_PERIOD_LABELS[statsPeriodType];
  els.statsPeriodRange.textContent = range.label;
  els.statsCurrent.textContent = STATS_CURRENT_LABELS[statsPeriodType];

  els.statsPeriodButtons.forEach((button) => {
    const active = button.dataset.statsPeriod === statsPeriodType;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function getStatsRange() {
  return getPeriodRange(statsPeriodType, statsAnchorDate);
}

function getPeriodRange(periodType, anchorDate) {
  const anchor = cloneDate(anchorDate);
  let start;
  let end;
  let label;

  if (periodType === "week") {
    start = startOfWeek(anchor);
    end = addDays(start, 6);
    label = `${dateToIso(start)} - ${dateToIso(end)}`;
  } else if (periodType === "month") {
    start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
    label = `${anchor.getFullYear()} ${MONTH_NAMES[anchor.getMonth()]}`;
  } else {
    start = new Date(anchor.getFullYear(), 0, 1);
    end = new Date(anchor.getFullYear(), 11, 31);
    label = `${anchor.getFullYear()} metai`;
  }

  return {
    startIso: dateToIso(start),
    endIso: dateToIso(end),
    label
  };
}

function filterEntriesByRange(range) {
  return entries.filter((entry) => entry.date >= range.startIso && entry.date <= range.endIso);
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
    weekly: Number(els.weeklyLimit.value) || DEFAULT_SETTINGS.weekly,
    monthly: Number(els.monthlyLimit.value) || DEFAULT_SETTINGS.monthly,
    yearly: Number(els.yearlyLimit.value) || DEFAULT_SETTINGS.yearly
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  refresh();
}

async function exportData() {
  const exportedAt = new Date().toISOString();
  const payload = {
    app: "Alko Vienetai",
    version: EXPORT_VERSION,
    exportedAt,
    entries,
    settings,
    storage: {
      [STORAGE_KEY]: entries,
      [SETTINGS_KEY]: settings
    }
  };
  const filename = `alko-vienetai-${todayIso()}.json`;
  const text = JSON.stringify(payload, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const file = typeof File !== "undefined" ? new File([blob], filename, { type: "application/json" }) : null;
  els.backupText.value = text;

  try {
    await navigator.clipboard?.writeText(text);
  } catch {
    // Clipboard is a convenience fallback only.
  }

  try {
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Alko Vienetai",
        text: "Alko Vienetai duomenų kopija"
      });
      showDataStatus(`Eksportuota ${entries.length} įrašų.`);
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showDataStatus(`Eksportuota ${entries.length} įrašų.`);
}

async function importData(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    await importPayload(JSON.parse(await file.text()));
  } catch (error) {
    showDataStatus("Importuoti nepavyko.");
    alert(error?.message || "Nepavyko importuoti duomenų failo.");
  } finally {
    event.target.value = "";
  }
}

async function importTextData() {
  const text = els.importText.value.trim();
  if (!text) {
    showDataStatus("Įklijuok duomenų kopiją.");
    return;
  }

  try {
    await importPayload(JSON.parse(text));
    els.importText.value = "";
  } catch (error) {
    showDataStatus("Importuoti nepavyko.");
    alert(error?.message || "Nepavyko importuoti įklijuotos kopijos.");
  }
}

async function importPayload(payload) {
  const importedEntries = getImportEntries(payload);
  const importedSettings = getImportSettings(payload);

  if (!importedEntries.length && !importedSettings) {
    throw new Error("Faile nerasta Alko Vienetai duomenų.");
  }

  if (!confirm(`Importuoti ${importedEntries.length} įrašų? Esami įrašai bus išsaugoti ir sujungti.`)) {
    return;
  }

  const beforeCount = entries.length;
  entries = mergeEntries(entries, importedEntries);
  persistEntries();

  if (importedSettings) {
    settings = normalizeSettings(importedSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    updateSettingsInputs();
  }

  refresh();
  showDataStatus(`Importuota ${entries.length - beforeCount} naujų įrašų.`);
}

function getImportEntries(payload) {
  const rawEntries = Array.isArray(payload?.entries)
    ? payload.entries
    : Array.isArray(payload?.storage?.[STORAGE_KEY])
      ? payload.storage[STORAGE_KEY]
      : [];

  return rawEntries.map(normalizeEntry).filter(Boolean);
}

function getImportSettings(payload) {
  const rawSettings = payload?.settings || payload?.storage?.[SETTINGS_KEY];
  return rawSettings && typeof rawSettings === "object" ? rawSettings : null;
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const date = String(entry.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const amount = Math.max(0, Number(entry.amount) || 0);
  const abv = Math.min(96, Math.max(0, Number(entry.abv) || 0));
  const rawGrams = Number(entry.grams);
  const grams = Number.isFinite(rawGrams) && rawGrams >= 0 ? rawGrams : calculateGrams(amount, abv);
  const rawUnits = Number(entry.units);
  const units = Number.isFinite(rawUnits) && rawUnits >= 0 ? rawUnits : grams / GRAMS_PER_UNIT;

  if (!Number.isFinite(units) || units < 0) {
    return null;
  }

  return {
    id: entry.id ? String(entry.id) : getId(),
    date,
    drinkId: String(entry.drinkId || "other"),
    drink: String(entry.drink || "Kita"),
    amount,
    abv,
    grams,
    units
  };
}

function mergeEntries(currentEntries, importedEntries) {
  const seen = new Set();
  currentEntries.forEach((entry) => {
    seen.add(`id:${entry.id}`);
    seen.add(entryContentKey(entry));
  });

  const merged = [...currentEntries];
  importedEntries.forEach((entry) => {
    const idKey = `id:${entry.id}`;
    const contentKey = entryContentKey(entry);
    if (seen.has(idKey) || seen.has(contentKey)) {
      return;
    }

    merged.push(entry);
    seen.add(idKey);
    seen.add(contentKey);
  });

  return merged.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function entryContentKey(entry) {
  return [
    "entry",
    entry.date,
    entry.drinkId,
    Number(entry.amount || 0).toFixed(2),
    Number(entry.abv || 0).toFixed(2),
    Number(entry.units || 0).toFixed(4)
  ].join("|");
}

function normalizeSettings(rawSettings) {
  return {
    daily: positiveNumber(rawSettings.daily, settings.daily || DEFAULT_SETTINGS.daily),
    weekly: positiveNumber(rawSettings.weekly, settings.weekly || DEFAULT_SETTINGS.weekly),
    monthly: positiveNumber(rawSettings.monthly, settings.monthly || DEFAULT_SETTINGS.monthly),
    yearly: positiveNumber(rawSettings.yearly, settings.yearly || DEFAULT_SETTINGS.yearly)
  };
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function updateSettingsInputs() {
  els.dailyLimit.value = settings.daily;
  els.weeklyLimit.value = settings.weekly;
  els.monthlyLimit.value = settings.monthly;
  els.yearlyLimit.value = settings.yearly;
}

function showDataStatus(message) {
  els.dataStatus.textContent = message;
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

function cloneDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const result = cloneDate(date);
  const mondayOffset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - mondayOffset);
  return result;
}

function addDays(date, days) {
  const result = cloneDate(date);
  result.setDate(result.getDate() + days);
  return result;
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
