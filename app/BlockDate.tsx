import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useEffect, useState } from "react";
import { Animated, Image, Text, TouchableWithoutFeedback, View } from "react-native";
import { getData } from "./_getData";

interface Day {
    num: number,
    complete: boolean
}

var monthNow = Number(moment().format("M")) - 1;
var yearNow = Number(moment().format("Y"))
var dayWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
var listMonth = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
var listDayWeek = [6, 0, 1, 2, 3, 4, 5]

var first = Number(moment().format("M")) - 1
var end = Number(moment().format("M")) - 1

function BlockDate(props: { animDate: any; complete: any; activeDate:any; }) {
    const [month, setMonth] = useState(monthNow)
    const [monthArr, setMonthArr] = useState(new Array<Day>({ num: -1, complete: false }))

    useEffect(() => {
        let f = async () => {
            let a = await AsyncStorage.getItem("start")
            if (a) {
                first = parseInt(a)
            }

            a = await AsyncStorage.getItem("end")
            if (a) {
                end = parseInt(a)
            }
        }

        f()

        let date = new Date(yearNow, month, 1)
        let weekDay = date.getDay()
        let days = new Array<Day>(listDayWeek[weekDay]).fill({ num: -1, complete: false })
        while (date.getMonth() === month) {
            days.push({ num: new Date(date).getDate(), complete: false });
            date.setDate(date.getDate() + 1);
        }
        setMonthArr(days)
    }, [month, props.activeDate])

    useEffect(() => {
        const ttt = async () => {
            let data: string | null = null
            await getData().then(res =>{ if(res) { data = JSON.parse(res) } })
            
            setMonthArr(days =>
                days.map((v) => {
                    if (data && data[`${v.num}/${month}`]?.complete) {
                        return { num: v.num, complete: true }
                    }
                    return v
                })
            )
        }

        ttt()
    }, [month, props.activeDate])

    const handleNext = () => {
        // if (month != end) {
        if (month != 11) {
            setMonth(n => n + 1)
        } else {
            setMonth(0)
        }
        // }
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

    return <Animated.View style={{ backgroundColor: "#BBDEFB", width: "100%", height: "100%", position: "absolute", left: props.animDate, }}>
        <View style={{ maxWidth: 340, marginHorizontal: "auto" }}>
            <View style={{ paddingTop: 20, marginBottom: 10, flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={{ fontSize: 20, fontWeight: 500, marginRight: "auto" }}>{listMonth[month]}</Text>
                <TouchableWithoutFeedback onPress={handlePrev}>
                    <Image source={{ uri: "assets/images/arrow.svg" }} style={{ height: 25, width: 25, marginRight: 15 }} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={handleNext}>
                    <Image source={{ uri: "assets/images/arrow.svg" }} style={{ height: 25, width: 25, transform: [{ rotateZ: "180deg" }] }} />
                </TouchableWithoutFeedback>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginHorizontal: "auto" }}>
                {dayWeek.map((day, i) => (
                    <View key={i} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ textTransform: "uppercase", fontWeight: 500 }}>{day}</Text>
                    </View>
                ))}
            </View>
            <View style={{ width: 340, height: 2, backgroundColor: "#1976d2", marginHorizontal: "auto" }}></View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginHorizontal: "auto", maxWidth: 340, top: 10 }}>
                {monthArr?.map((v, i) => {
                    if (v.num == -1) {
                        return <View key={i} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: "50%", opacity: 1 }}>
                        </View>
                    }
                    if (v.complete) {
                        return <View key={i} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#1976D2", borderRadius: "50%", opacity: 1 }}>
                            <Text style={{ fontSize: 16, lineHeight: 0, color: "#e3f2fd", fontWeight: 500 }}>{v.num}</Text>
                        </View>
                    }
                    return <View key={i} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#E3F2FD", borderRadius: "50%", opacity: 0.5 }}>
                        <Text style={{ fontSize: 16, lineHeight: 0, fontWeight: 500 }}>{v.num}</Text>
                    </View>
                })}
            </View>
        </View>
    </Animated.View>
}

export default BlockDate;