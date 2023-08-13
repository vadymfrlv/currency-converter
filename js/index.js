// CONSTANTS
const API_BASE_URL = 'http://data.fixer.io/api';
const API_KEY = 'c987c76104add32d3de5c350a30dd317';

const DEFAULT_CURRENCY_FROM = 'EUR';
const DEFAULT_CURRENCY_TO = 'USD';

const DATA_PRECISION_2 = 2;
const DATA_PRECISION_7 = 7;

// SELECTORS
// selectors
const selectEls = document.querySelectorAll('.select-currency');
const selectCurrencyFromEl = document.querySelector('.select-currency-from');
const selectCurrencyToEl = document.querySelector('.select-currency-to');
const exchangeCurrencyFromEl = document.querySelector('.currency-name-from');
// rate
const exchangeRateEl = document.querySelector('.currency-rate');
const exchangeCurrencyToEl = document.querySelector('.currency-name-to');
// inputs
const currencyAmountFromEl = document.querySelector('.currency-amount-from');
const currencyAmountToEl = document.querySelector('.currency-amount-to');
/// disclaimer
const disclaimer = document.querySelector('.disclaimer');
// error
const errorContainer = document.querySelector('.error-container');
const errorText = document.querySelector('.error-text');

// UI VARIABLES
const UIData = {
  currencies: {},
  rates: {},
  timestamp: '',
  selectedValue: '',
  exchangeRateValue: 0,
};

// FETCHING DATA
// get currency symbols and full names
const fetchCurrency = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/symbols?access_key=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// get currency exchange rates and timestamp
const fetchConverter = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/latest?access_key=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// receiving currency symbols
const populateSelectWithOptions = async () => {
  try {
    const symbolsData = await fetchCurrency();

    //check fetch success
    if (!symbolsData.success) {
      showError();
      return;
    }

    UIData.currencies = symbolsData.symbols;

    selectEls.forEach(selectEl => {
      appendOptionsToSelect(selectEl, UIData.currencies);
      initializeSelect(selectEl);
    });
  } catch (error) {
    showError();
    console.log(error);
  }
};

// set up options(currencies) for selectors
const appendOptionsToSelect = (selectEl, currencies) => {
  //   set up currency by default
  let defaultSymbol = DEFAULT_CURRENCY_FROM;
  if (selectEl.classList.contains('select-currency-to')) {
    defaultSymbol = DEFAULT_CURRENCY_TO;
  }

  // set up options
  for (const symbol in currencies) {
    const optionEl = document.createElement('option');
    if (currencies.hasOwnProperty(symbol)) {
      optionEl.value = symbol;
      optionEl.textContent = currencies[symbol];
      optionEl.classList.add('currency-option');

      if (symbol === defaultSymbol) {
        optionEl.setAttribute('selected', 'selected');
      }

      selectEl.appendChild(optionEl);
    }
  }
};

const initializeSelect = selectEl => {
  UIData.selectedValue = selectEl.value;
};

// getting rates and timestamp
const fetchConverterData = async () => {
  try {
    const converterData = await fetchConverter();

    //check fetch success
    if (!converterData.success) {
      showError();
      return;
    }

    // prepare timestamp
    UIData.rates = converterData.rates;
    UIData.timestamp = converterData.timestamp * 1000;

    calculateExchangeRate();
    displayFormattedDate(UIData.timestamp);

    return converterData;
  } catch (error) {
    showError();
    console.log(error);
  }
};

// calculate and display exchange rate
const calculateExchangeRate = () => {
  if (UIData.rates && UIData.currencies) {
    const fromCurrency = selectCurrencyFromEl.value;
    const toCurrency = selectCurrencyToEl.value;

    UIData.exchangeRateValue = UIData.rates[toCurrency] / UIData.rates[fromCurrency];

    // adding the plural to the currency if needed
    const plural = UIData.exchangeRateValue === 1 ? '' : 's';

    exchangeCurrencyFromEl.textContent = UIData.currencies[fromCurrency];
    exchangeCurrencyToEl.textContent = UIData.currencies[toCurrency] + plural;

    if (UIData.exchangeRateValue.toFixed(DATA_PRECISION_2) !== '0.00') {
      exchangeRateEl.textContent = UIData.exchangeRateValue.toFixed(DATA_PRECISION_2);
    } else exchangeRateEl.textContent = UIData.exchangeRateValue.toFixed(DATA_PRECISION_7);
  }
};

// processing and setting up date from timestamp
const displayFormattedDate = timestamp => {
  const date = new Date(timestamp);

  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);
  const lowercaseFormattedDate = formattedDate.replace(/AM|PM/g, match => match.toLowerCase());

  const timeDiv = document.querySelector('.time');
  timeDiv.textContent = lowercaseFormattedDate;
};

// HANDLERS
// options tracking and data recalculation
const onSelectChange = async event => {
  UIData.selectedValue = event.target.value;

  const optionsEls = event.target.querySelectorAll('option');

  optionsEls.forEach(optionEl => {
    optionEl.removeAttribute('selected');
  });

  const selectedOptionEl = event.target.querySelector(`option[value="${UIData.selectedValue}"]`);
  if (selectedOptionEl) {
    selectedOptionEl.setAttribute('selected', 'selected');
  }

  await fetchConverterData();
  calculateExchangeRate();
  onInputCurrencyAmountFromChange();
};

// calculation of the exchange amount
const onInputCurrencyAmountFromChange = () => {
  const amountFrom = parseFloat(currencyAmountFromEl.value);
  if (!isNaN(amountFrom)) {
    const amountTo = (amountFrom * UIData.exchangeRateValue).toFixed(DATA_PRECISION_2);
    currencyAmountToEl.value = amountTo;
  } else {
    currencyAmountToEl.value = '';
  }
};

// error handling
const showError = (message = 'An error occurred. Please try again.') => {
  errorText.textContent = message;
  errorContainer.style.display = 'flex';

  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
};

// INIT APP
const initializeApp = async () => {
  try {
    await populateSelectWithOptions();
    const converterData = await fetchConverterData();

    if (!converterData) {
      showError('An error occurred while initializing the app. Please refresh page.');
      return;
    }

    currencyAmountFromEl.value = '1';
    onInputCurrencyAmountFromChange();
  } catch (error) {
    console.log(error);
  }
};

// LISTENERS
const addEventListeners = () => {
  // show disclaimer
  disclaimer.addEventListener('click', () => {
    disclaimer.classList.toggle('clicked');
  });

  // hide disclaimer
  document.addEventListener('click', event => {
    if (!disclaimer.contains(event.target)) {
      disclaimer.classList.remove('clicked');
    }
  });

  // change on selectors
  selectCurrencyFromEl.addEventListener('change', onSelectChange);
  selectCurrencyToEl.addEventListener('change', onSelectChange);

  // change on input amount
  currencyAmountFromEl.addEventListener('input', onInputCurrencyAmountFromChange);

  // hide error window
  document.addEventListener('click', event => {
    if (!errorContainer.contains(event.currentTarget)) {
      errorContainer.style.display = 'none';
    }
  });
};

window.addEventListener('load', () => {
  addEventListeners();
  initializeApp();
});
