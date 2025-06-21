import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const UserListModal = ({ visible, users, title, onClose, onUnfollow, showUnfollow }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <FlatList
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.userRow}>
                <Text style={styles.username}>{item.nombreUsuario || item.username}</Text>
                {showUnfollow && (
                  <TouchableOpacity
                    style={styles.unfollowButton}
                    onPress={() => onUnfollow(item)}
                  >
                    <Text style={styles.unfollowText}>Unfollow</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    width: '88%',
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#007AFF',
    letterSpacing: 0.5,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  username: {
    fontSize: 17,
    color: '#222',
  },
  unfollowButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
  },
  unfollowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  closeButton: {
    marginTop: 22,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 24,
    fontSize: 16,
  },
});

export default UserListModal;
