from rich.prompt import Prompt
from ..core.alert import Alert

class CLI:
    def __init__(self):
        self.storage = Storage()
        self.portfolio = self.storage.load()
        self.console = Console()

    def run(self):
        parser = argparse.ArgumentParser(description="CryptoPortfolio V2 (Final)")
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

        # Command: alert
        alert_parser = subparsers.add_parser("alert", help="Set a price alert")
        alert_parser.add_argument("symbol", type=str, help="Asset symbol")
        alert_parser.add_argument("target", type=float, help="Target price")
        alert_parser.add_argument("--below", action="store_true", help="Alert when price goes below target (default: above)")

        # Command: simulate
        sim_parser = subparsers.add_parser("simulate", help="Simulate market changes")
        sim_parser.add_argument("percent", type=float, help="Percentage change (e.g., 10 for +10%, -20 for -20%)")

        args = parser.parse_args()

        if args.command == "add":
            self.add_asset(args.symbol.upper(), args.quantity, args.price)
        elif args.command == "list":
            self.list_assets()
        elif args.command == "dashboard":
            self.show_dashboard()
        elif args.command == "alert":
            condition = "below" if args.below else "above"
            self.add_alert(args.symbol.upper(), args.target, condition)
        elif args.command == "simulate":
            self.simulate_portfolio(args.percent)
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

    def add_alert(self, symbol: str, target: float, condition: str):
        alert = Alert(symbol, target, condition)
        self.portfolio.add_alert(alert)
        self.storage.save(self.portfolio)
        self.console.print(f"[green]Alert set: {symbol} {condition} ${target}[/green]")

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
        
        # Show alerts if any
        alerts = self.portfolio.get_alerts()
        if alerts:
            self.console.print("\n[bold]Active Alerts:[/bold]")
            for a in alerts:
                self.console.print(f"- {a.symbol} {a.condition} ${a.target_price}")

    def show_dashboard(self):
        assets = self.portfolio.get_assets()
        alerts = self.portfolio.get_alerts()
        
        if not assets:
            self.console.print("[yellow]Portfolio is empty.[/yellow]")
            return

        table = Table(title="Live Portfolio Dashboard")
        table.add_column("Symbol", style="cyan")
        table.add_column("Qty", style="magenta")
        table.add_column("Current Price", style="bold blue")
        table.add_column("Value", style="bold blue")
        table.add_column("P/L", style="bold")
        table.add_column("Alerts", style="red")

        total_value = 0.0
        total_cost = 0.0

        with self.console.status("[bold green]Fetching live prices..."):
            for asset in assets:
                current_price = asset.buy_price 
                pl_str = "N/A"
                pl_style = "dim"
                alert_msg = ""
                
                if asset.coin_id:
                    price = CoinGeckoAPI.get_price(asset.coin_id)
                    if price:
                        current_price = price
                        # Check alerts
                        for alert in alerts:
                            if alert.symbol == asset.symbol and alert.check(current_price):
                                alert_msg = f"TRIGGERED ({alert.condition} {alert.target_price})"

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
                    f"${current_price:.2f}",
                    f"${value:.2f}",
                    f"[{pl_style}]{pl_str}[/{pl_style}]",
                    f"[blink red]{alert_msg}[/blink red]" if alert_msg else ""
                )

        self.console.print(table)
        
        total_pl = total_value - total_cost
        total_pl_percent = (total_pl / total_cost * 100) if total_cost > 0 else 0
        style = "green" if total_pl >= 0 else "red"
        
        self.console.print(f"\n[bold]Total Portfolio Value:[/bold] ${total_value:.2f}")
        self.console.print(f"[bold {style}]Total P/L: ${total_pl:.2f} ({total_pl_percent:.1f}%)[/bold {style}]")

    def simulate_portfolio(self, percent_change: float):
        assets = self.portfolio.get_assets()
        factor = 1 + (percent_change / 100)
        
        self.console.print(f"[bold]Simulating market move: {percent_change:+.1f}%[/bold]\n")
        
        table = Table(title="Simulation Results")
        table.add_column("Symbol", style="cyan")
        table.add_column("Current Value (Est)", style="dim")
        table.add_column("Simulated Value", style="bold magenta")
        
        total_sim_value = 0.0
        
        for asset in assets:
            # For simplicity in offline sim, use buy_price as base if live unknown, 
            # ideally we'd fetch live but let's assume base is current known state
            base_price = asset.buy_price 
            
            sim_price = base_price * factor
            sim_value = asset.quantity * sim_price
            current_val_est = asset.quantity * base_price
            
            total_sim_value += sim_value
            
            table.add_row(
                asset.symbol,
                f"${current_val_est:.2f}",
                f"${sim_value:.2f}"
            )
            
        self.console.print(table)
        self.console.print(f"\n[bold]Projected Total:[/bold] ${total_sim_value:.2f}")
