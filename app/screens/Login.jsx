import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { APP, SCREEN_NAME } from "../helpers/constant";
import { MUTATION_LOGIN } from "../apollo";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/auth.context";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setIsLoggedIn, setUser } = useAuth();
  const [form, setForm] = React.useState({
    username: "khanz",
    password: "khanz!",
  });
  const [login, { loading, error }] = useMutation(MUTATION_LOGIN);

  const handleOnLogin = async () => {
    try {
      const { data } = await login({ variables: form });

      await SecureStore.setItemAsync("access_token", data.login.access_token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.login.user));
      setIsLoggedIn(true);
      setUser(data.login.user)
      navigation.navigate(SCREEN_NAME.HOME);
    } catch (err) {
      console.log(err, ">>><<ASDad");
    }
  };

  console.log(error, '>>>ads')

  if (loading) return <Text>Submitting...</Text>;
  if (error) return <Text>Submission error! ${error.message}`</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titleText}>{APP.NAME}</Text>

        <View style={{ width: "100%", padding: 50 }}>
          <TextInput
            name="username"
            value={form.username}
            onChangeText={(username) => setForm({ ...form, username })}
            style={styles.input}
            placeholder="Phone number, email or username"
          />
          <TextInput
            name="password"
            onChangeText={(password) => setForm({ ...form, password })}
            value={form.password}
            style={styles.input}
            secureTextEntry={true}
            placeholder="Password"
          />
          <Button
            title="Log in"
            onPress={handleOnLogin}
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          Don't have an account?{" "}
          <Text
            style={{ fontWeight: "bold" }}
            onPress={() => {
              navigation.navigate(SCREEN_NAME.REGISTER);
            }}
          >
            Sign up.
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
