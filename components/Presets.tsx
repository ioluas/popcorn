import { JSX } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo'
import { Ionicons } from '@expo/vector-icons'
import { Preset } from '@/utils/General'
import { PresetValues } from '@/components/Quickstart'
import { formatTime } from '@/utils/General'

type PresetsProps = {
  presets: Preset[]
  onSelect: (values: PresetValues) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export default function Presets({ presets, onSelect, onDelete, onAdd }: PresetsProps): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{presets.length === 0 ? 'No presets yet' : 'Presets'}</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Entypo name="plus" size={16} color={styles.addButtonText.color} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {presets.length === 0 ? (
        <Text style={styles.description}>
          To create your first preset, use the Save button to quick save. For advanced settings use the Add button.
        </Text>
      ) : (
        <View style={styles.list}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={styles.item}
              onPress={() => onSelect({ sets: preset.sets, workTime: preset.workTime, restTime: preset.restTime })}
            >
              <View style={styles.itemContent}>
                <View>
                  <Text style={styles.itemName}>{preset.name}</Text>
                  <Text style={styles.itemDetails}>
                    {preset.sets} sets · {formatTime(preset.workTime)} work · {formatTime(preset.restTime)} rest
                  </Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(preset.id)}>
                  <Ionicons name="trash-outline" size={20} color="#b0bec5" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
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
  description: {
    fontSize: 16,
    color: '#9e9e9e',
    lineHeight: 24,
  },
  list: {
    gap: 8,
  },
  item: {
    backgroundColor: '#4a5c6a',
    borderRadius: 8,
    padding: 12,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 13,
    color: '#b0bec5',
  },
})
