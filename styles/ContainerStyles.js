import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const ContainerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    position: "absolute",
    top: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    borderRadius: 100,
    overflow: "hidden",
  },
  textContainer: {
    marginTop: 20,
    borderRadius: 50,
    padding: 20,
  },
  formContainer: {
    width: width * 0.8,
    justifyContent: "center",
    padding: 20,
    borderRadius: 50,
  },
  listContainer: {
    paddingVertical: 60,
  },
  translationContainer:{
    width: width * 0.8,
    padding: 20,
    borderRadius: 50,
    overflow: "hidden",
    marginVertical: 10,
  },
  buttonContainer: {
    width: width * 0.8,
    justifyContent: "center",
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
  },
});

export default ContainerStyles;
