import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
  microphoneButton: {
    width: 200,
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  backButton: {
    borderRadus: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  translateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
  },
  picker: {
    marginTop: 20,
    borderRadius: 50,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 40,
  },
});

export default ButtonStyles;
