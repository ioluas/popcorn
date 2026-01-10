import { Dispatch, JSX, SetStateAction, useState } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useTranslation } from 'react-i18next'
import CounterButton from '@/components/partials/CounterButton'
import { formatTime } from '@/utils/General'

export type PresetValues = {
  sets: number
  workTime: number
  restTime: number
}

type QuickstartProps = {
  values: PresetValues
  onChange: Dispatch<SetStateAction<PresetValues>>
  onStart: () => void
  onSave: () => void
}

export default function Quickstart({ values, onChange, onStart, onSave }: QuickstartProps): JSX.Element {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  const { sets, workTime, restTime } = values

  const setSets = (updater: (prev: number) => number) => {
    onChange((prev) => ({ ...prev, sets: updater(prev.sets) }))
  }

  const setWorkTime = (updater: (prev: number) => number) => {
    onChange((prev) => ({ ...prev, workTime: updater(prev.workTime) }))
  }

  const setRestTime = (updater: (prev: number) => number) => {
    onChange((prev) => ({ ...prev, restTime: updater(prev.restTime) }))
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.cardTitle}>{t('quickstart.title')}</Text>
        <Text style={styles.chevron}>
          {isExpanded ? (
            <Ionicons name="chevron-collapse" size={24} color="#e2e2e2" />
          ) : (
            <Ionicons name="chevron-expand" size={24} color="#e2e2e2" />
          )}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.cardContent}>
          {/* Sets */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('quickstart.labels.sets')}</Text>
            <View style={styles.counter}>
              <CounterButton type={'decrement'} amount={1} setter={setSets} testID="sets-decrement" />
              <Text style={styles.counterValue}>{sets}</Text>
              <CounterButton type={'increment'} amount={1} setter={setSets} testID="sets-increment" />
            </View>
          </View>

          {/* Workout */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('quickstart.labels.workout')}</Text>
            <View style={styles.counter}>
              <CounterButton type={'decrement'} amount={5} setter={setWorkTime} testID="work-decrement-5" />
              <CounterButton type={'decrement'} amount={1} setter={setWorkTime} testID="work-decrement-1" />
              <Text style={styles.timeValue}>{formatTime(workTime)}</Text>
              <CounterButton type={'increment'} amount={1} setter={setWorkTime} testID="work-increment-1" />
              <CounterButton type={'increment'} amount={5} setter={setWorkTime} testID="work-increment-5" />
            </View>
          </View>

          {/* Rest */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('quickstart.labels.rest')}</Text>
            <View style={styles.counter}>
              <CounterButton type={'decrement'} amount={5} setter={setRestTime} testID="rest-decrement-5" />
              <CounterButton type={'decrement'} amount={1} setter={setRestTime} testID="rest-decrement-1" />
              <Text style={styles.timeValue}>{formatTime(restTime)}</Text>
              <CounterButton type={'increment'} amount={1} setter={setRestTime} testID="rest-increment-1" />
              <CounterButton type={'increment'} amount={5} setter={setRestTime} testID="rest-increment-5" />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Ionicons name={'save-outline'} size={16} color={styles.saveButtonText.color} />
            <Text style={styles.saveButtonText}>{t('quickstart.buttons.save')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={() => onStart()}>
        <MaterialIcons name="electric-bolt" size={24} color={styles.startButtonText.color} />
        <Text style={styles.startButtonText}>{t('quickstart.buttons.start')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
})
