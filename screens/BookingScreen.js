import { StyleSheet, Text, View, SafeAreaView, Pressable, ActivityIndicator  } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const BookingScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const uid = auth.currentUser.uid;
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Bookings",
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

  useEffect(() => {
    const fetchProducts = async () => {
      const colRef = collection(db, "bookings");
      const q = query(colRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      const userBookings = [];
      querySnapshot.forEach((doc) => {
        userBookings.push(doc.data());
      });
      setItems(userBookings);
      setLoading(false);
    };

    fetchProducts();
  }, [items]);

  //console.log(items);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003580" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      {items.map((item, index) => {
        //console.log(item.bookingDetails.name);
        return (
        <Pressable
          key={index}
          style={{
            backgroundColor: "white",
            marginVertical: 10,
            marginHorizontal: 20,
            borderColor: "#E0E0E0",
            borderWidth: 1,
            padding: 14,
            borderRadius: 6,
          }}
        >
          <View>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {item.bookingDetails.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 7,
              }}
            >
              <MaterialIcons name="stars" size={24} color="green" />
              <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>
                {item.bookingDetails.rating}
              </Text>
              <Text style={{ marginLeft: 3 }}>•</Text>
              <View
                style={{
                  padding: 6,
                  borderRadius: 4,
                  width: 100,
                  backgroundColor: "#0039a6",

                  marginLeft: 4,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 13,
                    fontWeight: "400",
                  }}
                >
                  Genius Level
                </Text>
              </View>

              <View
                style={{
                  padding: 6,
                  borderRadius: 4,
                  width: 120,
                  backgroundColor: "green",

                  marginLeft: 4,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 13,
                    fontWeight: "400",
                  }}
                >
                  Cost: {item.bookingDetails.newPrice} BDT
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      )})}
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({});
