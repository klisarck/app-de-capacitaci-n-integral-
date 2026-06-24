import type { QuizQuestion } from './courses';

// Quizzes are stored separately from lesson content to prevent easy copying
export const lessonQuizzes: Record<string, QuizQuestion[]> = {
  'batalla-carabobo': [
    {
      id: 'q1',
      question: {
        es: '¿En qué fecha se libró la Batalla de Carabobo?',
        en: 'On what date was the Battle of Carabobo fought?',
      },
      options: {
        es: ['19 de abril de 1810', '24 de junio de 1821', '5 de julio de 1811', '12 de febrero de 1818'],
        en: ['April 19, 1810', 'June 24, 1821', 'July 5, 1811', 'February 12, 1818'],
      },
      correctIndex: 1,
    },
    {
      id: 'q2',
      question: {
        es: '¿Quién comandó la Primera División del ejército patriota?',
        en: 'Who commanded the First Division of the patriot army?',
      },
      options: {
        es: ['Manuel Cedeño', 'Ambrosio Plaza', 'José Antonio Páez', 'Rafael Urdaneta'],
        en: ['Manuel Cedeño', 'Ambrosio Plaza', 'José Antonio Páez', 'Rafael Urdaneta'],
      },
      correctIndex: 2,
    },
    {
      id: 'q3',
      question: {
        es: '¿Quién comandaba el ejército realista en Carabobo?',
        en: 'Who commanded the royalist army at Carabobo?',
      },
      options: {
        es: ['Pablo Morillo', 'Miguel de la Torre', 'Domingo Monteverde', 'José Tomás Boves'],
        en: ['Pablo Morillo', 'Miguel de la Torre', 'Domingo Monteverde', 'José Tomás Boves'],
      },
      correctIndex: 1,
    },
  ],
  'batalla-boyaca': [
    {
      id: 'q1',
      question: {
        es: '¿En qué año se libró la Batalla de Boyacá?',
        en: 'In what year was the Battle of Boyacá fought?',
      },
      options: { es: ['1817', '1819', '1821', '1823'], en: ['1817', '1819', '1821', '1823'] },
      correctIndex: 1,
    },
    {
      id: 'q2',
      question: {
        es: '¿Qué obstáculo natural cruzó Bolívar para llegar a Boyacá?',
        en: 'What natural obstacle did Bolívar cross to reach Boyacá?',
      },
      options: {
        es: ['El Río Orinoco', 'Los Andes', 'El Lago de Maracaibo', 'La Selva Amazónica'],
        en: ['The Orinoco River', 'The Andes', 'Lake Maracaibo', 'The Amazon Rainforest'],
      },
      correctIndex: 1,
    },
    {
      id: 'q3',
      question: {
        es: '¿Cuánto duró aproximadamente la Batalla de Boyacá?',
        en: 'Approximately how long did the Battle of Boyacá last?',
      },
      options: {
        es: ['Dos días', 'Dos horas', 'Dos semanas', 'Dos minutos'],
        en: ['Two days', 'Two hours', 'Two weeks', 'Two minutes'],
      },
      correctIndex: 1,
    },
  ],
  'estructura-fanb': [
    {
      id: 'q1',
      question: {
        es: '¿Cuántos componentes integran la FANB?',
        en: 'How many components make up the FANB?',
      },
      options: { es: ['Tres', 'Cuatro', 'Cinco', 'Seis'], en: ['Three', 'Four', 'Five', 'Six'] },
      correctIndex: 1,
    },
    {
      id: 'q2',
      question: {
        es: '¿Qué componente se encarga del orden interno?',
        en: 'Which component is in charge of internal order?',
      },
      options: {
        es: ['Ejército', 'Armada', 'Aviación', 'Guardia Nacional'],
        en: ['Army', 'Navy', 'Aviation', 'National Guard'],
      },
      correctIndex: 3,
    },
    {
      id: 'q3',
      question: {
        es: '¿Qué es la Milicia Nacional Bolivariana?',
        en: 'What is the Bolivarian National Militia?',
      },
      options: {
        es: [
          'Un componente regular de la FANB',
          'Un cuerpo especial de ciudadanos voluntarios',
          'Una policía municipal',
          'Un grupo de inteligencia',
        ],
        en: [
          'A regular component of the FANB',
          'A special body of volunteer citizens',
          'A municipal police force',
          'An intelligence group',
        ],
      },
      correctIndex: 1,
    },
  ],
  'voces-de-mando': [
    {
      id: 'q1',
      question: {
        es: '¿Cuántos tipos de voces de mando existen?',
        en: 'How many types of commands exist?',
      },
      options: { es: ['Uno', 'Dos', 'Tres', 'Cuatro'], en: ['One', 'Two', 'Three', 'Four'] },
      correctIndex: 1,
    },
    {
      id: 'q2',
      question: {
        es: '¿Qué ángulo deben formar los talones en la posición de firmes?',
        en: 'What angle should the heels form in the position of attention?',
      },
      options: { es: ['30°', '45°', '60°', '90°'], en: ['30°', '45°', '60°', '90°'] },
      correctIndex: 1,
    },
    {
      id: 'q3',
      question: {
        es: '¿Cuál es la voz de mando para un giro de 180°?',
        en: 'What is the command for a 180° turn?',
      },
      options: {
        es: ['Flanco derecho', 'Media vuelta', 'De frente', 'A discreción'],
        en: ['Right face', 'About face', 'Forward march', 'At ease'],
      },
      correctIndex: 1,
    },
  ],
};
