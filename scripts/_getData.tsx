import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dimensions } from "react-native"

export var widthPers = Dimensions.get("window").width / 100

export async function getData() {
    // const data = {
    //     "18/7": {
    //         "complete": true,   
    //     },
    //     "20/7": {
    //         "complete": true,   
    //     }
    // }

    let data = await AsyncStorage.getItem("data")

    return data
}

export async function editDayWater(count: number, date: string) {
    const data = {
        count: count,
        date: date
    }

    await AsyncStorage.setItem("count", JSON.stringify(data))
}

export async function getDayWater() {

    let count = await AsyncStorage.getItem("count")

    return count
}

export async function setDataAllDays(allDays: number) {
    await AsyncStorage.setItem("allDays", allDays.toString())
    console.log("set");
}

export async function getDataAllDays() {
    let allDays = 0

    await AsyncStorage.getItem("allDays").then(value => { if (!isNaN(Number(value))) { allDays = Number(value) } })
    console.log(allDays);
    console.log("get");

    return allDays
}