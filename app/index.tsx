import React, { useEffect, useState } from "react";
import Main from "./Main";
import { checkFirstDay } from "@/scripts/_getData";
import { SafeAreaView, StatusBar, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "@/scripts/_styles";
import Tutorial from "./Tutorial";

export default function Root() {
  const [firstRun, setFirstRun] = useState<String>("")
  const [register, setRegister] = useState<boolean>(false)

  useEffect(() => {
    async function funcAsync() {
      // let first = await checkFirstDay()
      // setFirstRun(first)
    }
    funcAsync()
  }, [])

  // чистка стора
  // useEffect(() => {
  //   let ttt = async () => {
  //     await AsyncStorage.clear()
  //   }
  //   ttt()
  // }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#2196f3" barStyle={"dark-content"} />
      <SafeAreaView style={styles.root}>
        {register == true
          ? <Main />
          : <Tutorial setRegister={setRegister}/>}
      </SafeAreaView>
    </View>
  );
}


