## Executive Summary

This report provides a comprehensive overview of the current status of the **Fitness and Diet Forum** project. The project has been successfully completed and deployed. The final milestone focused on implementing key features, improving user experience, and addressing customer feedback. Significant progress was made on both the web and mobile platforms, ensuring seamless functionality and feature integration.

#### **Status**: Project successfully deployed.  
#### **Scope**: Web, mobile, and backend tasks have been finalized, covering core functionalities like user roles, exercise tracking, and bookmarking.

### Status of Deliverables

#### **Primary Features**
- **Post and Feed Management**  
- **Advanced Search**  
- **Follow/Unfollow System**  
- **User Authentication** (Login/Logout)  
- **Commenting, Liking, and Bookmarking Functionality**  

#### **Domain-Specific Features**
- **Meal and Exercise Management**: Users can create meals, exercises, and workout programs.  
- **Exercise Tracking**: Users log workouts, including weights, sets, and repetitions.  
- **Leaderboard**: Real-time ranking for meals, exercises, and combined scores.  
- **Super-User System**: Super-users can create new exercises and meals.  
- **Activity Stream**: Users can see the activity of other users like meal/exercise creation, workout logging

#### **Technical Deliverables**
- **API Documentation**: Fully documented with Swagger, covering endpoints, inputs, outputs, and responses.  
- **Testing**: Unit tests, integration tests, and user tests were performed on web, mobile, and backend systems.  
- **Data Standards**: Followed W3C Activity Streams standard and adopted a NoSQL database for JSON data.  

### Final Release Notes

#### **Features Added**
- Weight-day graphics for user progress visualization  
- Weekly exercise tracking system  
- Enhanced search functionality for upper body workouts  
- Bookmarking exercises and adding them to weekly programs  
- Real-time leaderboard with meal, exercise, and combined rankings
- Real-time activity stream with meal exercise creation and workout logging  

#### **Improvements Based on Feedback**
- Exercises now display instructions in smaller text.  
- Workout repetitions and sets are limited to a maximum of 30.  
- Logs track completed exercises along with weights used. 
- New fields like difficulty added to Workout object

#### **Bug Fixes**
- Resolved authentication issues between frontend and backend systems.  
- Fixed UI bugs in the weekly program and activity streams.

#### Note
There was a bug we encountered in the deployed application, but can not recreate in local where the transition from normal member to super member doesn't work. Hence, if you would like to test the super member specific features, you can login to one of our already-existing super member accounts with username "kaan" and password "Kaan1234".

### Development Process Changes

#### **Chatting Feature Removed**
- We removed the chat page from the project to implement other features and reach desired goals more focused.

#### **Task Allocation and Specialization**
- Tasks were divided clearly between frontend, backend, and mobile teams. This improved focus and reduced bottlenecks.  

#### **Customer Feedback Integration**
- Feedback on UI/UX led to refinements in exercise tracking and display features.  
- Prioritized leaderboard changes to improve user engagement.  

#### **Impact**
- Improved development efficiency and clarity in responsibilities.  
- Enhanced user satisfaction due to better alignment with user expectations.  

### Reflections on Final Milestone Demo

The final demo presentation showcased a seamless workflow across web and mobile platforms, highlighting major features like:  
- **Meal and exercise creation**  
- **Leaderboards and community engagement**  
- **Super-user privileges and activity streams**  

#### **Lessons Learned**
- Clearer task division ensures timely completion of deliverables.  
- Continuous integration of user feedback accelerates feature development and user satisfaction.  
- Early testing helps in identifying bugs and reducing last-minute issues.  

### What Could Have Been Done Differently

If we were to start the project again, the following approaches would have streamlined the process:

1. **Earlier Adoption of W3C Standards**  
   Implementing Activity Streams at the start would have reduced refactoring time.  

2. **Enhanced Automation for Data Population**  
   Using automation scripts earlier for data population could have saved time spent on manual entry.  

3. **Focused UI/UX Prototyping**  
   Creating detailed prototypes at the beginning would have accelerated frontend development and improved the user experience sooner.  

4. **Unified Testing Strategy**  
   Establishing comprehensive testing strategies at an earlier stage would have improved overall code reliability and reduced deployment delays.  

### Conclusion

This report summarizes the successful completion of the project, highlights the key achievements, and reflects on the lessons learned throughout the development lifecycle.

## Progress Based on Teamwork
### Summary of Work Performed by Each Team member
| **Member** | **Work Done** |
|------------------|-------------|
| Zeynep Buse Aydın | - Implemented meal component, meal creation, meal deletion, and meal rating in frontend. <br> - Implemented post component, post creation, post deletion, post like functionality, and feed in frontend. <br> - Implemented exercise program deletion in frontend. <br> - Implemented 'edit profile' functionality and weight-date graph in profile page in frontend. <br> - Implemented activity streams on a separate page in frontend. <br> - Implemented super-user features in frontend (super_member UI, food and exercise creation). <br> - Implemented advanced filters for meal search in frontend. <br> - Changed authentication system in frontend. <br> - Wrote frontend unit tests. <br> - Solved bugs. |
| Bilge Kaan Güneyli | - Implemented meal component, meal creation, meal deletion, and meal rating in backend. <br> - Implemented super-user features in backend. <br> - Implemented advanced search in backend. <br> - Created unit tests and documentation for the features I implemented. <br> - Fixed bugs in backend. <br> - Deployed the project. <br> - Integrated Edamam API to the project. |
| Ahmet Batuhan Canlı | - Implemented workout logging and history page in frontend. <br> - Implemented exercise bookmarking and bookmarked exercises page in frontend. <br> - Implemented advanced search functionality (excluding filters for meals) in frontend. <br> - Implemented comment functionality for the post component in frontend. <br> - Implemented post bookmarking and bookmarked posts page in frontend. <br> - Created the user manual for the customer Milestone 3 report. <br> |
| Berat Yılmaz | - Implemented post actions (commenting, bookmarking, liking) in mobile app. <br> - Improved workout component UI and fixed workout program storing bug. <br> - Added bookmarking and rating features for workout programs. <br> - Added bookmarks page to mobile app. <br> - Wrote unit tests for feed page. <br> - Generated APK file for milestone. <br> - Contributed to system manual documentation. <br> |
| Nurullah Uçan | - Implemented backend integration for the profile workout section in the mobile app.  <br> - Developed and integrated the "Add and Remove Program" functionality in the Weekly Program module. <br> - Enhanced the Weekly Program and Daily Exercise Management feature with the ability to view the last 5 weekly programs.  <br> - Integrated backend functionalities for the "Edit Profile" page in the mobile application.  <br> - Designed and developed the Discover Page to display Activity Streams in the mobile application. <br> - Implemented a separate screen for displaying bookmarked posts in the mobile app. <br> - Developed the profile page feed to display user-related  posts. <br>  - Wrote unit tests for `EditProfileScreen` and `WeeklyProgram`, ensuring input validation, modal interactions, and performance consistency.|
| Murat Can Kocakulak | - Focused on Workout Log addition and Activity Stream implementation. <br> - Integrated a NoSQL database (Firebase Firestore) to support JSON-based data. <br> - Learned and implemented Firestore integration, replacing MySQL for Activity Streams. <br> - Wrote functions and loggings to integrate Activity Streams into the code. <br> - Updated the ReadMe file for database integration across teammates' environments. <br> - Created and tested Postman inputs for all backend view functions to ensure valid outputs. <br> - Assisted Kaan in deploying the project with compatibility for the new Firebase database implementation. <br> - Implemented W3C Activity Streams to log: workout creation, workout logging, and meal creation. <br> Implemented workout logging to capture workout date, exercises performed, and performance details. <br> Authored the Executive Summary for the final project report. <br> |
| Ceyhun Sonyürek | - Exercise screen which displays created workouts and exercise creation page are connected to backend. <br> - Authentication changes on the backend side integrated on mobile. <br> - Meal page connected to backend and meal creating screen UI prepared. <br> - Leaderboard unit test updated. <br> - Helped to create executive summary part of the milestone report. <br> - Reviewed many PR's on mobile side and gave feedback to my teammates. |
| Talha Ordukaya | - Solved authentication problems by fixing bugs in the login and signup flows. <br> - Implemented search functionality in the backend, covering users, posts, meals, and workouts. <br> - Added delete endpoints for posts and comments, enabling users to manage their content. <br> - Implemented edit functionality for meal-related endpoints. <br> - Added unit tests for various endpoints, ensuring code quality and reliability. <br> -  Updated Swagger documentation for feed, auth, search, post, and workout endpoints. |

### Status of Requirements
- :red_circle: Not started
- :large_orange_diamond: In progress
- :large_blue_circle: Completed (Implemented, Tested, Documented, Deployed)

| **Requirement** | **Backend** | **Frontend** | **Mobile** |
|------------------|-------------|---------|------------|
| 1.1.1.1.1 Guests shall be able to sign-up to the platform with a unique e-mail address, unique username and a password which complies with the secure password definition in the glossary. | :large_orange_diamond:* | :large_orange_diamond:* | :large_orange_diamond:* |
| 1.1.2.1.1 Members shall be able to log-in to their account by providing their username and password. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.1.2 Members shall be able to change their username to another untaken username when they are logged in. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.1.3 Members shall be able to change their e-mail address when they are logged in. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.1.4 Members shall be able to change their password when they are logged in. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.1.5 Members shall be able to log-out from the platform. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.1.2.1.6 Members should be able to irreversibly delete their account. | :red_circle: | :red_circle: | :red_circle: |
| 1.1.2.1.7 Members should be able to reset their password by providing their username or e-mail address. | :red_circle: | :red_circle: | :red_circle: |
| 1.1.2.2.1 Members shall be able to see and edit their account information (username, e-mail, password, profile picture, name, surname, biography). | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.2.2 Members should be able to block and unblock other members. | :red_circle: | :red_circle: | :red_circle: |
| 1.1.2.2.3 Members should be able to make their followers unfollow them. | :red_circle: | :red_circle: | :red_circle: |
| 1.1.2.2.4 Members should be able to keep their body measurements in their profiles, invisible by other users. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.3.1 Members shall be able to create posts that may contain text, images, links, diet programs and workout programs. | :large_orange_diamond:** | :large_orange_diamond:** | :large_orange_diamond: |
| 1.1.2.3.2 Members shall be able to delete their posts. | :large_blue_circle: | :large_blue_circle:  | :red_circle: |
| 1.1.2.3.3 Members shall be able to create diet and workout programs by combining options provided by the platform. | :large_blue_circle: | :large_blue_circle: | :large_orange_diamond: |
| 1.1.2.3.4 Members shall be able to delete diet and workout programs that they have created. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.1.2.3.5 Members shall be able to view other members' posts. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.3.6 Members shall be able to comment on posts. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.3.7 Members shall be able to like and unlike posts. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.3.8 Members shall be able to create direct messaging sessions with other members. | :red_circle: | :red_circle: | :red_circle: |
| 1.1.2.3.9 Members shall be able to semantically search for posts, users, workout and diet programs. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.1.2.3.10 Members shall be able to rank other users for the leaderboard. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.3.11 Members shall be able to follow and unfollow other members. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.3.12 Members shall be able to bookmark and unbookmark content. | :large_blue_circle: | :large_orange_diamond:*** | :large_orange_diamond: |
| 1.1.2.3.13 Members should be able to track their gym progress from the platform. | :large_blue_circle: | :large_blue_circle: | :large_orange_diamond: |
| 1.1.2.3.14 Members shall be able make advanced searches using filters provided by the platform. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.1.2.3.15 Members should be provided statistics such as BMI which will be generated using information they provide. | :red_circle: | :red_circle: | :red_circle: |
| 1.1.2.3.16 Members should be able to track the change in their body measurements with graphs from the platform. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.4.1 Super-members shall be subject to all the requirements which are related to members. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.1.2.4.2 Super-members shall be able to provide exercise options to the workout database of the platform. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.1.2.4.3 Super-members should be able to provide new food options to the food database of the platform. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.2.1.1 Members shall be provided food options which shall be retrieved from the Edamam Nutrition API and platform database to create diet programs. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.2.1.2 The platform database of foods shall include the food options provided by the super-members. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.2.1.3 The platform shall return the nutritional values of foods which shall be retrieved from the Edamam Nutrition API. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.2.1.4 The platform shall provide links to recipes of foods which shall be retrieved from the Edamam Nutrition API. | :red_circle: | :red_circle: | :red_circle: |
| 1.2.1.5 The platform shall display images of foods which shall be retrieved from the Wikidata API. | :red_circle: | :red_circle: | :red_circle: |
| 1.2.2.1 Members shall be provided muscle options to combine in their workout program. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.2.2.2 Members shall be provided exercise options for the muscles they have chosen which shall be retrieved from the Ninjas Exercises API and platform database to create exercise programs. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.2.2.3 Members shall be provided with the difficulty level and instructions of the exercise options which shall be retrieved from the Ninjas Exercises API and platform database to create exercise programs. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.2.2.4 The platform database of exercises shall include the exercise options provided by the super-members. | :large_orange_diamond: | :large_orange_diamond: | :red_circle: |
| 1.2.3.1 Search shall return posts, workout programs, meals and users. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.2.3.2 Search shall provide users filters to narrow their search domain down. | :large_blue_circle: | :large_blue_circle: | :red_circle: |
| 1.2.3.3 Search should return the possible similar results. | :red_circle: | :red_circle: | :red_circle: |
| 1.2.4.1 Posts shall support having text, images, diet programs, workout programs and contain user-curated content. | :large_orange_diamond:**** | :large_orange_diamond:****  | :large_orange_diamond: |
| 1.2.5.1 Each member shall have a profile page. | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.2.5.2 Each member shall be able to view other members’ profile pages as well as his/her own including their profile information: that member's profile photo, biography, number of followers, rating, previous posts, workout and diet programs.  | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| 1.2.5.3 Profile pages of users shall be visible to all unblocked users. | :red_circle: | :red_circle: | :red_circle: |

\* The passwords do not necessarily comply with the secure password. \
\** Images and links are missing. \
\*** Meal bookmark is missing. \
\**** Images are missing.

### API Endpoints

- API documentation: http://68.183.213.92:8000/swagger
- API base url: http://68.183.213.92:3000

Postman exports of 3 API calls related to core functionalities of the project.

Create Food All:
- the endpoint is called when a normal member tries to create a food object, super-members can use this functionality too
- takes food name and ingredients and puts them into the database with the nutritional values which it retrieves from the external API

Workout Program:
- the endpoint is called when a member tries to create a workout program
- takes workout name and exercises and puts them into the database

Create Program:
- the endpoint is called when a user tries to create a weekly workout program
- takes days and workout ids and puts them in the database

You can try these requests with the following steps:
- Copy the content and paste it into a json file
- Go to collections tab on Postman and click Import
- Choose the json file you have created

Notes:
- Authentication tokens of these calls are created with the user `@kaan`. The token is expected to work properly but in case the token expires, you can login to an account (ex: `username:kaan password:Kaan1234`) and retrieve the token from the console output. (You may use `inspect` in Chrome) Then you can replace the one in `Authentication` field of the headers
- Id fields (`food_id`, `workout_id`, `program_id` and `id`) can change in your request since they are auto-incremented fields. Also, the username's can change if you use a token generated with a different account
- Also, if you would like to try different `id`s in `create_program` you are highly encouraged to use lower numbers since there are not too many workouts in the database and you can get errors

```json
{
	"info": {
		"_postman_id": "9c7d39b8-a398-4116-8b00-555908af958a",
		"name": "New Collection",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "39127066"
	},
	"item": [
		{
			"name": "Create Food All",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Authorization",
						"value": "Token 2f79749644669003bffbb549ebaf6cce0d0532d9",
						"type": "text"
					}
				],
				"body": {
					"mode": "formdata",
					"formdata": [
						{
							"key": "food_name",
							"value": "Spaghetti",
							"type": "text"
						},
						{
							"key": "ingredients",
							"value": "150 gr pasta\\n50 gr tomato sauce",
							"type": "text"
						},
						{
							"key": "recipe_url",
							"value": "https://ifoodreal.com/spaghetti-with-tomato-sauce-recipe/",
							"type": "text"
						}
					]
				},
				"url": {
					"raw": "http://68.183.213.92:8000/create_food_all/",
					"protocol": "http",
					"host": [
						"68",
						"183",
						"213",
						"92"
					],
					"port": "8000",
					"path": [
						"create_food_all",
						""
					]
				}
			},
			"response": [
				{
					"message": "Food for meal created successfully with Edamam Nutrition Analysis API", 
					"food_id": 13, 
					"food_name": "Spaghetti", 
					"ingredients": "150 gr pasta\\n50 gr tomato sauce", 
					"recipe_url": "https://ifoodreal.com/spaghetti-with-tomato-sauce-recipe/", 
					"image_url": "", 
					"calories": "36.0 kcal", 
					"fat": "0.44999999999999996 g", 
					"fat_saturated": "0.0615 g", 
					"fat_trans": "0.0 g", 
					"carbo": "7.965 g", 
					"fiber": "2.25 g", 
					"sugar": "5.34 g", 
					"protein": "1.7999999999999998 g", 
					"cholesterol": "0.0 mg", 
					"na": "711.0 mg", 
					"ca": "21.0 mg", 
					"k": "445.5 mg", 
					"vit_k": "4.199999999999999 \u00b5g", 
					"vit_c": "10.5 mg", 
					"vit_a_rae": "33.0 \u00b5g", 
					"vit_d": "0.0 \u00b5g", 
					"vit_b12": "0.0 \u00b5g", 
					"vit_b6": "0.14700000000000002 mg"
					}
				]
		},
		{
			"name": "Workout Program",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Authorization",
						"value": "Token 2f79749644669003bffbb549ebaf6cce0d0532d9",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"workout_name\": \"Full Body Strength\",\n  \"exercises\": [\n    {\n      \"type\": \"Strength\",\n      \"name\": \"Bench Press\",\n      \"muscle\": \"Chest\",\n      \"equipment\": \"Barbell\",\n      \"difficulty\": \"Intermediate\",\n      \"instruction\": \"Lie on a bench and press the bar upward.\",\n      \"sets\": 3,\n      \"reps\": 10\n    },\n    {\n      \"type\": \"Strength\",\n      \"name\": \"Deadlift\",\n      \"muscle\": \"Back\",\n      \"equipment\": \"Barbell\",\n      \"difficulty\": \"Advanced\",\n      \"instruction\": \"Lift the bar from the ground to your thighs.\",\n      \"sets\": 4,\n      \"reps\": 8\n    }\n  ]\n}\n",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://68.183.213.92:8000/workout_program/",
					"protocol": "http",
					"host": [
						"68",
						"183",
						"213",
						"92"
					],
					"port": "8000",
					"path": [
						"workout_program",
						""
					]
				}
			},
			"response": [
				{
					"message": "Workout program created successfully",
					"workout_id": 31,
					"workout_name": "Full Body Strength",
					"created_by": "kaan",
					"exercises_count": 2
				}				
			]
		},
		{
			"name": "Create Program",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Authorization",
						"value": "Token 2f79749644669003bffbb549ebaf6cce0d0532d9",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"workouts\": {\n    \"1\": 1,\n    \"3\": 3,\n    \"5\": 2\n  }\n}\n",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://68.183.213.92:8000/create-program/",
					"protocol": "http",
					"host": [
						"68",
						"183",
						"213",
						"92"
					],
					"port": "8000",
					"path": [
						"create-program",
						""
					]
				}
			},
			"response": [
				{
					"status": "success",
					"program_id": 10,
					"user": {
						"id": 1,
						"username": "kaan",
						"email": "kaan@gmail.com"
					}, 
					"days": [
						{
							"day": "Tuesday",
							"workout": 
							{
								"id": 1,
								"name": "Mcan's Arm Day"
							}
						},
						{
							"day": "Thursday",
							"workout": 
							{
								"id": 3, 
								"name": "Mcan's Leg Day"
							}
						}, 
						{
							"day": "Saturday", 
							"workout": 
							{
								"id": 2,
								"name": "Mcan's Chest"
							}
						}
					]
				}
			]
		}
	]
}
```


### User Interface / User Experience
#### Frontend
##### The UI/UX Components and Pages Codes

| **Components**                                                                                   | **Pages**                                                                                  |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [CreateMealModal](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/CreateMealModal.js) | [Discover](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/Discover.js) |
| [CreatePostModal](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/CreatePostModal.js) | [ExerciseProgramList](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/ExerciseProgramList.js) |
| [DayProgram](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/DayProgram.js)         | [Exercises](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/Exercises.js) |
| [EditProfileForm](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/EditProfileForm.js) | [Feed](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/Feed.js) |
| [Exercise](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/Exercise.js)            | [LeaderBoard](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/LeaderBoard.js) |
| [ExerciseProgram](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/ExerciseProgram.js) | [Login](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/Login.js) |
| [Food](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/Food.js)                    | [MealList](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/MealList.js) |
| [History](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/History.js)              | [ProfilePage](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/ProfilePage.js) |
| [Meal](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/Meal.js)                    | [SearchResults](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/SearchResults.js) |
| [MuscleGroups](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/MuscleGroups.js)    | [Signup Page](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/pages/Signup.js) |
| [NutrientSection](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/NutrientSection.js) |                                                                                          |
| [Post](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/Post.js)                    |                                                                                          |
| [Sidebar](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/Sidebar.js)              |                                                                                          |
| [TodaysExercises](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/TodaysExercises.js) |                                                                                          |
| [Topbar](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/Topbar.js)                |                                                                                          |
| [WeekProgram](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/WeekProgram.js)      |                                                                                          |
| [WeightGraph](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/src/components/WeightGraph.js)      |                                                                                          |


##### Screenshots

<details>
<summary>Sign Up</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 16 48" src="https://github.com/user-attachments/assets/00aa21ba-5681-4525-bdf0-722d8a6486d9" />
</details>
<details>
<summary>Sign In</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 16 33" src="https://github.com/user-attachments/assets/0246b78f-9f95-4802-9cb6-8aef85168d88" />
</details>
<details>
<summary>Feed</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 06 16" src="https://github.com/user-attachments/assets/35021531-bf15-4271-8cb4-fec709989dfa" />
</details>
<details>
<summary>Bookmarked Posts</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 21 00" src="https://github.com/user-attachments/assets/2e111004-f0eb-4111-b243-3b3d87726ad9" />
</details>
<details>
<summary>Member Profile - Posts</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 07 38" src="https://github.com/user-attachments/assets/fe3fc758-7546-4429-ae5b-f787a85f698b" />
</details>
<details>
<summary>Member Profile - Meals</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 08 01" src="https://github.com/user-attachments/assets/9ea0e3f4-0613-4365-bb06-23b091431c4c" />
</details>
<details>
<summary>Member Profile - Exercises</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 08 15" src="https://github.com/user-attachments/assets/cc9ccea9-cc74-4034-a6e1-5d326f9c0dfa" />
</details>
<details>
<summary>Member Profile - Edit Profile</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 08 44" src="https://github.com/user-attachments/assets/42a2386e-5b73-48c8-addd-e3708dc8a8a3" />
</details>
<details>
<summary>Discover</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 09 51" src="https://github.com/user-attachments/assets/b3701d9b-c3c3-4af6-8c14-4ea83c20a292" />
</details>
<details>
<summary>Meals</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 10 21" src="https://github.com/user-attachments/assets/8f306f85-0a9f-418c-bf95-0c93db0c65db" />
</details>
<details>
<summary>Create a Meal</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 10 37" src="https://github.com/user-attachments/assets/2f3793b5-497c-46ab-b33b-c2a07b80290c" />
</details>
<details>
<summary>Regular Member - Add Food</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 11 41" src="https://github.com/user-attachments/assets/49418fb1-5ecd-49f7-822a-03a02efb8773" />
</details>
<details>
<summary>Exercises Weekly Program</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 12 39" src="https://github.com/user-attachments/assets/58a23a93-be17-4565-924e-46629ec45f69" />
</details>
<details>
<summary>Workout History</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 13 04" src="https://github.com/user-attachments/assets/9eec6f64-3179-458e-8cbf-e0133e42a4b9" />
</details>
<details>
<summary>Your Exercise Programs</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 13 23" src="https://github.com/user-attachments/assets/da951889-06ef-4f14-8479-e7ef1fb64836" />
</details>
<details>
<summary>Create Exercise Program</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 14 09" src="https://github.com/user-attachments/assets/8436c9bc-e14f-47eb-b6f5-b602a3caf964" />
</details>
<details>
<summary>Bookmarked Workouts</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 14 25" src="https://github.com/user-attachments/assets/d5c739b6-d456-4f86-b5db-fd7bbbf3dca0" />
</details>
<details>
<summary>Leaderboards</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 14 45" src="https://github.com/user-attachments/assets/f07b1bbc-9417-4303-a8b3-c27e1a0ba95b" />
</details>
<details>
<summary>Create a Post</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 15 20" src="https://github.com/user-attachments/assets/af801e25-b8df-4e69-a5b4-e69d32423de0" />
</details>
<details>
<summary>Search with Filters</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 15 55" src="https://github.com/user-attachments/assets/1ce751b3-c50d-4d10-a1c2-e6c6df1f8c41" />
</details>
<details>
<summary>Search Results</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 16 15" src="https://github.com/user-attachments/assets/6445829b-f687-4278-a234-aa5172605d20" />
</details>

##### Super Member Specific Screenshots
<details>
<summary>Super Member - Profile Page</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 22 25" src="https://github.com/user-attachments/assets/1f5db410-8aec-4c36-ad09-d10c6cf1c0be" />
</details>
<details>
<summary>Add Food with Nutrients Input</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 23 01" src="https://github.com/user-attachments/assets/488ed637-2842-44a9-b34f-448573ef4231" />
</details>
<details>
<summary>Create Exercise</summary>
<img width="900" alt="Screenshot 2024-12-20 at 13 23 28" src="https://github.com/user-attachments/assets/84338c8b-e9e2-475a-b71a-acce72b079ba" />
</details>

#### Mobile
##### The UI/UX Components and Pages Codes

| **Components**                                                                                   | **Pages**                                                                                  |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [CommentModal](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/CommentModal.tsx) | [Home](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/index.tsx) |
| [FeedScreen](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/FeedScreen.tsx) | [Discover](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/discover.tsx) |
| [Food](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/Food.tsx)         | [Weekly](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/WeeklyProgram.tsx) |
| [MealProgram](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/MealProgram.tsx) | [Exercises](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/exercises.tsx) |
| [MealsScreen](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/MealsScreen.tsx)   | [Meals](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/meals.tsx) |
| [Post](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/Post.tsx) | [Leaderboard](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/leaderboard.tsx) |
| [EditProfileScreen](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/EditProfileScreen.tsx)     | [Profile](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/profile.tsx) |
| [last_five_programs](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/last_five_programs.tsx)               | [Index](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/index.tsx) |
| [createPostScreen](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/createPostScreen.tsx)                  |  [Login](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/login.tsx)  |
| [daily_exercise](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/daily_exercise.tsx)   | [Signup](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/signup.tsx)  |
| [BookmarksScreen](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/BookmarksScreen.tsx)   |                                                                                          |
| [PostCreate](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/PostCreate.tsx)                    |                        |
| [_layout](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/_layout.tsx)              |                           |
| [others-profile](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/others-profile.tsx)            |                                    |
| [WorkoutEdit](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/components/WorkoutEdit.tsx)                |                                            |
| [exerciseProgramCreator](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/exerciseProgramCreator.tsx)      |                                                         |
| [exerciseSelector](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/exerciseSelector.tsx)      |                                                                                          |
| [mealProgramCreator](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/mealProgramCreator.tsx)      |                                                                                          |
| [muscleGroupSelector](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/muscleGroupSelector.tsx)      |                                                                                          |
| [_layout](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/app/(tabs)/_layout.tsx)      |                                                                                          |



##### Screenshots

<details>
<summary>Index</summary>
<img width="230"  src="https://github.com/user-attachments/assets/ac1f962d-bca3-461e-880d-627f11049e2e" />
</details>
<details>
<summary>Sign Up</summary>
<img width="230"  src="https://github.com/user-attachments/assets/1e201395-5d60-4644-bd83-e8d0105abc1c" />
</details>
<details>
<summary>Login</summary>
<img width="230" src="https://github.com/user-attachments/assets/782d1e69-c624-4260-983e-1011cc59f919" />
</details>
<details>
<summary>Feed</summary>
<img width="230" src="https://github.com/user-attachments/assets/c67e5790-939c-4f6d-b2e0-bf8f6c09761f" />
</details>
<details>
<summary>Bookmarked Posts</summary>
<img width="230" src="https://github.com/user-attachments/assets/d981a011-215b-467e-a700-9a609454e179" />
</details>
<details>
<summary>Profile - Posts</summary>
<img width="230"  src="https://github.com/user-attachments/assets/4cfabb73-ddd7-4c2d-acab-85f04a72f158" />
</details>
<details>
<summary>Profile - Meals</summary>
<img width="230" src="https://github.com/user-attachments/assets/d4d70366-e1f1-4158-9108-5d558b672df4" />
</details>
<details>
<summary>Profile - Exercises</summary>
<img width="230" src="https://github.com/user-attachments/assets/51799d50-c4e5-472c-80b4-073577769e97" />
</details>
<details>
<summary>Profile - Edit Profile</summary>
<img width="230" src="https://github.com/user-attachments/assets/b0f4428f-b40d-4d97-ae9c-35bb466c2785" />
</details>
<details>
<summary>Discover</summary>
<img width="230" src="https://github.com/user-attachments/assets/f9135e1b-9877-48f2-9ce7-77f0a422c3c8" />
</details>
<details>
<summary>Meals</summary>
<img width="230" src="https://github.com/user-attachments/assets/f038b1fa-9d5c-470a-bc45-7a9f93a27cd9" />
</details>
<details>
<summary>Exercises Weekly Program</summary>
<img width="230" src="https://github.com/user-attachments/assets/1fb36b53-5cb1-455e-bca8-7522de8bdbfb" />
<img width="230" src="https://github.com/user-attachments/assets/5a7e9860-f5b9-437d-841e-883629995837" />
</details>
<details>
<summary>Exercises </summary>
<img width="230" src="https://github.com/user-attachments/assets/12f82b2a-d08b-4c16-9933-9e7cfbf57a24" />
</details>
<details>
<summary>Create Exercise </summary>
<img width="230" src="https://github.com/user-attachments/assets/2a6895a2-c178-42b9-b697-b7d56b78cf74" />
<img width="230" src="https://github.com/user-attachments/assets/2ade0349-bf06-4767-9511-eec6f648c1fd" />
<img width="230" src="https://github.com/user-attachments/assets/6ffc3f79-80ce-4147-91c5-f9fa80f4f558" />
</details>
<details>
<summary>Leaderboards</summary>
<img width="230" src="https://github.com/user-attachments/assets/8d7d47e4-951c-4924-9508-cdf8659f6eed" />
<img width="230" src="https://github.com/user-attachments/assets/2281c67c-f85d-4c8a-ba5c-4a9534bb5ae7" />
<img width="230" src="https://github.com/user-attachments/assets/bff3d693-6ce9-401a-81b4-4dc5e7ca4ce4" />
</details>
<details>
<summary>Create a Post</summary>
<img width="230" src="https://github.com/user-attachments/assets/dfaf735e-9e90-4b6d-a679-aef274e63b1a" />
</details>
<details>
<summary>Last Five Programs</summary>
<img width="230" src="https://github.com/user-attachments/assets/3c69ba62-046f-4a9a-833d-bf7dfb846627" />
<img width="230" src="https://github.com/user-attachments/assets/03e1f996-5a48-4b89-baf9-8e22a7653e54" />
</details>
<details>
<summary>Weekly Overview</summary>
<img width="230" src="https://github.com/user-attachments/assets/7bfc6da0-9bfd-4aae-af52-1e9dc57aa87d" />
</details>
<details>
<summary>Daily Exercise</summary>
<img width="230" src="https://github.com/user-attachments/assets/f73ddcb5-43d2-40f6-b622-ed31e1bda566" />
</details>
<details>
<summary>Weight History</summary>
<img width="230" src="https://github.com/user-attachments/assets/8bf943f1-d20f-4934-a0ac-bcbc1b74f17d" />
</details>

### Standards: Work Completed Towards Applying W3C Standards

In this project, the team successfully applied **W3C Activity Streams standards** by integrating them with **Firebase Firestore**. Activity Streams were used to structure and standardize user activities such as creating workouts, logging exercises, and tracking meals. The following work was completed:

---

#### 1. Data Representation Using W3C Activity Streams

Activities were designed to align with the W3C standard schema, ensuring consistency and compatibility.

##### Structure of Activities
Each activity stored in Firestore includes the following components:
- `@context`: W3C Activity Streams context URL.
- `type`: The type of activity (e.g., "Create," "Log").
- `actor`: Details about the user performing the action.
- `object`: The specific item being acted upon (workout, exercise, or meal).
- `summary`: A human-readable summary of the activity.
- `published`: Timestamp of when the activity occurred.

---

#### 2. Implementation Details

##### a) Workout Activities
Stored data for when users created new workouts:
```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Create",
  "actor": {
    "id": 1,
    "name": "zaydin",
    "isSuperUser": false
  },
  "object": {
    "id": 8,
    "name": "Standing dumbbell shrug",
    "muscle": "traps",
    "reps": "5",
    "sets": "2",
    "type": "strength"
  },
  "summary": "zaydin created a new workout program 'buse new'",
  "published": "2024-12-16T12:50:58.782680"
}
```
##### b) Workout Log Activities

Stored data for logging completed workouts:
```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Log",
  "actor": {
    "id": 1,
    "name": "mcankk",
    "isSuperUser": true
  },
  "object": {
    "exercises": [
      {
        "id": 115,
        "name": "Barbell Squat",
        "muscle": "legs",
        "performance": {
          "actual_sets": 3,
          "actual_reps": 12,
          "weight": 50.5
        }
      }
    ]
  },
  "summary": "mcankk logged their 'Full Body Workout' workout",
  "published": "2024-12-13T19:25:44.635581"
}
```
##### c) Meal Activities

Stored data for creating meals and food tracking:
```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Create",
  "actor": {
    "id": 20,
    "name": "testuser1",
    "isSuperUser": false
  },
  "object": {
    "id": 10,
    "name": "Apple",
    "ingredients": "100 gr apple",
    "nutrients": {
      "calories": "52.0 kcal",
      "carbohydrates": "13.8 g",
      "protein": "0.26 g"
    }
  },
  "summary": "testuser1 created a new meal 'Apple Breakfast'",
  "published": "2024-12-19T23:27:21.253527"
}
```
#### 3. Integration with Firestore

##### Adding Data
View functions were updated to include Firestore database calls when creating activities. For example:
```python
db.collection('workoutActivities').add({
    "@context": "https://www.w3.org/ns/activitystreams",
    "type": "Create",
    "actor": {"id": user_id, "name": username},
    "object": {"name": workout_name, "muscle": muscle, "reps": reps},
    "published": datetime.utcnow()
}) 
```
##### Retrieving Data

New GET functions were written to retrieve logs and activities from Firestore. Example:
```python
def get_workout_logs():
    logs = db.collection('workoutLogActivities').stream()
    return [log.to_dict() for log in logs]
```
#### 4. Benefits of Applying W3C Standards

- **Consistency**: Uniform JSON-based data representation for activities like "Create" and "Log."
- **Scalability**: W3C-compatible data can be integrated with other platforms that follow the same standard.
- **Flexibility**: The JSON structure makes it easy to extend activities with new fields or actions (e.g., "Update," "Delete").
- **Interoperability**: W3C Activity Streams allow data to be shared or exported without format conversions.

---

#### 5. Summary of Work

The team successfully implemented **W3C Activity Streams standards** using Firebase Firestore as the database. This included:
- Structuring workout, log, and meal activities to align with the W3C schema.
- Ensuring all activities were stored in a standardized JSON format.
- Writing view functions to add and retrieve data efficiently from Firestore.

This approach ensures that the system adheres to global standards, improving long-term scalability, interoperability, and maintainability.




### Scenario 1: Super User Kaan
#### Persona:
Name: Bilge Kaan Güneyli \
Age: 22 \
Occupation: Computer Engineering Student \
Background: Kaan is very famous actually (from our milestones), but let us give his background. Kaan is a computer engineering student who started working out 4 months ago in a gym in which his personal trainers suggested him using "Fitness and Diet Forum". After being a member of "Fitness and Diet Forum" community, Kaan became a super member because his workouts and meal programs are rated very highly by the other users.
#### Scenario
- Kaan opens the Fitness and Diet Forum app and logs in to his account.
- As a super member, he decides to start by creating a new meal. He goes to the "Meals" tab, clicks on the "Create a Meal" button, names it "My Dinner," and begins adding foods. When he typed in and searched for "Grilled Salmon", it wasn't found. But since he is a super member, he can enter all the information about "Grilled Salmon" including the macro- and micronutrients, vitamins, calories as well as the recipe, food picture and ingredients. He enters the details and clicks on "Save Food". The food is saved, then he adds it to his meal by clicking on "Add Food to Meal". He finally clicks on "Save and Finalize Meal" button and "My Dinner" meal is created and visible in Kaan's "Meals" tab.
- As a new super member, he is eager to explore all the privileges displayed in the tooltip that appears when he hovers over the "i" icon located at the lower left corner of the page. He navigates to the "Exercises" section, clicks on "My Exercise Programs" tab, "Create New Exercise" button and adds a new exercise called "Mountain Climbers," selecting the muscle the exercise aims, the exercise type, difficulty and entering the name, equipment, instructions. After saving it, on the same page, he clicks on "Create New Program" and he creates a workout program called "Morning Boost" and includes the new exercise via selecting the muscle it targets.
- Switching to the feed, Kaan scrolls through the posts shared by the community. He sees a workout plan promoting unhealthy practices. Concerned, he comments, "This is very unhealthy. You should not do it.". Additionally, he gives the lowest rate (1 star) possible to that workout. While scrolling through feed, he also sees lots of high quality posts which he "likes" and bookmarks.
- Kaan then explores activities shared by other superusers. Visiting a fellow superuser’s profile, he bookmarks an exercise program that catches his attention.
- Eager to expand his weekly plan, he searches for "Upper Body Workout" in the search bar and he filters the results by selecting "Chest" muscle. Finding a relevant exercise, he bookmarks it and then goes to "Exercises" tab. There, he decides he want to do that exercise 3 times that week so he adds it to Tuesday, Thursday and Sunday on his weekly workout plan.
- Starting his workout, Kaan presses the "Run" button to begin the session. After completing it, he checks his workout history to track his progress via clicking on "View History" button.
- After his workout, Kaan weighs himself and goes to his profile page to updates his weight in the weight graph, visualizing his fitness journey over the past weeks.
- Feeling inspired by his achievements, Kaan edits his profile to reflect his new role and contributions as a superuser. He creates a post featuring his new meal and workout program, encouraging others to try them.
- Before logging out, Kaan visits the Leaderboards to see his rank. Spotting his name among the top rated users fills him with pride and motivates him to stay active in the community.

### Scenario 2: Newbie Batuhan
#### Persona:
Name: Ahmet Batuhan Canlı \
Age: 23 \
Occupation: Computer Engineering Student \
Background: Batuhan became Kaan's friend when they met on Batuhan's first day at the gym. He heard about the "Fitness and Diet Forum" from Kaan, he is very curious and ready to explore the forum as a new member. 
#### Scenario:
- Batuhan signs up to the "Fitness and Diet Forum" with a unique username, email address and password.
- He searches for "Kaan", he sees the results containing his friend Kaan's profile, his workouts, meals and posts. From there he goes to Kaan's profile page.
- On Kaan's profile page, he sees the "crown" which indicated that Kaan is a super member of the community. He sees his score which is very high (4.6), he immediately follows him and gets very curious about the posts, meals and workouts Kaan created.
- Initially the "Posts" tab is open, he scrolls down in that page. He then switches to "Meals" tab, sees Kaan's "My Breakfast" meal and decides he wants to try that sometime. He also wants to discover Kaan's exercises. He switches to "Exercises" tab and bookmarks an exercise program he thinks he can do.
- Since he is a new member, Batuhan really wants to discover the forum entirely. So his next step is to go to the "Discover" tab. There, he sees a user named buse created a new meal '2-minute breakfast'. He then clicks on 'buse' and goes to buse's profile where he finds and rates buse's '2-minute breakfast' meal 5 stars.
- Batuhan decides to explore more breakfast meals for inspiration. He enters "breakfast" to the search bar and applies the following filters:
Calories (kcal): Min 300, Max 800
Protein (g): Min 20, Max 50
Fat (g): Min 10, Max 30
Carbs (g): Min 30, Max 100
Fiber (g): Min 5, Max 20
After applying these filters, Batuhan finds several meals that match his criteria.
- After getting inspired by the meals he found, he goes to the "Meals" section on the sidebar and realizing he can create his own meal, Batuhan clicks on "Create a Meal" button.
- He enters "My Lunch" as the name of the meal and clicks on "Create Meal" button. He then sees he can search for foods with their names. He enters "Chicken Salad", after clicking on the option appeared, he gets the micro- and macronutrients, vitamins, recipe, picture, calories and ingredient list of chicken salad. He clicks on "Add Food to Meal" button. 
- Batuhan also wants to add "Chocolate Cake" to the meal as well. He searches for "Chocolate Cake" but it says that 'The food was not found'. So he finds the picture, recipe and ingredients of the cake he wants. He enters them and then clicks on "Get Nutrients" button. All the micro- and macronutrients, vitamins, and calories of the chocolate cake are displayed on the page. He clicks on "Add Food to Meal" button, and he can see both "Chicken Salad" and "Chocolate Cake" added to the new meal.
- He finally clicks on "Save and Finalize Meal" button and "My Lunch" meal is created and visible in Batuhan's "Meals" tab.

### Features and Work Completed for the Scenarios

#### Authentication and Profile Management
##### User Authentication and Authorization
- Implemented user registration with validation for unique usernames, emails, and secure password storage.
- Developed login functionality using secure token-based authentication, enabling users to securely access their accounts.
##### Profile Features
- Enabled profile customization, including the ability to update profile information, roles (e.g., superuser).
- Added a dynamic weight-tracking graph that visualizes a user’s fitness journey based on historical weight entries.

#### Meal Management
##### Meal Creation
- Designed a comprehensive meal creation flow with options for adding foods manually or searching the food database.
- Allowed superusers to manually input detailed food information, including macro- and micronutrients, calories, vitamins, ingredients, recipe, and food image.
##### Food Search and Input
- Implemented a search functionality that fetches food information from a pre-populated food database.
- For missing foods, superusers can manually input data and save it for future use. Normal users can input the food name, ingredients, recipe and food image and  extract nutritional data from the API, then add this food.
##### Meal Rating and Search
- Developed meal rating functionality to allow users to rate meals from 1 to 5 stars.
- Added search filters to discover meals based on min and max calories, protein, fat, carbs, and fiber amounts.

#### Exercise and Exercise Program Management
##### Exercise Creation and Customization
- Allowed superusers to create new exercises, including attributes such as muscle group, exercise type, difficulty, equipment, and instructions.
##### Exercise Programs
- Developed a feature to create exercise programs with the exercises on the forum.
##### Exercise Program Search and Bookmarking
- Integrated a search bar with filtering options (e.g., muscle groups) to discover exercises.
- Enabled users to bookmark exercise programs for quick access.
##### Workout Tracking
- Developed functionality for users to add exercises to specific days of the week and customize their weekly workout plans.
- Enabled users to initiate workout sessions with a “Run” button and select the exercises they did, enter the number of sets, repetitions they did and weight they used.
- Logged completed workouts and saved them in a history section for progress tracking.

#### Community Features
##### Feed and Interactions
- Designed a dynamic feed where users can view, like, comment, and bookmark posts shared by the users they follow.
##### Superuser Privileges
- Highlighted superuser privileges with tooltips and badges (e.g., crowns) on profiles.
- Enabled superusers to create food with providing all the details and create exercises that other users can explore and use.
##### Discover Tab
- Built a discovery page to explore the community activities including meal creation, exercise program creation, and exercise completion (logging).
- Integrated user profile redirection for seamless navigation between users and their activities.
- Utilized a relational database to store these user activities with respect to W3C Activity Streams standard.
##### Leaderboards
- Implemented a 3-leaderboard system that ranks users based on scores derived from their contributions. One for both meal and workout ratings (Overall Leaderboard), one for only meal ratings (Meal Leaderboard) and one for only workout ratings (Workout Leaderboard).

## Individual Contributions
<details>
<summary>Member: Zeynep Buse Aydın (Frontend)</summary>

#### Responsibilities:
As a frontend team member, I was responsible for implementing various core features in the frontend part of the project, implementing unit tests and fixing bugs. As the group’s Communicator, I managed internal communication within the team and acted as the point of contact between our team, the course instructor, and teaching assistants.

#### Main contributions:

##### Code-related significant issues:
- [#517](https://github.com/bounswe/bounswe2024group4/issues/517) Implement creating a post
- [#518](https://github.com/bounswe/bounswe2024group4/issues/518) Connect feed to backend
- [#519](https://github.com/bounswe/bounswe2024group4/issues/519) Implement post like feature
- [#524](https://github.com/bounswe/bounswe2024group4/issues/524) Implement delete operations in frontend (post, meal and exercise program deletions).
- [#534](https://github.com/bounswe/bounswe2024group4/issues/534) Change authentication system in frontend.
- [#538](https://github.com/bounswe/bounswe2024group4/issues/538) Implement weight-date graph in profile page.
- [#539](https://github.com/bounswe/bounswe2024group4/issues/539) Implement activity streams in frontend on a separate page.
- [#540](https://github.com/bounswe/bounswe2024group4/issues/540) Implement create a meal, connect the meal component to backend.
- [#541](https://github.com/bounswe/bounswe2024group4/issues/541) Implement super-user features in frontend: super_member specific UI, food creation with nutrients, exercise creation.
- [#550](https://github.com/bounswe/bounswe2024group4/issues/550) Write frontend unit tests.
- [#572](https://github.com/bounswe/bounswe2024group4/issues/572) Bug fix: Adding workouts while creating posts do not work properly.
- [#588](https://github.com/bounswe/bounswe2024group4/issues/588) Embed meals into posts in frontend.
- [#619](https://github.com/bounswe/bounswe2024group4/issues/619) Implement advanced filters for meal search.
- [#620](https://github.com/bounswe/bounswe2024group4/issues/620) Bug fix: exercise history is not displayed.


##### Non-code-related significant issues:
- [#630](https://github.com/bounswe/bounswe2024group4/issues/630) Write the assigned parts of the Milestone 3 Report

#### Pull requests:
- [#522](https://github.com/bounswe/bounswe2024group4/pull/522) [#598](https://github.com/bounswe/bounswe2024group4/pull/598) Implemented post component and post creation functionality in frontend.
- [#523](https://github.com/bounswe/bounswe2024group4/pull/523) Implemented Feed page in frontend.
- [#530](https://github.com/bounswe/bounswe2024group4/pull/530) Implemented 'post like' functionality in frontend.
- [#535](https://github.com/bounswe/bounswe2024group4/pull/535) Updated the authentication in frontend with respect to the new version implemented in backend.
- [#536](https://github.com/bounswe/bounswe2024group4/pull/536) Implemented 'edit profile' functionality in frontend.
- [#547](https://github.com/bounswe/bounswe2024group4/pull/547) Implemented weight graph on profile page.
- [#548](https://github.com/bounswe/bounswe2024group4/pull/548) Super-member specific UI in frontend is implemented
- [#549](https://github.com/bounswe/bounswe2024group4/pull/549)  [#623](https://github.com/bounswe/bounswe2024group4/pull/623) Implemented frontend unit tests for CreatePostModal.js, EditProfileForm.js, ExerciseProgram.js, Feed.js, LeaderBoard.js, Post.js, and ProfilePage.js.
- [#555](https://github.com/bounswe/bounswe2024group4/pull/555) Implemented 'delete workout' functionality.
- [#561](https://github.com/bounswe/bounswe2024group4/pull/561) Implemented Discover page using activity streams.
- [#583](https://github.com/bounswe/bounswe2024group4/pull/583) [#615](https://github.com/bounswe/bounswe2024group4/pull/615) [#627](https://github.com/bounswe/bounswe2024group4/pull/627) bug fixes
- [#589](https://github.com/bounswe/bounswe2024group4/pull/589) Implemented meal component, 'meal creation' functionality and food addition via getting the nutrients from the API.
- [#592](https://github.com/bounswe/bounswe2024group4/pull/592) Implemented 'exercise creation' for super members.
- [#595](https://github.com/bounswe/bounswe2024group4/pull/595) Implemented 'delete post' functionality.
- [#597](https://github.com/bounswe/bounswe2024group4/pull/597) Implemented 'delete meal' functionality.
- [#600](https://github.com/bounswe/bounswe2024group4/pull/600) Implemented meal rating.
- [#601](https://github.com/bounswe/bounswe2024group4/pull/601) Implemented super members' feature to create food via giving its all info (including the nutrients).
- [#614](https://github.com/bounswe/bounswe2024group4/pull/614) Helped Batuhan implementing advanced meal search.

#### Unit Tests
I implemented the following frontend unit tests:
- "EditProfileForm Component renders the form with pre-filled user data",
- "EditProfileForm Component calls onClose when the Cancel button is clicked",
- "EditProfileForm Component updates the form state when inputs change",
- "EditProfileForm Component submits the form and calls the API",
- "EditProfileForm Component shows an error alert if the API call fails",
- "CreatePostModal renders modal when isModalOpen is true",
- "CreatePostModal does not render modal when isModalOpen is false",
- "CreatePostModal fetches workouts when modal is opened",
- "CreatePostModal handles workout selection and displays selected workout",
- "CreatePostModal handles creating post with content and workout selection",
- "CreatePostModal handles cancel button and resets state",
- "CreatePostModal disables submit button when post content and workout are empty",
- "CreatePostModal enables submit button when post content and workout are provided",
- "ProfilePage should render profile information correctly",
- "ProfilePage should show error message when user is not found",
- "ProfilePage should handle follow button click",
- "ProfilePage should render stars based on score",
- "Post Component renders the Post component",
- "Post Component displays the like count correctly",
- "Post Component handles like toggle correctly",
- "Post Component displays unlike button if post is already liked",
- "Post Component handles unlike toggle correctly",
- "Post Component renders user's score correctly",
- "Post Component handles API error on like action",
- "LeaderBoard should render loading message when data is fetching",
- "LeaderBoard should render error message when API fails",
- "LeaderBoard should display leaderboards when data is fetched",
- "LeaderBoard should render correct number of stars for valid ratings",
- "LeaderBoard should not render stars for invalid ratings",
- "Feed component renders posts successfully from API",
- "Feed component displays an error message if fetching posts fails",
- "Feed component displays error message if server returns non-200 status",
- "Feed component displays \"No posts found\" when no posts are available",
- "Feed component renders posts with correct data",
- "ExerciseProgram Component renders ExerciseProgram component correctly",
- "ExerciseProgram Component submits rating and updates the UI",
- "ExerciseProgram Component calls onDelete function when Remove Program button is clicked",
- "ExerciseProgram Component handles API errors gracefully when submitting rating"

#### Additional information:
When a team member from frontend team left the project, I took on additional responsibilities to help cover the extra workload, ensuring that the project remained on track and deadlines were met. I remained actively involved in all aspects of the project, attending every lab session, meeting, and lecture. I created the scenario to present in customer demo with my teammates and presented the demo of our project.

</details>

<details>
<summary>Member: Bilge Kaan Güneyli (Backend)</summary>

#### Responsibilities: 
In this milestone, I had three main responsibilities which are backend for the meal component,  advanced search, exercise creation and deployment. Among these creating the whole meal component was the biggest one. In case of search, I updated the existing search endpoint in order to add filters of advanced search feature. I was also responsible for the theoretical design of this part. In the third part, I created the super member logic and the exercise creation privilege of it.  After the implementation, I created the unit tests and documentation of the endpoints. I was also responsible for deploying the project when the we needed to test the implemented features in the deployed environment.

#### Main contributions:

In the code-related part of the project, I created the meal component and all the related functionalities in backend. For this component, I implemented 11 endpoints covering creation, deletion, getting and interaction features. I also handled the integration of Edamam Nutritional Analysis API in this part. My second code-related task was upgrading the search functionality of our project and adding domain-specific filters so that it can be considered as semantic/advanced search. I also tested these endpoints and cooperated with the front-end team to fix bugs and make changes based on the needs of the project. Third code-related contribution of mine was adapting the super-member feature to the fitness part of the project. This was already handled by me in the diet side. In case of fitness, I created the exercise creation feature. In addition, I created the models, unit tests and API documentations for these parts of the project. Lastly, I was active in fixing bugs in backend which were reported by other teams.

In the management part of the project, I attended all the meetings and labs and participated actively in each of them. I also contributed to the project as I designed the flow of meal creation (partly) and the advanced search processes. My other contributions were constantly being in communication with other teams to bypass communication overheads and creating the API endpoints part in the milestone report.

##### Code-Related Significant Issues:

- [#553](https://github.com/bounswe/bounswe2024group4/issues/553) Implement Meal Feature in Backend
- [#581](https://github.com/bounswe/bounswe2024group4/issues/581) Enhance the Search with Filters
- [#586](https://github.com/bounswe/bounswe2024group4/issues/586) Fix Leaderboard Profile Picture Display Bug

##### Management-Related Significant Issues:
- [#628](https://github.com/bounswe/bounswe2024group4/issues/628) Update the Requirements
- [#631](https://github.com/bounswe/bounswe2024group4/issues/631) Create the API Endpoints Part of Milestone Report

#### Pull Requests:
- [#557](https://github.com/bounswe/bounswe2024group4/pull/557) implement exercise creation
- [#552](https://github.com/bounswe/bounswe2024group4/pull/552) [#556](https://github.com/bounswe/bounswe2024group4/pull/556) [#571](https://github.com/bounswe/bounswe2024group4/pull/571) implement meals
- [#579](https://github.com/bounswe/bounswe2024group4/pull/579) [#580](https://github.com/bounswe/bounswe2024group4/pull/580) implement advanced search
- [#521](https://github.com/bounswe/bounswe2024group4/pull/521) [#587](https://github.com/bounswe/bounswe2024group4/pull/587)
 [#607](https://github.com/bounswe/bounswe2024group4/pull/607)
[#608](https://github.com/bounswe/bounswe2024group4/pull/608) [#609](https://github.com/bounswe/bounswe2024group4/pull/609) [#611](https://github.com/bounswe/bounswe2024group4/pull/611)  bug fixes
- [#584](https://github.com/bounswe/bounswe2024group4/pull/584) [#606](https://github.com/bounswe/bounswe2024group4/pull/606) [#622](https://github.com/bounswe/bounswe2024group4/pull/622) [#626](https://github.com/bounswe/bounswe2024group4/pull/626) small updates

#### Unit Tests:
I implemented the following unit tests for backend
```
test_create_food_all_api (diet_program_app.tests.TestCreateMealFood.test_create_food_all_api) ... ok
test_create_food_all_api_mulitple_ingrdients (diet_program_app.tests.TestCreateMealFood.test_create_food_all_api_mulitple_ingrdients) ... ok
test_create_food_all_fail (diet_program_app.tests.TestCreateMealFood.test_create_food_all_fail) ... ok
test_create_food_superuser (diet_program_app.tests.TestCreateMealFood.test_create_food_superuser) ... ok
test_create_food_superuser_not_super (diet_program_app.tests.TestCreateMealFood.test_create_food_superuser_not_super) ... ok
test_create_food_superuser_use_in_meal (diet_program_app.tests.TestCreateMealFood.test_create_food_superuser_use_in_meal) ... ok
test_create_meal (diet_program_app.tests.TestCreateMealFood.test_create_meal) ... ok
test_four_toggle_bookmark_meal (diet_program_app.tests.TestMealFeatures.test_four_toggle_bookmark_meal) ... ok
test_one_toggle_bookmark_meal (diet_program_app.tests.TestMealFeatures.test_one_toggle_bookmark_meal) ... ok
test_rate_meal (diet_program_app.tests.TestMealFeatures.test_rate_meal) ... ok
test_rate_meal_become_super (diet_program_app.tests.TestMealFeatures.test_rate_meal_become_super) ... ok
test_rate_meal_with_score (diet_program_app.tests.TestMealFeatures.test_rate_meal_with_score) ... ok
test_three_toggle_bookmark_meal (diet_program_app.tests.TestMealFeatures.test_three_toggle_bookmark_meal) ... ok
test_two_toggle_bookmark_meal (diet_program_app.tests.TestMealFeatures.test_two_toggle_bookmark_meal) ... ok
test_delete_meal_by_id (diet_program_app.tests.TestMealFoodGettersAndDelete.test_delete_meal_by_id) ... ok
test_double_bookmark_test_get_bookmarked_meals (diet_program_app.tests.TestMealFoodGettersAndDelete.test_double_bookmark_test_get_bookmarked_meals) ... ok
test_get_bookmarked_meals (diet_program_app.tests.TestMealFoodGettersAndDelete.test_get_bookmarked_meals) ... ok
test_get_foodname_options (diet_program_app.tests.TestMealFoodGettersAndDelete.test_get_foodname_options) ... ok
test_get_meal_from_id (diet_program_app.tests.TestMealFoodGettersAndDelete.test_get_meal_from_id) ... ok
test_get_meals (diet_program_app.tests.TestMealFoodGettersAndDelete.test_get_meals) ... ok
test_create_exercise_invalid_data (exercise_program_app.tests.CreateExerciseSuperUserTestCase.test_create_exercise_invalid_data) ... ok
test_create_exercise_normal_user (exercise_program_app.tests.CreateExerciseSuperUserTestCase.test_create_exercise_normal_user) ... ok
test_create_exercise_superuser (exercise_program_app.tests.CreateExerciseSuperUserTestCase.test_create_exercise_superuser) ... ok
test_workout_program (exercise_program_app.tests.WorkoutProgramTestCase.test_workout_program) ... ok
test_rate_workout_with_score (exercise_program_app.tests.WorkoutTests.test_rate_workout_with_score) ... ok
test_edit_profile (profiles_app.tests.TestProfile.test_edit_profile) ... ok
test_view_profile_not_found (profiles_app.tests.TestProfile.test_view_profile_not_found) ... ok
test_view_profile_other_user (profiles_app.tests.TestProfile.test_view_profile_other_user) ... ok
test_view_profile_yourself (profiles_app.tests.TestProfile.test_view_profile_yourself) ... ok
test_search_meals_with_calorie_filter (search_app.tests.AdvancedSearchTests.test_search_meals_with_calorie_filter) ... ok
test_search_multiple_categories (search_app.tests.AdvancedSearchTests.test_search_multiple_categories) ... ok
test_search_multiple_filters (search_app.tests.AdvancedSearchTests.test_search_multiple_filters) ... ok
test_search_multiple_muscles (search_app.tests.AdvancedSearchTests.test_search_multiple_muscles) ... ok
test_search_super_member_users (search_app.tests.AdvancedSearchTests.test_search_super_member_users) ... ok
test_search_users_filter (search_app.tests.AdvancedSearchTests.test_search_users_filter) ... ok
test_search_workouts_with_muscle_filter (search_app.tests.AdvancedSearchTests.test_search_workouts_with_muscle_filter) ... ok
test_follow (simple_features_app.tests.TestFollowUnfollow.test_follow) ... ok
test_follow_already_following (simple_features_app.tests.TestFollowUnfollow.test_follow_already_following) ... ok
test_follow_nonexistent_user (simple_features_app.tests.TestFollowUnfollow.test_follow_nonexistent_user) ... ok
test_follow_yourself (simple_features_app.tests.TestFollowUnfollow.test_follow_yourself) ... ok
test_unfollow (simple_features_app.tests.TestFollowUnfollow.test_unfollow) ... ok
test_unfollow_nonexistent_user (simple_features_app.tests.TestFollowUnfollow.test_unfollow_nonexistent_user) ... ok
test_unfollow_not_following (simple_features_app.tests.TestFollowUnfollow.test_unfollow_not_following) ... ok
test_unfollow_yourself (simple_features_app.tests.TestFollowUnfollow.test_unfollow_yourself) ... ok
test_get_leaderboard (simple_features_app.tests.TestLeaderboard.test_get_leaderboard) ... ok
test_get_meal_leaderboard (simple_features_app.tests.TestLeaderboard.test_get_meal_leaderboard) ... ok
test_get_workout_leaderboard (simple_features_app.tests.TestLeaderboard.test_get_workout_leaderboard) ... ok
```
#### Additional Information:

In case of communication, I was very active in this milestone as I took responsibility in all the meetings and labs, also since I was responsible for the requirements and some of the most important features like meal and semantic search, I had comprehensive knowledge about the desired state of the project. 

</details>


<details>
<summary>Member: Murat Can Kocakulak</summary>
Responsibilities: 
For this milestone I have mainly worked on Workout Log addition and Activity Stream implementation. Activity Stream implementation was a bigger topic than I thought because it included finding a new database in order to integrate the data in json format. For this task, I have found a nosql database and learned the requirements and implementation process of it to our code. Because we have always worked with mysql, It was hard at first to get used to a new database and its implementation but after learning its proper way I have managed to write the required functions and loggings inside the code. Afterward I have updated the ReadMe so that this new db additions can be used on all my teammates local environments. Besides that, I have also actively worked on retaining necessary postman inputs work all of the view functions inside backend and tested them from my console if they get a valid output. I have also helped Kaan deploy the project which is compatible with the new firebase database implementation.


#### Main contributions:
In the code related part, my contributions to the project’s code base focused on implementing critical functionalities that adhere to W3C Activity Streams standards and improving workout tracking features. These include:
1. Activity Stream Implementation
    * Integrated W3C Activity Streams into the project using Firebase Firestore.
    * Designed and implemented structured JSON-based activity logs for core functionalities such as:
        * Workout Creation
        * Workout Logging
        * Meal Creation
    * Ensured the @context field points to the W3C Activity Streams namespace, aligning with global standards 
2. Workout Logging Feature
    * Implemented functionality for users to log their workouts, capturing key data such as:
        * Date of the workout
        * Exercises performed (name, muscle group, type)
        * Performance details (sets, repetitions, and weight for each exercise)
    * Ensured data is stored and retrieved efficiently from Firestore, allowing users to track progress. 

For the management-related significant issues part, I played an active role in managing and coordinating project efforts, ensuring effective teamwork and smooth progress. My contributions include:
1. Executive Summary Creation
    * Wrote the Executive Summary for the final project report, summarizing the project status, deliverables, and improvements made during development.
    * Highlighted lessons learned and provided insights on alternative approaches to improve the process.
2. Meeting Participation and Communication
    * Attended all project meetings, actively contributing to discussions and decisions regarding milestones and deliverables.
    * Facilitated communication between team members, ensuring everyone remained aligned on project goals and responsibilities.
3. Task Coordination
    * Assisted in dividing tasks among team members for both frontend and backend development.
    * Monitored progress and ensured that all deadlines were met efficiently.
4. Collaboration and Problem-Solving
    * Collaborated with teammates to resolve issues and blockers, particularly around integrating W3C standards and logging features.
    * Provided feedback and supported team members throughout the development cycle.


##### Code-Related Significant Issues:

- [#634](https://github.com/bounswe/bounswe2024group4/issues/634) Implementing Activity Stream logging and getting logs
- [#636](https://github.com/bounswe/bounswe2024group4/issues/636) Implement Workout Logging with needed fields

##### Management-Related Significant Issues:
- [#512](https://github.com/bounswe/bounswe2024group4/issues/512) Add the planning part of the report
- [#635](https://github.com/bounswe/bounswe2024group4/issues/635) Creating executive summary part

#### Pull Requests:
I have done all my adjustments on two pull requests:

- [#559](https://github.com/bounswe/bounswe2024group4/pull/559) 
*readme updated with firestore credentials
*requirements updated for firestore and google operations
*minor bug on delete workout fixed
*Activity stream added same way to workout log and create meal
*dockercompse updated with firebase credentials
*activity stream removed
*workout log field additions and modifications
*final modifications for competence with other prs

- [#637](https://github.com/bounswe/bounswe2024group4/pull/637) 
*tests implemented for activity streams and workout logs


#### Unit Tests:
I implemented following unit tests for backend:
test_workout_log_invalid_date (exercise_program_app.tests.WorkoutLogTestCase) ... ok
test_workout_log_invalid_exercise (exercise_program_app.tests.WorkoutLogTestCase) ... ok
test_workout_log_no_exercises (exercise_program_app.tests.WorkoutLogTestCase) ... ok
test_workout_log_success (exercise_program_app.tests.WorkoutLogTestCase) ... ok
test_get_workout_activities_failure (exercise_program_app.tests.GetWorkoutActivitiesTestCase)
Test workout activities retrieval with Firestore error ... ok
test_get_workout_activities_no_data (exercise_program_app.tests.GetWorkoutActivitiesTestCase)
Test workout activities retrieval with no data ... ok
test_get_workout_activities_success (exercise_program_app.tests.GetWorkoutActivitiesTestCase)
Test successful retrieval of workout activities ... ok
test_get_workout_log_activities_failure (exercise_program_app.tests.GetWorkoutLogActivitiesTestCase)
Test workout log activities retrieval with Firestore error ... ok
test_get_workout_log_activities_no_data (exercise_program_app.tests.GetWorkoutLogActivitiesTestCase)
Test workout log activities retrieval with no data ... ok
test_get_workout_log_activities_success (exercise_program_app.tests.GetWorkoutLogActivitiesTestCase)
Test successful retrieval of workout log activities ... ok
test_get_meal_activities_failure (diet_program_app.tests.GetMealActivitiesTestCase)
Test meal activities retrieval with Firestore error ... ok
test_get_meal_activities_no_data (diet_program_app.tests.GetMealActivitiesTestCase)
Test meal activities retrieval with no data ... ok
test_get_meal_activities_success (diet_program_app.tests.GetMealActivitiesTestCase)
Test successful retrieval of meal activities ... ok

#### Additional Information:

My contributions included implementing critical features such as Activity Streams and Workout Logging while adhering to W3C standards. On the management side, I prepared the Executive Summary, actively participated in meetings, and ensured effective communication and collaboration among team members. I took responsibility for implementing a new database and learning its environment in order to achieve a nice functionality in our app. I also actively worked on keeping the functionality of the backend and kept in touch with my teammates Talha and Kaan on backend, also with Buse on frontend


</details>

<details>
<summary>Member: Nurullah Uçan (Mobile)</summary>

#### Responsibilities:
The primary responsibilities include ensuring the integration of the application with the backend and implementing this integration in assigned sections such as Weekly Program and Profile. Additionally, assisting with incomplete parts and improving them to contribute to the overall functionality of the project is a key duty. Writing and maintaining unit tests to validate the reliability and accuracy of implemented features is another important aspect of the role. Providing additional support where needed during the development process, making enhancements to improve the overall functionality of the application, and contributing to team efforts are also significant responsibilities.Furthermore, Preparing the milestone report involves completing the assigned section and documenting progress.

#### Main contributions:
I integrated backend functionalities into key application components such as Weekly Program and Profile. For the Weekly Program component, I added features like adding and removing workout programs as well as viewing summaries of the last 5 weeks. Additionally, I contributed to the development of the Discover Page to display dynamic activity streams and implemented the Feed Screen (within profiles) to enable users to share and view posts.

I developed a dedicated Bookmark Screen to help users efficiently manage and view their saved content. For the Edit Profile Page, I completed backend integration, allowing users to update their profiles effortlessly. Furthermore, I wrote unit tests for components such as Weekly Program and Edit Profile Screen, ensuring functionality and maintaining code reliability.

I also supported other areas of the application, contributing to the overall development process. Throughout the project, I worked on various sections and collaborated with my teammates to address and resolve issues effectively.
The milestone report has been prepared, covering progress based on teamwork, status of requirements, user interface and experience, and standards compliance.

#### Code-related significant issues:
- [#526](https://github.com/bounswe/bounswe2024group4/issues/526) Backend integration for profile workout section
- [#532](https://github.com/bounswe/bounswe2024group4/issues/532) Implement Add and Remove Program Functionality in Weekly Program 
- [#562](https://github.com/bounswe/bounswe2024group4/issues/562) Enhance Weekly Program and Daily Exercise Management with Last 5 Weekly View
- [#567](https://github.com/bounswe/bounswe2024group4/issues/567) Backend Integration for Edit Profile Page (Mobile)
- [#582](https://github.com/bounswe/bounswe2024group4/issues/582) Add unit test for WeeklyProgram on mobile
- [#594](https://github.com/bounswe/bounswe2024group4/issues/594) Implement Discover Page for Activity Streams in Mobile
- [#612](https://github.com/bounswe/bounswe2024group4/issues/612) Display Bookmarked Posts in a Separate Screen
- [#616](https://github.com/bounswe/bounswe2024group4/issues/616) Implement Feed Screen to Display Posts

#### Non-code-related significant issues:
- [#632](https://github.com/bounswe/bounswe2024group4/issues/632) Prepare "Progress Based on Teamwork" Section for Milestone Report

#### Pull requests:
-  [#527](https://github.com/bounswe/bounswe2024group4/pull/527) Integrate profile workout section with backend
- [#533](https://github.com/bounswe/bounswe2024group4/pull/533) Add and Remove Program Functionality in WeeklyProgram
- [#570](https://github.com/bounswe/bounswe2024group4/pull/570) Enhance Profile Screens with Backend Integration and Improved UI 
- [#593](https://github.com/bounswe/bounswe2024group4/pull/593) Enhance WeeklyProgram Component with Unit Tests and Validation
- [#605](https://github.com/bounswe/bounswe2024group4/pull/605) Improved Discover screen with activity fetching and bug fixes
- [#613](https://github.com/bounswe/bounswe2024group4/pull/613) Added BookmarkScreen to display bookmarked posts
- [#617](https://github.com/bounswe/bounswe2024group4/pull/617) Implement FeedScreen Component for Rendering User Posts

#### Unit Tests
* [EditProfileScreen-test.tsx](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/__tests__/EditProfileScreen-test.tsx)
Ensures the "Edit Profile" screen renders correctly with all input fields and buttons. Validates email format, password matching, and input values for weight and height, showing appropriate error messages for invalid data. 
<img width="589" alt="Ekran Resmi 2024-12-20 10 21 20" src="https://github.com/user-attachments/assets/4f6cc9fe-78fd-40ff-8985-c28cc1c878b9" />

* [weekly-test.tsx](https://github.com/bounswe/bounswe2024group4/blob/main/mobile/__tests__/weekly-test.tsx)
Tests the functionality of rendering weekly programs, including loading spinner and days of the week. Verifies adding, removing, and saving programs to specific days, as well as modal interactions like program selection and closing.
<img width="458" alt="Ekran Resmi 2024-12-20 10 22 23" src="https://github.com/user-attachments/assets/01c8d602-729e-4c44-9411-b5454c890032" />


#### Additional information:

</details>

<details>
<summary>Member: Talha Ordukaya (Backend)</summary>

#### Responsibilities: 
In this milestone, I had three main responsibilities: resolving authentication issues, implementing backend search functionality, and adding delete and edit operations for posts and meals. Among these, fixing authentication problems was a critical task as it involved addressing issues where all endpoints required a token, even when it was unnecessary. I ensured proper configuration so that token validation was enforced only where needed, enhancing both security and usability. For search, I implemented new endpoints that allowed users to search for posts, meals, workouts, and other users effectively. Additionally, I developed delete endpoints for posts and comments, enabling users to manage their content, and added edit functionality for meal-related endpoints, providing flexibility for updates. Beyond these, I focused on improving code quality by writing comprehensive unit tests for various endpoints and updating the Swagger documentation to ensure clarity for team members and future development. These tasks collectively strengthened the backend functionality and ensured smooth integration with frontend and mobile components.

#### Main contributions:

In the code-related part of the project, I resolved critical authentication issues that affected all endpoints requiring a token, ensuring token validation was applied only where necessary. This involved debugging and updating the backend logic to improve both security and usability across the platform. My second major task was implementing the search functionality, where I created endpoints to allow users to search for posts, meals, workouts, and other users. This included designing the search logic and ensuring efficient query handling to return accurate results. Additionally, I added delete and edit functionalities for posts and meal-related endpoints. I also wrote extensive unit tests for all my endpoints, including those related to feed, authentication, search, posts, and workouts, to ensure code quality and reliability. Furthermore, I updated the Swagger documentation for these endpoints, making them easier to understand and integrate.

In the management part of the project, I actively participated in team meetings and contributed to discussions on task allocation and resolving technical blockers. I collaborated with frontend and mobile teams to ensure smooth integration of backend APIs and addressed any issues that arose during development. Additionally, I supported the milestone reporting process by documenting the functionalities I implemented and providing technical insights for the group report.

##### Code-Related Significant Issues:

- [#520](https://github.com/bounswe/bounswe2024group4/issues/520) Solved authentication problems by fixing bugs in the login and signup flows.
- [#563](https://github.com/bounswe/bounswe2024group4/issues/563) Implemented search functionality in the backend, covering users, posts, meals, and workouts.
- [#565](https://github.com/bounswe/bounswe2024group4/issues/565) Added delete endpoints for posts and comments, enabling users to manage their content.
- [#568](https://github.com/bounswe/bounswe2024group4/issues/568)  Implemented edit functionality for meal-related endpoints.
- [#575](https://github.com/bounswe/bounswe2024group4/issues/575) Added unit tests for various endpoints, ensuring code quality and reliability.
- [#577](https://github.com/bounswe/bounswe2024group4/issues/577) Updated Swagger documentation for feed, auth, search, post, and workout endpoints.

##### Non-Code-Related Significant Issues:
- [#632](https://github.com/bounswe/bounswe2024group4/issues/632) Prepared standards part in "Progress Based on Teamwork" Section for Milestone Report
- [#638](https://github.com/bounswe/bounswe2024group4/issues/638) Contributed to the milestone report by documenting individual contributions.

#### Pull Requests:
- [#529](https://github.com/bounswe/bounswe2024group4/pull/529) Fixed authentication issues and enhanced session handling.
- [#564](https://github.com/bounswe/bounswe2024group4/pull/564) Added an endpoint to search users, posts, meals, and workouts.
- [#569](https://github.com/bounswe/bounswe2024group4/pull/569) Added meal-related endpoints for delete and edit operations.
- [#573](https://github.com/bounswe/bounswe2024group4/pull/573) Added delete post and comment endpoints.
- [#576](https://github.com/bounswe/bounswe2024group4/pull/576) Wrote unit tests for feed, auth, search, post, and workout endpoints.
- [#578](https://github.com/bounswe/bounswe2024group4/pull/578) Added Swagger documentation for all related endpoints.

#### Unit Tests:
I implemented the following unit tests for backend
```
test_rate_workout_success (exercise_program_app.tests.WorkoutTests.test_rate_workout_success)
Test successful workout rating ... ok
test_rate_workout_with_score (exercise_program_app.tests.WorkoutTests.test_rate_workout_with_score)
Test rating workout with score ... ok
test_toggle_bookmark_nonexistent_workout (exercise_program_app.tests.WorkoutTests.test_toggle_bookmark_nonexistent_workout)
Test bookmarking nonexistent workout ... ok
test_toggle_bookmark_workout_success (exercise_program_app.tests.WorkoutTests.test_toggle_bookmark_workout_success)
Test bookmarking and unbookmarking workout ... ok
test_unauthorized_requests (exercise_program_app.tests.WorkoutTests.test_unauthorized_requests)
Test endpoints without authentication ... ok
test_bookmarked_posts (posts_app.tests.PostsTests.test_bookmarked_posts)
Test getting bookmarked posts ... ok
test_comment_missing_content (posts_app.tests.PostsTests.test_comment_missing_content)
Test comment creation without content ... ok
test_comment_success (posts_app.tests.PostsTests.test_comment_success)
Test successful comment creation ... ok
test_create_post_missing_content (posts_app.tests.PostsTests.test_create_post_missing_content)
Test post creation without content ... ok
test_create_post_success (posts_app.tests.PostsTests.test_create_post_success)
Test successful post creation ... ok
test_create_post_with_invalid_workout (posts_app.tests.PostsTests.test_create_post_with_invalid_workout)
Test creating post with nonexistent workout ... ok
test_create_post_with_meal (posts_app.tests.PostsTests.test_create_post_with_meal)
Test creating post with meal reference ... ok
test_create_post_with_workout (posts_app.tests.PostsTests.test_create_post_with_workout)
Test creating post with workout reference ... ok
test_liked_posts (posts_app.tests.PostsTests.test_liked_posts)
Test getting liked posts ... ok
test_toggle_bookmark_success (posts_app.tests.PostsTests.test_toggle_bookmark_success)
Test successful bookmark toggle ... ok
test_toggle_like_nonexistent_post (posts_app.tests.PostsTests.test_toggle_like_nonexistent_post)
Test liking nonexistent post ... ok
test_toggle_like_success (posts_app.tests.PostsTests.test_toggle_like_success)
Test successful like toggle ... ok
test_unauthorized_requests (posts_app.tests.PostsTests.test_unauthorized_requests)
Test endpoints without authentication ... ok
test_search_all (search_app.tests.SearchTests.test_search_all)
Test search across all content types ... ok
test_search_case_insensitive (search_app.tests.SearchTests.test_search_case_insensitive)
Test case-insensitive search ... ok
test_search_invalid_type (search_app.tests.SearchTests.test_search_invalid_type)
Test search with invalid category parameter ... ok
test_search_meals (search_app.tests.SearchTests.test_search_meals)
Test search meals only ... ok
test_search_missing_query (search_app.tests.SearchTests.test_search_missing_query)
Test search without query parameter ... ok
test_search_no_results (search_app.tests.SearchTests.test_search_no_results)
Test search with no matching results ... ok
test_search_posts (search_app.tests.SearchTests.test_search_posts)
Test search posts only ... ok
test_search_unauthorized (search_app.tests.SearchTests.test_search_unauthorized)
Test search without authentication ... ok
test_search_users (search_app.tests.SearchTests.test_search_users)
Test search users only ... ok
test_search_workouts (search_app.tests.SearchTests.test_search_workouts)
Test search workouts only ... ok
test_feed_invalid_method (social_feed_app.tests.FeedViewTestCase.test_feed_invalid_method) ... ok
test_feed_success (social_feed_app.tests.FeedViewTestCase.test_feed_success) ... ok
test_feed_unauthorized (social_feed_app.tests.FeedViewTestCase.test_feed_unauthorized) ... ok
test_following_feed_invalid_method (social_feed_app.tests.FollowingFeedViewTestCase.test_following_feed_invalid_method) ... ok
test_following_feed_success (social_feed_app.tests.FollowingFeedViewTestCase.test_following_feed_success) ... ok
test_following_feed_unauthorized (social_feed_app.tests.FollowingFeedViewTestCase.test_following_feed_unauthorized) ... ok
test_csrf_token (user_auth_app.tests.AuthenticationTests.test_csrf_token)
Test CSRF token endpoint ... ok
test_csrf_token_wrong_method (user_auth_app.tests.AuthenticationTests.test_csrf_token_wrong_method)
Test CSRF token endpoint with wrong HTTP method ... ok
test_login_nonexistent_user (user_auth_app.tests.AuthenticationTests.test_login_nonexistent_user)
Test login with non-existent user ... ok
test_login_success (user_auth_app.tests.AuthenticationTests.test_login_success)
Test successful login ... ok
test_login_wrong_password (user_auth_app.tests.AuthenticationTests.test_login_wrong_password)
Test login with wrong password ... ok
test_logout_success (user_auth_app.tests.AuthenticationTests.test_logout_success)
Test successful logout ... ok
test_logout_unauthorized (user_auth_app.tests.AuthenticationTests.test_logout_unauthorized)
Test logout without authentication ... ok
test_signup_duplicate_email (user_auth_app.tests.AuthenticationTests.test_signup_duplicate_email)
Test signup with existing email ... ok
test_signup_duplicate_username (user_auth_app.tests.AuthenticationTests.test_signup_duplicate_username)
Test signup with existing username ... ok
test_signup_missing_fields (user_auth_app.tests.AuthenticationTests.test_signup_missing_fields)
Test signup with missing required fields ... ok
test_signup_success (user_auth_app.tests.AuthenticationTests.test_signup_success)
Test successful user registration ... ok
```
#### Additional Information:



</details>

<details>

<summary> Member: Ceyhun Sonyürek (Mobile) </summary>

#### Responsibilities: 
In this milestone, my primary responsibility was to develop features on the mobile side that had pre-designed user interfaces and integrate them with the backend endpoints. Additionally, I was tasked with adjusting the mobile app's routing and the handling of tokens and parameters between pages to align with changes made to the backend endpoints, which were updated to address authentication-related issues. Beyond my own development tasks, I worked to ensure that all the features I implemented were compatible with the application and as error-free as possible. Furthermore, I reviewed the work done by my teammates, provided constructive feedback, and contributed to improving the overall quality of the project.

#### Main contributions:
First, I worked on updating the user interface for displaying workout programs fetched from the backend. Then, I implemented the functionality to retrieve exercises from the backend based on the selected muscle group during the exercise creation process. I also ensured that newly created workout programs were sent to the backend and saved in the database. After fully integrating the exercise section with the backend, I made adjustments to the mobile code to align with changes made to the backend endpoints to resolve authentication issues. Following this, I connected the section that displays user-created meal programs to the backend and designed the user interface for meal creation. Additionally, I updated the test written for the leaderboard to ensure it remained accurate and functional after recent changes. These contributions collectively improved the app’s functionality and user experience.

##### Code-Related Significant Issues:
- [#639](https://github.com/bounswe/bounswe2024group4/issues/639) Adding create workout feature to mobile
- [#640](https://github.com/bounswe/bounswe2024group4/issues/640) Update mobile according to backend authentication changes
- [#641](https://github.com/bounswe/bounswe2024group4/issues/641) Connect meal programs to backend on mobile
- [#642](https://github.com/bounswe/bounswe2024group4/issues/642) Update leaderboard unit test on mobile

##### Management-Related Significant Issues:
- [#635](https://github.com/bounswe/bounswe2024group4/issues/635) Creating executive summary part

#### Pull Requests:
- [#528](https://github.com/bounswe/bounswe2024group4/pull/528) Create workout programs on mobile
- [#546](https://github.com/bounswe/bounswe2024group4/pull/546) Mobile auth update
- [#618](https://github.com/bounswe/bounswe2024group4/pull/618) Connecting some meal features to backend
- [#624](https://github.com/bounswe/bounswe2024group4/pull/624) Leaderboard test update 

#### Unit Tests:
- __tests__/leaderboard-test.tsx

#### Additional Information:
Attended all labs, worked hard, implemented lots of codes and contributed to our strong teamwork. Also reviewed and gave feedback many pull requests developed by mobile team.


</details>

<details>
<summary> Member: Berat Yılmaz (Mobile) </summary>

#### Responsibilities: 

For this milestone I worked on adding post features to the mobile app, namely commenting, bookmarking and liking. Also reworked the workout component to improve its UI, fixed a bug related to storing workout programs, and added bookmarking and rating workout programs. Additionally, I added unit tests for the feed page. I also generated the APK file for the app for this milestone.

#### Main contributions:

##### Code-Related Significant Issues:

- [#531](https://github.com/bounswe/bounswe2024group4/issues/531) Implement post actions in mobile
- [#572](https://github.com/bounswe/bounswe2024group4/issues/572) Adding workouts while creating posts do not work properly
- [#591](https://github.com/bounswe/bounswe2024group4/issues/591) Add bookmarks page to mobile
- [#596](https://github.com/bounswe/bounswe2024group4/issues/596) Add rating functionality to workout program component
- [#602](https://github.com/bounswe/bounswe2024group4/issues/602) Add bookmarking to workout component

##### Management-Related Significant Issues:
- [#643](https://github.com/bounswe/bounswe2024group4/issues/643) Writing system manual for the final milestone report

#### Pull Requests:
- [#590](https://github.com/bounswe/bounswe2024group4/pull/590)  Add post actions to mobile
- [#599](https://github.com/bounswe/bounswe2024group4/pull/590)  Fix workout save bug
- [#603](https://github.com/bounswe/bounswe2024group4/pull/603)  Add bookmarking and rating workout programs
- [#621](https://github.com/bounswe/bounswe2024group4/pull/621)  Add bookmarking and rating workout programs

#### Reviewed Pull Requests
- [#533](https://github.com/bounswe/bounswe2024group4/pull/533)  Add and Remove Program Functionality in WeeklyProgram
- [#570](https://github.com/bounswe/bounswe2024group4/pull/570)  Enhance Profile Screens with Backend Integration and Improved UI
- [#593](https://github.com/bounswe/bounswe2024group4/pull/593)  Enhance WeeklyProgram Component with Unit Tests and Validation
- [#617](https://github.com/bounswe/bounswe2024group4/pull/617)  Implement FeedScreen Component for Rendering User Posts
- [#618](https://github.com/bounswe/bounswe2024group4/pull/618)  Connecting some meal features to backend

#### Unit Tests:
For `index-test.tsx` which tests the feed page of the mobile app. I wrote the following unit tests.
```
renders loading state initially
renders feed header
loads and displays posts
handles authentication error
handles API error
stops polling when component unmounts
```
For `home-test.tsx` which tests the page that redirects to login and signup of the mobile app I wrote the following unit tests.
``` 
renders correctly 
navigates to login screen on Log In button press
 navigates to signup screen on Sign Up button press
```
</details>

<details>
<summary>Member: Ahmet Batuhan Canlı (Frontend)</summary>

#### Responsibilities:
As a member of the frontend team, my responsibilities include completing the workout logging feature and implementing a history to track past activities. I am also tasked with developing a bookmark feature for workouts, posts, and meals, enabling users to save content for quick access. Additionally, I am responsible for implementing comments on posts to enhance user engagement and creating an advanced search feature to improve content discoverability. Lastly, I am in charge of preparing the User Manual for the Milestone 3 report, which will serve as a comprehensive guide for users to navigate and utilize the platform effectively.

#### Main contributions:
As a member of the frontend team, I successfully implemented the commenting feature and the bookmark functionality for posts and workouts. Additionally, I completed writing the User Manual for the Milestone 3 report. Regarding the advanced search and workout history features, I made significant progress and, with Buse’s assistance, we were able to implement these functionalities effectively.

##### Code-related significant issues:
- [#515](https://github.com/bounswe/bounswe2024group4/issues/515) Workout logging and history 
- [#516](https://github.com/bounswe/bounswe2024group4/issues/516) Exercise program bookmarking and its page
- [#542](https://github.com/bounswe/bounswe2024group4/issues/542) Advanced Search
- [#543](https://github.com/bounswe/bounswe2024group4/issues/543) Comment
- [#544](https://github.com/bounswe/bounswe2024group4/issues/544) Post Bookmark 



##### Non-code-related significant issues:
- [#629](https://github.com/bounswe/bounswe2024group4/issues/629) Create User manual

#### Pull requests:
- [#610](https://github.com/bounswe/bounswe2024group4/pull/610) weekly program connection with backend, exercise logging and history
- [#604](https://github.com/bounswe/bounswe2024group4/pull/604) Advanced Search
- [#574](https://github.com/bounswe/bounswe2024group4/pull/574) Comment
- [#551](https://github.com/bounswe/bounswe2024group4/pull/551) Post Bookmark
- [#525](https://github.com/bounswe/bounswe2024group4/pull/525) Exercise Bookmark
- [#625](https://github.com/bounswe/bounswe2024group4/pull/625) Meal Bookmark


#### Unit Tests
- [#644](https://github.com/bounswe/bounswe2024group4/pull/644) Search Test

#### Additional information:
I actively participated in the planning phase of the project, playing a significant role in shaping its direction. Additionally, I took an active part in preparing the script for the presentation, ensuring it effectively conveyed our work and objectives.

</details>

## Manuals
### User Manual: 
[User Manual for Fitness and Diet Forum](https://github.com/bounswe/bounswe2024group4/wiki/User-Manual-for-Fitness-and-Diet-Forum)
### System Manual: 
#### System Requirements

We are using a 4 GB RAM 2 vCPU 80 GB disk space AMD machine on DigitalOcean, which is sufficient for the application to be run. While weaker machines can be enough for the application's regular operation, we found that the time necessary for frontend compilation significantly increases with a weaker machine, so we opted for this one.

#### Docker installation

Follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04) to install Docker on a DigitalOcean machine. 

#### Installing the app (backend and frontend)

Whole application can be run either with Docker compose or by running each component on its own. 

##### Docker compose approach

1) Install `docker compose` by following [this guide](https://docs.docker.com/compose/install/linux/#install-using-the-repository).

2) Set the `.env` file under root directory to 

```
DB_NAME=fitness_app
DB_USER=root
DB_PASSWORD=****
DB_HOST=localhost
DB_PORT=3306
EXERCISES_API_KEY=
EDAMAM_APP_ID=
EDAMAM_APP_KEY=
FIREBASE_TYPE="service_account"
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_UNIVERSE_DOMAIN="googleapis.com"
```

Set the .env file under `frontend` to:

```
REACT_APP_API_URL=127.0.0.1
```

3) Run `docker compose up`. 

##### Separate components approach

1) Set the .env files in the same manner as step 2 of `Docker compose approach`.
2) Follow through the backend's [`README`](https://github.com/bounswe/bounswe2024group4/blob/main/backend/README.md) to run the backend.
3) Follow through the frontend's [`README`](https://github.com/bounswe/bounswe2024group4/blob/main/frontend/fitness-diet-forum/README.md) to run frontend.

Frontend will be up at `http://127.0.0.1:3000`.

##### Mobile

1) Set the .env file under `mobile` directory to 
```
EXPO_PUBLIC_API_URL=DEPLOY_URL
```
2) Run `npm install`.
3) Create an Android device in Android Studio. 
4) Run `npx expo start` and press `a` to run Android emulation on Android Studio.

#### Other Artifacts
- [Software Requirements Specification (SRS)](https://github.com/bounswe/bounswe2024group4/wiki/Requirements-Fitness-and-Diet-Forum)
- Software design documents
	- [Sequence Diagrams](https://github.com/bounswe/bounswe2024group4/wiki/Sequence-Diagrams:-Fitness-and-Diet-Forum)
	- [Class Diagram](https://github.com/bounswe/bounswe2024group4/wiki/Fitness-App-Class-Diagram)
	- [Use Case Diagrams](https://github.com/bounswe/bounswe2024group4/wiki/Use-Case-Diagrams:-Fitness-and-Diet-Forum)
- User scenarios and mockups
	- [Scenario 1](https://github.com/bounswe/bounswe2024group4/wiki/Scenario-1)
 	- [Scenario 2](https://github.com/bounswe/bounswe2024group4/wiki/Scenario-2)
  	- [Scenario 3](https://github.com/bounswe/bounswe2024group4/wiki/Scenario-3:-Posting-a-Diet-Program)
  	- [Scenario 4](https://github.com/bounswe/bounswe2024group4/wiki/Scenario-4:-Rating-Another-User's-Programs)
  	- [Scenario 5](https://github.com/bounswe/bounswe2024group4/wiki/Scenario-5:-Chatting-with-Another-User)
- [Project plan](https://github.com/orgs/bounswe/projects/76/views/4)
- Unit tests
	- [frontend](https://github.com/bounswe/bounswe2024group4/tree/main/frontend/fitness-diet-forum/src/__tests__)
 	- [mobile](https://github.com/bounswe/bounswe2024group4/tree/main/mobile/__tests__)
 	- backend: all the files with the name `test.py` under the path `backend/*_app`
