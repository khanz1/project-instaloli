import React from "react";
import { APPBAR_NAME, SCREEN_NAME } from "../helpers/constant";
import CreatePostScreen from "./home/CreatePost";
import ProfileScreen from "./home/Profile";
import FeedScreen from "./home/Feed";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchUserScreen from "./home/SearchUser";
import { Button, View } from "react-native";
import { LogoutButton } from "../components/LogoutButton";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === APPBAR_NAME.FEED) {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === APPBAR_NAME.CREATE_POST) {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === APPBAR_NAME.PROFILE) {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === SCREEN_NAME.SEARCH_USER) {
            iconName = focused ? "search" : "search-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "gray",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name={APPBAR_NAME.FEED} component={FeedScreen} />
      <Tab.Screen
        // options={{ headerShown: false }}
        name={SCREEN_NAME.SEARCH_USER}
        component={SearchUserScreen}
      />
      <Tab.Screen
        // options={{ headerShown: false }}
        name={APPBAR_NAME.CREATE_POST}
        component={CreatePostScreen}
      />
      <Tab.Screen
        options={{
          // headerShown: false,
          headerRight: LogoutButton
        }}
        name={APPBAR_NAME.PROFILE}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
