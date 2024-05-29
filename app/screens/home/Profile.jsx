import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ProfilePostCard } from "../../components/PostCard";
import { QUERY_GET_USER_PROFILE } from "../../apollo";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../context/auth.context";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(QUERY_GET_USER_PROFILE, {
    variables: { id: user._id },
    fetchPolicy: "no-cache",
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! ${error.message}</Text>;

  // console.log(JSON.stringify(data.getUserById, null, 2), ">><>SAD");
  
  return (
    <View style={styles.container}>
      <View style={{ paddingLeft: 10, paddingRight: 10, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Image
            source={{
              uri: `https://api.dicebear.com/8.x/adventurer/png?seed=${user.name}`,
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100 / 2,
              overflow: "hidden",
            }}
          />
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text>{data.getUserById.posts?.length}</Text>
            <Text>posts</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>{data.getUserById.followers?.length}</Text>
            <Text>followers</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>{data.getUserById.followings?.length}</Text>
            <Text>following</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: "flex-start",
        }}
      >
        <Text style={{ fontSize: 16 }}>{user.name}</Text>
      </View>
      <View style={{ paddingTop: 50, width: "100%", height: "100%" }}>
        <FlatList
          data={data.getUserById.posts}
          renderItem={({ item }) => (
            <ProfilePostCard
              uri={item.imgUrl}
            />
          )}
          numColumns={3}
          keyExtractor={(item) => item._id}
          // contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    gap: 10,
  },
});
