import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { PostCard } from "../../components/PostCard";
import { POST_CARD_TYPE } from "../../helpers/constant";
import { useQuery } from "@apollo/client";
import { QUERY_GET_POSTS } from "../../apollo";

export default function FeedScreen() {
  const { loading, error, data } = useQuery(QUERY_GET_POSTS, {
    fetchPolicy: "no-cache",
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! ${error.message}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data.posts}
        renderItem={({ item }) => (
          <PostCard key={item._id} type={POST_CARD_TYPE.FEED} post={item} />
        )}
        keyExtractor={(item) => item._id}
        initialNumToRender={data.posts?.length || 0}
        contentContainerStyle={{ gap: 15, paddingBottom: 20 }}
        ListFooterComponent={
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              alignItems: "center",
            }}
          >
            <Text>This is the end of your feed</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
