# CryptoPortfolio V2 (Final)

Feature-complete version with Alerts, Simulation, and Test coverage.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
# Set a price alert
python -m crypto_portfolio.main alert BTC 100000

# Simulate market crash
python -m crypto_portfolio.main simulate -20

# Run Tests
python -m unittest discover tests
```
