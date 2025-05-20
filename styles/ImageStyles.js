import { StyleSheet } from "react-native";

const ImageStyles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 100,
  },
  logoHeader: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 75,
  },
});

export default ImageStyles;
