# BabyDriverDB
Database code for the Baby Driver project


After containers boot up, access the backend node server at http://localhost:3000/


The live site is accessible at http://babydriver.digital/


# Backend Routes:

## User Data
PUT /user - Creates user account
Request Body: email, password, school_id (defaults to NULL)
Response: user_id, email

POST /user/email – Change user email
Request Body: email
Response: new_user_email

POST /user/password – Change user password
Request Body: password
Response: “Password updated successfully”

GET /users – Retrieve all user data
Response: array of user data

GET /user/:id – Retrieve user data by id
Response: id, email, school_id

## Sessions
POST /user/session – Create a user login session
Request Body: email, password
Response: redirect to /user

DELETE /user/session – Logout of a user session
Response: “Successfully Logged Out”

## Child Information
PUT /child – Add a child to the current account
Request Body: first_name, last_name, age, height, school_id
Response Body: child_id, parent_id, first_name, last_name, age, height, school_id

POST /child/:id – Update child’s age
Request Body: age, height, school_id, first_name, last_name
Response Body: new_child_age, new_height, new_school_id, new_first_name, new_last_name

GET /child/:id? - Retrieve all children for the current user or the information of a specific child
Response Body: array of children, {child_id, parent_id, first_name, last_name, age, height, school_id}

## Pickups
GET /pickups/assigned - Retrieves pickups assigned to you
Response Body: array of pickups

GET /pickups/requested - Retrieves pickups requested by you
Response Body: array of pickups

GET /pickups/:id – Retrieve a pickup by its id
Response Body: pickup_id, child_id, parent_id, creation_date, pickup_date, pickup_time, dropoff_id, assigned_to, status, safeword

POST /pickups/status – Update the pickup status
Request Body: pickup_id, status
Response Body: “Updated pickup status”

PUT /pickups  - Create new pickup
Request Body: child_id, pickup_date, pickup_time, dropoff_id, assigned_to, safeword
Response Body: pickup_id, child_id, pickup_date, pickup_time, dropoff_id, assigned_to, safeword