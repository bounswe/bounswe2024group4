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
                    'weight': openapi.Schema(type=openapi.TYPE_NUMBER),
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
                    # 'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    #     type=openapi.TYPE_OBJECT,
                    #     properties={
                    #         'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    #     }
                    # )),
                    'is_following': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='True if the authenticated user is following the user, False otherwise, None if the authenticated user is the user'),
                }
            )),
            401: openapi.Response('Unauthorized'),
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