import { setMaxWaterDay } from "@/scripts/_getData";
import { langData } from "@/scripts/_langData";
import { useState } from "react";
import { TouchableWithoutFeedback, View, Text, TextInput, Image } from "react-native";



export default function Tutorial({ setRegister }) {
    const [lng, setLng] = useState<string>("ru")
    const [page, setPage] = useState<number>(1)
    const [gender, setGender] = useState("")
    const [weightPerson, setWeightPerson] = useState<number>(0)

    const handleChangeLang = (str: string) => {
        setLng(str)
    }

    const handleChangePage = () => {
        if (page == 4 && weightPerson != 0) {
            async function funcAsync() {
                let countGlass = gender == "m"
                    ? Math.ceil(Number(weightPerson) * 35 / 250).toString()
                    : Math.ceil(Number(weightPerson) * 31 / 250).toString()
                await setMaxWaterDay(countGlass)
                setRegister(true)
            }

            funcAsync()
        }
        if (page == 3) {
            if (gender != "") {
                setPage(p => p + 1)
            }
        } else if (page != 4) {
            setPage(p => p + 1)
        }
    }

    const handleChangeGender = (str: string) => {
        setGender(str)
    }

    return <>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {page == 1 &&
                <>
                    <Text style={{fontSize: 24, marginBottom:15, fontWeight:"500", color:"#2196f3"}}>{langData[lng].tutorial.titleLang}</Text>
                    <View style={{ flexDirection: "row", gap: 10, marginBottom: 60 }}>
                        <TouchableWithoutFeedback onPressIn={() => handleChangeLang("ru")}>
                            <View style={[{ backgroundColor: "#2196f3", height: 140, width: 140, borderRadius: 15, padding: 20 }, lng != "ru" && { opacity: 0.5 }]}>
                                <Image source={require("../assets/images/russia.png")} style={{ width: "100%", height: "100%" }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPressIn={() => handleChangeLang("en")}>
                            <View style={[{ backgroundColor: "#2196f3", height: 140, width: 140, borderRadius: 15, padding: 20 }, lng != "en" && { opacity: 0.5 }]}>
                                <Image source={require("../assets/images/english.png")} style={{ width: "100%", height: "100%" }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </>
            }
            {page == 2 &&
                <Text style={{ fontSize: 24, marginBottom:15, fontWeight:"500", color:"#2196f3"}}>Добро пожаловать</Text>
            }
            {page == 3 &&
                <>
                    <Text style={{ fontSize: 24, marginBottom:15, fontWeight:"500", color:"#2196f3"}}>{langData[lng].tutorial.titleGender}</Text>
                    <View style={{ flexDirection: "row", gap: 10, marginBottom: 60 }}>
                        <TouchableWithoutFeedback onPressIn={() => handleChangeGender("m")}>
                            <View style={[{ backgroundColor: "#2196f3", height: 140, width: 140, borderRadius: 15, padding: 20, opacity:0.5 }, gender == "m" && { opacity: 1 }]}>
                                <Image source={require("../assets/images/man.png")} style={{ width: "100%", height: "100%" }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPressIn={() => handleChangeGender("w")}>
                            <View style={[{ backgroundColor: "#2196f3", height: 140, width: 140, borderRadius: 15, padding: 20, opacity:0.5 }, gender == "w" && { opacity: 1 }]}>
                                <Image source={require("../assets/images/woman.png")} style={{ width: "100%", height: "100%" }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </>
            }
            {page == 4 &&
                <View style={{ marginBottom: 60 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ borderWidth: 2, borderBlockColor: "black", position: "relative" }}>
                            <TextInput value={weightPerson.toString()} onChangeText={(v) => setWeightPerson(Number(v))} keyboardType="number-pad" style={{ width: 70, paddingHorizontal: 10, height: 30 }} />
                            <Text style={{ position: "absolute", right: 5, lineHeight: 30 }}>кг</Text>
                        </View>
                        {gender == "m"
                            ? <Text> = {Number(weightPerson) * 35} мл</Text>
                            : <Text> = {Number(weightPerson) * 31} мл</Text>
                        }

                    </View>
                    {gender == "m"
                        ? <Text>Стаканов: {Math.ceil(Number(weightPerson) * 35 / 250)}</Text>
                        : <Text>Стаканов: {Math.ceil(Number(weightPerson) * 31 / 250)}</Text>
                    }
                </View>
            }
            <TouchableWithoutFeedback onPressIn={() => handleChangePage()}>
                <Text style={[{ backgroundColor: "#2196f3", padding: 10, width: "80%", color: "white", textAlign: "center", borderRadius: 10, fontSize: 20, position: "absolute", bottom: 30 },
                gender == "" && page == 3 && { opacity: 0.5 },
                weightPerson == 0 && page == 4 && { opacity: 0.5 }]}>{langData[lng].tutorial.button}</Text>
            </TouchableWithoutFeedback>
        </View>
    </>
}
