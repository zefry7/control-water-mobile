import React from "react";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, TextInput, StyleSheet, SafeAreaView, Image, TouchableWithoutFeedback, Animated, Dimensions, Button } from "react-native";
import AnimatedProgressWheel from 'react-native-progress-wheel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import BlockDate from "./BlockDate";
import { editDayWater, getDayWater, widthPers } from "./_getData";
import Svg, { Path } from "react-native-svg";

var now = moment().format("DD/MM");
// var now = "18/08"

export default function Index() {
  const [maxDay, setMaxDay] = useState(10)
  const [count, setCount] = useState(0)
  const [mass, setMass] = useState(new Array(1).fill(0))
  const [activeDate, setActiveDate] = useState(false)
  const [complete, setComplete] = useState(false)
  const [firstRun, setFisrtRun] = useState(false)
  const animGlass = useState(new Animated.Value(130))[0]
  const animDate = useState(new Animated.Value(600))[0]
  const [text, setText] = useState("10")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ttt = async () => {
      let start = await AsyncStorage.getItem("start")
      if (!start) {
        var month = Number(moment().format("M")) - 1
        await AsyncStorage.setItem("start", month.toString())
      }
      let end = await AsyncStorage.getItem("end")
      if (!end) {
        var month = Number(moment().format("M")) - 1
        await AsyncStorage.setItem("end", month.toString())
      }
      let c = 0
      await getDayWater().then(res => { if (res) { c = JSON.parse(res) } })

      let t = await AsyncStorage.getItem("maxDay")
      if (!t) {
        setFisrtRun(true)
      } else {
        console.log(t);
        setMaxDay(Number(t))
      }
      if (c.date == now) {
        setCount(Number(c?.count))
      }

      setLoading(true)
      // if (a) {
      //   // setCount(Number(a))
      // } else {
      //   let num = Number(prompt("Сколько воды?"))
      //   setMaxDay(num)
      //   setMass(new Array(num).fill(0))
      // }
    }
    ttt()
    console.log(Dimensions.get("window").width);

  }, [])


  useEffect(() => {
    setMass(new Array(maxDay).fill(0))
  }, [maxDay])

  // useEffect(() => {
  //   let ttt = async () => {
  //     await AsyncStorage.clear()
  //   }
  //   ttt()
  // }, [])

  const handleClickButton = () => {
    if (maxDay > count) {
      editDayWater(count + 1, now)
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
    if (!activeDate) {
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

    if (count >= maxDay) {
      setComplete(true)
    }
  }, [count])

  useEffect(() => {

    const addItem = async (a: any) => {
      let oldData = {}
      await AsyncStorage.getItem("data").then(v => { if (v) { oldData = JSON.parse(v || "") } })
      console.log(oldData);

      await AsyncStorage.setItem("data", JSON.stringify({ ...oldData, ...a }))

    }

    if (complete) {
      let s = now.split("/")
      let newDay = Number(s[0]) + "/" + (Number(s[1]) - 1)
      let a = {
        [newDay]: {
          complete: true
        }
      }
      addItem(a)
    }
  }, [complete])


  const handleClickModal = () => {
    const ttt = async () => {
      await AsyncStorage.setItem("maxDay", text)
      console.log("123");
      setFisrtRun(false)
      setMaxDay(Number(text))
      setCount(0)
    }
    ttt()
  }

  const handleClickWater = () => {
    setFisrtRun(true)
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
      <TouchableWithoutFeedback onPress={handleClickWater}>
          <View style={{ height: 48, width: 48, position: "absolute", left: 6, top: 6, justifyContent: "center", alignItems: "center", backgroundColor: "#BBDEFB", borderRadius: 10 }}>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.headerText}>Logo</Text>
        <TouchableWithoutFeedback onPress={handleClickDate}>
          <View style={{ height: 48, width: 48, position: "absolute", right: 6, top: 6, justifyContent: "center", alignItems: "center", backgroundColor: "#BBDEFB", borderRadius: 10 }}>
            <Image source={require("../assets/images/date.png")} style={{ height: 35, width: 35 }} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {loading &&
        <ScrollView style={styles.main} contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", paddingVertical: (widthPers * 11) }}>
            <View style={{ justifyContent: "center", alignItems: "center", height: (widthPers * 88), position: "relative", marginBottom: (widthPers * 8) }}>
              <Text style={{ fontSize: 24, lineHeight: 24, color: '#1976D2', fontWeight: "500", marginBottom: 10 }}>{now}</Text>
              <View style={styles.wrapperCircle}>
                <AnimatedProgressWheel size={widthPers * 88} width={widthPers * 2} color={'#1976D2'} progress={count * 100 / maxDay} backgroundColor={'#BBDEFB'} rotation="-90deg" duration={600} />
              </View>
              {count < maxDay
                ?
                <View style={{ maxHeight: 150, width: 150, flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                  <TouchableWithoutFeedback style={{ height: 350, width: 350 }} onPress={handleClickButton}>
                    <Animated.View style={{ height: animGlass }}>
                      <Svg width={widthPers * 36} height={widthPers * 36} fill="none" viewBox="0 0 24 24">
                        <Path
                          fill="#1976D2"
                          fillRule="evenodd"
                          d="M5.161 1a2 2 0 0 0-1.978 2.297l2.573 17.148A3 3 0 0 0 8.722 23h6.556a3 3 0 0 0 2.966-2.555l2.573-17.148A2 2 0 0 0 18.839 1H5.16Zm0 2H18.84l-.6 4H5.76l-.6-4Zm.9 6 1.672 11.148a1 1 0 0 0 .99.852h6.555a1 1 0 0 0 .989-.852L17.939 9H6.06Z"
                          clipRule="evenodd"
                        />
                      </Svg>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
                : <View style={{ maxHeight: 150, width: 150, flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                  <Image source={require("../assets/images/accept.png")} style={{ height: 130, width: 130, cursor: "pointer" }} />
                </View>
              }
              <Text style={{ fontSize: 24, lineHeight: 24, color: '#1976D2', fontWeight: "500" }}>{count}/{maxDay}</Text>
            </View>
            <View style={{ flexWrap: "wrap", flexDirection: "row", gap: (widthPers * 2), width: (widthPers * 88), height: (widthPers * 34), marginTop: "auto", alignItems: "center", justifyContent: "center" }}>
              {mass.map((_, i) => {
                if (count >= i + 1) {
                  return <Svg width={widthPers * 16} height={widthPers * 16} fill="none" viewBox="0 0 24 24" key={i} >
                    <Path
                      fill="#1976D2"
                      fillRule="evenodd"
                      d="M5.161 1a2 2 0 0 0-1.978 2.297l2.573 17.148A3 3 0 0 0 8.722 23h6.556a3 3 0 0 0 2.966-2.555l2.573-17.148A2 2 0 0 0 18.839 1H5.16Zm0 2H18.84l-.6 4H5.76l-.6-4Zm.9 6 1.672 11.148a1 1 0 0 0 .99.852h6.555a1 1 0 0 0 .989-.852L17.939 9H6.06Z"
                      clipRule="evenodd"
                    />
                  </Svg>
                }
                return <Svg width={widthPers * 16} height={widthPers * 16} fill="none" viewBox="0 0 24 24" key={i} opacity={0.5} >
                  <Path
                    fill="#1976D2"
                    fillRule="evenodd"
                    d="M5.161 1a2 2 0 0 0-1.978 2.297l2.573 17.148A3 3 0 0 0 8.722 23h6.556a3 3 0 0 0 2.966-2.555l2.573-17.148A2 2 0 0 0 18.839 1H5.16Zm0 2H18.84l-.6 4H5.76l-.6-4Zm.9 6 1.672 11.148a1 1 0 0 0 .99.852h6.555a1 1 0 0 0 .989-.852L17.939 9H6.06Z"
                    clipRule="evenodd"
                  />
                </Svg>
              })}
            </View>
          </View>
          <BlockDate animDate={animDate} complete={complete} activeDate={activeDate} />
        </ScrollView>
      }
      {firstRun == true &&
        <View style={styles.modelWrapper}>
          <TextInput style={{ height: 20, width: 100, zIndex: 120, borderWidth: 2, marginBottom: 15 }} keyboardType="numeric" value={text} onChangeText={setText} />
          <Button title="Click" onPress={handleClickModal} />
        </View>
      }
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
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
    width: 200,
    height: 200,
    backgroundColor: "#BBDEFB",
    zIndex: 120,
    transform: [{ translateX: -100 }, { translateY: -100 }],
    borderColor: "#1976d2",
    borderWidth: 2,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center"
  }
})