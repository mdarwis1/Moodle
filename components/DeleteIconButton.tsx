import colors from "@/styles/colors";
import defaultStyles from "@/styles/defaultStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { TouchableHighlight, View } from "react-native";

type propsType = {
  onPress: () => void;
};

const DeleteIconButton: React.FC<propsType> = ({ onPress }) => {
  return (
    <TouchableHighlight
      style={defaultStyles.iconButton}
      underlayColor="#ddd"
      onPress={onPress}
    >
      <View style={defaultStyles.deleteIcon}>
        <MaterialCommunityIcons
          name="delete"
          size={24}
          color={colors.deleteColor}
        />
      </View>
    </TouchableHighlight>
  );
};

export default DeleteIconButton;
