import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const handleNext = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.jpg')}
        style={styles.logo}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.instructions}>
          Welcome to Hotel Booking App!{'\n\n'}
          Explore and book amazing places with amazing Deals and Discounts.{'\n\n'}
          Enjoy your vacations!
        </Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003580', // Set the background color
  },
  logo: {
    width: 200,
    height: 190,
    marginBottom: 20,
    backgroundColor:"white",
    borderRadius: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#003580',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
