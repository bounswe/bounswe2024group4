from drf_yasg import openapi

edit_profile_schema = {
    'operation_summary': 'Edit Profile',
    'operation_description': 'Edit the profile of the authenticated user',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'email': openapi.Schema(type=openapi.TYPE_STRING),
            'bio': openapi.Schema(type=openapi.TYPE_STRING),
            'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, format='url', description='URL of the profile picture'),
            'weight': openapi.Schema(type=openapi.TYPE_NUMBER),
            'height': openapi.Schema(type=openapi.TYPE_NUMBER),
            'password': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ),
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
    }
}

view_profile_schema = {
    'operation_summary': 'View Profile',
    'operation_description': 'View the profile of a user',
    'responses': {
            200: openapi.Response('Success', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'username': openapi.Schema(type=openapi.TYPE_STRING),
                    'email': openapi.Schema(type=openapi.TYPE_STRING),
                    'bio': openapi.Schema(type=openapi.TYPE_STRING),
                    'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, format='url', description='URL of the profile picture'),
                    'score': openapi.Schema(type=openapi.TYPE_INTEGER),
                    # 'weight': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'weight_history': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'weight': openapi.Schema(type=openapi.TYPE_NUMBER),
                            'date': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                        }
                    )),
                    'height': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'following_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'followers_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'is_following': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='True if the authenticated user is following the user, False otherwise, None if the authenticated user is the user'),
                    'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        }
                    )),
                    'workouts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'workout_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        }
                    )),
                    # 'meals': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                }
            )),
            401: openapi.Response('Unauthorized'),
            404: openapi.Response('Not Found'),
        }
    }

follow_schema = {
    'operation_summary': 'Follow User',
    'operation_description': 'Follow a user',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'following': openapi.Schema(type=openapi.TYPE_STRING, description='Username of the user to follow'),
        }
    ),
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
        404: openapi.Response('Not Found'),
    }
}

unfollow_schema = {
    'operation_summary': 'Unfollow User',
    'operation_description': 'Unfollow a user',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'following': openapi.Schema(type=openapi.TYPE_STRING, description='Username of the user to unfollow'),
        }
    ),
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
        404: openapi.Response('Not Found'),
    }
}

get_leaderboard_schema = {
    'operation_summary': 'Get Leaderboard',
    'operation_description': 'Get the leaderboard of users',
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'leaderboard': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'username': openapi.Schema(type=openapi.TYPE_STRING),
                            'score': openapi.Schema(type=openapi.TYPE_INTEGER),
                        }
                    )
                )
            }
        )),
        401: openapi.Response('Unauthorized'),
    }
}

get_workout_leaderboard_schema = {
    'operation_summary': 'Get Workout Leaderboard',
    'operation_description': 'Get the leaderboard of users based on workout ratings',
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'workout_leaderboard': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'username': openapi.Schema(type=openapi.TYPE_STRING),
                            'workout_rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                        }
                    )
                )
            }
        )),
        401: openapi.Response('Unauthorized'),
    }
}

get_meal_leaderboard_schema = {
    'operation_summary': 'Get Meal Leaderboard',
    'operation_description': 'Get the leaderboard of users based on meal ratings',
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'meal_leaderboard': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'username': openapi.Schema(type=openapi.TYPE_STRING),
                            'meal_rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                        }
                    )
                )
            }
        )),
        401: openapi.Response('Unauthorized'),
    }
}

get_exercises_schema = {
    'operation_summary': 'Get Exercises',
    'operation_description': 'Get a list of exercises',
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'exercise_name': openapi.Schema(type=openapi.TYPE_STRING),
                    'muscle': openapi.Schema(type=openapi.TYPE_STRING),
                    'equipment': openapi.Schema(type=openapi.TYPE_STRING),
                    'instruction': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )
        )),
        400: openapi.Response('Bad Request'),
        404: openapi.Response('Not Found'),
    }
}


user_programs_schema = {
    'operation_description': "Get all workout programs for the logged-in user",
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': {
                    'status': 'success',
                    'user': {
                        'id': 1,
                        'username': 'john_doe',
                        'email': 'john@example.com'
                    },
                    'programs': [
                        {
                            'program_id': 1,
                            'days_per_week': 3,
                            'created_at': '2024-03-18 10:30:00',
                            'workout_days': [
                                {
                                    'day': 'Monday',
                                    'workout': {
                                        'id': 1,
                                        'name': 'Upper Body Strength'
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized - User not logged in'
    },
    'tags': ['Programs']
}

user_workout_logs_schema = {
    'operation_description': "Get all workout logs for the logged-in user",
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': {
                    'status': 'success',
                    'user': {
                        'id': 1,
                        'username': 'john_doe',
                        'email': 'john@example.com'
                    },
                    'workout_logs': [
                        {
                            'log_id': 1,
                            'workout': {
                                'id': 1,
                                'name': 'Upper Body Strength'
                            },
                            'date_completed': '2024-03-18',
                            'created_at': '2024-03-18 10:30:00'
                        }
                    ]
                }
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized - User not logged in'
    },
    'tags': ['Workout Logs']
}

create_program_schema = {
    'operation_description': "Create a new weekly workout program",
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'workouts': openapi.Schema(
                type=openapi.TYPE_OBJECT,
                description="Dictionary of day numbers (0-6) and workout IDs",
                example={'0': 1, '2': 2, '4': 3}
            )
        },
        required=['workouts']
    ),
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': {
                    'status': 'success',
                    'program_id': 1,
                    'user': {
                        'id': 1,
                        'username': 'john_doe',
                        'email': 'john@example.com'
                    },
                    'days': [
                        {
                            'day': 'Monday',
                            'workout': {
                                'id': 1,
                                'name': 'Upper Body Strength'
                            }
                        }
                    ]
                }
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized - User not logged in'
    },
    'tags': ['Programs']
}

log_workout_schema = {
    'operation_description': "Log a completed workout",
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'workout_id': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description="ID of the completed workout"
            ),
            'date': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Date of completion (YYYY-MM-DD)",
                example="2024-03-18"
            )
        },
        required=['workout_id', 'date']
    ),
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': {
                    'status': 'success',
                    'log_id': 1,
                    'user': {
                        'id': 1,
                        'username': 'john_doe',
                        'email': 'john@example.com'
                    },
                    'workout': {
                        'id': 1,
                        'name': 'Upper Body Strength'
                    },
                    'date': '2024-03-18'
                }
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized - User not logged in'
    },
    'tags': ['Workout Logs']
}

feed_schema = {
    'operation_summary': 'Feed',
    'operation_description': 'Retrieve all posts',
    'responses': {
        200: openapi.Response('Posts retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_OBJECT))
            }
        )),
        405: 'Invalid request'
    }
}

following_feed_schema = {
    'operation_summary': 'Following Feed',
    'operation_description': 'Retrieve posts from users that the authenticated user is following',
    'responses': {
        200: openapi.Response('Posts retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_OBJECT))
            }
        )),
        405: 'Invalid request'
    }
}

post_schema = {
    'operation_summary': 'Post',
    'operation_description': 'Create a post',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'content': openapi.Schema(type=openapi.TYPE_STRING, description='Content of the post'),
            'workoutId': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the workout'),
            'mealId': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the meal')
        },
        required=['content'],
        example={
            'content': 'This is a sample post content.',
            'workoutId': 1,
            'mealId': 2
        }
    ),
    'responses': {
        201: openapi.Response('Post created successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER)
            }
        )),
        400: 'Bad Request',
        404: 'Workout not found',
        405: 'Invalid request'
    }
}

toggle_like_schema = {
    'operation_summary': 'Toggle Like',
    'operation_description': 'Toggle like on a post',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'postId': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the post')
        },
        required=['postId'],
        example={
            'postId': 1
        }
    ),
    'responses': {
        200: openapi.Response('Post liked/unliked successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        400: 'Bad Request',
        404: 'Post not found',
        405: 'Invalid request',
        500: 'Internal Server Error'
    }
}

comment_schema = {
    'operation_summary': 'Comment',
    'operation_description': 'Comment on a post',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'postId': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the post'),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description='Content of the comment')
        },
        required=['postId', 'content'],
        example={
            'postId': 1,
            'content': 'This is a sample comment.'
        }
    ),
    'responses': {
        201: openapi.Response('Comment created successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
                'comment_id': openapi.Schema(type=openapi.TYPE_INTEGER)
            }
        )),
        400: 'Bad Request',
        404: 'Post not found',
        405: 'Invalid request'
    }
}

toggle_bookmark_schema = {
    'operation_summary': 'Toggle Bookmark',
    'operation_description': 'Toggle bookmark on a post',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'postId': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the post')
        },
        required=['postId'],
        example={
            'postId': 1
        }
    ),
    'responses': {
        200: openapi.Response('Post bookmarked/unbookmarked successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        400: 'Bad Request',
        404: 'Not Found',
        405: 'Invalid request',
        500: 'Internal Server Error'
    }
}

liked_posts_schema = {
    'operation_summary': 'Liked Posts',
    'operation_description': 'Retrieve posts liked by the authenticated user',
    'responses': {
        200: openapi.Response('Posts retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_OBJECT))
            }
        )),
        405: 'Invalid request',
    }
}

bookmarked_posts_schema = {
    'operation_summary': 'Bookmarked Posts',
    'operation_description': 'Retrieve posts bookmarked by the authenticated user',
    'responses': {
        200: openapi.Response('Posts retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_OBJECT))
            }
        )),
        405: 'Invalid request'
    }
}

rate_workout_schema = {
    'operation_summary': 'Rate Workout',
    'operation_description': 'Rate a workout',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'workoutId': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the workout'),
            'rating': openapi.Schema(type=openapi.TYPE_NUMBER, description='Rating of the workout')
        },
        required=['workoutId', 'rating'],
        example={
            'workoutId': 1,
            'rating': 4.5
        }
    ),
    'responses': {
        200: openapi.Response('Workout rated successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        400: 'Bad Request',
        404: 'Workout not found',
        405: 'Invalid request'
    }
}

get_workout_by_id_schema = {
    'operation_summary': 'Get Workout by ID',
    'operation_description': 'Retrieve a workout by ID',
    'responses': {
        200: openapi.Response('Workout retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'workout': openapi.Schema(type=openapi.TYPE_OBJECT)
            }
        )),
        404: 'Workout not found',
        405: 'Invalid request'
    }
}

get_workouts_by_user_id_schema = {
    'operation_summary': 'Get Workouts by User ID',
    'operation_description': 'Retrieve workouts by user ID',
    'responses': {
        200: openapi.Response('Workouts retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'workouts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_OBJECT))
            }
        )),
        404: 'User not found',
        405: 'Invalid request'
    }
}

sign_up_schema = {
    'operation_summary': 'Sign Up',
    'operation_description': 'Sign up a user',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'email': openapi.Schema(type=openapi.TYPE_STRING),
            'password': openapi.Schema(type=openapi.TYPE_STRING),
            'user_type': openapi.Schema(type=openapi.TYPE_STRING, description='Type of user (member/trainer)')
        },
        required=['username', 'email', 'password'],
        example={
            'username': 'john_doe',
            'email': 'john@gmail.com',
            'password': 'password',
            'user_type': 'member'
        }
    ),
    'responses': {
        200: openapi.Response('User signed up successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        400: 'Bad Request'
    }
}

log_in_schema = {
    'operation_summary': 'Log In',
    'operation_description': 'Log in a user',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'password': openapi.Schema(type=openapi.TYPE_STRING)
        },
        required=['username', 'password'],
        example={
            'username': 'john_doe',
            'password': 'password'
        }
    ),
    'responses': {
        200: openapi.Response('User logged in successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        400: 'Bad Request',
        401: 'Unauthorized'
    }
}

log_out_schema = {
    'operation_summary': 'Log Out',
    'operation_description': 'Log out the authenticated user',
    'responses': {
        200: openapi.Response('User logged out successfully'),
        405: 'Invalid request'
    }
}

csrf_token_schema = {
    'operation_summary': 'CSRF Token',
    'operation_description': 'Get CSRF token',
    'responses': {
        200: openapi.Response('CSRF token retrieved successfully'),
        405: 'Invalid request'
    }
}

session_schema = {
    'operation_summary': 'Session',
    'operation_description': 'Get session information',
    'responses': {
        200: openapi.Response('Session information retrieved successfully'),
        405: 'Invalid request'
    }
}