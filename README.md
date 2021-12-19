# Interview Creation Portal

## Description
Create a simple app where admins can create interviews by selecting participants, interview start time and end time

## Requirements
1. An interview creation page where the admin can create an interview by selecting participants, start time and end time. Backend should throw error with proper error message if: 
   * Any of the participants is not available during the scheduled time (i.e, has another interview scheduled)
   * No of participants is less than 2
2. An interviews list page where admin can see all the upcoming interviews.
3. An interview edit page where admin can edit the created interview with the same validations as on the creation page.
* Note: No need to add a page to create Users/Participants. Create them directly in the database


## SET UP

### STEP1 - Install dependencies 

`npm install` 

### STEP2 - In order to run the program 

`npm start`


### Your system should have mongoDB server already installed and running in order to connect to database.
