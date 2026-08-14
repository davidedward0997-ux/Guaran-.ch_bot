import threading
import subprocess


def run_web():
    subprocess.run([
        "gunicorn",
        "--bind",
        "0.0.0.0:8080",
        "server:app"
    ])


def run_bot():
    subprocess.run([
        "python",
        "bot.py"
    ])


web_thread = threading.Thread(
    target=run_web,
    daemon=True
)

bot_thread = threading.Thread(
    target=run_bot,
    daemon=True
)

web_thread.start()
bot_thread.start()

web_thread.join()
bot_thread.join()
