from drf_yasg import openapi

# profiles app
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

# simple features app
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

# diet program app
get_food_by_id_schema = {
    'operation_summary': 'Get Food by ID',
    'operation_description': 'Get a food by ID',
    'manual_parameters': [
        openapi.Parameter(
            'food_id',
            openapi.IN_QUERY,
            description="ID of the food to retrieve",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description="Success",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'food_name': openapi.Schema(type=openapi.TYPE_STRING),
                    'ingredients': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(type=openapi.TYPE_STRING)
                    ),
                    'recipe_url': openapi.Schema(type=openapi.TYPE_STRING),
                    'energ_kcal': openapi.Schema(type=openapi.TYPE_STRING),
                    'fat': openapi.Schema(type=openapi.TYPE_STRING),
                    'fat_saturated': openapi.Schema(type=openapi.TYPE_STRING),
                    'fat_trans': openapi.Schema(type=openapi.TYPE_STRING),
                    'cholesterol': openapi.Schema(type=openapi.TYPE_STRING),
                    'carbo': openapi.Schema(type=openapi.TYPE_STRING),
                    'sugar': openapi.Schema(type=openapi.TYPE_STRING),
                    'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                    'protein': openapi.Schema(type=openapi.TYPE_STRING),
                    'na': openapi.Schema(type=openapi.TYPE_STRING),
                    'k': openapi.Schema(type=openapi.TYPE_STRING),
                    'ca': openapi.Schema(type=openapi.TYPE_STRING),
                    'vit_k': openapi.Schema(type=openapi.TYPE_STRING),
                    'vit_a_rae': openapi.Schema(type=openapi.TYPE_STRING),
                    'vit_c': openapi.Schema(type=openapi.TYPE_STRING),
                    'vit_d': openapi.Schema(type=openapi.TYPE_STRING),
                    'vit_b6': openapi.Schema(type=openapi.TYPE_STRING),
                    'vit_b12': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        404: 'Food not found'
    }
}

create_meal_schema = {
    'operation_summary': 'Create Meal',
    'operation_description': 'Create a meal',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meal_name': openapi.Schema(type=openapi.TYPE_STRING),
            'foods': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'food_id': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )),
        },
        required=['meal_name', 'foods']
    ),
    'responses': {
        201: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'meal_name': openapi.Schema(type=openapi.TYPE_STRING),
                'created_by': openapi.Schema(type=openapi.TYPE_STRING),
                'foods_count': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
    }
}

create_food_all_schema = {
    'operation_summary': 'Create Food',
    'operation_description': 'Create a food',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'food_name': openapi.Schema(type=openapi.TYPE_STRING),
            'ingredients': openapi.Schema(type=openapi.TYPE_NUMBER),
            'recipe_url': openapi.Schema(type=openapi.TYPE_NUMBER),
            'image_url': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['food_name', 'ingredients'],
    ), 
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
                'food_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        )),
        201: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
                'food_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'food_name': openapi.Schema(type=openapi.TYPE_STRING),
                'ingredients': openapi.Schema(type=openapi.TYPE_STRING),
                'recipe_url': openapi.Schema(type=openapi.TYPE_STRING),
                'image_url': openapi.Schema(type=openapi.TYPE_STRING),
                'calories': openapi.Schema(type=openapi.TYPE_NUMBER),
                'fat': openapi.Schema(type=openapi.TYPE_STRING),
                'fat_saturated': openapi.Schema(type=openapi.TYPE_STRING),
                'fat_trans': openapi.Schema(type=openapi.TYPE_STRING),
                'cholesterol': openapi.Schema(type=openapi.TYPE_STRING),
                'carbo': openapi.Schema(type=openapi.TYPE_STRING),
                'sugar': openapi.Schema(type=openapi.TYPE_STRING),
                'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                'protein': openapi.Schema(type=openapi.TYPE_STRING),
                'na': openapi.Schema(type=openapi.TYPE_STRING),
                'k': openapi.Schema(type=openapi.TYPE_STRING),
                'ca': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_k': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_a_rae': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_c': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_d': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_b6': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_b12': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
        404: openapi.Response('Not Found'),
    }
}

create_food_superuser_schema = {
    'operation_summary': 'Create Food with Nutritional Values',
    'operation_description': 'Create a food with nutritional values',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'food_name': openapi.Schema(type=openapi.TYPE_STRING),
            'ingredients': openapi.Schema(type=openapi.TYPE_STRING),
            'recipe_url': openapi.Schema(type=openapi.TYPE_STRING),
            'energ_kcal': openapi.Schema(type=openapi.TYPE_STRING),
            'fat': openapi.Schema(type=openapi.TYPE_STRING),
            'fat_saturated': openapi.Schema(type=openapi.TYPE_STRING),
            'fat_trans': openapi.Schema(type=openapi.TYPE_STRING),
            'cholesterol': openapi.Schema(type=openapi.TYPE_STRING),
            'carbo': openapi.Schema(type=openapi.TYPE_STRING),
            'sugar': openapi.Schema(type=openapi.TYPE_STRING),
            'fiber': openapi.Schema(type=openapi.TYPE_STRING),
            'protein': openapi.Schema(type=openapi.TYPE_STRING),
            'na': openapi.Schema(type=openapi.TYPE_STRING),
            'k': openapi.Schema(type=openapi.TYPE_STRING),
            'ca': openapi.Schema(type=openapi.TYPE_STRING),
            'vit_k': openapi.Schema(type=openapi.TYPE_STRING),
            'vit_a_rae': openapi.Schema(type=openapi.TYPE_STRING),
            'vit_c': openapi.Schema(type=openapi.TYPE_STRING),
            'vit_d': openapi.Schema(type=openapi.TYPE_STRING),
            'vit_b6': openapi.Schema(type=openapi.TYPE_STRING),
            'vit_b12': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['food_name', 'ingredients'],
    ),
    'responses': {
        201: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
                'food_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'food_name': openapi.Schema(type=openapi.TYPE_STRING),
                'ingredients': openapi.Schema(type=openapi.TYPE_STRING),
                'recipe_url': openapi.Schema(type=openapi.TYPE_STRING),
                'image_url': openapi.Schema(type=openapi.TYPE_STRING),
                'calories': openapi.Schema(type=openapi.TYPE_NUMBER),
                'fat': openapi.Schema(type=openapi.TYPE_STRING),
                'fat_saturated': openapi.Schema(type=openapi.TYPE_STRING),
                'fat_trans': openapi.Schema(type=openapi.TYPE_STRING),
                'cholesterol': openapi.Schema(type=openapi.TYPE_STRING),
                'carbo': openapi.Schema(type=openapi.TYPE_STRING),
                'sugar': openapi.Schema(type=openapi.TYPE_STRING),
                'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                'protein': openapi.Schema(type=openapi.TYPE_STRING),
                'na': openapi.Schema(type=openapi.TYPE_STRING),
                'k': openapi.Schema(type=openapi.TYPE_STRING),
                'ca': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_k': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_a_rae': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_c': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_d': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_b6': openapi.Schema(type=openapi.TYPE_STRING),
                'vit_b12': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
        404: openapi.Response('Not Found'),
    }
}

get_meal_from_id_schema = {
    'operation_summary': 'Get Meal by ID',
    'operation_description': 'Get a meal by ID',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the meal'),
        },
        required=['meal_id'],
    ),
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'meal_name': openapi.Schema(type=openapi.TYPE_STRING),
                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                'rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                'rating_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'calories': openapi.Schema(type=openapi.TYPE_NUMBER),
                'fat': openapi.Schema(type=openapi.TYPE_STRING),
                'protein': openapi.Schema(type=openapi.TYPE_STRING),
                'carbs': openapi.Schema(type=openapi.TYPE_STRING),
                'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                'foods': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'food_name': openapi.Schema(type=openapi.TYPE_STRING),
                            'ingredients': openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(type=openapi.TYPE_STRING)
                            ),
                            'recipe_url': openapi.Schema(type=openapi.TYPE_STRING),
                            'energ_kcal': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat_saturated': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat_trans': openapi.Schema(type=openapi.TYPE_STRING),
                            'cholesterol': openapi.Schema(type=openapi.TYPE_STRING),
                            'carbo': openapi.Schema(type=openapi.TYPE_STRING),
                            'sugar': openapi.Schema(type=openapi.TYPE_STRING),
                            'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                            'protein': openapi.Schema(type=openapi.TYPE_STRING),
                            'na': openapi.Schema(type=openapi.TYPE_STRING),
                            'k': openapi.Schema(type=openapi.TYPE_STRING),
                            'ca': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_k': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_a_rae': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_c': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_d': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_b6': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_b12': openapi.Schema(type=openapi.TYPE_STRING),
                            'image_url': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            }
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
        404: openapi.Response('Not Found'),
    }
}

delete_meal_by_id_schema = {
    'operation_summary': 'Delete Meal by ID',
    'operation_description': 'Delete a meal by ID',
    'responses': { 
        '200': openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        400: openapi.Response('Bad Request'),
        403: openapi.Response('Unauthorized'),
        404: openapi.Response('Not Found'),
        405: openapi.Response('Invalid request'),
    }
}

get_foodname_options_schema = {
    'operation_summary': 'Get Food Name Options',
    'operation_description': 'Get a list of food names',
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_STRING
            )
        )),
        400: openapi.Response('Bad Request'),
        401: openapi.Response('Unauthorized'),
        405: openapi.Response('Invalid request'),
    }
}

rate_meal_schema = {
    'operation_summary': 'Rate Meal',
    'operation_description': 'Rate a meal',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the meal'),
            'rating': openapi.Schema(type=openapi.TYPE_NUMBER, description='Rating of the meal')
        },
        required=['meal_id', 'rating'],
        example={
            'meal_id': 1,
            'rating': 4.5
        }
    ),
    'responses': {
        200: openapi.Response('Meal rated successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        400: 'Bad Request',
        404: 'Meal not found',
        405: 'Invalid request'
    }
}

get_meals_schema = {
    'operation_summary': 'Get Meals by User id',
    'operation_description': 'Get the meals created by user',
    'manual_parameters': [
        openapi.Parameter(
            'user_id',
            openapi.IN_QUERY,
            description="ID of the user",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'meal_name': openapi.Schema(type=openapi.TYPE_STRING),
                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                'rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                'rating_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'calories': openapi.Schema(type=openapi.TYPE_NUMBER),
                'fat': openapi.Schema(type=openapi.TYPE_STRING),
                'protein': openapi.Schema(type=openapi.TYPE_STRING),
                'carbs': openapi.Schema(type=openapi.TYPE_STRING),
                'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                'foods': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'food_name': openapi.Schema(type=openapi.TYPE_STRING),
                            'ingredients': openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(type=openapi.TYPE_STRING)
                            ),
                            'recipe_url': openapi.Schema(type=openapi.TYPE_STRING),
                            'energ_kcal': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat_saturated': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat_trans': openapi.Schema(type=openapi.TYPE_STRING),
                            'cholesterol': openapi.Schema(type=openapi.TYPE_STRING),
                            'carbo': openapi.Schema(type=openapi.TYPE_STRING),
                            'sugar': openapi.Schema(type=openapi.TYPE_STRING),
                            'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                            'protein': openapi.Schema(type=openapi.TYPE_STRING),
                            'na': openapi.Schema(type=openapi.TYPE_STRING),
                            'k': openapi.Schema(type=openapi.TYPE_STRING),
                            'ca': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_k': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_a_rae': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_c': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_d': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_b6': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_b12': openapi.Schema(type=openapi.TYPE_STRING),
                            'image_url': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            }
            )
        ),
        404: 'User not found',
        405: 'Invalid request'
    }
}

toggle_bookmark_meal_schema = {
    'operation_summary': 'Toggle Bookmark Meal',
    'operation_description': 'Toggle bookmark on a meal',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the meal')
        },
        required=['meal_id'],
        example={'meal_id': 1},
    ),
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        400: 'Bad Request',
        404: 'Not Found',
        405: 'Invalid request',
    }
}

get_bookmarked_meals_schema = {
    'operation_summary': 'Get Bookmarked Meals',
    'operation_description': 'Get the meals bookmarked of the user',
    'manual_parameters': [
        openapi.Parameter(
            'user_id',
            openapi.IN_QUERY,
            description="ID of the user",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'meal_name': openapi.Schema(type=openapi.TYPE_STRING),
                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                'rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                'rating_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'calories': openapi.Schema(type=openapi.TYPE_NUMBER),
                'fat': openapi.Schema(type=openapi.TYPE_STRING),
                'protein': openapi.Schema(type=openapi.TYPE_STRING),
                'carbs': openapi.Schema(type=openapi.TYPE_STRING),
                'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                'foods': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'food_name': openapi.Schema(type=openapi.TYPE_STRING),
                            'ingredients': openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(type=openapi.TYPE_STRING)
                            ),
                            'recipe_url': openapi.Schema(type=openapi.TYPE_STRING),
                            'energ_kcal': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat_saturated': openapi.Schema(type=openapi.TYPE_STRING),
                            'fat_trans': openapi.Schema(type=openapi.TYPE_STRING),
                            'cholesterol': openapi.Schema(type=openapi.TYPE_STRING),
                            'carbo': openapi.Schema(type=openapi.TYPE_STRING),
                            'sugar': openapi.Schema(type=openapi.TYPE_STRING),
                            'fiber': openapi.Schema(type=openapi.TYPE_STRING),
                            'protein': openapi.Schema(type=openapi.TYPE_STRING),
                            'na': openapi.Schema(type=openapi.TYPE_STRING),
                            'k': openapi.Schema(type=openapi.TYPE_STRING),
                            'ca': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_k': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_a_rae': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_c': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_d': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_b6': openapi.Schema(type=openapi.TYPE_STRING),
                            'vit_b12': openapi.Schema(type=openapi.TYPE_STRING),
                            'image_url': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                )
            }
            )
        ),
        404: 'User not found',
        405: 'Invalid request'
    }
}

# exercise program app
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

create_exercise_superuser_schema = {
    'operation_description': "Create a new exercise",
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description="Name of the exercise"),
            'type': openapi.Schema(type=openapi.TYPE_STRING, description="Type of exercise"),
            'muscle': openapi.Schema(type=openapi.TYPE_STRING, description="Primary muscle group worked"),
            'equipment': openapi.Schema(type=openapi.TYPE_STRING, description="Equipment needed"),
            'difficulty': openapi.Schema(type=openapi.TYPE_STRING, description="Difficulty level of the exercise"),
            'instruction': openapi.Schema(type=openapi.TYPE_STRING, description="Instructions for the exercise"),
        },
        required=['name', 'muscle', 'equipment', 'instruction'],            
    ),
    'responses': {
        200: openapi.Response(
            description="Success",
            examples={
                'application/json': {
                    'status': 'success',
                    'exercise_id': 1,
                    'name': 'Chest Press',
                    'muscle': 'Chest',
                    'equipment': 'Machine',
                    'instruction': 'Sit on the machine and push the handles forward.',
                    'difficulty': 'Beginner'
                }
            }
        ),
        400: 'Bad Request',
        401: 'Unauthorized',
    },
    # 'tags': ['Exercises']
}

# social feed app
feed_schema = {
    'operation_summary': 'Get Feed',
    'operation_description': 'Retrieve all posts in chronological order',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Posts retrieved successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'posts': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'content': openapi.Schema(type=openapi.TYPE_STRING),
                                'workout_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                'like_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                                'liked': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                'user': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                                        'profile_picture': openapi.Schema(
                                            type=openapi.TYPE_STRING,
                                            format='uri',
                                            nullable=True
                                        ),
                                        'score': openapi.Schema(type=openapi.TYPE_NUMBER)
                                    }
                                )
                            }
                        )
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
    }
}

following_feed_schema = {
    'operation_summary': 'Get Following Feed',
    'operation_description': 'Retrieve posts from users that the authenticated user follows',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Posts retrieved successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'posts': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'content': openapi.Schema(type=openapi.TYPE_STRING),
                                'workout_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                'like_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                                'liked': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                'user': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                                        'profile_picture': openapi.Schema(
                                            type=openapi.TYPE_STRING,
                                            format='uri',
                                            nullable=True
                                        ),
                                        'score': openapi.Schema(type=openapi.TYPE_NUMBER)
                                    }
                                )
                            }
                        )
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
    }
}

# posts app
post_schema = {
    'operation_summary': 'Create Post',
    'operation_description': 'Create a new post with optional workout or meal reference',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['content'],
        properties={
            'content': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Content of the post'
            ),
            'workoutId': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='ID of the referenced workout',
                nullable=True
            ),
            'mealId': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='ID of the referenced meal',
                nullable=True
            )
        }
    ),
    'responses': {
        201: openapi.Response(
            description='Post created successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'content': openapi.Schema(type=openapi.TYPE_STRING),
                    'workout_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                    'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True)
                }
            )
        ),
        400: openapi.Response(
            description='Bad Request',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        401: 'Authentication credentials were not provided'
    }
}

toggle_like_schema = {
    'operation_summary': 'Toggle Like',
    'operation_description': 'Like or unlike a post',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['postId'],
        properties={
            'postId': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='ID of the post to like/unlike'
            )
        }
    ),
    'responses': {
        200: openapi.Response(
            description='Like toggled successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        400: 'Invalid post ID',
        401: 'Authentication credentials were not provided',
        404: 'Post not found'
    }
}

comment_schema = {
    'operation_summary': 'Create Comment',
    'operation_description': 'Add a comment to a post',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['postId', 'content'],
        properties={
            'postId': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='ID of the post to comment on'
            ),
            'content': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Content of the comment'
            )
        }
    ),
    'responses': {
        201: openapi.Response(
            description='Comment created successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'comment_id': openapi.Schema(type=openapi.TYPE_INTEGER)
                }
            )
        ),
        400: 'Missing required fields',
        401: 'Authentication credentials were not provided',
        404: 'Post not found'
    }
}

toggle_bookmark_schema = {
    'operation_summary': 'Toggle Bookmark',
    'operation_description': 'Bookmark or unbookmark a post',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['postId'],
        properties={
            'postId': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='ID of the post to bookmark/unbookmark'
            )
        }
    ),
    'responses': {
        200: openapi.Response(
            description='Bookmark toggled successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        400: 'Invalid post ID',
        401: 'Authentication credentials were not provided',
        404: 'Post not found'
    }
}

liked_posts_schema = {
    'operation_summary': 'Get Liked Posts',
    'operation_description': 'Get all posts liked by the authenticated user',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Liked posts retrieved successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'liked_posts': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'content': openapi.Schema(type=openapi.TYPE_STRING),
                                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                                'like_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'user': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                                        'profile_picture': openapi.Schema(
                                            type=openapi.TYPE_STRING,
                                            format='uri',
                                            nullable=True
                                        )
                                    }
                                )
                            }
                        )
                    )
                }
            )
        ),
        401: 'Authentication credentials were not provided'
    }
}

delete_post_schema = {
    'operation_summary': 'Delete Post',
    'operation_description': 'Delete a post (only available to post owner)',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Post deleted successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'post_id': openapi.Schema(type=openapi.TYPE_INTEGER)
                }
            )
        ),
        401: 'Authentication credentials were not provided',
        403: 'Not authorized to delete this post',
        404: 'Post not found'
    }
}

delete_comment_schema = {
    'operation_summary': 'Delete Comment',
    'operation_description': 'Delete a comment (only available to comment owner)',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Comment deleted successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'comment_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'post_id': openapi.Schema(type=openapi.TYPE_INTEGER)
                }
            )
        ),
        401: 'Authentication credentials were not provided',
        403: 'Not authorized to delete this comment',
        404: 'Comment not found'
    }
}

rate_workout_schema = {
    'operation_summary': 'Rate Workout',
    'operation_description': 'Rate a workout and update user ratings',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['workout_id', 'rating'],
        properties={
            'workout_id': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='ID of the workout to rate'
            ),
            'rating': openapi.Schema(
                type=openapi.TYPE_NUMBER,
                description='Rating value between 0 and 5',
                minimum=0,
                maximum=5
            )
        }
    ),
    'responses': {
        200: openapi.Response(
            description='Rating submitted successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Rating submitted successfully'
                    ),
                    'workout': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'workout_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                            'rating_count': openapi.Schema(type=openapi.TYPE_INTEGER)
                        }
                    ),
                    'user': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'workout_rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                            'workout_rating_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'score': openapi.Schema(type=openapi.TYPE_NUMBER)
                        }
                    )
                }
            )
        ),
        400: openapi.Response(
            description='Bad Request',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Rating must be between 0 and 5'
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        404: openapi.Response(
            description='Workout not found',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Workout not found'
                    )
                }
            )
        )
    }
}

get_workout_by_id_schema = {
    'operation_summary': 'Get Workout by ID',
    'operation_description': 'Retrieve detailed information about a specific workout',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        ),
        openapi.Parameter(
            'workout_id',
            openapi.IN_PATH,
            description="ID of the workout to retrieve",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description="Workout details retrieved successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'id': openapi.Schema(
                        type=openapi.TYPE_INTEGER,
                        description='Unique identifier of the workout'
                    ),
                    'workout_name': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description='Name of the workout'
                    ),
                    'created_by': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description='Username of the workout creator'
                    ),
                    'rating': openapi.Schema(
                        type=openapi.TYPE_NUMBER,
                        description='Average rating of the workout',
                        minimum=0,
                        maximum=5
                    ),
                    'rating_count': openapi.Schema(
                        type=openapi.TYPE_INTEGER,
                        description='Number of ratings received'
                    ),
                    'exercises': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        description='List of exercises in this workout',
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'type': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Type of exercise (e.g., strength, cardio)'
                                ),
                                'name': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Name of the exercise'
                                ),
                                'muscle': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Primary muscle group targeted'
                                ),
                                'equipment': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Equipment required for the exercise'
                                ),
                                'difficulty': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Difficulty level of the exercise',
                                    enum=['Beginner', 'Intermediate', 'Expert']
                                ),
                                'instruction': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Instructions for performing the exercise'
                                ),
                                'sets': openapi.Schema(
                                    type=openapi.TYPE_INTEGER,
                                    description='Number of sets'
                                ),
                                'reps': openapi.Schema(
                                    type=openapi.TYPE_INTEGER,
                                    description='Number of repetitions per set'
                                ),
                                'exercise_id': openapi.Schema(
                                    type=openapi.TYPE_INTEGER,
                                    description='Unique identifier of the exercise'
                                )
                            }
                        )
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        404: openapi.Response(
            description='Workout not found',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Workout not found'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
    }
}

# user auth app schema
sign_up_schema = {
    'operation_summary': 'Sign Up',
    'operation_description': 'Register a new user account',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['username', 'email', 'password'],
        properties={
            'username': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Username for the new account'
            ),
            'email': openapi.Schema(
                type=openapi.TYPE_STRING,
                format='email',
                description='Email address for the new account'
            ),
            'password': openapi.Schema(
                type=openapi.TYPE_STRING,
                format='password',
                description='Password for the new account'
            ),
            'user_type': openapi.Schema(
                type=openapi.TYPE_STRING,
                enum=['member', 'trainer'],
                default='member',
                description='Type of user account'
            )
        }
    ),
    'responses': {
        201: openapi.Response(
            description='User created successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'user': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'username': openapi.Schema(type=openapi.TYPE_STRING),
                            'email': openapi.Schema(type=openapi.TYPE_STRING),
                            'user_type': openapi.Schema(type=openapi.TYPE_STRING),
                            'id': openapi.Schema(type=openapi.TYPE_INTEGER)
                        }
                    ),
                    'token': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        400: openapi.Response(
            description='Bad Request',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING),
                    'details': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'username': openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                            'email': openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                            'password': openapi.Schema(type=openapi.TYPE_STRING, nullable=True)
                        }
                    )
                }
            )
        )
    }
}

log_in_schema = {
    'operation_summary': 'Log In',
    'operation_description': 'Authenticate and get access token',
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['username', 'password'],
        properties={
            'username': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Username of the account'
            ),
            'password': openapi.Schema(
                type=openapi.TYPE_STRING,
                format='password',
                description='Password of the account'
            )
        }
    ),
    'responses': {
        200: openapi.Response(
            description='Login successful',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'user': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'username': openapi.Schema(type=openapi.TYPE_STRING),
                            'email': openapi.Schema(type=openapi.TYPE_STRING),
                            'user_type': openapi.Schema(type=openapi.TYPE_STRING),
                            'id': openapi.Schema(type=openapi.TYPE_INTEGER)
                        }
                    ),
                    'token': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        401: openapi.Response(
            description='Authentication failed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid credentials'
                    )
                }
            )
        )
    }
}

log_out_schema = {
    'operation_summary': 'Log Out',
    'operation_description': 'Invalidate the current authentication token',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Logout successful',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Logged out successfully'
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        )
    }
}

csrf_token_schema = {
    'operation_summary': 'Get CSRF Token',
    'operation_description': 'Get a CSRF token for making authenticated requests',
    'responses': {
        200: openapi.Response(
            description='CSRF token retrieved successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'csrf_token': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description='CSRF token to be used in subsequent requests'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
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

get_workouts_schema = {
    'operation_summary': 'Get User Workouts',
    'operation_description': 'Retrieve all workouts created by the authenticated user',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description="List of user's workouts",
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Unique identifier of the workout'
                        ),
                        'workout_name': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Name of the workout'
                        ),
                        'created_by': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Username of the workout creator'
                        ),
                        'rating': openapi.Schema(
                            type=openapi.TYPE_NUMBER,
                            description='Average rating of the workout',
                            minimum=0,
                            maximum=5
                        ),
                        'rating_count': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Number of ratings received'
                        ),
                        'exercises': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            description='List of exercises in this workout',
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'type': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Type of exercise (e.g., strength, cardio)'
                                    ),
                                    'name': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Name of the exercise'
                                    ),
                                    'muscle': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Primary muscle group targeted'
                                    ),
                                    'equipment': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Equipment required for the exercise'
                                    ),
                                    'difficulty': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Difficulty level of the exercise',
                                        enum=['Beginner', 'Intermediate', 'Expert']
                                    ),
                                    'instruction': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Instructions for performing the exercise'
                                    ),
                                    'sets': openapi.Schema(
                                        type=openapi.TYPE_INTEGER,
                                        description='Number of sets'
                                    ),
                                    'reps': openapi.Schema(
                                        type=openapi.TYPE_INTEGER,
                                        description='Number of repetitions per set'
                                    )
                                }
                            )
                        ),
                        'created_at': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            format='date-time',
                            description='When the workout was created'
                        )
                    }
                )
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
    }
}

toggle_bookmark_workout_schema = {
    'operation_summary': 'Toggle Workout Bookmark',
    'operation_description': 'Bookmark or unbookmark a workout',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['workout_id'],
        properties={
            'workout_id': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='ID of the workout to bookmark/unbookmark'
            )
        }
    ),
    'responses': {
        200: openapi.Response(
            description='Bookmark toggled successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description='Success message',
                        example='Bookmark added/removed'
                    ),
                    'workout_id': openapi.Schema(
                        type=openapi.TYPE_INTEGER,
                        description='ID of the affected workout'
                    ),
                    'username': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description='Username of the user who toggled the bookmark'
                    )
                }
            )
        ),
        400: openapi.Response(
            description='Bad Request',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='workout_id is required'
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        404: openapi.Response(
            description='Workout not found',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Workout not found'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
    }
}

get_bookmarked_workouts_schema = {
    'operation_summary': 'Get Bookmarked Workouts',
    'operation_description': 'Retrieve all workouts bookmarked by the authenticated user',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description="List of bookmarked workouts",
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Unique identifier of the workout'
                        ),
                        'workout_name': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Name of the workout'
                        ),
                        'created_by': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Username of the workout creator'
                        ),
                        'rating': openapi.Schema(
                            type=openapi.TYPE_NUMBER,
                            description='Average rating of the workout',
                            minimum=0,
                            maximum=5
                        ),
                        'rating_count': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Number of ratings received'
                        ),
                        'created_at': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            format='date-time',
                            description='When the workout was created'
                        ),
                        'is_bookmarked': openapi.Schema(
                            type=openapi.TYPE_BOOLEAN,
                            description='Whether the workout is bookmarked by the current user'
                        )
                    }
                )
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
    }
}

search_schema = {
    'operation_summary': 'Search',
    'operation_description': 'Search across users, posts, meals, and workouts',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        ),
        openapi.Parameter(
            'search',
            openapi.IN_QUERY,
            description='Search query string',
            type=openapi.TYPE_STRING,
            required=True
        ),
        openapi.Parameter(
            'type',
            openapi.IN_QUERY,
            description='Type of content to search',
            type=openapi.TYPE_STRING,
            enum=['all', 'users', 'posts', 'meals', 'workouts'],
            default='all'
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Search results',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'users': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'username': openapi.Schema(type=openapi.TYPE_STRING),
                                'profile_picture': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    format='uri',
                                    nullable=True
                                ),
                                'score': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'user_type': openapi.Schema(type=openapi.TYPE_STRING),
                                'workout_rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'meal_rating': openapi.Schema(type=openapi.TYPE_NUMBER)
                            }
                        )
                    ),
                    'posts': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'content': openapi.Schema(type=openapi.TYPE_STRING),
                                'created_at': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    format='date-time'
                                ),
                                'like_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'user': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                                        'profile_picture': openapi.Schema(
                                            type=openapi.TYPE_STRING,
                                            format='uri',
                                            nullable=True
                                        )
                                    }
                                ),
                                'workout_id': openapi.Schema(
                                    type=openapi.TYPE_INTEGER,
                                    nullable=True
                                ),
                                'meal_id': openapi.Schema(
                                    type=openapi.TYPE_INTEGER,
                                    nullable=True
                                )
                            }
                        )
                    ),
                    'meals': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'meal_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'created_at': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    format='date-time'
                                ),
                                'rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'rating_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'created_by': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                                        'profile_picture': openapi.Schema(
                                            type=openapi.TYPE_STRING,
                                            format='uri',
                                            nullable=True
                                        )
                                    }
                                )
                            }
                        )
                    ),
                    'workouts': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'workout_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'workout_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'rating_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'created_by': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                                        'profile_picture': openapi.Schema(
                                            type=openapi.TYPE_STRING,
                                            format='uri',
                                            nullable=True
                                        )
                                    }
                                )
                            }
                        )
                    )
                }
            )
        ),
        400: openapi.Response(
            description='Bad Request',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Search query is required'
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        )
    }
}

bookmarked_posts_schema = {
    'operation_summary': 'Get Bookmarked Posts',
    'operation_description': 'Get all posts bookmarked by the authenticated user',
    'manual_parameters': [
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description='Token <auth_token>',
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    'responses': {
        200: openapi.Response(
            description='Bookmarked posts retrieved successfully',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'bookmarked_posts': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'content': openapi.Schema(type=openapi.TYPE_STRING),
                                'workout_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                'meal_id': openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
                                'like_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                                'liked': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                'user': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                                        'profile_picture': openapi.Schema(
                                            type=openapi.TYPE_STRING,
                                            format='uri',
                                            nullable=True
                                        ),
                                        'score': openapi.Schema(type=openapi.TYPE_NUMBER)
                                    }
                                )
                            }
                        )
                    )
                }
            )
        ),
        401: openapi.Response(
            description='Not authenticated',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Authentication credentials were not provided.'
                    )
                }
            )
        ),
        405: openapi.Response(
            description='Method not allowed',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example='Invalid request method'
                    )
                }
            )
        )
    }
}
