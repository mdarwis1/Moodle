import colors from "@/styles/colors";
import React from "react";
import { FlatList, Image, Pressable, StyleSheet } from "react-native";

type Mood = {
  id: string;
  image: any;
};

type MoodGridProps = {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
};

const MOODS: Mood[] = [
  { id: "happy", image: require("../assets/images/moods/happy.png") },
  { id: "sad", image: require("../assets/images/moods/sad.png") },
  { id: "sick", image: require("../assets/images/moods/sick.png") },
  {
    id: "celebrating",
    image: require("../assets/images/moods/celebrating.png"),
  },
  { id: "love", image: require("../assets/images/moods/love.png") },
  { id: "mad", image: require("../assets/images/moods/mad.png") },
  { id: "silly", image: require("../assets/images/moods/silly.png") },
  { id: "stressed", image: require("../assets/images/moods/stressed.png") },
  { id: "tired", image: require("../assets/images/moods/tired.png") },
];

//Used ChatGPT to help create the emoji grid
//https://chatgpt.com/share/69aad7cf-7158-800a-a593-67d9c54fb4a9
//Date: 3/6/26
export default function MoodGrid({ selected, setSelected }: MoodGridProps) {
  function toggleMood(id: string) {
    if (selected === id) {
      setSelected(null);
    } else {
      setSelected(id);
    }
  }

  return (
    <FlatList<Mood>
      data={MOODS}
      numColumns={3}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={[styles.emojiBox, selected === item.id && styles.selected]}
          onPress={() => toggleMood(item.id)}
        >
          <Image source={item.image} style={styles.image} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  emojiBox: {
    width: 70,
    height: 70,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f1ead0",
  },
  selected: {
    borderWidth: 3,
    borderRadius: 12,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 32,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
