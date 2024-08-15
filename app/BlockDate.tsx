import moment from "moment";
import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";

var month = Number(moment().format("M")) - 1;


function BlockDate(props: { animDate: any; complete: any; now: any; }) {
    const [monthArr, setMonthArr] = useState(new Array({}))

    useEffect(() => {
        let days = []
        let date = new Date(2024, month, 1)
        while (date.getMonth() === month) {
            days.push({ num: new Date(date).getDate(), complete: false });
            date.setDate(date.getDate() + 1);
        }
        setMonthArr(days)
    }, [])

    useEffect(() => {
        if (props.complete) {
            let d = Number(props.now.split("/")[0])
            setMonthArr(days =>
                days.map((v, i) => {
                    if (v.num == d) {
                        return { num: v.num, complete: true }
                    }
                    return v
                })
            )
        }
    }, [props.complete])

    return <Animated.View style={{ backgroundColor: "#BBDEFB", width: "100%", height: "100%", position: "absolute", left: props.animDate }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginHorizontal: "auto", maxWidth: 340, top: 10 }}>
            {monthArr?.map((v, i) => {
                if (v.complete) {
                    return <View style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#1976D2", borderRadius: "50%", opacity: 1 }}>
                        <Text style={{ fontSize: 16, lineHeight: 0, color: "#e3f2fd", fontWeight: 500 }}>{v.num}</Text>
                    </View>
                }
                return <View style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#E3F2FD", borderRadius: "50%", opacity: 0.5 }}>
                    <Text style={{ fontSize: 16, lineHeight: 0, fontWeight: 500 }}>{v.num}</Text>
                </View>
            })}
        </View>
    </Animated.View>
}

export default BlockDate;