import { Button, Checkbox, Host } from '@expo/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Brand blue used for the app bar, the outlined field and the SAVE button. */
const BLUE = '#3D5AFE';
/** How long the "Task Added!" toast stays on screen before fading out. */
const TOAST_DURATION = 2400;

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');

  const nextId = useRef(1);
  const [toastOpacity] = useState(() => new Animated.Value(0));
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const showToast = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    hideTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, TOAST_DURATION);
  };

  const handleSave = () => {
    const title = taskText.trim();
    if (!title) {
      return;
    }

    setTasks((previous) => [
      ...previous,
      { id: String(nextId.current++), title, done: false },
    ]);
    setTaskText('');
    showToast();
  };

  const toggleTask = (id: string, done: boolean) => {
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, done } : task)),
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.appBar}>
        <View style={styles.appBarContent}>
          <MaterialIcons name="menu" size={26} color="#FFFFFF" />
          <Text style={styles.appBarTitle}>Menu</Text>
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Add an item</Text>

          <View style={styles.inputRow}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Enter a task</Text>
              <TextInput
                style={styles.input}
                value={taskText}
                onChangeText={setTaskText}
                placeholder="Mow the lawn"
                placeholderTextColor="#9E9E9E"
                underlineColorAndroid="transparent"
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>

            <Host
              matchContents
              colorScheme="light"
              seedColor={BLUE}
              ignoreSafeArea="all"
              style={styles.saveButtonHost}>
              <Button
                label="SAVE"
                variant="filled"
                onPress={handleSave}
                style={styles.saveButton}
              />
            </Host>
          </View>

          <View style={styles.list}>
            {tasks.map((task) => (
              <Host
                key={task.id}
                matchContents
                colorScheme="light"
                seedColor={BLUE}
                ignoreSafeArea="all"
                style={styles.taskHost}>
                <Checkbox
                  label={task.title}
                  value={task.done}
                  onValueChange={(done) => toggleTask(task.id, done)}
                />
              </Host>
            ))}
          </View>
        </ScrollView>

        <Animated.View
          style={[styles.toast, { opacity: toastOpacity, pointerEvents: 'none' }]}
          accessibilityRole="alert">
          <Text style={styles.toastText}>Task Added!</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    backgroundColor: BLUE,
  },
  appBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  field: {
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  fieldLabel: {
    position: 'absolute',
    top: -9,
    left: 10,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
    color: BLUE,
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    padding: 0,
    fontSize: 17,
    color: '#000000',
  },
  saveButtonHost: {
    alignSelf: 'flex-start',
  },
  saveButton: {
    backgroundColor: BLUE,
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  list: {
    marginTop: 32,
    paddingLeft: 8,
    gap: 16,
    alignItems: 'flex-start',
  },
  taskHost: {
    alignSelf: 'flex-start',
  },
  toast: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 20,
    backgroundColor: '#323232',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
