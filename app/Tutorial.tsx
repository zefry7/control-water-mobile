import { setMaxWaterDay } from "@/scripts/_getData";
import { langData } from "@/scripts/_langData";
import { useState } from "react";
import { TouchableWithoutFeedback, View, Text, TextInput, Image, ScrollView } from "react-native";



export default function Tutorial({ setRegister }) {
    const [lng, setLng] = useState<string>("ru")
    const [page, setPage] = useState<number>(1)
    const [gender, setGender] = useState("")
    const [weightPerson, setWeightPerson] = useState<number | string>("")

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

    const handleChangeWeight = (v: string) => {
        if (v.length == 0) {
            setWeightPerson("")
            return
        }
        if (v.length <= 3) {
            if (!isNaN(Number(v)) && Number(v) <= 175)
                setWeightPerson(Number(v))
        }
    }

    return <>
        <ScrollView style={{ flex: 1, position: "relative" }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 30, width: 290, marginHorizontal: "auto" }}>
            <View style={{ marginTop: "auto", marginBottom: 60 }}>
                {page == 1 &&
                    <>
                        <Text style={{ fontSize: 24, marginBottom: 15, fontWeight: "500", color: "#2196f3", textAlign: "center" }}>{langData[lng].tutorial.titleLang}</Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
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
                    <Text style={{ fontSize: 24, marginBottom: 15, fontWeight: "500", color: "#2196f3" }}>Добро пожаловать</Text>
                }
                {page == 3 &&
                    <>
                        <Text style={{ fontSize: 24, marginBottom: 15, fontWeight: "500", color: "#2196f3", textAlign: "center" }}>{langData[lng].tutorial.titleGender}</Text>
                        <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
                            <TouchableWithoutFeedback onPressIn={() => handleChangeGender("m")}>
                                <View style={[{ backgroundColor: "#2196f3", height: 140, width: 140, borderRadius: 15, padding: 20, opacity: 0.5 }, gender == "m" && { opacity: 1 }]}>
                                    <Image source={require("../assets/images/man.png")} style={{ width: "100%", height: "100%" }} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPressIn={() => handleChangeGender("w")}>
                                <View style={[{ backgroundColor: "#2196f3", height: 140, width: 140, borderRadius: 15, padding: 20, opacity: 0.5 }, gender == "w" && { opacity: 1 }]}>
                                    <Image source={require("../assets/images/woman.png")} style={{ width: "100%", height: "100%" }} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#2196f3", padding: 10, borderRadius: 15 }}>
                            <Image source={require("../assets/images/descr.png")} style={{ width: 50, height: 50 }} />
                            <Text style={{ fontSize: 16, color: "white", width: 210 }}>Выбор повлияет на расчёт рекомендуемой дневной нормы воды.</Text>
                        </View>
                    </>
                }
                {page == 4 &&
                    <>
                        <Text style={{ fontSize: 24, marginBottom: 15, fontWeight: "500", color: "#2196f3", textAlign: "center" }}>{langData[lng].tutorial.titleWeight}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#2196f3", padding: 10, borderRadius: 15, marginBottom: 15 }}>
                            <Text style={{ fontSize: 16, color: "white" }}>
                                Укажите свой текущий вес, чтобы мы смогли высчитать дневную норму воды для вас. Если вам не подойдёт полученная дневная норма воды, то вы сможете изменить её позже в приложение.
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 15, marginBottom: 15 }}>
                            <View style={{ backgroundColor: "#BBDEFB", borderColor: "#2196f3", borderWidth: 2, borderRadius: 10, position: "relative", width: 100 }}>
                                <TextInput value={weightPerson.toString()} onChangeText={(v) => handleChangeWeight(v)} keyboardType="number-pad" placeholder="0" placeholderTextColor={"white"} cursorColor={"white"} style={{ fontSize: 20, paddingHorizontal: 10, height: 36, color: "white" }} />
                                <Text style={{ position: "absolute", right: 10, lineHeight: 36, fontSize: 20, color: "white" }}>кг</Text>
                            </View>
                            <Text style={{ fontSize: 24, height: 40, width: 40, backgroundColor: "#2196f3", textAlign: "center", lineHeight: 40, borderRadius: 100, color: "white" }}>=</Text>
                            <View style={{ width: 100, backgroundColor: "#2196f3", height: 40, paddingHorizontal: 10, borderRadius: 10, flexDirection: "row" }}>
                                <Text style={{ lineHeight: 40, fontSize: 20, color: "white" }}>
                                    {gender == "m"
                                        ? Number(weightPerson) * 35
                                        : Number(weightPerson) * 31
                                    }
                                </Text>
                                <Text style={{ position: "absolute", right: 10, lineHeight: 40, fontSize: 20, color: "white" }}>мл</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: "#2196f3", padding: 10, borderRadius: 15, marginBottom: 15 }}>
                            <Text style={{ fontSize: 16, color: "white" }}>
                                Для удобства отслеживания потребления воды, мы разбиваем дневную норму воды по стаканам.
                                Снизу отображается количество стаканов.
                            </Text>
                        </View>
                        <Text style={{ backgroundColor: "#2196f3", padding: 10, borderRadius: 10, fontSize: 20, color: "white", width: 50, marginHorizontal: "auto", marginBottom: 15, textAlign: "center" }}>
                            {gender == "m"
                                ? Math.ceil(Number(weightPerson) * 35 / 250)
                                : Math.ceil(Number(weightPerson) * 31 / 250)
                            }
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#2196f3", padding: 10, borderRadius: 15 }}>
                            <Image source={require("../assets/images/descr.png")} style={{ width: 50, height: 50 }} />
                            <Text style={{ fontSize: 16, color: "white", width: 210 }}>Каждый стакан имеет объём в 250 мл.</Text>
                        </View>
                    </>
                }
            </View>
            <TouchableWithoutFeedback onPressIn={() => handleChangePage()}>
                <Text style={[{ backgroundColor: "#2196f3", padding: 10, width: 290, color: "white", textAlign: "center", borderRadius: 10, fontSize: 20, marginTop: "auto" },
                gender == "" && page == 3 && { opacity: 0.5 },
                weightPerson == 0 && page == 4 && { opacity: 0.5 }]}>{langData[lng].tutorial.button}</Text>
            </TouchableWithoutFeedback>
        </ScrollView>
    </>
}
