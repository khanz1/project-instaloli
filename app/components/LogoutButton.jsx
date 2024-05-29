import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { SCREEN_NAME } from "../helpers/constant";
import { useAuth } from "../context/auth.context";
import { Button, View } from "react-native";

export const LogoutButton = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigation();
  const handleOnLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("user");
    setIsLoggedIn(false);
    navigate.navigate(SCREEN_NAME.LOGIN);
  };
  return (
    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Button title="logout" onPress={handleOnLogout} />
    </View>
  );
};
