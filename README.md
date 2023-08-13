# Currency Converter

## Description 📑

Currency Converter is a small application that allows users to convert between different currencies.
The list of currencies is fetched from the [<b>`Fixer.io`</b>](https://www.fixer.io) API and
presented as options in the selectors. Upon the initial render, exchange rates for each currency are
requested, and since two popular currencies are preselected by default, the user immediately sees
the conversion rate between these two currencies.

The conversion rate is calculated through simple division, considering the selected source and
target currencies. When the user selects a different currency, the exchange rate updates
accordingly. Additionally, the application automatically calculates the converted amount in the
selected currency when the user inputs an amount of currency they want to exchange.

Furthermore, the user can see the timestamp of the last data update for calculation purposes, which
refreshes every time the currency is changed or the page is reloaded.

By clicking on the "Disclaimer" link, the user can read the policy from the Fixer.io API. The
application has enhanced user experience by customizing selectors and dropdown lists. Error handling
is also implemented, informing the user in case any errors occur.

## Demo 🖥

<!-- ![Demo](https://raw.githubusercontent.com/vadymfrlv/storage/main/demos/cyrrencyConverter/currencyConverter-demo.gif) -->

## Installation ⚡️

To test and use the application, follow these steps:

1. Click the `<> CODE` tab above and select `Download ZIP` to get all the necessary files used by
   the application.
2. Extract the downloaded ZIP archive on your computer.
3. Open the extracted directory and run the index.html file in your browser.

## Tech Stack 🛠

The Currency Converter application is built using the following technologies:

- HTML
- CSS
- JavaScript

## Author 👨🏻‍💻

This app was developed by frlv
