# Trainer
codeforces problem Tracker and performance Analysis platform.
1.when provided with contest Id and problem index,It fetches all the problem information from codeforces using
  codeforces API and generates problem link for the problem.
2.This platform contains stopwatch to check the client's progress and It stores all the information of the problem
  like problem statements,start time,finish time,rating of the problem whether solved or not.
3.you can always use the analysis tab to check your progress.
4.you can see the latest submissions on this site on the status tab.
5.get the complete list of Trainer users on connections tab and you can also check out their analysis by searching 
 with the user name.

Codeforces performance Tracker | Self  Project | Full Stack Web Development
• The Scope of this project is to  keep track of the problems solved by the users on codeforces and give them
a  complete analysis of their performance,comparing themselves with other users
• Developed the Interface of the platform with  required tools for checking their performance like on screen
stopwatch.
• Used codeforces API services to obtain data of the problems and stored the data in mongoDB database
• Programmed the backend server using NodeJS and built middleware using Express
• Used sessions based authentication to login users and  passport.js for persistent login sessions to reduce
the stress of logging in everytime they use the app
• Used Bootstrap for styling the Frontend and deployed the app with Heroku [https://cp-trainer.herokuapp.com/]

Further Development
• Providing  complete analysis of user’s progress  with the help of graphs and charts of the data in the database 
by using Query Library in MongoDB Atlas Charts.
• Creating a realtime  dynamic Rating Graph  based on their performance using the duration and the problem rating
parameters and developing a virtual rank based analysis 
• Converting it into a mobile application using react native






