import { JSX, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Preset, formatTime } from '@/utils/General'
import { PresetValues } from '@/components/Quickstart'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

type PresetsProps = {
  presets: Preset[]
  onSelect: (values: PresetValues) => void
  onStart: (values: PresetValues) => void
  onDelete: (id: string) => void
}

export default function Presets({ presets, onSelect, onStart, onDelete }: PresetsProps): JSX.Element {
  const { t } = useTranslation()
  const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null)

  const handleConfirmDelete = () => {
    if (presetToDelete) {
      onDelete(presetToDelete.id)
      setPresetToDelete(null)
    }
  }

  const getPresetValues = (preset: Preset): PresetValues => ({
    sets: preset.sets,
    workTime: preset.workTime,
    restTime: preset.restTime,
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{presets.length === 0 ? t('presets.noPresets') : t('presets.title')}</Text>
      {presets.length === 0 ? (
        <Text style={styles.description}>{t('presets.description')}</Text>
      ) : (
        <View style={styles.list}>
          {presets.map((preset) => (
            <View key={preset.id} style={styles.item}>
              <View style={styles.itemContent}>
                <TouchableOpacity style={styles.itemInfo} onPress={() => onSelect(getPresetValues(preset))}>
                  <Text style={styles.itemName}>{preset.name}</Text>
                  <Text style={styles.itemDetails}>
                    {t('presets.itemDetails', {
                      sets: preset.sets,
                      workTime: formatTime(preset.workTime),
                      restTime: formatTime(preset.restTime),
                    })}
                  </Text>
                </TouchableOpacity>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => onStart(getPresetValues(preset))}
                    accessibilityLabel={t('presets.accessibility.startPreset', { name: preset.name })}
                    accessibilityRole="button"
                  >
                    <Ionicons name="play" size={20} color="#b0bec5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setPresetToDelete(preset)}
                    accessibilityLabel={t('presets.accessibility.deletePreset', { name: preset.name })}
                    accessibilityRole="button"
                  >
                    <Ionicons name="trash-outline" size={20} color="#b0bec5" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <ConfirmDeleteModal
        visible={presetToDelete !== null}
        presetName={presetToDelete?.name ?? ''}
        onConfirm={handleConfirmDelete}
        onClose={() => setPresetToDelete(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
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
  itemInfo: {
    flex: 1,
  },
  itemActions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  playButton: {
    padding: 8,
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
