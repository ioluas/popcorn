import { TranslationKeys } from '../types'

const en: TranslationKeys = {
  timer: {
    phases: {
      work: 'Work',
      rest: 'Rest',
      complete: 'Complete!',
    },
    setProgress: 'Set {{current}} / {{total}}',
    holdToExit: 'Hold to Exit',
  },
  quickstart: {
    title: 'Quickstart',
    labels: {
      sets: 'Sets',
      workout: 'Workout',
      rest: 'Rest',
    },
    buttons: {
      save: 'Save',
      start: 'Start',
    },
  },
  presets: {
    title: 'Presets',
    noPresets: 'No presets yet',
    description: 'To create your first preset, use the Save button in Quickstart.',
    itemDetails: '{{sets}} sets · {{workTime}} work · {{restTime}} rest',
    accessibility: {
      startPreset: 'Start {{name}} preset',
      deletePreset: 'Delete {{name}} preset',
    },
  },
  savePresetModal: {
    title: 'Save Preset',
    labels: {
      sets: 'Sets',
      work: 'Work',
      rest: 'Rest',
    },
    placeholder: 'Enter preset name',
    buttons: {
      cancel: 'Cancel',
      save: 'Save',
    },
  },
  confirmDeleteModal: {
    title: 'Delete Preset',
    message: 'Are you sure you want to delete "{{presetName}}"?',
    buttons: {
      cancel: 'Cancel',
      delete: 'Delete',
    },
    accessibility: {
      cancelDelete: 'Cancel delete preset',
      confirmDelete: 'Confirm delete preset',
    },
  },
  settings: {
    title: 'Settings',
    language: {
      label: 'Language',
      languages: {
        en: 'English',
        sv: 'Svenska',
        ar: 'العربية',
      },
    },
    volume: {
      label: 'Volume',
    },
    colors: {
      workBackground: 'Work Background',
      restBackground: 'Rest Background',
      reset: 'Reset',
    },
  },
  common: {
    restartRequired: 'Restart Required',
    restartMessage: 'Changing to this language requires restarting the app. Continue?',
    restart: 'Restart',
    cancel: 'Cancel',
    increaseBy: 'Increase by {{amount}}',
    decreaseBy: 'Decrease by {{amount}}',
  },
}

export default en
