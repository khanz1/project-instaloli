import { Text, View, Image, KeyboardAvoidingView, TextInput, Button } from "react-native";
import { APP } from "../helpers/constant";

export const ProfileCard = ({ user }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      <Image
        source={{ uri: APP.GET_PROFILE_PICTURE(user.username) }}
        style={{ width: 50, height: 50 }}
      />
      <View style={{ alignItems: "flex-start", justifyContent: "center" }}>
        <Text>{user.username}</Text>
        <Text>{user.email}</Text>
      </View>
    </View>
  );
}

export const CommentCard = ({ comment }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <Image
          source={{ uri: APP.GET_PROFILE_PICTURE(comment.username) }}
          style={{ flex: 1, width: 50, height: 50 }}
        />
        <View
          style={{
            flex: 6,
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
            paddingLeft: 10,
            paddingRight: 15,
          }}
        >
          <Text>{comment.username}</Text>
          <Text style={{ textAlign: "justify" }}>
            {comment.content}
          </Text>
        </View>
      </View>
    </View>
  );
};