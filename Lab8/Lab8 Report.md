# 03.12.2024 Lab8 report

### Features to be Finalized for Final Milestone
- [ ] Post and Feed
- [ ] Meal
- [ ] Exercise
- [ ] Advanced Search
- [ ] Workout logs

### Primary Features
- [ ] Advanced Search
- [ ] Feed and Posts
- [ ] Follow/unfollow
- [ ] Login/logout
- [ ] Bookmarking
- [ ] Comment
- [ ] Like

### Domain-specific features
- [ ] Meal and Exercise Management
* Unlike generic apps, this system integrates both meal and exercises to well-being.
* Users create meals and exercise programs. They can then share them within posts, or they can display each others' programs.

- [ ] Exercise Tracking
* Exercise tracking is crucial for monitoring progress and maintaining accountability, which are central to fitness-focused applications.
* The app logs workouts, including number of repetitions, sets, and weight, using user inputs. This data is available to users for them to see their progress.

- [ ] Leaderboard
* Leaderboards promote community engagement and motivate users through gamification, leveraging friendly competition to encourage consistency in workouts and diet.
* User exercise and meal programs are rated by other users. Scores are aggregated and ranked in real time using a leaderboard algorithm, with data stored in MySQL database.

- [ ] Super-User and Regular User Discrimination
* This feature distinguishes super users (e.g., trainers or coaches) from regular users, enabling tailored functionalities like creating exercise for others.
* The user roles are determined based on user ratings. Super-users access more functionalities, while regular users have standard functionality.

- [ ] Rating System
* A rating system allows users to provide feedback on workouts, meals, fostering user-driven content improvement and enhancing community trust.
* Users rate content with a score. Ratings are aggregated, and displayed dynamically, using a scoring algorithm.

### API and its Documentation

### Standart Being Followed
We will follow the Activity Streams standard of W3C.
- [ ] Find a NoSQL database to hold the information
- [ ] Data format should be JSON
- [ ] Log the profile views from view_profile endpoint
- [ ] Log the post deletions from delete_post endpoint
- [ ] Log the comment deletions from delete_comment endpoint

### Testing Strategies
#### Development Phase:
- [ ] Backend: Postman and HTML templates to test the requests and responses
- [ ] Frontend: Directly in the browser or local development environment, where UI and the behavior of components are observed.
- [ ] Mobile: Within the mobile app on simulator or emulator. The focus is on observing how UI is and components react.
#### Integration Phase:
Backend
- [ ] Unit tests to check the endpoints in a more comprehensive manner
- [ ] Test the integrated front-end on a local machine
Frontend
- [ ] Unit tests to validate the functionality of individual frontend components, ensuring each part works as expected in isolation.
- [ ] Test the integrated frontend on a local machine to check the overall UI and interactions, ensuring everything functions correctly when connected to the backend.
Mobile
- [ ] Implement unit tests to validate the logic and behavior of mobile components, checking each feature individually.
- [ ] Test the mobile app on a simulator or emulator to ensure the UI and features work as expected, focusing on responsiveness, navigation, and data interactions.
#### After Deployment:
Apply and report end-to-end, user tests covering all features to make sure that everything is working correctly.
User tests that cover the following features will be created:
- [ ] Exercise creation
- [ ] Meal creation
- [ ] Sign-up/Login
- [ ] Follow/unfollow
- [ ] Create Post
- [ ] Like Post
- [ ] Search
- [ ] Edit Profile
- [ ] Comment
- [ ] Bookmark/Unbookmark
- [ ] See Others' Profile
- [ ] Leaderboard
- [ ] Rating an exercise/meal
- [ ] Comment
