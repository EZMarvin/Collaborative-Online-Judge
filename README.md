# Collaborative-Online-Judge
## Author: E Zhang
Developed an online code judging system which allows multiple users to code in one document towards one problem
* WEEK1
	* In **week1/** folder, **onlinejudge-client/** is my project folder, **oj-client/** is backup files from class.
* WEEK2-3
	* In **week2-3/**, finished all functions till codelab1 on week3 which is connecting server with client, and realizing Login/Logout & authenticated roles with Auth0.
	* When use for test and review, just run 'npm start' in server folder and broswer loocalhost:3000 
	* **Changes:** 
		1. Put add problem in navbar, which will let admin user to add problem in a new web page.  
* WEEK4
	* In **week4/**, finished the project with:
		* collaboration coding function (different cursor color, redis store old 'change' events), 
		* docker image(push to dockerhub ), 
		* python executor server (python flask response to nodejs server)
		* nginx load balancer code
	* When use for test and review, run 
		1. 'sudo sh launcher.sh' in week4 folder
		2. if wanna test nginx load balancer, copy two floder and nginx.conf to nginx folder, copy host, and change EXECUTOR_SERVER_URL in rest route file.
