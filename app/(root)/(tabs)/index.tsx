import { Link } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from "@/types";

export default function Index() {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    loadTaskStats();
  }, []);

  const loadTaskStats = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks) {
        const tasks: Task[] = JSON.parse(storedTasks);
        const completed = tasks.filter(task => task.completed).length;
        setTaskStats({
          total: tasks.length,
          completed,
          pending: tasks.length - completed
        });
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 p-6 rounded-b-3xl shadow-md">
        <Text className="text-3xl font-bold text-white mb-2">Task Tracker</Text>
        <Text className="text-white text-opacity-80">Manage your tasks efficiently</Text>
      </View>

      {/* Stats Cards */}
      <View className="flex-row justify-between px-4 -mt-6">
        <View className="bg-white p-4 rounded-xl shadow w-[30%]">
          <Text className="text-gray-600">Total</Text>
          <Text className="text-2xl font-bold text-gray-800">{taskStats.total}</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow w-[30%]">
          <Text className="text-gray-600">Done</Text>
          <Text className="text-2xl font-bold text-green-600">{taskStats.completed}</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow w-[30%]">
          <Text className="text-gray-600">Pending</Text>
          <Text className="text-2xl font-bold text-orange-500">{taskStats.pending}</Text>
        </View>
      </View>

      {/* Navigation Button */}
      <View className="flex-1 items-center justify-center p-4">
        <Link href="/tasksList" asChild>
          <TouchableOpacity className="bg-blue-500 p-4 rounded-xl shadow-md flex-row items-center">
            <Ionicons name="list" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">View Tasks</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <View className="p-4 items-center">
        <Text className="text-gray-500">Stay organized, get more done</Text>
        <Text className="text-gray-500">By GHAZI</Text>
      </View>
    </View>
  );
}
