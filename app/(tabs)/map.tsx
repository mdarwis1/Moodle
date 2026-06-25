import { useAuth } from "@/components/AuthProvider";
import RestaurantModal from "@/components/RestrauntModal";
import defaultStyles from "@/styles/defaultStyles";
import { supabase } from "@/utils/supabase";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

//Used ChatGPT to learn how to implement react native map and set initial location
//https://chatgpt.com/share/69aec648-cb88-800f-9c20-c448a8418ea0
//Date: 3/10/26

type Restaurant = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  tags?: {
    cuisine?: string;
    amenity?: string;
  };
  moods?: string[];
};

export default function MapScreen() {
  // fallback location so map never loads blank
  const [region, setRegion] = useState({
    latitude: 42.08,
    longitude: -88.05,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Learned from ChatGPT how to implement starter modal when marker clicked
  // https://chatgpt.com/share/69ca086f-d194-8326-88b7-4af6c3aec1af
  // Date: 3/30/26
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Learned from ChatGPT how to implement Overpass API
  // https://chatgpt.com/share/69c19dd6-3038-800f-b5fc-ebc2a8e99aa0
  // Date: 3/23/26

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<number>>(new Set());

  // Learned from ChatGPT how to show emoji in map header
  //https://chatgpt.com/share/69dcea49-2b0c-83ea-95b6-4c3f7e780b4e
  // 4/13/26
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
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        selectedMood ? (
          <Image
            source={moodImages[selectedMood]}
            style={{ width: 35, height: 35 }}
          />
        ) : (
          <Text style={{ fontSize: 18 }}>Map</Text>
        ),
    });
  }, [selectedMood]);
  // Used ChatGPT to connect restaurants to supabase
  // https://chatgpt.com/share/69cd15ca-45ec-832e-b475-9f86abfd178b
  // Date: 4/1/26

  const { session } = useAuth();

  // auto-updates map when mood changed
  useFocusEffect(
    useCallback(() => {
      async function fetchUserMood() {
        if (!session?.user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("emoji")
          .eq("id", session.user.id)
          .single();

        if (!error) {
          setSelectedMood(data?.emoji || null);
        }
      }

      fetchUserMood();
    }, [session]),
  );

  console.log("Selected mood:", selectedMood);

  // openstreet via overpass query to grab restaurants
  const fetchRestaurants = async (lat: number, lon: number) => {
    const query = `
[out:json][timeout:25];
(
  node["amenity"="restaurant"](around:10000, ${lat}, ${lon});
  node["amenity"="fast_food"](around:10000, ${lat}, ${lon});
  node["amenity"="cafe"](around:10000, ${lat}, ${lon});
  node["amenity"="bar"](around:10000, ${lat}, ${lon});
    node["amenity"="pub"](around:10000, ${lat}, ${lon});

  node["amenity"="food_court"](around:10000, ${lat}, ${lon});
    node["amenity"="ice_cream"](around:10000, ${lat}, ${lon});

);
out;
`;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
      });

      const text = await res.text();
      //console.log("RAW RESPONSE:", text);

      const data = JSON.parse(text);
      const results: Restaurant[] = data.elements
        .filter((el: any) => el.lat != null && el.lon != null)
        .map((el: any) => ({
          id: el.id,
          name: el.tags?.name || "Unnamed",
          latitude: Number(el.lat),
          longitude: Number(el.lon),
          tags: {
            cuisine: el.tags?.cuisine,
            amenity: el.tags?.amenity,
          },
        }));
      console.log("COUNT:", data.elements.length);
      //console.log("RESULTS:", results);
      const resultsWithMoods = results.map((r) => ({
        ...r,
        moods: getMoods(r),
      }));

      setRestaurants(resultsWithMoods);
    } catch (err) {
      console.log("Overpass error:", err);
    }
  };
  //location permissions
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      setRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      await fetchRestaurants(lat, lon);
    })();
  }, []);

  if (!region) return <View style={defaultStyles.mapContainer} />;

  // console.log("REGION:", region);

  // console.log("Rendering markers:", restaurants.length);

  // fitting all markers in map even when close together
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (restaurants.length && mapRef.current) {
      mapRef.current.fitToCoordinates(
        restaurants.map((r) => ({
          latitude: r.latitude,
          longitude: r.longitude,
        })),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        },
      );
    }
  }, [restaurants]);

  // Used ChatGPT to create mood tagging system and filter map
  // https://chatgpt.com/share/69cd156d-5d8c-832b-ae20-7e290a8a76e3
  // Date: 3/31/26

  const cuisineToMood: Record<string, string[]> = {
    italian: ["love"],
    mexican: ["celebrating"],
    steak_house: ["celebrating"],
    chinese: ["mad", "sick"],
    burger: ["silly"],
    pizza: ["stressed"],
    thai: ["sick"],
    american: ["happy"],
    japanese: ["sad"],
    sushi: ["sad"],
    indian: ["stressed", "silly"],
    french: ["mad", "love"],
    mediterranean: ["happy"],
  };

  const amenityToMood: Record<string, string[]> = {
    cafe: ["tired", "stressed"],
    fast_food: ["silly"],
    restaurant: ["happy"],
    bar: ["celebrating"],
    pub: ["celebrating"],
    ice_cream: ["happy", "silly"],
    food_court: ["stressed"],
  };

  function getMoods(restaurant: Restaurant): string[] {
    const moods = new Set<string>();

    const cuisineTag = restaurant.tags?.cuisine;
    const amenityTag = restaurant.tags?.amenity;

    // cuisine
    if (cuisineTag) {
      const cuisines = cuisineTag.split(";");

      cuisines.forEach((c) => {
        const clean = c.trim().toLowerCase();

        if (cuisineToMood[clean]) {
          cuisineToMood[clean].forEach((m) => moods.add(m));
        }
      });
    }

    // amenities
    if (amenityTag) {
      const cleanAmenity = amenityTag.toLowerCase();

      if (amenityToMood[cleanAmenity]) {
        amenityToMood[cleanAmenity].forEach((m) => moods.add(m));
      }
    }

    return Array.from(moods);
  }

  const filteredRestaurants = selectedMood
    ? restaurants.filter((r) => r.moods?.includes(selectedMood))
    : restaurants;
  console.log(filteredRestaurants);

  // load all restaurants user has reviewed
  useFocusEffect(
    useCallback(() => {
      const fetchReviewed = async () => {
        if (!session?.user) return;

        const { data, error } = await supabase
          .from("reviews")
          .select("restaurant_id")
          .eq("user_id", session.user.id);

        if (!error && data) {
          const ids = new Set(data.map((r) => r.restaurant_id));

          setReviewedIds(ids);
        }
      };

      fetchReviewed();
    }, [session]),
  );

  return (
    <View style={defaultStyles.mapContainer}>
      <MapView
        ref={mapRef}
        style={defaultStyles.map}
        region={region}
        showsUserLocation={true}
      >
        {filteredRestaurants.map((r) => (
          // Used ChatGPT to change pin color based on whether reviewed or not
          // 5/2/26
          // https://chatgpt.com/share/69f6c0c3-56d0-83ea-9111-559705cfdb87
          <Marker
            key={r.id}
            coordinate={{
              latitude: r.latitude,
              longitude: r.longitude,
            }}
            pinColor={reviewedIds.has(r.id) ? "green" : "red"}
            title={r.name}
            onPress={() => {
              setSelectedRestaurant(r);
              setModalVisible(true);
            }}
            tracksViewChanges={false}
          />
        ))}
      </MapView>

      {selectedMood && (
        <Image
          source={moodImages[selectedMood]}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 50,
            height: 50,
            zIndex: 10,
            borderWidth: 2,
            borderColor: "black",
            borderRadius: 5,
          }}
        />
      )}

      <RestaurantModal
        visible={modalVisible}
        restaurant={selectedRestaurant}
        onClose={() => setModalVisible(false)}
        setReviewedIds={setReviewedIds}
      />
    </View>
  );
}
