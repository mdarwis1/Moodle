import { StyleSheet } from "react-native";
import colors from "./colors";

const defaultStyles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
  },

  subtitle: {
    color: colors.secondary,
    marginBottom: 15,
  },

  card: {
    backgroundColor: colors.color,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    width: "100%",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.primary,
    fontFamily: "Caprasimo_400Regular",
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
  },

  rating: {
    color: colors.primary,
    marginTop: 2,
  },
  leaderboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.primarylight,
  },

  rank: {
    fontWeight: "bold",
    width: 40,
    fontSize: 16,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primarylight,
    marginVertical: 10,
  },

  reviewText: {
    fontSize: 15,
    color: colors.primary,
    lineHeight: 20,
  },

  name: {
    flex: 1,
    fontSize: 16,
    color: colors.secondary,
  },

  count: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.primary,
  },

  reviewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarylight,
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: colors.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  moodIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },

  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalContent: {
    width: "85%",
    backgroundColor: colors.color,
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.primary,
    fontFamily: "Caprasimo_400Regular",
  },

  modalImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },

  modalSection: {
    marginBottom: 10,
  },

  label: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: "500",
  },

  value: {
    fontSize: 16,

    color: colors.primary,
  },

  favoriteItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primarylight,
    padding: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  iconButton: {
    borderWidth: 0,
    //borderRadius: 70,
    width: 70,
    height: 50,
    marginTop: 8,
    marginLeft: 20,
  },

  deleteIcon: {
    flexDirection: "row",
    padding: 8,
    margin: 2,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: colors.secondary,
    marginLeft: 14,
    marginRight: 14,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 15,
    marginVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleText: {
    fontSize: 36,
    fontWeight: 600,
    color: colors.secondary,
    fontFamily: "Caprasimo_400Regular",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    margin: 8,
  },
  buttonText: {
    fontSize: 20,
  },
  textFieldContainer: {
    position: "relative",
    justifyContent: "center",
  },
  textInputBox: {
    backgroundColor: colors.primarylight,
    width: 250,
    height: 50,
    borderWidth: 2,
    borderRadius: 20,
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    marginBottom: 13,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  profileText: {
    fontSize: 22,
    marginBottom: 20,
    fontFamily: "Caprasimo_400Regular",
    color: colors.secondary,
  },
  emojiText: {
    fontSize: 19,
    marginBottom: 6,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 35,
    height: 35,
  },
});

export default defaultStyles;
