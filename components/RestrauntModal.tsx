import colors from "@/styles/colors";
import { supabase } from "@/utils/supabase";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MoodGrid from "./EmojiGrid";
//learned how to fix converting to component w chat gpt chatGPT
//https://chatgpt.com/share/69d79fd0-96bc-8326-9b6d-bd531c2e79b3
//04/09
type Restaurant = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  moods?: string[];
};

type Props = {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  setReviewedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
};
//Learned how to implement reviews + rating
//https://chatgpt.com/share/69dcebe5-c01c-8326-984d-53c382e82d52

const moodImages: Record<string, any> = {
  happy: require("../assets/images/moods/happy.png"),
  sad: require("../assets/images/moods/sad.png"),
  sick: require("../assets/images/moods/sick.png"),
  celebrating: require("../assets/images/moods/celebrating.png"),
  love: require("../assets/images/moods/love.png"),
  mad: require("../assets/images/moods/mad.png"),
  silly: require("../assets/images/moods/silly.png"),
  stressed: require("../assets/images/moods/stressed.png"),
  tired: require("../assets/images/moods/tired.png"),
};

export default function RestaurantModal({
  visible,
  restaurant,
  onClose,
  setReviewedIds,
}: Props) {
  const [review, setReview] = useState("");
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(3.5);
  const [address, setAddress] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const openMaps = () => {
    if (!restaurant) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;
    Linking.openURL(url);
  };
  //4/23/26
  //https://chatgpt.com/share/69ea1894-b738-83ea-823f-c78cb7d360c
  //live arg rating update
  const fetchAverage = async () => {
    if (!restaurant) return;

    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("restaurant_id", restaurant.id);

    if (error) {
      console.log(error);
      return;
    }

    const avg =
      data.length > 0
        ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
        : 3.5;

    setAvgRating(avg);
  };
  useEffect(() => {
    if (visible && restaurant) {
      fetchAverage();
      fetchReviews();
      fetchAddress();
    }
  }, [visible, restaurant]);

  if (!restaurant) return null;
  //4/23/26
  //https://chatgpt.com/share/69ea1894-b738-83ea-823f-c78cb7d360c
  //live adress update
  const fetchAddress = async () => {
    if (!restaurant) return;

    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      });

      if (place) {
        setAddress(
          `${place.name || ""} ${place.street || ""}, ${place.city || ""}`,
        );
      }
    } catch (err) {
      console.log("Address error:", err);
    }
  };

  // Used ChatGPT to figure out how to alert for different requirements
  // 5/2/25
  // https://chatgpt.com/share/69f6b646-48c0-83ea-8e51-32fd0817decb
  const handleSubmit = async () => {
    if (!rating) {
      Alert.alert(
        "Missing rating",
        "Please select a star rating before submitting.",
      );
      return;
    }

    if (!selectedMood) {
      Alert.alert(
        "Missing mood",
        "Please select how this place made you feel.",
      );
      return;
    }

    if (!review.trim()) {
      Alert.alert(
        "Missing review",
        "Please write a short review before submitting.",
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Not logged in", "Please log in to submit a review.");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        restaurant_id: restaurant.id,
        user_id: user.id,
        review_text: review,
        restaurant_name: restaurant.name,
        rating: rating,
        mood: selectedMood,
      },
    ]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Your review was submitted!");

      setReviewedIds((prev) => {
        const updated = new Set(prev);
        updated.add(restaurant.id);
        return updated;
      });

      setReview("");
      setRating(0);
      setSelectedMood(null);
      onClose();
    }
  };

  const fetchReviews = async () => {
    if (!restaurant) return;

    const { data, error } = await supabase
      .from("reviews")
      .select("review_text, rating, mood, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setUserReviews(data || []);
  };
  const resetForm = () => {
    setReview("");
    setRating(0);
    setSelectedMood(null);
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      {/*Used ChatGPT to collapse keyboard
        Date: 4/28/26
        Link: https://chatgpt.com/share/69f0c31b-41c4-83ea-993e-952b6440cb86
      */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
                width: "90%",
                maxWidth: 400,
                maxHeight: "85%",
                elevation: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FlatList
                data={[]}
                keyExtractor={() => "dummy"}
                renderItem={null}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                    ></View>
                    {/*From map screen implementation of emojis*/}
                    {/* Emoji */}
                    {restaurant.moods?.[0] && (
                      <Image
                        source={moodImages[restaurant.moods[0]]}
                        style={{
                          width: 40,
                          height: 40,
                          position: "absolute",
                          top: 10,
                          left: 10,
                          marginBottom: 5,

                          alignSelf: "center",
                        }}
                      />
                    )}
                    <View style={{ alignItems: "center", marginBottom: 15 }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "700",
                          color: colors.primary,
                          fontFamily: "Caprasimo_400Regular",
                        }}
                      >
                        {restaurant.name}
                      </Text>

                      <TouchableOpacity onPress={openMaps}>
                        <Text
                          style={{
                            color: colors.secondary,

                            fontSize: 14,
                            marginTop: 20,
                          }}
                        >
                          {address || "Loading address..."}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        marginTop: 5,
                        fontWeight: "700",
                        color: colors.secondary,
                        fontSize: 16,
                      }}
                    >
                      Average Rating
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 5,
                        borderColor: colors.secondary,
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text
                          key={star}
                          style={{
                            fontSize: 28,
                            marginRight: 6,
                            color: colors.primary,
                          }}
                        >
                          {star <= Math.round(avgRating) ? "★" : "☆"}
                        </Text>
                      ))}
                      <Text
                        style={{
                          marginLeft: 5,
                          marginTop: 5,
                          color: colors.secondary,
                          fontSize: 20,
                        }}
                      >
                        ({avgRating.toFixed(1)})
                      </Text>
                    </View>
                    {/* User Rating */}
                    <Text
                      style={{
                        marginTop: 5,
                        fontWeight: "700",
                        color: colors.secondary,
                        fontSize: 16,
                      }}
                    >
                      Your Rating
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => setRating(star)}
                        >
                          <Text
                            style={{
                              fontSize: 28,
                              marginRight: 6,
                              color: colors.primary,
                            }}
                          >
                            {star <= rating ? "★" : "☆"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text
                      style={{
                        marginTop: 18,
                        fontWeight: "600",
                        color: colors.secondary,
                      }}
                    >
                      How did this place make you feel?
                    </Text>
                    <MoodGrid
                      selected={selectedMood}
                      setSelected={setSelectedMood}
                    />
                    {/*Used ChatGPT to make dropdown list for all user reveiews at a specific place
                Date: 5/2/26
                Link: https://chatgpt.com/share/69f6bbe9-4080-83ea-abbc-5c4b229e9dc0*/}
                    <TouchableOpacity
                      onPress={() => setReviewsOpen(!reviewsOpen)}
                      style={{ marginTop: 15 }}
                    >
                      <Text
                        style={{ fontWeight: "600", color: colors.primary }}
                      >
                        Reviews {reviewsOpen ? "▲" : "▼"}
                      </Text>
                    </TouchableOpacity>
                    {reviewsOpen && (
                      <View style={{ marginTop: 18 }}>
                        {userReviews.length === 0 ? (
                          <Text style={{ color: "gray" }}>
                            No reviews yet. Be the first!
                          </Text>
                        ) : (
                          userReviews.map((r, index) => (
                            <View
                              key={index}
                              style={{
                                marginTop: 10,
                                padding: 12,
                                backgroundColor: "#f9f9f9",
                                borderRadius: 10,
                              }}
                            >
                              <Text>
                                {"⭐".repeat(r.rating)}
                                {"☆".repeat(5 - r.rating)}
                              </Text>

                              {r.mood && <Text>Feeling: {r.mood}</Text>}

                              <Text style={{ marginTop: 5 }}>
                                {r.review_text}
                              </Text>
                            </View>
                          ))
                        )}
                      </View>
                    )}
                    {/* Review */}

                    <TextInput
                      placeholder="Write a review..."
                      value={review}
                      onChangeText={setReview}
                      multiline
                      style={{
                        borderWidth: 1,
                        borderColor: colors.primarylight,
                        borderRadius: 12,
                        padding: 12,
                        marginTop: 15,
                        minHeight: 70,
                        backgroundColor: "white",
                      }}
                    />
                    {/* Submit */}
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={{
                        marginTop: 15,
                        padding: 14,
                        backgroundColor: colors.primary,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        Submit Review
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={{
                        marginTop: 10,
                        padding: 12,
                        backgroundColor: colors.secondary,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                  </>
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
