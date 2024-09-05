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
    fireDay: 5,
    lang: "ru" || "en",
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

//получение первого дня; если его нет, определить
export async function checkFirstDay(sendNotification?: () => void) {
    let start = await AsyncStorage.getItem("first")
    if (!start) {
        //подписка на уведомление
        if (sendNotification)
            sendNotification()
        start = moment().format("DD/MM/YYYY")
        await AsyncStorage.setItem("first", start)
    }
    return start
}

//получение последнего дня; если его нет, определить
export async function checkLastDay() {
    let end = await AsyncStorage.getItem("last")
    if (!end) {
        end = moment().format("DD/MM/YYYY")
        await AsyncStorage.setItem("last", end)
    } else {
        let now = moment().format("DD/MM/YYYY")
        if(now != end) {
            await AsyncStorage.setItem("last", end)
        }
    }
    return end
}

export async function getLangApplication(setLang: Function, selectorLang: Function) {
    let lang = await AsyncStorage.getItem("lang")
    if(lang) {
        setLang(lang)
        selectorLang(lang)
    } else {
        setLang("ru")
        selectorLang("ru")
    }
    console.log(lang || "ru");
    
}

export async function setLangApplication(lang: string) {
    await AsyncStorage.setItem("lang", lang)
}