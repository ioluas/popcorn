import { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import CounterButton from '@/components/CounterButton'

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`
}

export default function Page() {
  const [sets, setSets] = useState<number>(3)
  const [workTime, setWorkTime] = useState<number>(5)
  const [restTime, setRestTime] = useState<number>(5)
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Quickstart Card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardHeader} onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.cardTitle}>Quickstart</Text>
            <Text style={styles.chevron}>
              {isExpanded ? (
                <Ionicons name="chevron-expand" size={24} color="#e2e2e2" />
              ) : (
                <Ionicons name="chevron-collapse" size={24} color="#e2e2e2" />
              )}
            </Text>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.cardContent}>
              {/* Sets */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sets</Text>
                <View style={styles.counter}>
                  <CounterButton type={'decrement'} value={sets} amount={1} setter={setSets}/>
                  <Text style={styles.counterValue}>{sets}</Text>
                  <CounterButton type={'increment'} value={sets} amount={1} setter={setSets}/>
                </View>
              </View>

              {/* Workout */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Workout</Text>
                <View style={styles.counter}>
                  <CounterButton type={'decrement'} value={workTime} amount={5} setter={setWorkTime}/>
                  <CounterButton type={'decrement'} value={workTime} amount={1} setter={setWorkTime}/>
                  <Text style={styles.timeValue}>{formatTime(workTime)}</Text>
                  <CounterButton type={'increment'} value={workTime} amount={1} setter={setWorkTime}/>
                  <CounterButton type={'increment'} value={workTime} amount={5} setter={setWorkTime}/>
                </View>
              </View>

              {/* Rest */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rest</Text>
                <View style={styles.counter}>
                  <CounterButton type={'decrement'} value={restTime} amount={5} setter={setRestTime}/>
                  <CounterButton type={'decrement'} value={restTime} amount={1} setter={setRestTime}/>
                  <Text style={styles.timeValue}>{formatTime(restTime)}</Text>
                  <CounterButton type={'increment'} value={restTime} amount={1} setter={setRestTime}/>
                  <CounterButton type={'increment'} value={restTime} amount={5} setter={setRestTime}/>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={() => alert('Not implemented yet!')}>
                <Ionicons name={'save-outline'} size={16} color={styles.saveButtonText.color} />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} onPress={() => alert('Not implemented yet!')}>
            <MaterialIcons name="electric-bolt" size={24} color={styles.startButtonText.color} />
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>

        {/* Presets Section */}
        <View style={styles.presetsSection}>
          <View style={styles.presetsHeader}>
            <Text style={styles.presetsTitle}>No presets yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => alert('Not implemented yet!')}>
              <Entypo name="plus" size={16} color={styles.addButtonText.color} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.presetsDescription}>
            To create your first preset, use the Save button to quick save. For advanced settings use the Add button.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#4a5c6a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#fff',
  },
  chevron: {
    fontSize: 20,
    color: '#fff',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputGroup: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#b0bec5',
    letterSpacing: 2,
    marginBottom: 8,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterValue: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '400',
    minWidth: 60,
    textAlign: 'center',
  },
  timeValue: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '400',
    minWidth: 120,
    textAlign: 'center',
  },
  saveButton: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  startButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#5d7a8c',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    color: '#e8d44d',
    fontWeight: '600',
    letterSpacing: 1,
  },
  presetsSection: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  presetsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  presetsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  presetsDescription: {
    fontSize: 16,
    color: '#9e9e9e',
    lineHeight: 24,
  },
})
