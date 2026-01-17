export type TranslationKeys = {
  timer: {
    phases: {
      work: string
      rest: string
      complete: string
    }
    setProgress: string
    holdToExit: string
  }
  quickstart: {
    title: string
    labels: {
      sets: string
      workout: string
      rest: string
    }
    buttons: {
      save: string
      start: string
    }
  }
  presets: {
    title: string
    noPresets: string
    description: string
    itemDetails: string
    accessibility: {
      startPreset: string
      deletePreset: string
    }
  }
  savePresetModal: {
    title: string
    labels: {
      sets: string
      work: string
      rest: string
    }
    placeholder: string
    buttons: {
      cancel: string
      save: string
    }
  }
  confirmDeleteModal: {
    title: string
    message: string
    buttons: {
      cancel: string
      delete: string
    }
    accessibility: {
      cancelDelete: string
      confirmDelete: string
    }
  }
  settings: {
    title: string
    language: {
      label: string
      languages: {
        en: string
        sv: string
        ar: string
      }
    }
    volume: {
      label: string
    }
    colors: {
      workBackground: string
      restBackground: string
      reset: string
    }
  }
  common: {
    restartRequired: string
    restartMessage: string
    restart: string
    cancel: string
    increaseBy: string
    decreaseBy: string
  }
}

export const LANGUAGE_STORAGE_KEY = 'poptimer:language'

export const SUPPORTED_LANGUAGES = ['en', 'sv', 'ar'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const RTL_LANGUAGES: SupportedLanguage[] = ['ar']
