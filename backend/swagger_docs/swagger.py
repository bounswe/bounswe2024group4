from drf_yasg import openapi

edit_profile_schema = {
    'operation_summary': 'Edit Profile',
    'operation_description': 'Edit the profile of the authenticated user',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='New username of the user'),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='New email of the user'),
            'bio': openapi.Schema(type=openapi.TYPE_STRING, description='New bio of the user'),
            'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, format='url', description='URL of the profile picture'),
            'weight': openapi.Schema(type=openapi.TYPE_NUMBER, description='New weight of the user'),
            'height': openapi.Schema(type=openapi.TYPE_NUMBER, description='New height of the user'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='New password of the user'),
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
                            'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, format='url'),
                            'rating': openapi.Schema(type=openapi.TYPE_INTEGER),
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
                            'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, format='url'),
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
                            'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, format='url'),
                            'meal_rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                        }
                    )
                )
            }
        )),
        401: openapi.Response('Unauthorized'),
    }
}

workout_program_schema = {
    'operation_summary': 'Create Workout Programs',
    'operation_description': 'Creates a workout programs',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'workout_name': openapi.Schema(type=openapi.TYPE_STRING),
            'exercises': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'exercise_type': openapi.Schema(type=openapi.TYPE_STRING),
                    'exercise_name': openapi.Schema(type=openapi.TYPE_STRING),
                    'muscle': openapi.Schema(type=openapi.TYPE_STRING),
                    'equipment': openapi.Schema(type=openapi.TYPE_STRING),
                    'instruction': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )),
        },
        required=['workout_name', 'exercises']
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

rate_workout_schema = {
    'operation_description': "Rate a workout",
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'workout_id': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description="ID of the workout to rate"
            ),
            'rating': openapi.Schema(
                type=openapi.TYPE_NUMBER,
                description="Rating value (0-5)",
                example=4.5
            )
        },
        required=['workout_id', 'rating']
    ),
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': {
                    'message': 'Rating submitted successfully'
                }
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized - User not logged in'
    },
    'tags': ['Workouts']
}

get_workout_by_id_schema = {
    'operation_description': "Get a specific workout by its ID",
    'manual_parameters': [
        openapi.Parameter(
            'workout_id',
            openapi.IN_PATH,
            description="ID of the workout to retrieve",
            type=openapi.TYPE_INTEGER
        )
    ],
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': {
                    'id': 1,
                    'workout_name': 'Upper Body Strength',
                    'created_by': 'john_doe',
                    'rating': 4.5,
                    'rating_count': 10,
                    'exercises': [
                        {
                            'type': 'strength',
                            'name': 'Bench Press',
                            'muscle': 'chest',
                            'equipment': 'barbell',
                            'instruction': 'Lie on the bench and press the barbell up.'
                        }
                    ]
                }
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized - User not logged in',
        404: 'Not Found - Workout not found'
    },
    'tags': ['Workouts']
}

get_workouts_by_user_id_schema = {
    'operation_description': "Get workouts by user ID",
    'manual_parameters': [
        openapi.Parameter(
            'user_id',
            openapi.IN_PATH,
            description="ID of the user whose workouts to retrieve",
            type=openapi.TYPE_INTEGER
        )
    ],
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': [
                    {
                        'id': 1,
                        'workout_name': 'Upper Body Strength',
                        'created_by': 'john_doe',
                        'rating': 4.5,
                        'rating_count': 10,
                        'exercises': [
                            {
                                'type': 'strength',
                                'name': 'Bench Press',
                                'muscle': 'chest',
                                'equipment': 'barbell',
                                'instruction': 'Lie on the bench and press the barbell up.'
                            }
                        ]
                    }
                ]
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized - User not logged in',
        404: 'Not Found - User not found'
    },
    'tags': ['Workouts']
}