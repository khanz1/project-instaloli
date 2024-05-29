import React, { useMemo, useState } from "react";
import {
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { POST_CARD_TYPE, SCREEN_NAME } from "../helpers/constant";
import { CommentCard } from "./ProfileCard";
import { timeAgo } from "../helpers/formatter";

const dimensions = Dimensions.get("screen");

export const ProfilePostCard = ({ uri }) => {
  return (
    <View>
      <Image
        source={{ uri }}
        style={{
          width: dimensions.width / 3,
          height: dimensions.width / 3,
        }}
      />
    </View>
  );
};
import { useAuth } from "../context/auth.context";
import { useMutation } from "@apollo/client";
import { MUTATION_CREATE_COMMENT, MUTATION_LIKE_POST } from "../apollo";

export const PostCard = ({ type, post, refetch }) => {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const navigation = useNavigation();
  const [likePost] = useMutation(MUTATION_LIKE_POST, {
    variables: { postId: post._id },
  });
  const [commentPost] = useMutation(MUTATION_CREATE_COMMENT, {
    variables: { postId: post._id, content: comment },
  });
  const handleNavigateToDetail = () => {
    navigation.navigate(SCREEN_NAME.POST_DETAIL, { postId: post._id });
  };

  const handleOnComment = async () => {
    await commentPost();
    await refetch();
    setComment("");
    Keyboard.dismiss();
  }

  const handleOnLike = async () => {
    await likePost();
    await refetch();
  };
  const isLiked = useMemo(() => {
    return post.likes.find((like) => like.username === user.username);
  }, [user, post.likes]);

  return (
    <View>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <Image
            source={{
              uri: `https://api.dicebear.com/8.x/adventurer/png?seed=${post.author?.name}`,
            }}
            style={{ width: 50, height: 50 }}
          />
          <View style={{ alignItems: "flex-start", justifyContent: "center" }}>
            <Text>{post.author?.username}</Text>
            <Text>{post.author?.email}</Text>
          </View>
        </View>
        <View>
          {type === POST_CARD_TYPE.FEED && (
            <TouchableOpacity onPress={handleNavigateToDetail}>
              <Image
                source={{
                  uri: post.imgUrl,
                }}
                style={{
                  width: dimensions.width,
                  height: dimensions.width,
                }}
              />
            </TouchableOpacity>
          )}
          {type === POST_CARD_TYPE.DETAIL && (
            <Image
              // source={{ uri: "https://reactnative.dev/docs/assets/p_cat2.png" }}
              source={{ uri: post.imgUrl }}
              style={{
                width: dimensions.width,
                height: dimensions.width,
              }}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 15,
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked && "#FF4033"}
              size={30}
              onPress={handleOnLike}
            />
            <Ionicons name="chatbubble-outline" size={30} />
            <Ionicons name="paper-plane-outline" size={30} />
          </View>
          <View>
            <Ionicons name="bookmark-outline" size={30} />
          </View>
        </View>
        {post.likes.length > 0 && (
          <View
            style={{
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {post.likes?.length} Likes
            </Text>
          </View>
        )}
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            gap: 5,
          }}
        >
          <Text>
            <Text style={{ fontWeight: "bold" }}>{post.author?.username} </Text>
            <Text>{post.content}</Text>
          </Text>
          <View style={{ gap: 10 }}>
            <Text>{post.tags.map((tag) => `#${tag}`).join(" ")}</Text>
          </View>
          {type === POST_CARD_TYPE.FEED && post.comments.length > 0 && (
            <Text style={{ color: "gray" }}>
              View all {post.comments?.length} comments
            </Text>
          )}
          {type === POST_CARD_TYPE.DETAIL && (
            <View>
              <Text style={{ color: "gray" }}>{timeAgo(post.createdAt)}</Text>
              {post.comments.map((comment, index) => (
                <CommentCard key={index} comment={comment} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {type === POST_CARD_TYPE.DETAIL && (
        <View>
          <View style={{ flexDirection: "row", padding: 10, gap: 10 }}>
            <TextInput
              style={{ flex: 5 }}
              value={comment}
              onChangeText={(text) => setComment(text)}
              placeholder="Write your comment"
            />
            <Button title="Post" style={{ height: "100%" }} onPress={handleOnComment} />
          </View>
        </View>
      )}
    </View>
  );
};
