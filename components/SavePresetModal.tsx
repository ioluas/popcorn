import { useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PresetValues } from '@/components/Quickstart'
import { formatTime } from '@/utils/General'

type SavePresetModalProps = {
  visible: boolean
  values: PresetValues
  onSave: (name: string) => void
  onClose: () => void
}

export default function SavePresetModal({ visible, values, onSave, onClose }: SavePresetModalProps) {
  const [name, setName] = useState<string>('')

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
      setName('')
    }
  }

  const handleClose = () => {
    setName('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Save Preset</Text>

          <View style={styles.valuesContainer}>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Sets</Text>
              <Text style={styles.valueText}>{values.sets}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Work</Text>
              <Text style={styles.valueText}>{formatTime(values.workTime)}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Rest</Text>
              <Text style={styles.valueText}>{formatTime(values.restTime)}</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter preset name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#4a5c6a',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  valuesContainer: {
    backgroundColor: '#3d4f5a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  valueLabel: {
    fontSize: 14,
    color: '#b0bec5',
  },
  valueText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#3d4f5a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#5d7a8c',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#e8d44d',
    fontWeight: '600',
  },
})
