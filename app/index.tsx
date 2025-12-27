import { useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Quickstart, { PresetValues } from '@/components/Quickstart'
import Presets from '@/components/Presets'
import SavePresetModal from '@/components/SavePresetModal'
import { usePresets } from '@/hooks/usePresets'

export default function Page() {
  const [quickstartValues, setQuickstartValues] = useState<PresetValues>({
    sets: 3,
    workTime: 5 * 60,
    restTime: 60,
  })
  const [showSaveModal, setShowSaveModal] = useState(false)
  const { presets, savePreset } = usePresets()

  const handleStart = () => {
    console.log('Starting with:', quickstartValues)
    alert(`Starting: ${quickstartValues.sets} sets, ${quickstartValues.workTime}s work, ${quickstartValues.restTime}s rest`)
  }

  const handleSave = () => {
    setShowSaveModal(true)
  }

  const handleSavePreset = async (name: string) => {
    await savePreset(name, quickstartValues)
    setShowSaveModal(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Quickstart
          values={quickstartValues}
          onChange={setQuickstartValues}
          onStart={handleStart}
          onSave={handleSave}
        />

        <Presets
          presets={presets}
          onSelect={setQuickstartValues}
          onAdd={() => alert('Not implemented yet!')}
        />
      </ScrollView>

      <SavePresetModal
        visible={showSaveModal}
        values={quickstartValues}
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
