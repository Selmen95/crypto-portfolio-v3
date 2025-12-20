import unittest
from datetime import datetime
from crypto_portfolio.core.asset import Asset
from crypto_portfolio.core.portfolio import Portfolio

class TestAsset(unittest.TestCase):
    def test_values(self):
        asset = Asset("BTC", 0.5, 30000.0)
        self.assertEqual(asset.current_value(40000.0), 20000.0)
        self.assertEqual(asset.profit_loss(40000.0), 5000.0)
        
    def test_negative_pl(self):
        asset = Asset("BTC", 1.0, 50000.0)
        self.assertEqual(asset.profit_loss(40000.0), -10000.0)

class TestPortfolio(unittest.TestCase):
    def setUp(self):
        self.portfolio = Portfolio()

    def test_add_remove(self):
        asset = Asset("ETH", 10.0, 2000.0)
        self.portfolio.add_asset(asset)
        self.assertEqual(len(self.portfolio.get_assets()), 1)
        
        self.portfolio.remove_asset("ETH")
        self.assertEqual(len(self.portfolio.get_assets()), 0)

if __name__ == '__main__':
    unittest.main()
