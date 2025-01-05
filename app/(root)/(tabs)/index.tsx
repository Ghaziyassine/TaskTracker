import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-blue-600">Home</Text>
      <Link href="/tasksList" className="mt-2 text-blue-500">Tasks</Link>
    </View>
  );
}
