import { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Quickstart, { PresetValues } from '@/components/Quickstart'
import Presets from '@/components/Presets'
import SavePresetModal from '@/components/SavePresetModal'
import { usePresets } from '@/hooks/usePresets'

export default function Page() {
  const [presetValues, setPresetValues] = useState<PresetValues>({
    sets: 3,
    workTime: 5 * 60,
    restTime: 60,
  })
  const [showSaveModal, setShowSaveModal] = useState(false)
  const { presets, savePreset } = usePresets()

  const handleStart = () => {
    console.log('Starting with:', presetValues)
    alert(`Starting: ${presetValues.sets} sets, ${presetValues.workTime}s work, ${presetValues.restTime}s rest`)
  }

  const handleSave = () => {
    setShowSaveModal(true)
  }

  const handleSavePreset = async (name: string) => {
    await savePreset(name, presetValues)
    setShowSaveModal(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 16 }}>
        <Quickstart values={presetValues} onChange={setPresetValues} onStart={handleStart} onSave={handleSave} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Presets presets={presets} onSelect={setPresetValues} onAdd={() => alert('Not implemented yet!')} />
      </ScrollView>

      <SavePresetModal
        visible={showSaveModal}
        values={presetValues}
        onSave={handleSavePreset}
        onClose={() => setShowSaveModal(false)}
      />
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
})
