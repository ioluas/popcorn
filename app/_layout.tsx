import { useEffect, useState } from 'react'
import { View, ActivityIndicator, I18nManager, Alert } from 'react-native'
import { Stack } from 'expo-router'
import { I18nextProvider } from 'react-i18next'
import i18n, { initI18n, isRTL } from '@/i18n'

export default function RootLayout() {
  const [isI18nReady, setIsI18nReady] = useState(false)

  useEffect(() => {
    initI18n().then(() => {
      const currentLang = i18n.language
      const shouldBeRTL = isRTL(currentLang)
      const currentlyRTL = I18nManager.isRTL

      // If RTL state doesn't match the language, fix it and notify user
      if (shouldBeRTL !== currentlyRTL) {
        I18nManager.allowRTL(shouldBeRTL)
        I18nManager.forceRTL(shouldBeRTL)
        // In dev mode, user needs to manually restart again
        if (__DEV__) {
          Alert.alert('Restart Required', 'Please close and reopen the app to apply layout direction changes.')
        }
      }
      setIsI18nReady(true)
    })
  }, [])

  if (!isI18nReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#242424', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" testID="activity-indicator" />
      </View>
    )
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#242424' },
        }}
      />
    </I18nextProvider>
  )
}
