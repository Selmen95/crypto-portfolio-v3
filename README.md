# CryptoPortfolio

![App Screenshot](https://raw.githubusercontent.com/base44/crypto-pro/main/screenshot.png)

A modular Python CLI application for managing cryptocurrency portfolios, developed as a university project.

## Project Structure
This archive contains three key versions demonstrating staged development:

*   **`v0/` (MVP)**: Minimal viable product. Local storage, basic add/list commands.
*   **`v1/` (Extended)**: Adds live price tracking via CoinGecko API and a rich dashboard.
*   **`v2/` (Final)**: Complete feature set with Alerts, Market Simulations, and Unit Tests.

## Report
See `REPORT.md` for the full 15-page project report content.

## Quick Start (V2)

1.  **Install Dependencies**:
    ```bash
    pip install -r v2/requirements.txt
    ```

2.  **Run the App**:
    ```bash
    python -m v2.crypto_portfolio.main dashboard
    ```

## Features
*   **Asset Management**: Add crypto/stocks with quantity and buy price.
*   **Live Data**: Real-time prices fetch.
*   **Alerts**: Get notified when assets hit target prices.
*   **Simulation**: "What if" scenarios for market movements.
*   **Persistence**: Auto-saves to JSON.

## License
MIT