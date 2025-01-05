import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-blue-600">Home</Text>
      <Link href="/sign-in" className="mt-4 text-blue-500">Sign in</Link>
      <Link href="/explore" className="mt-2 text-blue-500">Explore</Link>
      <Link href="/profile" className="mt-2 text-blue-500">Profile</Link>
    </View>
  );
}
