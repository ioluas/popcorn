import { useState, useEffect, useCallback } from 'react'
import { PresetValues } from '@/components/Quickstart'
import { Preset, loadPresetsFromStorage, persistPresetsToStorage } from '@/utils/General'

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPresetsFromStorage().then((loaded) => {
      setPresets(loaded)
      setIsLoading(false)
    })
  }, [])

  const savePreset = useCallback(
    async (name: string, values: PresetValues) => {
      const newPreset: Preset = {
        id: Date.now().toString(),
        name,
        sets: values.sets,
        workTime: values.workTime,
        restTime: values.restTime,
        createdAt: Date.now(),
      }
      const newPresets = [...presets, newPreset]
      setPresets(newPresets)
      await persistPresetsToStorage(newPresets)
      return newPreset
    },
    [presets]
  )

  const deletePreset = useCallback(
    async (id: string) => {
      const newPresets = presets.filter((p) => p.id !== id)
      setPresets(newPresets)
      await persistPresetsToStorage(newPresets)
    },
    [presets]
  )

  return { presets, isLoading, savePreset, deletePreset }
}
