import { TranslationKeys } from '../types'

const ar: TranslationKeys = {
  timer: {
    phases: {
      work: 'تمرين',
      rest: 'راحة',
      complete: 'اكتمل!',
    },
    setProgress: 'المجموعة {{current}} / {{total}}',
    holdToExit: 'اضغط مطولاً للخروج',
  },
  quickstart: {
    title: 'البدء السريع',
    labels: {
      sets: 'المجموعات',
      workout: 'التمرين',
      rest: 'الراحة',
    },
    buttons: {
      save: 'حفظ',
      start: 'ابدأ',
    },
  },
  presets: {
    title: 'الإعدادات المسبقة',
    noPresets: 'لا توجد إعدادات مسبقة',
    description: 'لإنشاء إعداد مسبق، استخدم زر الحفظ في البدء السريع.',
    itemDetails: '{{sets}} مجموعات · {{workTime}} تمرين · {{restTime}} راحة',
    accessibility: {
      startPreset: 'بدء {{name}}',
      deletePreset: 'حذف {{name}}',
    },
  },
  savePresetModal: {
    title: 'حفظ الإعداد المسبق',
    labels: {
      sets: 'المجموعات',
      work: 'التمرين',
      rest: 'الراحة',
    },
    placeholder: 'أدخل الاسم',
    buttons: {
      cancel: 'إلغاء',
      save: 'حفظ',
    },
  },
  confirmDeleteModal: {
    title: 'حذف الإعداد المسبق',
    message: 'هل أنت متأكد من حذف "{{presetName}}"؟',
    buttons: {
      cancel: 'إلغاء',
      delete: 'حذف',
    },
    accessibility: {
      cancelDelete: 'إلغاء الحذف',
      confirmDelete: 'تأكيد الحذف',
    },
  },
  settings: {
    title: 'الإعدادات',
    language: {
      label: 'اللغة',
      languages: {
        en: 'English',
        sv: 'Svenska',
        ar: 'العربية',
      },
    },
  },
  common: {
    restartRequired: 'يجب إعادة التشغيل',
    restartMessage: 'تغيير اللغة يتطلب إعادة تشغيل التطبيق. هل تريد المتابعة؟',
    restart: 'إعادة التشغيل',
    cancel: 'إلغاء',
    increaseBy: 'زيادة بمقدار {{amount}}',
    decreaseBy: 'نقصان بمقدار {{amount}}',
  },
}

export default ar
