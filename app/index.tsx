import React, { SetStateAction, useMemo, useRef } from "react";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, TextInput, StyleSheet, SafeAreaView, Image, TouchableWithoutFeedback, Animated, Dimensions, Button, Platform, Alert, StatusBar } from "react-native";
import AnimatedProgressWheel from 'react-native-progress-wheel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import BlockDate from "./BlockDate";
import { checkFirstDay, checkLastDay, getWaterDay, getMaxWaterDay, setWaterDay, widthPers, activeAnimated, setMaxWaterDay, getLangApplication, setLangApplication } from "../scripts/_getData";
import Svg, { Path } from "react-native-svg";
import { useNotificationObserver } from "@/scripts/useNotificationObserver";
import { styles } from "@/scripts/_styles";
import { langData } from "@/scripts/_langData";

var now = moment().format("DD/MM");

export default function Root() {
  const [countDay, setCountDay] = useState(10) //количество стаканов за день
  const [count, setCount] = useState(0) //количество выпитых стаканов
  const [mass, setMass] = useState(new Array(10).fill(0)) //отображения количества стаканов 
  const [activeDate, setActiveDate] = useState(false) //проверка открытия раздела календарь
  const [complete, setComplete] = useState(false) //выполнен день
  const [firstRun, setFirstRun] = useState(false) //проверка открытия модального окна
  const [textModal, setTextModal] = useState("10") //отображение текста в модальном окне
  const [loading, setLoading] = useState(false) //проверка загрузки контента
  const [errorInput, setErrorInput] = useState(false) //проверка на ошибку в модальном окне
  const [infoText, setInfoText] = useState(false)
  const [lang, setLang] = useState<keyof typeof langData>("ru")
  const [selectorLang, setSelectorLang] = useState("ru")
  const animGlass = useState(new Animated.Value(130))[0] //анимация при нажатии на главную кнопку
  const animDate = useState(new Animated.Value(600))[0] //анимация при нажатии на раздел с календарём

  const sendNotification = useNotificationObserver()

  //получение данных
  useEffect(() => {
    const checkData = async () => {
      await getLangApplication(setLang, setSelectorLang)
      await checkFirstDay(sendNotification)
      await checkLastDay()
      await getWaterDay(setCount)
      await getMaxWaterDay(setFirstRun, setCountDay)
      setLoading(true)
    }

    checkData()
  }, [])

  //изменение количества отображения стаканов
  useEffect(() => {
    setMass(new Array(countDay).fill(0))
    if (countDay < count) {
      setCount(countDay)
    }
  }, [countDay])

  useEffect(() => {
    const addItem = async (a: any) => {
      let oldData = {}
      await AsyncStorage.getItem("data").then(v => { if (v) { oldData = JSON.parse(v || "") } })
      await AsyncStorage.setItem("data", JSON.stringify({ ...oldData, ...a }))
    }

    if (complete) {
      let a = {
        [now]: true
      }
      addItem(a)
    }
  }, [complete])

  useEffect(() => {
    if (countDay <= count) {
      setComplete(true)
    }
  }, [count])


  //чистка стора

  // useEffect(() => {
  //   let ttt = async () => {
  //     await AsyncStorage.clear()
  //   }
  //   ttt()
  // }, [])

  const handleClickButton = () => {
    if (countDay > count) {
      activeAnimated(animGlass, 150, 300)
      setWaterDay(count + 1, now)
      setCount(count => count + 1)

      setTimeout(() => {
        activeAnimated(animGlass, 130, 300)

        //проверка условия выполнения
        if (count + 1 >= countDay) {
          setComplete(true)
        }
      }, 300)
    }
  }

  //нажатие по разделу с календарём
  const handleClickDate = () => {
    if (firstRun) {
      setFirstRun(false)
    }
    !activeDate ? activeAnimated(animDate, 0, 300) : activeAnimated(animDate, 600, 300)
    setActiveDate(v => !v)
  }


  //закрытие модального окна
  const handleClickModal = () => {
    const asyncFunc = async () => {
      if (!errorInput) {
        setLang(selectorLang as SetStateAction<"ru" | "en">)
        setLangApplication(selectorLang.toString())
        setMaxWaterDay(textModal)
        setFirstRun(false)
        setCountDay(Number(textModal))
      }
    }
    asyncFunc()
  }

  //нажатие по разделу с настройками
  const handleClickSetting = () => {
    setFirstRun(v => !v)
    if (activeDate) {
      activeAnimated(animDate, 600, 300)
      setActiveDate(v => !v)
    }
  }

  //изменение значения в модальном окне
  const handleChangeInput = (v: string) => {
    if (v.length < 3 && (v.slice(v.length - 1, v.length).match(/[0-9]/) || v == "")) {
      setTextModal(v)
      setInfoText(false)
      if (Number(v) >= 1 && Number(v) <= 10) {
        setErrorInput(false)
      } else {
        setErrorInput(true)
        setInfoText(v => !v)
      }
    }
  }

  const handleChangeLang = (strLang: string) => {
    setSelectorLang(strLang)
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#2196f3" barStyle={"dark-content"} />
      <SafeAreaView style={styles.root}>
        {loading &&
          <ScrollView style={styles.main} contentContainerStyle={{ flex: 1 }}>
            <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", paddingVertical: (widthPers * 11) }}>
              <View style={{ justifyContent: "center", alignItems: "center", height: (widthPers * 88), position: "relative", marginBottom: (widthPers * 8) }}>
                <Text style={{ fontSize: 24, lineHeight: 24, color: '#1976D2', fontWeight: "500", marginBottom: 10 }}>{now}</Text>
                <View style={styles.wrapperCircle}>
                  <AnimatedProgressWheel size={widthPers * 88} width={widthPers * 2} color={'#1976D2'} progress={count * 100 / countDay} backgroundColor={'#BBDEFB'} rotation="-90deg" duration={600} />
                </View>
                <View style={{ maxHeight: 150, width: 150, flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                  {complete == true
                    ? <Image source={require("../assets/images/accept.png")} style={{ height: 130, width: 130, cursor: "pointer" }} />
                    : <TouchableWithoutFeedback style={{ height: 350, width: 350 }} onPressIn={handleClickButton}>
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

                  }
                </View>
                <Text style={{ fontSize: 24, lineHeight: 24, color: '#1976D2', fontWeight: "500" }}>{count * 250} мл</Text>
              </View>
              <View style={{ flexWrap: "wrap", flexDirection: "row", gap: (widthPers * 2), width: (widthPers * 88), height: (widthPers * 34), marginTop: "auto", alignItems: "center", justifyContent: "center" }}>
                {mass.map((_, i) => {
                  return <View style={count >= i + 1 ? { opacity: 1 } : { opacity: 0.5 }} key={i}>
                    <Svg width={widthPers * 16} height={widthPers * 16} fill="none" viewBox="0 0 24 24">
                      <Path
                        fill="#1976D2"
                        fillRule="evenodd"
                        d="M5.161 1a2 2 0 0 0-1.978 2.297l2.573 17.148A3 3 0 0 0 8.722 23h6.556a3 3 0 0 0 2.966-2.555l2.573-17.148A2 2 0 0 0 18.839 1H5.16Zm0 2H18.84l-.6 4H5.76l-.6-4Zm.9 6 1.672 11.148a1 1 0 0 0 .99.852h6.555a1 1 0 0 0 .989-.852L17.939 9H6.06Z"
                        clipRule="evenodd"
                      />
                    </Svg>
                  </View>
                })}
              </View>
            </View>
            <BlockDate animDate={animDate} complete={complete} activeDate={activeDate} />
          </ScrollView>
        }
        {firstRun == true &&
          <View style={styles.modelWrapper}>
            <Text style={{ fontSize: 20, fontWeight: "500", lineHeight: 20, color: "#1976d2" }}>
              {langData[lang].titleSetting}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableWithoutFeedback onPressIn={() => handleChangeLang("ru")}>
                <View style={{ backgroundColor: "#2196f3", height: 30, width: 30 }}>
                  <Text style={[{ textAlign: "center", lineHeight: 30, color: "white" }, selectorLang != "ru" && {opacity: 0.5}]}>Ru</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPressIn={() => handleChangeLang("en")}>
                <View style={[{ backgroundColor: "#2196f3", height: 30, width: 30 }, selectorLang != "en" && {opacity: 0.5}]}>
                  <Text style={{ textAlign: "center", lineHeight: 30, color: "white" }}>En</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{ alignItems: "center", position: "relative" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput style={[styles.inputMax, errorInput && styles.inputMaxInvalid]} keyboardType="number-pad" value={textModal} onChangeText={(v) => handleChangeInput(v)} />
                <Text style={{ fontSize: 18, color: "#1976D2", fontWeight: "500" }}> = {Number(textModal) * 250} {langData[lang].ml}</Text>
              </View>
              {infoText &&
                <Text style={{ fontSize: 12, color: "red" }}>Допустимый диапазон от 1 до 10</Text>
              }
            </View>
            <TouchableWithoutFeedback onPress={handleClickModal}>
              <Text style={{ textAlign: "center", color: "white", backgroundColor:"#2196f3", padding:8, borderRadius:5, minWidth:90 }}>{langData[lang].textButtonSave}</Text>
            </TouchableWithoutFeedback>
          </View>
        }
        <View style={styles.header}>
          <TouchableWithoutFeedback onPressIn={handleClickSetting}>
            <View style={[styles.headerWrapperIcon, { height: 48, width: 48, left: 6, top: 6 }]}>
              <Image source={require("../assets/images/setting.png")} style={styles.headerIcon} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPressIn={sendNotification}>
            <View style={[styles.headerWrapperIcon, { height: 26, width: 70, left: 60, top: 17 }]}>
              <Text style={{ fontSize: 10 }}>Уведомление</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPressIn={handleClickDate}>
            <View style={[styles.headerWrapperIcon, { height: 48, width: 48, right: 6, top: 6 }]}>
              <Image source={require("../assets/images/date.png")} style={styles.headerIcon} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  );
}


