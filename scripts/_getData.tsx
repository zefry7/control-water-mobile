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
    fireDay: 5, //количество дней подряд
    lastDayFireDay: "22/8", //последний день выполнения подряд
    maxFireDay: 10, //максимальное количество дней подряд
    lang: "ru" || "en", //выбор языка
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
export async function getWaterDay(setCount: Function, now: string) {
    let count: Drink = { count: 0, date: "" }
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
export async function getMaxWaterDay(setCountDay: Function) {
    let t = await AsyncStorage.getItem("maxWaterDay")
    if (t) {
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
        if (sendNotification) sendNotification()
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
}

export async function setLangApplication(lang: string) {
    await AsyncStorage.setItem("lang", lang)
}

export async function setFireDay() {
    let fireDayCount = await AsyncStorage.getItem(("fireDay"))
    if(fireDayCount) {
        await AsyncStorage.setItem("fireDay", (Number(fireDayCount) + 1).toString())
    } else {
        await AsyncStorage.setItem("fireDay", "1")
    }
}

export async function getFireDay() {
    let fireDayCount = await AsyncStorage.getItem(("fireDay"))
    return Number(fireDayCount)
}

export async function nullFireDay() {
    await AsyncStorage.setItem("fireDay", "0")
    await AsyncStorage.removeItem("lastDayFireDay")
}


export async function setLastDayFireDay(now: string) {
    await AsyncStorage.setItem("lastDayFireDay", now)
}

export async function getLastDayFireDay() {
    let date = await AsyncStorage.getItem(("lastDayFireDay"))
    return date
}

export function checkFireDay(date1: string, date2: string) {
    const d1 = date1.split("/")
    const d2 = date2.split("/")

    const year = Number(moment().format("YYYY"))

    const convDate1 = new Date(year, Number(d1[1]), Number(d1[0]))
    const convDate2 = new Date(year, Number(d2[1]), Number(d2[0]))

    console.log(Math.abs(convDate1.getTime() - convDate2.getTime()), 60 * 60 * 24 * 1000);
    

    return Math.abs(convDate1.getTime() - convDate2.getTime()) > 60 * 60 * 24 * 1000 
}