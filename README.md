- [ ] User management solution
    - [x] Create, Read, Update, Delete user
    - [x] User is at least {id, email, pseudo, password, isAdmin}
    - [ ] You can read information about all users (except the password) if logged
    - [ ] You can create a new user even without being logged
    - [ ] You can only update yourself (other users cannot update you EXCEPT if admin)
    - [ ] You can only delete yourself (other users cannot delete you)
- [ ] Authentication need to be setup
  - [ ] Different solutions can be used, jwt token is recommended (see tips for more information)
  - [ ] All Read endpoints are be non-logged/anonymous 
  - [ ] All Write endpoints need the request to be authenticated (stateless)
- [ ] A rover endpoint
  - [ ] List all rovers and allow you to sort rover by date, name with a limit (default limit is 10 but can be changed with a parameter)
  - [ ] Create, Read, Update, Delete rover
  - [ ] Rover is at least {id, name, launch_date, construction_date, constructor, image}. When a rover is created you need to check the size of the image and resize it if needed (200*200px)
  - [ ] Only an admin can delete a rover
- [ ] A mission endpoint
  - [ ] List all missions and allow you to sort mission by dates, name, country
  - [ ] Create, Read, Update, Delete mission
  - [ ] Mission is at least {id, country, start_date, end_date, rovers}. A mission can use multiples rovers BUT a rover cannot be in two missions at a time
  - [ ] Only an admin OR the mission author can delete a mission
- [ ] It is important to provide good feedback to the users using the API so you will need to implement a simple type solution/validation like Joi or Yup or AJV
- [ ] On the same note, you need to use the valid HTTP code when returning information to the user
- [ ] Testing is important. You are required to implement a few tests on your project. Focus on testing the core functionalities