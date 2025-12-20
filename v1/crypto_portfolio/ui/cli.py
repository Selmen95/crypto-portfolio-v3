import argparse
from rich.console import Console
from rich.table import Table
from ..core.asset import Asset
from ..core.portfolio import Portfolio
from ..data.storage import Storage
from ..utils.api import CoinGeckoAPI

class CLI:
    def __init__(self):
        self.storage = Storage()
        self.portfolio = self.storage.load()
        self.console = Console()

    def run(self):
        parser = argparse.ArgumentParser(description="CryptoPortfolio V1 (Extended)")
        subparsers = parser.add_subparsers(dest="command", help="Available commands")

        # Command: add
        add_parser = subparsers.add_parser("add", help="Add a new asset")
        add_parser.add_argument("symbol", type=str, help="Asset symbol (e.g., BTC)")
        add_parser.add_argument("quantity", type=float, help="Quantity owned")
        add_parser.add_argument("price", type=float, help="Purchase price per unit")

        # Command: list
        subparsers.add_parser("list", help="List all assets (offline)")
        
        # Command: dashboard
        subparsers.add_parser("dashboard", help="Live portfolio dashboard")

        args = parser.parse_args()

        if args.command == "add":
            self.add_asset(args.symbol.upper(), args.quantity, args.price)
        elif args.command == "list":
            self.list_assets()
        elif args.command == "dashboard":
            self.show_dashboard()
        else:
            parser.print_help()

    def add_asset(self, symbol: str, quantity: float, price: float):
        self.console.print(f"[dim]Searching for {symbol} on CoinGecko...[/dim]")
        coin_id = CoinGeckoAPI.search_coin(symbol)
        
        if coin_id:
            self.console.print(f"[green]Found ID: {coin_id}[/green]")
        else:
            self.console.print(f"[yellow]Warning: Could not resolve ID for {symbol}. Live prices won't work.[/yellow]")
            coin_id = None

        asset = Asset(symbol, quantity, price, coin_id=coin_id)
        self.portfolio.add_asset(asset)
        self.storage.save(self.portfolio)
        self.console.print(f"[bold green]Successfully added {quantity} {symbol}![/bold green]")

    def list_assets(self):
        assets = self.portfolio.get_assets()
        if not assets:
            self.console.print("[yellow]Portfolio is empty.[/yellow]")
            return

        table = Table(title="My Assets (Offline View)")
        table.add_column("Symbol", style="cyan")
        table.add_column("Quantity", style="magenta")
        table.add_column("Buy Price", style="green")
        table.add_column("Coin ID", style="dim")

        for asset in assets:
            table.add_row(
                asset.symbol,
                f"{asset.quantity:.4f}",
                f"${asset.buy_price:.2f}",
                asset.coin_id or "N/A"
            )

        self.console.print(table)

    def show_dashboard(self):
        assets = self.portfolio.get_assets()
        if not assets:
            self.console.print("[yellow]Portfolio is empty.[/yellow]")
            return

        table = Table(title="Live Portfolio Dashboard")
        table.add_column("Symbol", style="cyan")
        table.add_column("Qty", style="magenta")
        table.add_column("Buy Price", style="dim")
        table.add_column("Current Price", style="bold blue")
        table.add_column("Value", style="bold blue")
        table.add_column("P/L", style="bold")

        total_value = 0.0
        total_cost = 0.0

        with self.console.status("[bold green]Fetching live prices..."):
            for asset in assets:
                current_price = asset.buy_price # Default to buy price if fetch fails
                pl_str = "N/A"
                pl_style = "dim"
                
                if asset.coin_id:
                    price = CoinGeckoAPI.get_price(asset.coin_id)
                    if price:
                        current_price = price
                
                value = asset.quantity * current_price
                cost = asset.quantity * asset.buy_price
                pl = value - cost
                pl_percent = (pl / cost * 100) if cost > 0 else 0
                
                total_value += value
                total_cost += cost
                
                if pl >= 0:
                    pl_str = f"+${pl:.2f} (+{pl_percent:.1f}%)"
                    pl_style = "green"
                else:
                    pl_str = f"-${abs(pl):.2f} ({pl_percent:.1f}%)"
                    pl_style = "red"

                table.add_row(
                    asset.symbol,
                    f"{asset.quantity:.4f}",
                    f"${asset.buy_price:.2f}",
                    f"${current_price:.2f}",
                    f"${value:.2f}",
                    f"[{pl_style}]{pl_str}[/{pl_style}]"
                )

        self.console.print(table)
        
        total_pl = total_value - total_cost
        total_pl_percent = (total_pl / total_cost * 100) if total_cost > 0 else 0
        style = "green" if total_pl >= 0 else "red"
        
        self.console.print(f"\n[bold]Total Portfolio Value:[/bold] ${total_value:.2f}")
        self.console.print(f"[bold {style}]Total P/L: ${total_pl:.2f} ({total_pl_percent:.1f}%)[/bold {style}]")
