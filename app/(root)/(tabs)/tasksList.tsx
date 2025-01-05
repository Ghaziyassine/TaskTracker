import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category } from '../../../types';

// Test data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    completed: false,
    category: 'work',
    dueDate: new Date(),
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Test Task 2',
    completed: true,
    category: 'personal',
    dueDate: new Date(),
    createdAt: new Date()
  }
];

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks); // Initialize with test data
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const categories: Category[] = ['work', 'personal', 'shopping', 'other'];

  useEffect(() => {
    loadTasks();
    console.log('Current tasks:', tasks); // Debug log
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
        console.log('Loaded tasks:', parsedTasks); // Debug log
      } else {
        // If no stored tasks, use initial test data
        await AsyncStorage.setItem('tasks', JSON.stringify(initialTasks));
        setTasks(initialTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const filteredTasks = selectedCategory === 'all' 
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="flex-row mb-4 space-x-2">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'all' ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onPress={() => setSelectedCategory('all')}
        >
          <Text className={`${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={() => setSelectedCategory(category)}
          >
            <Text className={`${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tasks.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">No tasks available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 mb-2 rounded-lg flex-row items-center">
              <TouchableOpacity
                onPress={() => toggleTask(item.id)}
                className="mr-3"
              >
                <View className={`w-6 h-6 rounded-full border-2 ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                }`} />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className={`text-lg ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-500">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                className="ml-2"
              >
                <Text className="text-red-500">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}