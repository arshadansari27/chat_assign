Assignment [Chat Application]
==============================

Things pending:
------------------------
1) Logout
2) Tests
3) See users who are not online
4) Online status

Things that can be improved:
-------------------------------------------
1) The login and registration can be moved to complete single page application based on AngularJS instead of JQuery (and ajax calls)
2) The backend can be done using Sails framework which comes with batteries included to have cleaner api and ability to apply policies on routes very easily


Reasons for the choice of technology:
--------------------------------------------------------
a) I started of with Jquery on signup and login page hoping to finish the task faster. But when it came to chat, it didn't make sense to use jquery directly so that page is done using angular
b) The backend apis are created adhoc in a single file, which I would much prefer to have them seperated using express routers
c) The client side code is not clean, since there are no services, etc. In order to get it to work first, I didn't design the code base properly. I would like to do that, if it is also to be assessed. 
d) Instead of using sails framework with angular js, I chose to keep the app bare, so that I don't get things for free like api generation etc. 
