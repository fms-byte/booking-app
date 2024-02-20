import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Import your Firebase configuration
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = collection(db, 'users'); // Replace 'users' with your collection name
        const querySnapshot = await getDocs(userCollection);

        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Assuming you have only one user in the collection for simplicity
        if (usersData.length > 0) {
          setUserData(usersData[0]);
        }
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Profile",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
      },
      headerStyle: {
        backgroundColor: "#003580",
        height: 110,
        borderBottomColor: "transparent",
        shadowColor: "transparent",
      },
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Navigate to the Login screen or any other screen after sign-out
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {userData ? (
        <View style={styles.profileContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{userData.firstname + " " + userData.lastname}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{userData.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.info}>{userData.phone}</Text>

          {/* Add other user properties here */}
          
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    backgroundColor: '#fff', // Add a background color
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#003580',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
