import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useEffect, useState } from "react";
import { Animated, Image, Text, TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { getAllDays, getData, widthPers } from "../scripts/_getData";
import Svg, { Path, G } from "react-native-svg";

interface Day {
    num: number,
    complete: boolean
}

var now = moment().format("DD/MM");

var monthNow = Number(moment().format("MM"));
var yearNow = Number(moment().format("Y"))
var dayWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
var listMonth = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
var listDayWeek = [6, 0, 1, 2, 3, 4, 5]

var first = Number(moment().format("M")) - 1
var last = Number(moment().format("M")) - 1

var countAllDays = 0
getAllDays().then((v: number) => countAllDays = v)

function BlockDate(props: { animDate: any; complete: any; activeDate: any; }) {
    const [month, setMonth] = useState(monthNow)
    const [monthArr, setMonthArr] = useState(new Array<Day>({ num: -1, complete: false }))
    const [allDays, setAllDays] = useState(countAllDays)
    const [maxDay, setMaxDay] = useState(0)


    //получение первого и последнего входа в приложение
    useEffect(() => {
        let checkFirstAndLast = async () => {
            await AsyncStorage.getItem("first").then(v => { if (v) { first = parseInt(v) } })
            await AsyncStorage.getItem("last").then(v => { if (v) { last = parseInt(v) } })
        }
        checkFirstAndLast()
    }, [])

    useEffect(() => {
        //получение массива выбранного месяца
        let date = new Date(yearNow, month - 1, 1)
        let weekDay = date.getDay()
        let days = new Array<Day>(listDayWeek[weekDay]).fill({ num: -1, complete: false })

        while (date.getMonth() === month - 1) {
            days.push({ num: new Date(date).getDate(), complete: false });
            date.setDate(date.getDate() + 1);
        }

        setMonthArr(days)

        //уставновка выполненных дней
        const completeDays = async () => {
            let data = await getData()
            setMonthArr(days =>
                days.map((v) => {
                    let str = month < 10 ? v.num + "/0" + month : v.num + "/" + month
                    if (data != null && data[str]) {
                        return { num: v.num, complete: true }
                    }
                    return v
                })
            )
        }
        completeDays()

    }, [month, props.activeDate])


    useEffect(() => {
        //добавлнение выполненного сегодня дня в количество выполненных дней
        const addNowDay = async () => {
            let oldData = await getData()
            if (props.complete == true && oldData[now] == null)
                setAllDays(v => v + 1)
        }
        addNowDay()
    }, [props.complete])

    const handleNext = () => {
        if (month != first + 3) {
            if (month != 11) {
                setMonth(n => n + 1)
            } else {
                setMonth(0)
            }
        }
    }

    const handlePrev = () => {
        if (month != first) {
            if (month != 0) {
                setMonth(n => n - 1)
            } else {
                setMonth(11)
            }
        }
    }

    return <Animated.View style={{ backgroundColor: "#BBDEFB", width: "100%", height: "100%", position: "absolute", left: props.animDate, zIndex: 50 }}>
        <View style={{ maxWidth: (widthPers * 88), marginHorizontal: "auto", paddingTop: 20 }}>
            <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#E3F2FD", padding: 10, borderRadius: 20, marginBottom: 10 }}>
                    <Text style={{ fontSize: 16 }}>Количество выполненных дней</Text>
                    <Text style={{ backgroundColor: "#90CAF9", fontSize: 18, height: 40, width: 40, borderRadius: 100, textAlign: "center", lineHeight: 40 }}>{allDays}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#E3F2FD", padding: 10, borderRadius: 20 }}>
                    <Text style={{ fontSize: 16 }}>Количество дней подряд</Text>
                    <Text style={{ backgroundColor: "#90CAF9", fontSize: 18, height: 40, width: 40, borderRadius: 100, textAlign: "center", lineHeight: 40 }}>{maxDay}</Text>
                </View>
            </View>
            <View style={{ marginBottom: 10, flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={{ fontSize: 20, fontWeight: "500", marginRight: "auto" }}>{listMonth[month - 1]}</Text>
                <TouchableWithoutFeedback onPress={handlePrev}>
                    <Svg
                        width={widthPers * 8}
                        height={widthPers * 8}
                        viewBox="0 0 24 24"
                        style={{ marginRight: (widthPers * 1.8) }}
                    >
                        <G
                            fill="none"
                            stroke="#000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        >
                            <Path d="m7.6 7-5.1 5 5.1 5" data-name="Right" />
                            <Path d="M21.5 12H4.8" />
                        </G>
                    </Svg>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={handleNext}>
                    <Svg
                        width={widthPers * 8}
                        height={widthPers * 8}
                        viewBox="0 0 24 24"
                        rotation={180}
                    >
                        <G
                            fill="none"
                            stroke="#000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        >
                            <Path d="m7.6 7-5.1 5 5.1 5" data-name="Right" />
                            <Path d="M21.5 12H4.8" />
                        </G>
                    </Svg>
                </TouchableWithoutFeedback>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: (widthPers * 1.8), marginHorizontal: "auto" }}>
                {dayWeek.map((day, i) => (
                    <View key={i} style={{ height: (widthPers * 11), width: (widthPers * 11), alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ textTransform: "uppercase", fontWeight: "500" }}>{day}</Text>
                    </View>
                ))}
            </View>
            <View style={{ width: (widthPers * 88), height: 2, backgroundColor: "#1976d2", marginHorizontal: "auto" }}></View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: (widthPers * 1.8), marginHorizontal: "auto", maxWidth: (widthPers * 88), top: 10 }}>
                {monthArr?.map((v, i) => {
                    if (v.num == -1) {
                        return <View key={i} style={[styles.dataWrapper, { opacity: 0 }]}>
                            <Text style={{ fontSize: 16, color: "#e3f2fd", fontWeight: "500" }}>{v.num}</Text>
                        </View>
                    }
                    if (v.complete) {
                        return <View key={i} style={[styles.dataWrapper, styles.dataActive]}>
                            <Text style={{ fontSize: 16, color: "#e3f2fd", fontWeight: "500" }}>{v.num}</Text>
                        </View>
                    }
                    return <View key={i} style={[styles.dataWrapper, styles.dataDefault]}>
                        <Text style={{ fontSize: 16, fontWeight: "500" }}>{v.num}</Text>
                    </View>
                })}
            </View>
        </View>
    </Animated.View>
}

export default BlockDate;

const styles = StyleSheet.create({
    dataWrapper: {
        height: (widthPers * 11),
        width: (widthPers * 11),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        opacity: 1,
        backgroundColor: "#ffffff"
    },
    dataActive: {
        backgroundColor: "#1976D2",
        opacity: 1
    },
    dataDefault: {
        backgroundColor: "#E3F2FD",
        opacity: 0.5
    }
})