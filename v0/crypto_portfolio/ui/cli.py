import argparse
from rich.console import Console
from rich.table import Table
from ..core.asset import Asset
from ..core.portfolio import Portfolio
from ..data.storage import Storage

class CLI:
    def __init__(self):
        self.storage = Storage()
        self.portfolio = self.storage.load()
        self.console = Console()

    def run(self):
        parser = argparse.ArgumentParser(description="CryptoPortfolio V0 (MVP)")
        subparsers = parser.add_subparsers(dest="command", help="Available commands")

        # Command: add
        add_parser = subparsers.add_parser("add", help="Add a new asset")
        add_parser.add_argument("symbol", type=str, help="Asset symbol (e.g., BTC)")
        add_parser.add_argument("quantity", type=float, help="Quantity owned")
        add_parser.add_argument("price", type=float, help="Purchase price per unit")

        # Command: list
        subparsers.add_parser("list", help="List all assets")

        args = parser.parse_args()

        if args.command == "add":
            self.add_asset(args.symbol.upper(), args.quantity, args.price)
        elif args.command == "list":
            self.list_assets()
        else:
            parser.print_help()

    def add_asset(self, symbol: str, quantity: float, price: float):
        asset = Asset(symbol, quantity, price)
        self.portfolio.add_asset(asset)
        self.storage.save(self.portfolio)
        self.console.print(f"[green]Successfully added {quantity} {symbol} bought at ${price}[/green]")

    def list_assets(self):
        assets = self.portfolio.get_assets()
        if not assets:
            self.console.print("[yellow]Portfolio is empty.[/yellow]")
            return

        table = Table(title="My Crypto Portfolio (V0)")

        table.add_column("Symbol", style="cyan", no_wrap=True)
        table.add_column("Quantity", style="magenta")
        table.add_column("Buy Price", style="green")
        table.add_column("Purchase Date", style="dim")

        for asset in assets:
            table.add_row(
                asset.symbol,
                f"{asset.quantity:.4f}",
                f"${asset.buy_price:.2f}",
                asset.purchase_date.strftime("%Y-%m-%d %H:%M")
            )

        self.console.print(table)
