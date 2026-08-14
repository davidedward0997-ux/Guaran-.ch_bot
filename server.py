from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="webapp")


@app.route("/")
def home():
    return send_from_directory("webapp", "index.html")


@app.route("/<path:filename>")
def files(filename):
    return send_from_directory("webapp", filename)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8080
    )
