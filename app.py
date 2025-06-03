from flask import Flask, redirect, render_template, request, session, jsonify
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
        return redirect("/task-tracker")
    else:
        return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    # Clear any session data
    session.clear()

    if request.method == "POST":
        name = request.form.get("username")
        password = request.form.get("password")

        # Make sure no fields are empty
        if not name:
            return apology("please provide a username", 400)
        if not password:
            return apology("please enter password", 400)
        
        db = get_db_connection()
        cursor = db.cursor()
        rows = cursor.execute("SELECT * FROM users WHERE username = ?", (name,)).fetchall()
        if (len(rows) != 1) or (rows[0]["hash"] != sha512(password.encode()).hexdigest()):
            cursor.close()
            db.close()
            return apology("Invalid username/password", 400)
        
        # Restore user session
        session["user_id"] = rows[0]["id"]

        return redirect("/task-tracker")
    else:
        return render_template("login.html")
    
@app.route("/task-tracker", methods=["GET"])
def tasktracker():
    return render_template("task-tracker.html")

@app.route("/addtask", methods=["GET", "POST"])
def add_task():
    if request.method == "POST":
        data = request.get_json()
        task = data.get("task_name")
        pomocount = int(data.get("pomodoro_count")) 
        month_idx = int(data.get("month_index"))
        date_idx = int(data.get("date_index"))

        if not task:
            return apology("Please provide a task name", 400)
        
        if pomocount < 1:
            return apology("Pomodoro count must be at least 1", 400)
        
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("INSERT INTO tasks (user_id, task, pomocount, month, date) VALUES (?, ?, ?, ?, ?)", (session["user_id"], task, pomocount, month_idx, date_idx))
        db.commit()
        task_id = cursor.lastrowid # Give me the id of the last row inserted
        print(f"TASK ID DEBUG: {task_id}")
        cursor.close()
        db.close()
        
        # Send the json file to the frontend to ensure everything is working
        return jsonify({"success": True, "message": "Task added successfully!", "task_id": task_id})
    else:
        return render_template("task-tracker.html")

@app.route("/deletetask", methods=["DELETE"])
def delete_task():
    if request.method == "DELETE":
        data = request.get_json()
        task_id = data.get("task_id")

        if not task_id:
            return apology("Invalid task ID", 400)
        
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        db.commit()
        cursor.close()
        db.close()

        return jsonify({"success": True, "message": "Task successfully deleted!"})
        
@app.route("/gettask")
def gettask():
    db = get_db_connection()
    cursor = db.cursor()
    tasks = cursor.execute("SELECT id, task, pomocount, month, date FROM tasks WHERE user_id = ?", (session["user_id"],)).fetchall()
    cursor.close()
    db.close()

    # Convert to dic list
    task_list = [
        {"id": row["id"], "task": row["task"], "pomocount": row["pomocount"], "month": row["month"], "date": row["date"]}
        for row in tasks
    ]
    return jsonify({"success": True, "tasks": task_list})

@app.route("/view-task", methods=["POST"])
def viewtask():
    if request.method == "POST":
        task_name = request.form.get("task_name")
        pomocount = request.form.get("no_pomodoros")
        date_idx = request.form.get("date_idx")
        month_idx = request.form.get("month_idx")

    return render_template("task.html", taskname=task_name)

@app.route("/updatetask", methods=["POST"])
def updatetask():
    if request.method == "POST":
        data = request.get_json()
        updated_pomocount = data.get("updatedpomoCount")
        id = data.get("taskId")

        db = get_db_connection()
        cursor = db.cursor()
        updated_task = cursor.execute("UPDATE tasks SET pomocount = ? WHERE id = ?", (updated_pomocount, id))
        db.commit()
        cursor.close()
        db.close()

        if updated_pomocount is None or id is None:
            return jsonify({"success": False, "error": "Missing data"}), 400
        return jsonify({"success": True})
    


if __name__ == "__main__":
    app.run(debug=True)