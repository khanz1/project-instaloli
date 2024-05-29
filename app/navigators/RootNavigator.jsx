import { useAuth } from "../context/auth.context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  LoginScreen,
  PostDetailScreen,
  RegisterScreen,
} from "../screens";
import { SCREEN_NAME } from "../helpers/constant";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isLoggedIn } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name={SCREEN_NAME.HOME}
              component={HomeScreen}
              options={{
                headerBackVisible: false,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={SCREEN_NAME.POST_DETAIL}
              component={PostDetailScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={SCREEN_NAME.LOGIN}
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREEN_NAME.REGISTER}
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}