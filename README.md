# CS50_final_project: Todolist x pomodoro Timer website

Video Demo: https://youtu.be/sd-n7IPyfIE
Link to website: https://pomodoro-task-tracker.onrender.com
(Note that the website would take some time to be hosted alive)

Description: 

# Overview
I created a todolist app that actively fuse pomodoro timer functionalities where you get to set the 
number of pomodoro (Pomodoro timer will be triggered followed by a short/long break depending on the current pomodoro index)

# Files overview

### project.db
This is the database that stores all the user and task data necessary for smooth operation

### app.py
This is the python file that stores all the backend activity from basic user things like /register, /login and /logout to other task- related operations such as /add_task and /deletetask. 

### requirements.txt
This is the text file that stores the flask related libaries that allows the python file to run smoothly

### apology.htnl
This is the file page that displays the apology page when the user makes an invalid request

### homepage.html
This is the file page that is displayed after you register/signed into your account.

### layout_intro.html 
This is the html file layout that is used for the login and register pages.

### layout_main.html
This is the html file layout that is used for the rest of the html files where the main opeartions were performed. This file layout allows for both header, body and footer for script insertions to perform the specific backends for files like task-tracker.html, task.html and the sidebar button divs

### login.html
This is the html file page that is used for login an existing user into the website

### register.html
This is the html file page that is used for registering a new user into the website.

### task-tracker.html
This is the page where the tasks and dates for each tasks are stored. They are stored in 7 columns, representing seven days in a week. You can hover over a day to create a task and hover over the task to see the delete task button. You can click on the task div to see the pomodoro timers set up in task.html. There are next and prev buttons to take you + 7 days and - 7 days respectively for each column. 

Each column displays the date on the top and the month on the bottom. Each following task created will be displayed below the month. The add task button will always be at the bottom. There will be a task tracker heading to signal the user is in the right page 

### task.html
This is the page where the tasks are to be done. I have implemented a customaisable pomodoro Timer system. The pomodoro timer blocks are arranged neatly in a column format and you could scroll down to see all the other pomodoro blocks and the back button.

There is a back button at the bottom of the page that wil turn to "mark as completed" once all the pomodoro blocks have been completed. The button will mark the task as complete if the button is shown mark as completed. Other wise the back button will take you back to the task tracker and the number of Pomodoro shown will reflect the amount of remaining pomodoros in your task.html page.

### button-click.mp3
[Click here to listen to the button-click sound](static/button-click.mp3)

### calendar.js
This is the javascript code for the backend of task-tracker.html

### crying_cat.jpg
This is the image displayed in apology.html
[Click here to view image](static/crying_cat.jpg)

### pomodoro.js
This is the javascript code for the backend of task.html

### stylesheet.css
This is the css used for my html pages

### timer ring.wav
This is the sound effect used after the break timers are finished
[Click here to listen to the timer ring sound](static/timer ring.wav)

### yay.mp3
This is the sound effect used after the work timer is finished 
[Click here to listen to the yay sound](static/yay.mp3)

###

# User expereience guide
The user will be presented with the login.html, if the user attemps to sign in without a proper account or leave the fields blank, the user will be redirected to apology.html with the appropriate error message. There will be a link for the user to click on to redirect the user to register.html to register an account if the user does not have an account. If the user left any blanks or enter a password that does not match the confirm password field, the user will be redirected to apology.html with the error message shown. 

Once the user signs in, the user will be greeted with homepage.html with 3 sidebar buttons: Home to redirect user to homepage.html; Task Tracker to redirect user to task-tracker.html; and logout to log the user out. Once in task-tracker.html, the user can click on the left (prev button) and right (next button) pointing arrow buttons to change the dates. 

The user can hover over the column and click on the add task button to start creating a new task. There will be a popup specifying the number of pomodoro blocks and the name of the task. Once the user submitted the information, there will be an alert notifying the user have successfully created the task. The task name and number of pomodoros will be displayed in the column. The user could over over the task and click on it to be redirected to task.html or click on the delete task button that appears to delete the task.

Once the user is in task.html, the user will see only one pomodoro block active and the rest are inactive (reduced opacity and unclickable). The user will finish one pomodoro cycle of work timer followed by a short/long break timer, the current pomodoro block will be slowly fade away and the next pomodoro block will be highlighted (active). Once all the pomodoro blocks have been successfully completed, there will be text displayed saying that the task is completed. 

There will be a back button that will change the number of pomodoro cycles to the number of pomodoro blocks left in tasks.html. Once all the tasks are completed, the button will change its name as "marked as completed".

Once each task is completed, yay.mp3 will be initialized. Once each break is completed, timer ring.wav will be initialized

The user could choose to edit the pomodoro duration but the default times have been preset. 

Once the user is finished with his/her experience with the website, the user could logout by pressing the logout button in the sidebar.

