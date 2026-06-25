import colors from "@/styles/colors";
import defaultStyles from "@/styles/defaultStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type propsType = {
  placeholder: string;
  placeholderTextColor?: string;
  value: string;
  onChangeText: (newValue: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
};

const TextField: React.FC<propsType> = ({
  placeholder,
  placeholderTextColor = colors.secondary,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={defaultStyles.textFieldContainer}>
      <TextInput
        style={defaultStyles.textInputBox}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        keyboardType={keyboardType}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={defaultStyles.eyeButton}
          onPress={() => setIsSecure(!isSecure)}
        >
          <Ionicons
            name={isSecure ? "eye-off" : "eye"}
            size={22}
            color={colors.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextField;
