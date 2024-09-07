import { Dimensions, StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    root: {
      backgroundColor: "#e3f2fd",
      flex: 1,
      fontWeight: "500",
      overflow: "hidden",
      height: "100%",
    },
    header: {
      backgroundColor: "#2196f3",
      height: 60,
      width: "100%",
      borderBottomColor: "#1976d2",
      borderBottomWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
    headerText: {
      fontSize: 24,
      color: "#e3f2fd",
      textTransform: "uppercase",
      fontWeight: "500",
    },
    headerWrapperIcon: {
        position: "absolute", 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#BBDEFB", 
        borderRadius: 10
    },
    headerIcon: {
        height: 35, 
        width: 35
    },
    main: {
      minHeight: Dimensions.get("window").height - 60,
      height: "100%",
      flex: 1
    },
    wrapperCircle: {
      alignItems: "center",
      justifyContent: "center",
      height: 300,
      width: 300,
      position: "absolute"
    },
    modelWrapper: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 250,
      minHeight: 200,
      backgroundColor: "#BBDEFB",
      zIndex: 120,
      transform: [{ translateX: -125 }, { translateY: -100 }],
      borderColor: "#1976d2",
      borderWidth: 2,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      flexDirection: "column"
    },
    inputMax: {
      width: 40,
      zIndex: 120,
      borderWidth: 2,
      paddingHorizontal: 5,
      borderColor: "#1976d2",
      borderRadius: 10,
      textAlign:"center"
    },
    inputMaxInvalid: {
      borderColor: "red"
    }
  })
  