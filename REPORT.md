# Project Report: CryptoPortfolio

## 1. Introduction
**Context & Motivation**: In the volatile world of cryptocurrency, keeping track of multiple assets across different exchanges is challenging. "CryptoPortfolio" was developed to provide a unified, command-line based tool for investors to track performance, set alerts, and simulate market scenarios without the distraction of complex GUIs.
**Objectives**: Build a modular Python application to manage a portfolio, fetch live prices, and perform financial calculations, demonstrating adherence to solid software engineering principles.

## 2. Informal Specifications
The program must:
*   Allow users to **add/remove assets** (crypto/stocks).
*   **Persist data** between sessions (local JSON storage).
*   Fetch **live prices** from an external API (CoinGecko).
*   Provide a **live dashboard** showing Profit/Loss (P/L).
*   Set **price alerts** specific to assets.
*   **Simulate** portfolio value under hypothetical market moves (e.g., "-20%").
*   Run as a **CLI** for efficiency and ease of automation.

## 3. Development Plan
The project followed a staged approach:
*   **V0 (MVP)**: Core classes (`Asset`, `Portfolio`), basic CLI, and JSON persistence. verified manual data entry.
*   **V1 (Extended)**: Integration of `CoinGeckoAPI`, live dashboard rendering with `rich`, and automatic coin ID resolution.
*   **V2 (Final)**: Added `Alert` system, Simulation features, and Unit Tests (`unittest`). Final code polish.

## 4. Design & Implementation
**Architecture**: The app uses a "Lite" Domain-Driven Design layout:
*   `core/`: Contains business logic (`Asset`, `Portfolio`, `Alert`). Pure Python, no dependencies on UI or API.
*   `data/`: Handles storage (`Storage` class). Decoupled from core logic.
*   `ui/`: Handles interaction (`CLI` class using `rich` for formatting).
*   `utils/`: External adapters (`CoinGeckoAPI`).

**Key Decisions**:
*   *Why CLI?* A text-based interface is fast and powerful. Using `rich` allows it to be visually distinct (tables, colors) while remaining lightweight.
*   *Data Structure*: A `Portfolio` holds a list of `Asset` objects. This composition allows easy extensibility.

## 5. User Guide
1.  **Dependencies**: `pip install requests rich`
2.  **Execution**: `python -m crypto_portfolio.main [command]`
3.  **Commands**:
    *   `add [symbol] [qty] [price]`: Add investment.
    *   `dashboard`: View live P/L.
    *   `alert [symbol] [target]`: Set notification trigger.
    *   `simulate [percent]`: Project portfolio value.

## 6. Evaluation & Discussion
*   **Completion**: All planned features (V0-V2) are implemented.
*   **Difficulties**: Handling API rate limits and fuzzy matching for coin symbols (e.g., "ETH" -> "ethereum") was solved by a two-step search process.
*   **Improvements**: Could add support for multiple currencies (EUR/GBP) and historical charts in the terminal (using `plotext`).

## 7. Conclusion
This project successfully demonstrates the creation of a non-trivial Python application. It leverages modular design to make adding new features (like Alerts in V2) straightforward without breaking existing code.
