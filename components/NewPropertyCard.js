// NewPropertyCard.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const NewPropertyCard = ({ property }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: property.image }} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{property.name}</Text>
        <Text style={styles.address}>
          {property.address && property.address.length > 50
            ? property.address.substr(0, 50) + "..."
            : property.address}
        </Text>
        <Text style={styles.price}>
          Price: Rs {property.newPrice * property.rooms} (for 1 night and{" "}
          {property.rooms} rooms)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 15,
  },
  image: {
    height: 100,
    width: 100,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    color: "gray",
    marginBottom: 5,
  },
  price: {
    color: "red",
    fontWeight: "bold",
  },
});

export default NewPropertyCard;
