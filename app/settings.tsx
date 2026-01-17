import { JSX, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import Slider from '@react-native-community/slider'
import { SUPPORTED_LANGUAGES, SupportedLanguage, saveLanguage, needsRTLRestart, applyRTL } from '@/i18n'
import RestartConfirmModal from '@/components/RestartConfirmModal'
import { useVolume } from '@/hooks/useVolume'
import { useSounds } from '@/hooks/useSounds'
import { useTimerColors, DEFAULT_BG_COLOR } from '@/hooks/useTimerColors'

const COLOR_PRESETS = [
  DEFAULT_BG_COLOR, // Default dark
  '#1a1a2e', // Dark navy
  '#0d3b4c', // Dark teal
  '#1b4332', // Dark green
  '#4a1942', // Dark purple
  '#5c1a1a', // Dark red
  '#FF6B35', // Orange (from icon)
  '#E91E8C', // Pink/magenta (from icon)
  '#5BC0EB', // Light blue (from icon)
  '#1E88E5', // Blue (from icon)
  '#2ECC71', // Green (from icon)
  '#FFC107', // Amber/yellow (from icon)
]

function invertColor(hex: string): string {
  const color = hex.replace('#', '')
  const r = 255 - parseInt(color.substring(0, 2), 16)
  const g = 255 - parseInt(color.substring(2, 4), 16)
  const b = 255 - parseInt(color.substring(4, 6), 16)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  sv: 'Svenska',
  ar: 'العربية',
}

async function reloadApp() {
  if (__DEV__) {
    // In development mode, expo-updates is not available
    Alert.alert('Development Mode', 'Please restart the app manually to apply RTL changes.')
    return
  }

  try {
    const Updates = await import('expo-updates')
    await Updates.reloadAsync()
  } catch {
    Alert.alert('Please restart the app manually to apply RTL changes.')
  }
}

export default function SettingsPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [pendingLanguage, setPendingLanguage] = useState<SupportedLanguage | null>(null)
  const { volume, setVolume } = useVolume()
  const { playBeep } = useSounds(volume)
  const { workBgColor, restBgColor, setWorkBgColor, setRestBgColor } = useTimerColors()

  const handleWorkColorChange = (color: string) => {
    void setWorkBgColor(color === DEFAULT_BG_COLOR ? null : color)
  }

  const handleRestColorChange = (color: string) => {
    void setRestBgColor(color === DEFAULT_BG_COLOR ? null : color)
  }

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language === i18n.language) return

    const requiresRestart = needsRTLRestart(language)

    if (requiresRestart) {
      setPendingLanguage(language)
    } else {
      await saveLanguage(language)
      await i18n.changeLanguage(language)
    }
  }

  const handleConfirmRestart = async () => {
    if (!pendingLanguage) return

    await saveLanguage(pendingLanguage)
    await i18n.changeLanguage(pendingLanguage)
    applyRTL(pendingLanguage)
    setPendingLanguage(null)
    await reloadApp()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language.label')}</Text>
          <View style={styles.optionsList}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.option, i18n.language === lang && styles.optionSelected]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text style={[styles.optionText, i18n.language === lang && styles.optionTextSelected]}>
                  {LANGUAGE_LABELS[lang]}
                </Text>
                {i18n.language === lang && <Ionicons name="checkmark" size={20} color="#e8d44d" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.volume.label')}</Text>
          <View style={styles.sliderContainer}>
            <Ionicons name="volume-low" size={20} color="#b0bec5" />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setVolume}
              onSlidingComplete={playBeep}
              minimumTrackTintColor="#e8d44d"
              maximumTrackTintColor="#4a5c6a"
              thumbTintColor="#e8d44d"
            />
            <Ionicons name="volume-high" size={20} color="#b0bec5" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.colors.workBackground')}</Text>
          <View style={styles.colorSwatchContainer}>
            {COLOR_PRESETS.map((color) => {
              const isSelected = (workBgColor ?? DEFAULT_BG_COLOR) === color
              return (
                <TouchableOpacity
                  key={color}
                  testID={`work-color-swatch-${color}`}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color, borderColor: invertColor(color) },
                    isSelected && styles.colorSwatchSelected,
                  ]}
                  onPress={() => handleWorkColorChange(color)}
                >
                  {isSelected && <Ionicons name="checkmark" size={16} color={invertColor(color)} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.colors.restBackground')}</Text>
          <View style={styles.colorSwatchContainer}>
            {COLOR_PRESETS.map((color) => {
              const isSelected = (restBgColor ?? DEFAULT_BG_COLOR) === color
              return (
                <TouchableOpacity
                  key={color}
                  testID={`rest-color-swatch-${color}`}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color, borderColor: invertColor(color) },
                    isSelected && styles.colorSwatchSelected,
                  ]}
                  onPress={() => handleRestColorChange(color)}
                >
                  {isSelected && <Ionicons name="checkmark" size={16} color={invertColor(color)} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>

      <RestartConfirmModal
        visible={pendingLanguage !== null}
        onConfirm={handleConfirmRestart}
        onClose={() => setPendingLanguage(null)}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b0bec5',
    letterSpacing: 1,
    marginBottom: 12,
  },
  optionsList: {
    backgroundColor: '#4a5c6a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d4f5a',
  },
  optionSelected: {
    backgroundColor: '#3d4f5a',
  },
  optionText: {
    fontSize: 16,
    color: '#b0bec5',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5c6a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  colorSwatchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  colorSwatchSelected: {
    borderWidth: 3,
  },
})
