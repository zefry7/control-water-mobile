import { useEffect, useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableWithoutFeedback, Animated } from "react-native";
import AnimatedProgressWheel from 'react-native-progress-wheel';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [maxDay, setMaxDay] = useState(10)
  const [waterControl, setWaterControl] = useState(0)
  const [count, setCount] = useState(0)
  const mass = useState(new Array(10).fill(0))[0]
  const animGlass = useState(new Animated.Value(130))[0]


  useEffect(() => {
    const ttt = async () => {
      let a = await AsyncStorage.getItem("count")
      if (a) {
        setCount(Number(a))
      }
    }
    ttt()
  }, [])

  const handleClickButton = () => {
    if (maxDay > count) {
      setWaterControl(water => water + 10);
      setCount(count => count + 1)

      Animated.timing(animGlass, {
        toValue: 150,
        duration: 300,
        useNativeDriver: false
      }).start()

      setTimeout(() => {
        Animated.timing(animGlass, {
          toValue: 130,
          duration: 300,
          useNativeDriver: false
        }).start()
      }, 300)
    }
  }

  useEffect(() => {
    AsyncStorage.setItem("count", count.toString());
  }, [count])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Logo</Text>
      </View>
      <View style={styles.main}>
        <View style={{ position: "relative", flex: 1, justifyContent: "center", alignItems: "center", top: -100 }}>
          <View style={styles.wrapperCircle}>
            <AnimatedProgressWheel size={350} width={10} color={'#1976D2'} progress={waterControl} backgroundColor={'#BBDEFB'} rotation="-90deg" duration={600} />
          </View>
          {count != maxDay
            ? <>
              <View style={{ maxHeight: 150, width: 150, flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <TouchableWithoutFeedback style={{ height: 350, width: 350 }} onPress={handleClickButton}>
                  <Animated.View style={{ height: animGlass }}>
                    <Image source={{ uri: "assets/images/glass.svg" }} style={{ height: "100%", width: 130, cursor: "pointer" }} />
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
              <Text style={{ fontSize: 24, lineHeight: 24, color: '#1976D2', fontWeight: 500 }}>{count}/10</Text>
            </>
            : <View style={{ maxHeight: 150, width: 150, flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
              <Image source={{ uri: "assets/images/accept.png" }} style={{ height: "100%", width: 130, cursor: "pointer" }} />
            </View>
          }
        </View>
        <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10, width: 340, position: "absolute", bottom: 180 }}>
          {mass.map((_, i) => {
            if (count >= i + 1) {
              return <Image source={{ uri: "assets/images/glass.svg" }} key={i} style={{ height: 60, width: 60, opacity: 1 }} />
            }

            return <Image source={{ uri: "assets/images/glass.svg" }} key={i} style={{ height: 60, width: 60, opacity: 0.5 }} />
          })}
        </View>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#e3f2fd",
    flex: 1
  },
  header: {
    backgroundColor: "#2196f3",
    height: 60,
    width: "100%",
    borderBottomColor: "#1976d2",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerText: {
    fontSize: 24,
    color: "#e3f2fd",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapperCircle: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    position: "absolute"
  },
})