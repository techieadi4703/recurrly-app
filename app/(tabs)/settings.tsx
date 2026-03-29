import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="text-xl px-4 pt-4 font-bold text-success">Settings</Text>
    </SafeAreaView>
  )
}

export default Settings