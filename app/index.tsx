import { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Quickstart, { PresetValues } from '@/components/Quickstart'
import Presets from '@/components/Presets'
import SavePresetModal from '@/components/SavePresetModal'
import { usePresets } from '@/hooks/usePresets'

export default function Page() {
  const router = useRouter()
  const [presetValues, setPresetValues] = useState<PresetValues>({
    sets: 3,
    workTime: 60,
    restTime: 30,
  })
  const [showSaveModal, setShowSaveModal] = useState(false)
  const { presets, savePreset, deletePreset } = usePresets()

  const handleStart = (values?: PresetValues) => {
    const { sets, workTime, restTime } = values ?? presetValues
    router.push({
      pathname: '/timer',
      params: {
        sets: String(sets),
        workTime: String(workTime),
        restTime: String(restTime),
      },
    })
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
        <Presets presets={presets} onSelect={setPresetValues} onStart={handleStart} onDelete={deletePreset} />
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
