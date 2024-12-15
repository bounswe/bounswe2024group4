import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CommentModal = ({ 
  visible, 
  onClose, 
  comments, 
  onCommentSubmit,
  postId 
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [newComment, setNewComment] = React.useState('');

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (newComment.trim()) {
      await onCommentSubmit(newComment);
      setNewComment('');
      Keyboard.dismiss();
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUsername}>@{item.username}</Text>
      <Text style={styles.commentText}>{item.content}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                  paddingBottom: insets.bottom,
                },
              ]}
            >
              <View style={styles.header}>
                <View style={styles.headerBar} />
                <Text style={styles.headerTitle}>Comments</Text>
              </View>

              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.commentsList}
              />

              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
              >
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#94A3B8"
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity 
                    onPress={handleSubmit}
                    disabled={!newComment.trim()}
                  >
                    <Text 
                      style={[
                        styles.postButton,
                        !newComment.trim() && styles.postButtonDisabled
                      ]}
                    >
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerBar: {
    width: 40,
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    marginBottom: 16,
  },
  commentUsername: {
    color: '#60A5FA',
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 14,
  },
  commentText: {
    color: '#fff',
    lineHeight: 20,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  postButton: {
    color: '#60A5FA',
    fontWeight: '600',
    fontSize: 14,
    padding: 4,
  },
  postButtonDisabled: {
    opacity: 0.5,
  }
});

export default CommentModal;