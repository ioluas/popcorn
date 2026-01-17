import { useState } from 'react'
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Quickstart, { PresetValues } from '@/components/Quickstart'
import Presets from '@/components/Presets'
import SavePresetModal from '@/components/SavePresetModal'
import CockatooAnimation from '@/components/CockatooAnimation'
import { usePresets } from '@/hooks/usePresets'
import { useCockatoo } from '@/hooks/useCockatoo'

export default function Page() {
  const router = useRouter()
  const [presetValues, setPresetValues] = useState<PresetValues>({
    sets: 3,
    workTime: 60,
    restTime: 30,
  })
  const [showSaveModal, setShowSaveModal] = useState(false)
  const { presets, savePreset, deletePreset } = usePresets()
  const { isAnimationPlaying, onAnimationComplete } = useCockatoo(presetValues.workTime)

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
      <CockatooAnimation isPlaying={isAnimationPlaying} onComplete={onAnimationComplete} />
      <View style={{ paddingHorizontal: 16 }}>
        <Quickstart values={presetValues} onChange={setPresetValues} onStart={handleStart} onSave={handleSave} />
      </View>

      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#b0bec5" />
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerSpacer: {
    width: 40,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
})
