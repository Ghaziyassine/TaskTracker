import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Task, Category } from '@/types';
import { Ionicons } from '@expo/vector-icons'; 
import { router } from 'expo-router';

const STORAGE_KEY = '@tasks';
const categories: Category[] = ['work', 'personal', 'shopping', 'other'];

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('other');
  const [dueDate, setDueDate] = useState(new Date());
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [sortByDate, setSortByDate] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = () => {
    if (newTaskTitle.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      category: selectedCategory,
      dueDate: dueDate,
      createdAt: new Date(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTaskTitle('');
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const filteredAndSortedTasks = tasks
    .filter(task => filterCategory === 'all' || task.category === filterCategory)
    .sort((a, b) => {
      if (sortByDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Tasks List</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <View className="mb-4">
        <TextInput
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white mb-2"
          placeholder="Add new task..."
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        
        <View className="bg-white rounded-lg mb-2">
          <Picker
            selectedValue={selectedCategory}
            onValueChange={value => setSelectedCategory(value as Category)}
          >
            {categories.map(category => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className="bg-white p-3 rounded-lg mb-2">
          <Text>Due Date: {dueDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            onChange={(event, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setDueDate(date);
            }}
          />
        )}

        <TouchableOpacity 
          onPress={addTask}
          className="bg-blue-500 p-3 rounded-lg">
          <Text className="text-white text-center font-semibold">Add Task</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1 mr-2">
          <Picker
            selectedValue={filterCategory}
            onValueChange={(itemValue) => setFilterCategory(itemValue)}
            className="bg-white rounded-lg h-12 px-2"
          >
            <Picker.Item label="All Categories" value="all" />
            {categories.map((category) => (
              <Picker.Item 
                key={category} 
                label={category.charAt(0).toUpperCase() + category.slice(1)} 
                value={category}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          onPress={() => setSortByDate(!sortByDate)}
          className={`px-4 py-3 rounded-lg ${
            sortByDate ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <Text className={`${
            sortByDate ? 'text-white' : 'text-gray-700'
          } font-medium`}>
            Sort by Date
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAndSortedTasks}
        keyExtractor={item => item.id}
        className="flex-1"
        renderItem={({ item }) => (
          <View className="bg-white mb-2 p-4 rounded-lg shadow-sm">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity 
                onPress={() => toggleTaskCompletion(item.id)}
                className="flex-1">
                <Text className={`text-lg ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-500">
                  {item.category} • Due: {new Date(item.dueDate).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={() => toggleTaskCompletion(item.id)}
                  className={`px-3 py-1 rounded-md ${item.completed ? 'bg-gray-200' : 'bg-green-500'}`}>
                  <Text className={`${item.completed ? 'text-gray-600' : 'text-white'}`}>
                    {item.completed ? 'Undo' : 'Complete'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => deleteTask(item.id)}
                  className="bg-red-500 px-3 py-1 rounded-md">
                  <Text className="text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}