import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ToastAndroid,
  Alert
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { savedPlaces } from "../SavedReducer";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import BkashImg from "../assets/bkash.png";

const ConfirmationScreen = () => {
  const route = useRoute();
  console.log(route.params);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [userPin, setUserPin] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Confirmation",
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
  const dispatch = useDispatch();
  const uid = auth.currentUser.uid;

  const paymentConfirm = () => {
    setModalVisible(true);
  };

  const confirmBooking = () => {
    console.log(mobileNumber);
    let temp = Math.floor(100000 + Math.random() * 900000);
    setOtp(temp);
    console.log("Generated Otp: "+temp);
    ToastAndroid.show(`Your OTP is: ${temp}`, ToastAndroid.SHORT);  
    setModalVisible(false);
    setOtpModalVisible(true);
  };

  const handleOtpSubmission = () => {
    console.log(otp, userOtp);
    if (userOtp == otp) {
      console.log("OTP matched. Please enter your PIN.");
      setOtpModalVisible(false);
      setPinModalVisible(true);
    } else {
      console.log("OTP did not match. Please try again.");
      ToastAndroid.show("OTP did not match. Please try again.", ToastAndroid.SHORT);
    }
  };

  const handlePinSubmission = async() => {
    //console.log(userPin);
    setPinModalVisible(false);
    dispatch(savedPlaces(route.params));
    //each booking id will be unique
    await setDoc(
      doc(db, "bookings", `${route.params.name}-${Date.now()}`),
      {
        bookingDetails: { ...route.params },
        bookingTime: new Date(),
        userId: uid,
      }
    );
    ToastAndroid.show("Booking Confirmed!", ToastAndroid.SHORT);
    navigation.navigate("Bookings");
  };
  return (
    <View>
      <Pressable style={{ backgroundColor: "white", margin: 10 }}>
        <View
          style={{
            marginHorizontal: 12,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              {route.params.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 7,
              }}
            >
              <MaterialIcons name="stars" size={24} color="green" />
              <Text>{route.params.rating}</Text>
              <View
                style={{
                  backgroundColor: "#003580",
                  paddingVertical: 3,
                  borderRadius: 5,
                  width: 100,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 15,
                  }}
                >
                  Genius Level
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#17B169",
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 6,
              marginRight: 14,
            }}
          >
            <Text style={{ color: "white", fontSize: 13 }}>
              Travel sustainable
            </Text>
          </View>
        </View>

        <View
          style={{
            margin: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 60,
          }}
        >
          <View>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
              Check In
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#007FFF" }}
            >
              {route.params.startDate}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
              Check Out
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#007FFF" }}
            >
              {route.params.endDate}
            </Text>
          </View>
        </View>
        <View style={{ margin: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
            Rooms and Guests
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#007FFF" }}>
            1 Rooms {route.params.adults} Adults {route.params.children}{" "}
            Children
          </Text>
        </View>

        <Pressable onPress={paymentConfirm} style={styles.payButton}>
          <Text style={styles.payButtonText}>Confirm Payment</Text>
        </Pressable>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <View style={styles.modalImgView}>
                    <Image
                      source={BkashImg}
                      style={{ width: "100%", height: "100%", padding: 10 }}
                    />
                  </View>

                  <View style={styles.marcentInfo}>
                    <Text style={styles.text}>
                      Check In: {route.params.startDate}
                    </Text>
                    <Text style={styles.text}>
                      Check Out: {route.params.endDate}
                    </Text>
                    <Text style={styles.text}>
                      Amount: BDT {route.params.newPrice}
                    </Text>
                  </View>

                  <View style={styles.modalContent}>
                    <Text style={styles.text}>Your bKash account number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g 01XXXXXXXXX"
                      onChangeText={(text) => setMobileNumber(text)}
                      value={mobileNumber}
                    />

                    <View style={styles.buttonContainer}>
                      <Button
                        title="PROCEED"
                        color="#BD1E5D"
                        onPress={confirmBooking}
                      />
                      {/* <Button
                        title="CLOSE"
                        color="#BD1E5D"
                        onPress={() => setModalVisible(!modalVisible)}
                      /> */}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        alignItems: "center",
                        color: "white",
                        fontSize: 16,
                        marginTop: 15,
                      }}
                    >
                      <MaterialIcons name="call" size={11} color="white" />
                      16247
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={otpModalVisible}
          onRequestClose={() => {
            setOtpModalVisible(!otpModalVisible);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setOtpModalVisible(!otpModalVisible)}
          >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <View style={styles.modalImgView}>
                    <Image
                      source={BkashImg}
                      style={{ width: "100%", height: "100%", padding: 10 }}
                    />
                  </View>

                  <View style={styles.marcentInfo}>
                    <Text style={styles.text}>
                      Check In: {route.params.startDate}
                    </Text>
                    <Text style={styles.text}>
                      Check Out: {route.params.endDate}
                    </Text>
                    <Text style={styles.text}>
                      Amount: BDT {route.params.newPrice}
                    </Text>
                  </View>

                  <View style={styles.modalContent}>
                    <Text style={styles.text}>Enter 6 Digit OTP</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g 123456"
                      onChangeText={(text) => setUserOtp(text)}
                      value={userOtp}
                    />

                    <View style={styles.buttonContainer}>
                      <Button
                        title="PROCEED"
                        color="#BD1E5D"
                        onPress={handleOtpSubmission}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        alignItems: "center",
                        color: "white",
                        fontSize: 16,
                        marginTop: 15,
                      }}
                    >
                      <MaterialIcons name="call" size={11} color="white" />
                      16247
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={pinModalVisible}
          onRequestClose={() => {
            setPinModalVisible(!pinModalVisible);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setPinModalVisible(!pinModalVisible)}
          >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <View style={styles.modalImgView}>
                    <Image
                      source={BkashImg}
                      style={{ width: "100%", height: "100%", padding: 10 }}
                    />
                  </View>

                  <View style={styles.marcentInfo}>
                    <Text style={styles.text}>
                      Check In: {route.params.startDate}
                    </Text>
                    <Text style={styles.text}>
                      Check Out: {route.params.endDate}
                    </Text>
                    <Text style={styles.text}>
                      Amount: BDT {route.params.newPrice}
                    </Text>
                  </View>

                  <View style={styles.modalContent}>
                    <Text style={styles.text}>Enter 5 Digit PIN</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g 12345"
                      onChangeText={(text) => setUserPin(text)}
                      value={userPin}
                      secureTextEntry={true}
                    />

                    <View style={styles.buttonContainer}>
                      <Button
                        title="PROCEED"
                        color="#BD1E5D"
                        onPress={handlePinSubmission}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        alignItems: "center",
                        color: "white",
                        fontSize: 16,
                        marginTop: 15,
                      }}
                    >
                      <MaterialIcons name="call" size={11} color="white" />
                      16247
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Pressable>
    </View>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ff5c5c",
  },
  payButton: {
    backgroundColor: "#003580",
    width: 130,
    padding: 5,
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 4,
    alignSelf: "center",
  },
  payButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    color: "#ffffff",
  },
  text: {
    fontSize: 16,
    color: "#ffffff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderRadius: 7,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    color: "black",
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: "#E3156F",
    borderRadius: 2,
    padding: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImgView: {
    marginTop: 5,
    width: "100%",
    height: "20%",
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  modalContent: {
    margin: 5,
    padding: 10,
    textAlign: "center",
    backgroundColor: "#E3156F",
    alignItems: "center",
  },
  marcentInfo: {
    marginTop: 10,
    width: "90%",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
});
