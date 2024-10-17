import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import Post from '../../components/Post';






const posts = [
  {
    id: '1',
    username: 'Ricky Stevens',
    profile_picture: 'https://s3-alpha-sig.figma.com/img/987b/f77e/4eed7e505e2f5813f3e6081a084da1a3?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=esLXTwvcgzmU10luiwXx0PuC~LyUaZfE1O9LagCfVQvYlDiGcd-v13dtKiz6pZUPlT6cWrOhEcPU3SLJu32Pz5qOVBTOGD7n5mhI7m3LfvwjXVWhvatY9xIEAccfNEIOfXgjULeTd4lI8QxKlepCclkorcEFkh32z~w1YgABKaIljmg3lUHhMOAohPlWWIGfe2m~x27IV0gUW1kuhrXMNSKgRiUNKgBCnldqJq~J6c1qAJY1ApnbrShZE9uPgiqqdZTNdZrPXYSqTVnjkYTPYefCsnhYrbEbH48wiEe4DxqXmXQJr96Ypg28PqmYVLkzVR469k1HFznlVhfPzHnO6g__',
    content: 'Gentle Chair Exercises for Staying Active in Your 70s!',
    image: 'https://www.bhf.org.uk/-/media/images/information-support/heart-matters/2018/december-2018/activity/5-more-chair-based-activities/chair-based-exercises-260x170-ss-noexp.jpg?h=170&w=260&rev=a38d5edbbbe743e3ac8cad1781f8217e&hash=1EF74F26B5E44467E3CE9E59152FF48F',
    created_at: new Date(),
    likes_count: 42,
    user_has_liked: false,
    user_has_bookmarked: false,
    user_rating: 4.5, 
  },
  {
    id: '2',
    username: 'Mesut Süre',
    profile_picture: 'https://s3-alpha-sig.figma.com/img/c119/d1d1/0458545bc8213fb534627f5d40638823?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=q4FefQQXnUWzL7dOs-9vK9J-UR6Yfqc8-6g3MXk3UAmklzE5f2DDfTmpTz7tJlEV0zK5sirvvRFUIdZt7WycMzJpLAKvPPhYKmKQocZ7cEPYCUaTQpUbUO74sPpLJpiaVN59T1n5n1S31ysHd-6OrdjGeqOxYUplXKQXQwLdwsqSsnwErOzdDUxQffJ7WMboKzF5XsIsQnMGjtrH2Xvao8UrYWdz1w49kJV7ZnmVub0M8LGohczKZas1Th-65-cNPv0nOSoKmW3y8LmmLBOAH7fluV9C9bcmt2exurAKaotpg8JAlO7EPXmg1iHWdyVDzOTg-pUFuc1s4IG9HGsJmQ__',
    content: 'Fueling up with a balanced meal to stay on track with my fitness goals.',
    image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/11396/cb91e012-a635-4b41-a59a-8b23c836423d.jpg',
    created_at: new Date(),
    likes_count: 28,
    user_has_liked: true,
    user_has_bookmarked: true,
    user_rating: 2.9, 
  },
  {
    id: '3',
    username: 'Mesut Süre',
    profile_picture: 'https://s3-alpha-sig.figma.com/img/c119/d1d1/0458545bc8213fb534627f5d40638823?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=q4FefQQXnUWzL7dOs-9vK9J-UR6Yfqc8-6g3MXk3UAmklzE5f2DDfTmpTz7tJlEV0zK5sirvvRFUIdZt7WycMzJpLAKvPPhYKmKQocZ7cEPYCUaTQpUbUO74sPpLJpiaVN59T1n5n1S31ysHd-6OrdjGeqOxYUplXKQXQwLdwsqSsnwErOzdDUxQffJ7WMboKzF5XsIsQnMGjtrH2Xvao8UrYWdz1w49kJV7ZnmVub0M8LGohczKZas1Th-65-cNPv0nOSoKmW3y8LmmLBOAH7fluV9C9bcmt2exurAKaotpg8JAlO7EPXmg1iHWdyVDzOTg-pUFuc1s4IG9HGsJmQ__',
    content: 'Fueling up with a balanced meal to stay on track with my fitness goals.',
    image: '',
    created_at: new Date(),
    likes_count: 28,
    user_has_liked: true,
    user_has_bookmarked: true,
    user_rating: 2.9, 
  },
  // Diğer postlar...
];

const PostFeed = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />} 
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B55AC',
    padding: 10,
  },
  feedContainer: {
    paddingVertical: 10,
  },
});

export default PostFeed;
