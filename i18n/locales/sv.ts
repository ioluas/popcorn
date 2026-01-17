import { TranslationKeys } from '../types'

const sv: TranslationKeys = {
  timer: {
    phases: {
      work: 'Arbete',
      rest: 'Vila',
      complete: 'Klart!',
    },
    setProgress: 'Set {{current}} / {{total}}',
    holdToExit: 'Håll för att avsluta',
  },
  quickstart: {
    title: 'Snabbstart',
    labels: {
      sets: 'Set',
      workout: 'Träning',
      rest: 'Vila',
    },
    buttons: {
      save: 'Spara',
      start: 'Starta',
    },
  },
  presets: {
    title: 'Förinställningar',
    noPresets: 'Inga förinställningar ännu',
    description: 'Skapa din första förinställning med Spara-knappen i Snabbstart.',
    itemDetails: '{{sets}} set · {{workTime}} arbete · {{restTime}} vila',
    accessibility: {
      startPreset: 'Starta {{name}}',
      deletePreset: 'Ta bort {{name}}',
    },
  },
  savePresetModal: {
    title: 'Spara förinställning',
    labels: {
      sets: 'Set',
      work: 'Arbete',
      rest: 'Vila',
    },
    placeholder: 'Ange namn',
    buttons: {
      cancel: 'Avbryt',
      save: 'Spara',
    },
  },
  confirmDeleteModal: {
    title: 'Ta bort förinställning',
    message: 'Är du säker på att du vill ta bort "{{presetName}}"?',
    buttons: {
      cancel: 'Avbryt',
      delete: 'Ta bort',
    },
    accessibility: {
      cancelDelete: 'Avbryt borttagning',
      confirmDelete: 'Bekräfta borttagning',
    },
  },
  settings: {
    title: 'Inställningar',
    language: {
      label: 'Språk',
      languages: {
        en: 'English',
        sv: 'Svenska',
        ar: 'العربية',
      },
    },
    volume: {
      label: 'Volym',
    },
    colors: {
      workBackground: 'Arbetsbakgrund',
      restBackground: 'Vilabakgrund',
      reset: 'Återställ',
    },
  },
  common: {
    restartRequired: 'Omstart krävs',
    restartMessage: 'Byte till detta språk kräver omstart av appen. Fortsätta?',
    restart: 'Starta om',
    cancel: 'Avbryt',
    increaseBy: 'Öka med {{amount}}',
    decreaseBy: 'Minska med {{amount}}',
  },
}

export default sv
