import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProfileCard } from "../../components/ProfileCard";
import { QUERY_SEARCH_USER } from "../../apollo";
import { useQuery } from "@apollo/client";
const SEARCH_TYPE = {
  PUBLIC: "PUBLIC",
  FOLLOWING: "FOLLOWING",
  FOLLOWERS: "FOLLOWERS",
}

export default function SearchUserScreen() {
  const [username, setUsername] = useState("");
  const [searchType, setSearchType] = useState(SEARCH_TYPE.PUBLIC);
  const { data, loading, error, refetch } = useQuery(QUERY_SEARCH_USER, {
    fetchPolicy: "no-cache",
    variables: { username },
  });

  if (error) return <Text>Error! ${error.message}</Text>;

  console.log(JSON.stringify(data, null, 2), username, "<<< d");

  const users = useMemo(() => {
    if (searchType === SEARCH_TYPE.PUBLIC) {
      return data?.searchUser || [];
    }
    if (searchType === SEARCH_TYPE.FOLLOWING) {
      return data?.searchUser.filter(user => user.isFollowing) || [];
    }
    if (searchType === SEARCH_TYPE.FOLLOWERS) {
      return data?.searchUser.filter(user => user.isFollower) || [];
    }
    return [];
  }, [searchType, data]);

  console.log(JSON.stringify(users, null, 2), searchType, username, "<<< users");

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name="search"
          size={20}
          color="#000"
        />
        <TextInput
          style={styles.input}
          placeholder="Search username or name"
          underlineColorAndroid="transparent"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            refetch();
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button
          title="Public"
          color={searchType !== SEARCH_TYPE.PUBLIC && "gray"}
          onPress={() => setSearchType(SEARCH_TYPE.PUBLIC)}
        />
        <Button
          title="Following"
          color={searchType !== SEARCH_TYPE.FOLLOWING && "gray"}
          onPress={() => setSearchType(SEARCH_TYPE.FOLLOWING)}
        />
        <Button
          title="Followers"
          color={searchType !== SEARCH_TYPE.FOLLOWERS && "gray"}
          onPress={() => setSearchType(SEARCH_TYPE.FOLLOWERS)}
        />
      </View>

      <View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView>
            {users.map((user) => (
              <ProfileCard key={user._id} user={user} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingRight: 10,
    gap: 10,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `rgba(0, 0, 0, 0.1)`,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    color: "#424242",
  },
});
