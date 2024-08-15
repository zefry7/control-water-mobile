import { useEffect, useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableWithoutFeedback, Animated } from "react-native";
import AnimatedProgressWheel from 'react-native-progress-wheel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import BlockDate from "./BlockDate";

var now = moment().format("DD/MM");

export default function Index() {
  const [maxDay, setMaxDay] = useState(10)
  const [waterControl, setWaterControl] = useState(0)
  const [count, setCount] = useState(0)
  const [mass, setMass] = useState(new Array(10).fill(0))
  const [activeDate, setActiveDate] = useState(false)
  const [complete, setComplete] = useState(false)
  const animGlass = useState(new Animated.Value(130))[0]
  const animDate = useState(new Animated.Value(600))[0] 

  useEffect(() => {
    const ttt = async () => {
      let a = await AsyncStorage.getItem("count")
      // if (a) {
      //   // setCount(Number(a))
      // } else {
      //   let num = Number(prompt("Сколько воды?"))
      //   setMaxDay(num)
      //   setMass(new Array(num).fill(0))
      // }
    }
    ttt()
  }, [])

  const handleClickButton = () => {
    if (maxDay > count) {
      setWaterControl(water => water + 100 / maxDay);
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

  const handleClickDate = () => {
    if(!activeDate) {
      Animated.timing(animDate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start()
    } else {
      Animated.timing(animDate, {
        toValue: 600,
        duration: 300,
        useNativeDriver: false
      }).start()
    }
    setActiveDate(v => !v)

  }

  useEffect(() => {
    AsyncStorage.setItem("count", count.toString());
    if(count >= maxDay) {
      setComplete(true)
    }
  }, [count])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={handleClickDate}>
          <View style={{ height: 40, width: 40, backgroundColor: "#1976D2", position: "absolute", right: 10, top: 10 }}></View>
        </TouchableWithoutFeedback>
        <Text style={styles.headerText}>Logo</Text>
      </View>
      <View style={styles.main}>
        <View style={{ position: "relative", flex: 1, width: "100%", justifyContent: "center", alignItems: "center"}}>
          <View style={{ position: "relative", flex: 1, justifyContent: "center", alignItems: "center", top: -100 }}>
            <Text style={{ fontSize: 24, lineHeight: 24, color: '#1976D2', fontWeight: 500, marginBottom: 10 }}>{now}</Text>
            <View style={styles.wrapperCircle}>
              <AnimatedProgressWheel size={350} width={10} color={'#1976D2'} progress={waterControl} backgroundColor={'#BBDEFB'} rotation="-90deg" duration={600} />
            </View>
            {count < maxDay
              ?
              <View style={{ maxHeight: 150, width: 150, flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <TouchableWithoutFeedback style={{ height: 350, width: 350 }} onPress={handleClickButton}>
                  <Animated.View style={{ height: animGlass }}>
                    <Image source={{ uri: "assets/images/glass.svg" }} style={{ height: "100%", width: 130, cursor: "pointer" }} />
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
              : <View style={{ maxHeight: 150, width: 150, flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <Image source={{ uri: "assets/images/accept.png" }} style={{ height: "100%", width: 130, cursor: "pointer" }} />
              </View>
            }
            <Text style={{ fontSize: 24, lineHeight: 24, color: '#1976D2', fontWeight: 500 }}>{count}/{maxDay}</Text>
          </View>
          <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 10, width: "100%", maxWidth: 340, position: "absolute", bottom: 120 }}>
            {mass.map((_, i) => {
              if (count >= i + 1) {
                return <Image source={{ uri: "assets/images/glass.svg" }} key={i} style={{ height: 60, width: 60, opacity: 1 }} />
              }
              return <Image source={{ uri: "assets/images/glass.svg" }} key={i} style={{ height: 60, width: 60, opacity: 0.5 }} />
            })}
          </View>
        </View>
        <BlockDate animDate={animDate} complete={complete} now={now}/>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#e3f2fd",
    flex: 1,
    overflow: "hidden"
  },
  header: {
    backgroundColor: "#2196f3",
    height: 60,
    width: "100%",
    borderBottomColor: "#1976d2",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
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