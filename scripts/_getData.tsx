import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from "moment"
import { Animated, Dimensions } from "react-native"

export var widthPers = Dimensions.get("window").width / 100

const baseData = {
    first: "23/4", //первый запуск приложения
    last: "7/5", //последний запуск приложения
    drink: {
        count: 5, //количество воды в день 
        date: "23/5" //для проверки на новый или тот же день
    },
    maxWaterDay: 7, //количество стаканов воды в день
    data: { //список выполненных дней
        "23/7": true,
        "24/7": true
    }
}


//получение данных о списке выполненных днях
export async function getData() {
    let data = {}
    await AsyncStorage.getItem("data").then(v => { if (v) { data = JSON.parse(v) } })

    return data
}

//изменение выпитой воды за день
export async function setWaterDay(count: number, date: string) {
    const data = {
        count: count,
        date: date
    }

    await AsyncStorage.setItem("drink", JSON.stringify(data))
}

//получение выпитой воды за день
interface Drink {
    count: number,
    date: string
}
export async function getWaterDay(setCount: Function) {
    let count: Drink = { count: 0, date: "" }
    let now = moment().format("DD/MM");
    await AsyncStorage.getItem("drink").then(res => { if (res) { count = JSON.parse(res) } })

    if (count.date == now) {
        setCount(Number(count?.count))
    }

    return count
}

//получение всего выпполненных дней
export async function getAllDays() {
    let data = {}
    await AsyncStorage.getItem("data").then(v => { if (v) { data = JSON.parse(v) } })

    return Object.keys(data).length
}

//получение первого дня; если его нет, определить
export async function checkFirstDay(sendNotification: () => void) {
    let start = await AsyncStorage.getItem("first")
    if (!start) {
        //подписка на уведомление
        sendNotification()
        var month = Number(moment().format("M")) - 1
        await AsyncStorage.setItem("first", month.toString())
    }
}

//получение последнего дня; если его нет, определить
export async function checkLastDay() {
    let end = await AsyncStorage.getItem("last")
    if (!end) {
        var month = Number(moment().format("M")) - 1
        await AsyncStorage.setItem("last", month.toString())
    }
}

//получение максимального количества воды в день
export async function getMaxWaterDay(setFirstRun: Function, setCountDay: Function) {
    let t = await AsyncStorage.getItem("maxWaterDay")
    if (!t) {
        setFirstRun(true)
    } else {
        setCountDay(Number(t))
    }
}


export async function setMaxWaterDay(textModal: string) {
    await AsyncStorage.setItem("maxWaterDay", textModal)
}

export function activeAnimated(nameAnimated: Animated.Value | Animated.ValueXY, value: number, time: number) {
    Animated.timing(nameAnimated, {
        toValue: value,
        duration: time,
        useNativeDriver: false
    }).start()
}