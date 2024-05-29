import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { APP, SCREEN_NAME } from "../helpers/constant";
import { MUTATION_REGISTER } from "../apollo";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("zerotwo");
  const [name, setName] = useState("Zero Two");
  const [email, setEmail] = useState("assistance.zerotwo@gmail.com");
  const [password, setPassword] = useState("zerotwo!");

  const [register, { loading, error }] = useMutation(MUTATION_REGISTER);

  const handleOnRegister = async () => {
    try {
      const { data } = await register({
        variables: {
          username,
          email,
          password,
          name,
        },
      });

      navigation.navigate(SCREEN_NAME.LOGIN);
    } catch (err) {
      console.log(err, ">>><<ASDad");
    }
  };

  if (loading) return <Text>Submitting...</Text>;
  if (error) return <Text>Submission error! ${error.message}`</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titleText}>{APP.NAME}</Text>

        <View style={{ width: "100%", padding: 50 }}>
          <TextInput
            style={styles.input}
            placeholder="name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="email"
          />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            style={styles.input}
            placeholder="Password"
          />
          <Button
            onPress={handleOnRegister}
            title="Register"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          Have an account?{" "}
          <Text
            style={{ fontWeight: "bold" }}
            onPress={() => {
              navigation.navigate(SCREEN_NAME.LOGIN);
            }}
          >
            Sign in.
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
  },
});
