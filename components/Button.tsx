import colors from "@/styles/colors";
import React from "react";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";

type propsType = {
  title: string;
  color?: string;
  textColor?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const Button: React.FC<propsType> = ({
  title,
  color = colors.primary,
  textColor = colors.background,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 12,
        height: 52,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color,
        borderRadius: 14,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          color: textColor,
          textAlign: "center",
          fontWeight: "600",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
