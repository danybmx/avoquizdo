import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: {
          Save: 'Save',
          'Played times': 'Played times',
          Options: 'Options',
          'Quiz manager': 'Quiz manager',
          Quiz: 'Quiz',
          'Quiz name': 'Quiz name',
          Questions: 'Questions',
          'Question title': 'Question title',
          Answers: 'Answers',
          Answer: 'Answer',
        },
      },
      es: {
        translations: {
          Save: 'Guardar',
          'Played times': 'Veces jugado',
          Options: 'Opciones',
          'Quiz manager': 'Gestión de concursos',
          Quiz: 'Concurso',
          'Quiz name': 'Nombre del concurso',
          Questions: 'Preguntas',
          'Question title': 'Enunciado',
          Answers: 'Respuestas',
          Answer: 'Respuesta',
        },
      },
      gl: {
        translations: {
          Save: 'Gardar',
          'Quiz manager': 'Xestión de concursos',
          'Played times': 'Veces xogado',
          Options: 'Opcións',
          Quiz: 'Concurso',
          'Quiz name': 'Nome do concurso',
          Questions: 'Preguntas',
          'Question title': 'Enunciado',
          Answers: 'Respostas',
          Answer: 'Resposta',
        },
      },
    },
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false, // we use content as keys
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
