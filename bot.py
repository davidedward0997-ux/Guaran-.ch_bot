from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo,
)
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
)

from config import BOT_TOKEN, MINI_APP_URL, CONTACT_URL


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [
            InlineKeyboardButton(
                "🛍️ Open shop",
                web_app=WebAppInfo(url=MINI_APP_URL)
            )
        ],
        [
            InlineKeyboardButton(
                "📞 Contact us",
                url=CONTACT_URL
            )
        ]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "😊 Welcome to Guaraná.ch!\n\n"
        "Thanks for your trust — explore our shop below 👇",
        reply_markup=reply_markup
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Use /start to open the Guaraná.ch shop."
    )


def main():
    if not BOT_TOKEN:
        raise ValueError(
            "BOT_TOKEN is missing. Add it to your environment variables."
        )

    application = Application.builder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))

    print("Guaraná.ch bot is running...")

    application.run_polling()


if __name__ == "__main__":
    main()
