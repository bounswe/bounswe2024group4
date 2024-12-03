# 03.12.2024 Lab8 report

### Features to be Finalized for Final Milestone
* Post and Feed
* Meal
* Advanced Search
* Workout logs

### Primary Features
* Advanced Search
* Feed and Posts
* Follow/unfollow
* Login/logout
* Bookmarking
* Comment
* Like

### Domain-specific features
#### Meal and Exercise Management
* Unlike generic apps, this system integrates both meal and exercises to well-being.
* Users create meals and exercise programs. They can then share them within posts, or they can display each others' programs.

#### Exercise Tracking
* Exercise tracking is crucial for monitoring progress and maintaining accountability, which are central to fitness-focused applications.
* The app logs workouts, including number of repetitions, sets, and weight, using user inputs. This data is available to users for them to see their progress.

#### Leaderboard
* Leaderboards promote community engagement and motivate users through gamification, leveraging friendly competition to encourage consistency in workouts and diet.
* User exercise and meal programs are rated by other users. Scores are aggregated and ranked in real time using a leaderboard algorithm, with data stored in MySQL database.

#### Super-User and Regular User Discrimination
* This feature distinguishes super users (e.g., trainers or coaches) from regular users, enabling tailored functionalities like creating exercise for others.
* The user roles are determined based on user ratings. Super-users access more functionalities, while regular users have standard functionality.

#### Rating System
* A rating system allows users to provide feedback on workouts, meals, fostering user-driven content improvement and enhancing community trust.
* Users rate content with a score. Ratings are aggregated, and displayed dynamically, using a scoring algorithm.