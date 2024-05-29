import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PostCard } from "../components/PostCard";
import { POST_CARD_TYPE } from "../helpers/constant";
import { useQuery } from "@apollo/client";
import { QUERY_GET_POST_BY_ID } from "../apollo";

export default function PostDetailScreen({ route }) {
  const postId = route.params.postId;
  const { data, loading, error, refetch } = useQuery(QUERY_GET_POST_BY_ID, {
    variables: { id: postId },
  });

  if (loading) return <Text>Submitting...</Text>;
  if (error) return <Text>Submission error! ${error.message}`</Text>;

  return (
    <View style={styles.container}>
      <PostCard
        type={POST_CARD_TYPE.DETAIL}
        post={data.getPostById}
        refetch={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
