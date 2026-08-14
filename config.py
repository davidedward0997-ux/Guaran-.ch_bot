import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
MINI_APP_URL = os.getenv(
    "MINI_APP_URL",
    "https://your-mini-app-url.com"
)

CONTACT_URL = os.getenv(
    "CONTACT_URL",
    "https://t.me/your_username"
)
