import AsyncStorage from "@react-native-async-storage/async-storage"

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