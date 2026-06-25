import Button from "@/components/Button";
import DeleteIconButton from "@/components/DeleteIconButton";
import colors from "@/styles/colors";
import defaultStyles from "@/styles/defaultStyles";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//Base funcitonality from sem 1 project + brandLogo App
//used chatGPT to fix bug issues when transferred
//https://chatgpt.com/share/69f809de-accc-83ea-8e8f-e40dc1d1a97d
//05/01/26
type Review = {
  id: number;
  restaurant_name: string;
  review_text: string;
  rating: number;
  mood: string;
  user_name: string;
};

type LeaderboardUser = {
  user_name: string;
  total_reviews: number;
};
const moodImages: Record<string, any> = {
  happy: require("../../assets/images/moods/happy.png"),
  sad: require("../../assets/images/moods/sad.png"),
  sick: require("../../assets/images/moods/sick.png"),
  celebrating: require("../../assets/images/moods/celebrating.png"),
  love: require("../../assets/images/moods/love.png"),
  mad: require("../../assets/images/moods/mad.png"),
  silly: require("../../assets/images/moods/silly.png"),
  stressed: require("../../assets/images/moods/stressed.png"),
  tired: require("../../assets/images/moods/tired.png"),
};
export default function ReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  const loadItems = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data as Review[]);
    }
  };
  const loadLeaderboard = async () => {
    const { data, error } = await supabase.from("reviews").select(`
      user_id,
      profiles (
        first_name,
        last_name
      )
    `);

    if (error || !data) {
      console.log(error);
      return;
    }

    const counts: Record<string, number> = {};

    data.forEach((review: any) => {
      const first = review.profiles?.first_name;
      const last = review.profiles?.last_name;

      if (!first || !last) return;

      const fullName = `${first} ${last}`;

      counts[fullName] = (counts[fullName] || 0) + 1;
    });

    const ranked = Object.entries(counts)
      .map(([user_name, total_reviews]) => ({
        user_name,
        total_reviews,
      }))
      .sort((a, b) => b.total_reviews - a.total_reviews);

    setLeaderboard(ranked);
  };
  useFocusEffect(
    useCallback(() => {
      loadItems();
      loadLeaderboard();
    }, []),
  );

  //Used ChatGPT to not just delete in react but also supabase (RLS policy)
  // 5/2/26
  //https://chatgpt.com/share/69f6e082-5d3c-83ea-9766-1f15de01f172

  const deleteReview = async (reviewId: number) => {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      console.log("Delete error:", error.message);
      return;
    }

    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setSelectedReview(null);

    loadLeaderboard();
  };

  const confirmDelete = (reviewId: number) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteReview(reviewId),
        },
      ],
    );
  };

  return (
    <View style={defaultStyles.listContainer}>
      {/* Leaderboard */}
      <View
        style={[
          defaultStyles.card,
          { marginTop: 25, marginBottom: 10, flexGrow: 0 },
        ]}
      >
        <Text style={defaultStyles.sectionTitle}>Leaderboard</Text>
        {leaderboard.map((user, index) => (
          <View key={index} style={defaultStyles.leaderboardRow}>
            <Text style={defaultStyles.rank}>#{index + 1}</Text>
            <Text style={defaultStyles.name}>{user.user_name}</Text>
            <Text style={defaultStyles.count}>{user.total_reviews}</Text>
          </View>
        ))}
      </View>

      <Text style={defaultStyles.titleText}>Your Reviews</Text>
      <Text style={defaultStyles.subtitle}>Total: {reviews.length}</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedReview(item)}>
            <View style={defaultStyles.reviewCard}>
              <Image
                source={moodImages[item.mood]}
                style={defaultStyles.moodIcon}
              />

              <View style={{ flex: 1 }}>
                <Text style={defaultStyles.reviewTitle}>
                  Review: {item.restaurant_name}
                </Text>
                <Text style={defaultStyles.rating}>{item.rating}/5 ⭐</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.secondary}
              />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No reviews yet.
          </Text>
        }
      />

      {/* Review Details Modal */}
      <Modal
        visible={selectedReview !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedReview(null)}
      >
        <View style={defaultStyles.modalBackground}>
          <View style={defaultStyles.modalContent}>
            {/* Header */}
            <Text
              style={[
                defaultStyles.modalTitle,
                {
                  textAlign: "center",
                },
              ]}
            >
              {selectedReview?.restaurant_name}
            </Text>
            <View style={{ position: "absolute", right: 0, top: 0 }}>
              <DeleteIconButton
                onPress={() => {
                  if (!selectedReview) return;
                  confirmDelete(selectedReview.id);
                }}
              />
            </View>

            <View style={defaultStyles.divider} />

            {/* Info Sections */}

            <View style={defaultStyles.modalSection}>
              <Text style={defaultStyles.label}>Rating:</Text>
              <Text style={defaultStyles.value}>
                {selectedReview?.rating}/5 ⭐
              </Text>
            </View>

            <View style={defaultStyles.modalSection}>
              <Text style={defaultStyles.label}>Mood:</Text>
              <Text style={defaultStyles.value}>{selectedReview?.mood}</Text>
            </View>

            <View style={defaultStyles.modalSection}>
              <Text style={defaultStyles.label}>Review:</Text>
              <Text style={defaultStyles.value}>
                {selectedReview?.review_text}
              </Text>
            </View>

            {/* Button */}
            <View style={{ width: "100%", marginTop: 0 }}>
              <Button
                title="Close"
                onPress={() => setSelectedReview(null)}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
