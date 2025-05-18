from flask import Flask, redirect, render_template, request, session
from flask_session import Session
import sqlite3
from hashlib import sha512

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

#ensuring flask updates every time after reload
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.jinja_env.auto_reload = True

def apology(message, code=400):
        def escape(s):
            for old, new in [
                ("-", "--"),
                ("_", "__"),
                ("?", "~q"),
                ("%", "~p"),
                ("#", "~h"),
                ("/", "~s"),
                ('"', "''"),
            ]:
                s = s.replace(old, new)
            return s
        return render_template("apology.html", top=code, bottom=escape(message)), code

def get_db_connection():
    conn = sqlite3.connect("project.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/", methods=["GET"])
def homepage():
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("username")
        password = request.form.get("password")
        password_confirm = request.form.get("confirmation")
        print(name, password, password_confirm)

        # Checks to avoid errors:

        # Make sure no fields are empty
        if not name:
            return apology("Please provide a username", 400)
        if not password:
            return apology("please enter password", 400)
        if not password_confirm:
            return apology("please confirm password", 400)
         
        #ensuring password keyed in is identical
        if password != password_confirm:
            return apology("Password is not identical", 400)
        

        # Check if username already exists
        db = get_db_connection()
        cursor = db.cursor()

        existing_user = cursor.execute("SELECT * FROM users WHERE username = ?", (name,)).fetchall()
        if existing_user:
            cursor.close()
            db.close()
            return apology("username already taken", 400)
    
        # Hashing the password
        hashed_password = sha512(password.encode()).hexdigest()

        # Inserting the new user into the database
        cursor.execute("INSERT INTO users (username, hash) VALUES (?, ?)", (name, hashed_password))
        db.commit()

        # Create user session
        rows = cursor.execute("SELECT * FROM users WHERE username = ?", (name,)).fetchall()
        session["user_id"] = rows[0]["id"]

        cursor.close()
        db.close()
        return redirect("/task")
    else:
        return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")

@app.route("/task", methods=["GET"])
def task():
    return render_template("task.html")

if __name__ == "__main__":
    app.run(debug=True)