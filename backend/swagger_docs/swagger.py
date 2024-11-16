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

