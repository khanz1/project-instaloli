import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { MUTATION_CREATE_POST } from "../../apollo";
import { useNavigation } from "@react-navigation/native";
import { APPBAR_NAME } from "../../helpers/constant";

const dimensions = Dimensions.get("screen");
const tags = ["travel", "adventure", "food", "music", "health", "cooking"];

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [imgUrl, setImgUrl] = useState(
    "https://4.bp.blogspot.com/-WJcu-UCgNYU/WZoyUY1NqvI/AAAAAAAAB6E/Xb1NXyOAp1MADPNMJPm_ByPoZVJnkMETQCLcBGAs/s1600/IMG_7517.JPG"
  );
  const [content, setContent] = useState(
    "Eric and I recently returned from three weeks of traveling in beautiful Switzerland - the land of my ancestors!  We visited my family members who live there and took in our fill of historic sites and glorious hikes.  From exploring Roman ruins and Medieval castles (my husband is a history professor, after all!) to hiking in the Swiss Alps (sometimes barefoot), Switzerland delighted us with one incredible experience after another. "
  );
  const [selectedTags, setSelectedTags] = useState([tags[0], tags[1]]);
  const [createPost] = useMutation(MUTATION_CREATE_POST, {
    variables: {
      content,
      tags: selectedTags,
      imgUrl,
    },
  });

  const handleOnCreatePost = async () => {
    try {
      console.log("create post", { content, tags, imgUrl });
      await createPost();
      setImgUrl("");
      setContent("");
      setSelectedTags([]);
      // navigation.navigate(APPBAR_NAME.FEED);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput
          placeholder="Image Url"
          value={imgUrl}
          onChangeText={(text) => setImgUrl(text)}
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            marginVertical: 20,
          }}
        />
        {imgUrl && (
          <Image
            source={{
              uri: imgUrl,
            }}
            style={{
              width: "100%",
              height: dimensions.width,
            }}
          />
        )}
        <TextInput
          placeholder="Write a caption..."
          onChangeText={(text) => setContent(text)}
          value={content}
          style={{
            height: 200,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            marginVertical: 20,
          }}
        />
        <View>
          <ScrollView
            contentContainerStyle={{ gap: 10 }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          >
            {tags.map((tag, index) => (
              <Button
                key={index}
                title={tag}
                color={selectedTags.includes(tag) ? "blue" : "#ccc"}
                onPress={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter((t) => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 10 }}>
        <Button title="Post" onPress={handleOnCreatePost} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
});
