from dataclasses import dataclass, field
from typing import Dict, Any, Optional

@dataclass
class UserProfile:
    full_name: str
    email: str
    bio: str = ""
    profile_picture_url: str = ""
    role: str = "User"
    created_date: str = "2024-01-01"
    default_currency: str = "USD"
    language: str = "fr"
    weekly_reports: bool = False
    email_notifications: bool = True # General switch
    notifications_config: Dict[str, bool] = field(default_factory=lambda: {
        "email_trades": True,
        "email_profits": True,
        "email_community": True
    })

    # KYC / Onboarding Fields
    age: Optional[int] = None
    profession: str = ""
    investment_experience: str = "Beginner"  # Beginner, Intermediate, Advanced, Expert
    risk_tolerance: str = "Moderate"  # Low, Moderate, High
    financial_goals: list[str] = field(default_factory=list) # e.g. ["Retirement", "Housing", "Speculation"]
    investment_horizon: str = "Medium Term" # Short (<1y), Medium (1-5y), Long (>5y)
    monthly_contribution: Optional[float] = 0.0
    total_net_worth: Optional[float] = 0.0
    tier: str = "Bronze"

    def calculate_tier(self):
        net_worth = self.total_net_worth or 0.0
        if net_worth >= 250000:
            self.tier = "Platinum"
        elif net_worth >= 50000:
            self.tier = "Gold"
        elif net_worth >= 10000:
            self.tier = "Silver"
        else:
            self.tier = "Bronze"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "full_name": self.full_name,
            "email": self.email,
            "bio": self.bio,
            "profile_picture_url": self.profile_picture_url,
            "role": self.role,
            "created_date": self.created_date,
            "default_currency": self.default_currency,
            "language": self.language,
            "weekly_reports": self.weekly_reports,
            "email_notifications": self.email_notifications,
            "notifications_config": self.notifications_config,
            # KYC fields
            "age": self.age,
            "profession": self.profession,
            "investment_experience": self.investment_experience,
            "risk_tolerance": self.risk_tolerance,
            "financial_goals": self.financial_goals,
            "investment_horizon": self.investment_horizon,
            "monthly_contribution": self.monthly_contribution,
            "monthly_contribution": self.monthly_contribution,
            "total_net_worth": self.total_net_worth,
            "tier": self.tier
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UserProfile':
        return cls(
            full_name=data.get("full_name", ""),
            email=data.get("email", ""),
            bio=data.get("bio", ""),
            profile_picture_url=data.get("profile_picture_url", ""),
            role=data.get("role", "User"),
            created_date=data.get("created_date", "2024-01-01"),
            default_currency=data.get("default_currency", "USD"),
            language=data.get("language", "fr"),
            weekly_reports=data.get("weekly_reports", False),
            email_notifications=data.get("email_notifications", True),
            notifications_config=data.get("notifications_config", {
                "email_trades": True,
                "email_profits": True,
                "email_community": True
            }),
            # KYC fields
            age=data.get("age"),
            profession=data.get("profession", ""),
            investment_experience=data.get("investment_experience", "Beginner"),
            risk_tolerance=data.get("risk_tolerance", "Moderate"),
            financial_goals=data.get("financial_goals", []),
            investment_horizon=data.get("investment_horizon", "Medium Term"),
            monthly_contribution=data.get("monthly_contribution", 0.0),

            total_net_worth=data.get("total_net_worth", 0.0),
            # tier is derived, but can be loaded if saved
        )
        if "tier" in data:
            profile.tier = data["tier"]
        else:
            profile.calculate_tier()
        return profile
