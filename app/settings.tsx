import { JSX, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, SupportedLanguage, saveLanguage, needsRTLRestart, applyRTL } from '@/i18n'
import RestartConfirmModal from '@/components/RestartConfirmModal'

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

      <View style={styles.content}>
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
      </View>

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
    textTransform: 'uppercase',
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
})
