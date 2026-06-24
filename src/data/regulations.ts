// Reglamentos oficiales de la UNEFA — texto extraído de los PDF originales
// para permitir búsqueda por palabras clave dentro de la plataforma.

export interface RegulationArticle {
  id: string;
  number: string; // "Norma 1", "Artículo 5", etc.
  title?: string;
  text: string;
}

export interface RegulationChapter {
  id: string;
  title: string;
  articles: RegulationArticle[];
}

export interface Regulation {
  id: string;
  title: string;
  shortTitle: string;
  year: string;
  description: string;
  pdfUrl?: string;
  chapters: RegulationChapter[];
}

export const regulations: Regulation[] = [
  {
    id: 'codigo-etica',
    title: 'Código de Ética de la UNEFA',
    shortTitle: 'Código de Ética',
    year: '2003',
    description:
      'Normas de conducta que orientan al personal académico, administrativo y estudiantil de la UNEFA. Aprobado en Consejo Directivo Extraordinario Nº 003, 6 de octubre de 2003.',
    pdfUrl: '/regulations/codigo-etica.pdf',
    chapters: [
      {
        id: 'principios',
        title: 'Primera Parte — Principios Fundamentales Generales',
        articles: [
          { id: 'p1', number: 'Primero', text: 'El presente Código de Ética establece las normas de carácter general que orientan la conducta de todos los integrantes de la Universidad Nacional Experimental Politécnica de la Fuerza Armada Nacional Bolivariana, en el desarrollo de las actividades inherentes a sus funciones respectivas.' },
          { id: 'p2', number: 'Segundo', text: 'Este Código de Ética se aplica al Personal Académico, al Personal Administrativo, Técnico y de Servicios, y a los Estudiantes de la UNEFA.' },
          { id: 'p3', number: 'Tercero', text: 'En la elaboración de este Código de Ética se tomaron en cuenta las directrices de la Ley de Universidades, la Ley Orgánica de Educación, el Reglamento General de la UNEFA y el Reglamento del Ejercicio de la Profesión Docente.' },
          { id: 'p4', number: 'Cuarto', text: 'Este Código propugna como valores: la vida, la libertad, la igualdad, la verdad, la justicia, la paz, la solidaridad, la tolerancia, el respeto, el diálogo, la convivencia, la honestidad, la disciplina, la responsabilidad ciudadana, la defensa de los Derechos Humanos y el cultivo de los valores espirituales del hombre.' },
          { id: 'p5', number: 'Quinto', text: 'Fines esenciales: el respeto a la dignidad de la Persona; el afianzamiento de principios morales sólidos; la presentación de pautas éticas que erradiquen conductas no cónsonas con la misión universitaria; y el cultivo de un êthos universitario de armonía y trabajo creador.' },
        ],
      },
      {
        id: 'normas-comunes',
        title: 'Capítulo I — Deberes de todos los miembros de la comunidad unefista',
        articles: [
          { id: 'n1', number: 'Norma 1', text: 'Propiciar en todo momento una visión integral del ser humano a fin de que la comunidad universitaria tome conciencia de la dignidad de la Persona y defienda sus derechos fundamentales sin distinciones.' },
          { id: 'n2', number: 'Norma 2', text: 'Enaltecer la tolerancia, el respeto y la convivencia como pilares fundamentales para el desarrollo armónico de la vida universitaria.' },
          { id: 'n3', number: 'Norma 3', text: 'Respetar el recinto universitario como lugar sagrado de trabajo y estudio, propiciando ambientes de dignidad personal, lealtad, decoro, limpieza y digna compostura.' },
          { id: 'n4', number: 'Norma 4', text: 'Colaborar en la creación y mantenimiento de un clima organizacional que propicie las relaciones humanas y el mejoramiento de los canales de comunicación.' },
          { id: 'n5', number: 'Norma 5', text: 'Evitar situaciones conflictivas que deterioren las relaciones interpersonales, así como los falsos rumores y los comentarios malsanos.' },
          { id: 'n6', number: 'Norma 6', text: 'Actuar con objetividad y justicia en los juicios valorativos, éticos, morales y legales que afecten la sana convivencia entre los miembros de la UNEFA.' },
          { id: 'n7', number: 'Norma 7', text: 'Evitar confrontaciones y actitudes negativas siendo respetuosos con el pluralismo presente en esta Universidad y en la sociedad venezolana.' },
          { id: 'n8', number: 'Norma 8', text: 'Contribuir en todo momento con la disciplina, el orden y el acato a los órganos de dirección y supervisión, cónsonos con la especificidad y el carácter militar de la Institución.' },
          { id: 'n9', number: 'Norma 9', text: 'Fomentar el sentido de pertenencia a la Universidad mediante la práctica de conductas que estimulen el apego a los valores unefistas.' },
          { id: 'n10', number: 'Norma 10', text: 'Ser dignos portadores de la imagen de la Universidad y exponentes de su elevada misión, mediante la observancia de una conducta ciudadana ejemplar.' },
          { id: 'n11', number: 'Norma 11', text: 'Cumplir y hacer cumplir los reglamentos, directivas, órdenes e instrucciones vigentes de la Universidad.' },
        ],
      },
      {
        id: 'normas-estudiantes',
        title: 'Capítulo IV — Deberes de los Estudiantes',
        articles: [
          { id: 'n47', number: 'Norma 47', text: 'Observar una conducta intachable, dentro y fuera de la Universidad, caracterizada por una actitud serena y comedida; de orden, cortesía y buena educación.' },
          { id: 'n48', number: 'Norma 48', text: 'Respetar en todo momento a sus profesores como personas dotadas de experiencia y conocimiento, revestidas de autoridad para conducir el proceso educativo.' },
          { id: 'n49', number: 'Norma 49', text: 'Desarrollar y mantener una actitud de respeto, decoro, colaboración y sana camaradería hacia los compañeros y compañeras de estudio.' },
          { id: 'n50', number: 'Norma 50', text: 'Contribuir con su conducta y actitud ejemplar a elevar el nivel cultural, académico, ético y moral de todos los integrantes de nuestra comunidad universitaria.' },
          { id: 'n51', number: 'Norma 51', text: 'Participar con entusiasmo en todas las actividades a que fueren convocados por los organismos universitarios competentes.' },
          { id: 'n52', number: 'Norma 52', text: 'Asistir puntualmente a clases y seguir con atención el desarrollo de las mismas, aprovechando al máximo las orientaciones del docente.' },
          { id: 'n53', number: 'Norma 53', text: 'Dedicar el tiempo necesario al estudio y la investigación, dada la fuerte exigencia académica de la UNEFA.' },
          { id: 'n54', number: 'Norma 54', text: 'Cultivar y practicar en todas las circunstancias los valores de la honestidad, la disciplina, la amistad, la justicia y la vocación de servicio a la comunidad.' },
          { id: 'n55', number: 'Norma 55', text: 'Cuidar y proteger los ambientes, útiles, materiales, equipos y demás bienes patrimoniales de la Universidad.' },
          { id: 'n56', number: 'Norma 56', text: 'Contribuir con su conducta ciudadana a la conservación de los recursos naturales y del medio ambiente.' },
          { id: 'n57', number: 'Norma 57', text: 'Cuidar su lenguaje, vestimenta y presentación personal, con la finalidad de dar buen ejemplo y contribuir al desarrollo de un ambiente sano y constructivo.' },
          { id: 'n58', number: 'Norma 58', text: 'Acatar en todo momento las disposiciones que sobre tránsito, permanencia y comportamiento rijan en cualquiera de las instalaciones de la Fuerza Armada Nacional.' },
          { id: 'n59', number: 'Norma 59', text: 'Observar una conducta apegada a la moral y las buenas costumbres, evitando situaciones conflictivas que puedan atentar contra la integridad y el decoro.' },
        ],
      },
    ],
  },
  {
    id: 'reglamento-disciplinario',
    title: 'Reglamento Procesal Disciplinario del Alumno UNEFA',
    shortTitle: 'Reglamento Disciplinario',
    year: '2011',
    description:
      'Establece las normas de conducta, faltas, sanciones y procedimientos disciplinarios aplicables a los estudiantes de la UNEFA. Promulgado el 15 de septiembre de 2011.',
    pdfUrl: '/regulations/reglamento-disciplinario.pdf',
    chapters: [
      {
        id: 'naturaleza',
        title: 'Capítulo I — De la Naturaleza',
        articles: [
          { id: 'a1', number: 'Artículo 1', text: 'La Universidad tiene como principio establecer un régimen disciplinario basado en la aplicación de la justicia equitativa, transparente, que permita el derecho a la legítima defensa así como el cumplimiento del debido proceso.' },
          { id: 'a2', number: 'Artículo 2', text: 'La observancia y aplicación de este Reglamento es obligatoria para todos los estudiantes de la Universidad, civiles y militares, en programas de pregrado, posgrado y extensión.' },
          { id: 'a3', number: 'Artículo 3', text: 'Aplica en el campus, instalaciones de la Universidad, actividades académicas o extracurriculares dentro o fuera del campus, y actividades ajenas si lesionan la imagen de la Universidad.' },
          { id: 'a4', number: 'Artículo 4', text: 'Las disposiciones se aplicarán siempre que los hechos no estén tipificados como delitos en las leyes penales de la República, en cuyo caso la competencia será de la jurisdicción correspondiente.' },
        ],
      },
      {
        id: 'autoridad',
        title: 'Capítulo III — De los Niveles de Autoridad',
        articles: [
          { id: 'a9', number: 'Artículo 9', text: 'Niveles de autoridad en orden descendente: 1) Consejo Universitario, 2) Rector, 3) Vicerrectores, 4) Secretario, 5) Consejo de Núcleo, 6) Decanos, 7) Jefes de División, 8) Jefes de Departamento, 9) Docentes.' },
          { id: 'a10', number: 'Artículo 10', text: 'El profesor es la máxima autoridad en el aula y está facultado para tomar las medidas correctivas necesarias para el mantenimiento del orden y la disciplina.' },
          { id: 'a11', number: 'Artículo 11', text: 'El delegado de curso es el estudiante responsable de vigilar el cumplimiento de los Reglamentos por parte de sus compañeros y portavoz ante las autoridades.' },
        ],
      },
      {
        id: 'deberes',
        title: 'Capítulo IV — Sección Primera — Deberes de los Estudiantes',
        articles: [
          { id: 'a12', number: 'Artículo 12', text: 'Son deberes: asistir puntualmente a clases, trabajos prácticos y seminarios; mantener espíritu de disciplina; cumplir con el Registro Militar; cooperar con la misión institucional; vestir adecuadamente y usar correctamente el uniforme (sin pirsin, aretes o accesorios contrarios al uniforme); portar credencial; cumplir obligaciones académicas; proteger los bienes de la Institución; guardar la moral y disciplina; informar anomalías; no presentarse bajo efectos de sustancias estupefacientes, psicotrópicas o alcohólicas, ni portar armas; el personal militar estudiante debe respetar a las autoridades militares de la Institución aún cuando su grado sea inferior.' },
        ],
      },
      {
        id: 'derechos',
        title: 'Capítulo IV — Sección Segunda — Derechos de los Estudiantes',
        articles: [
          { id: 'a13', number: 'Artículo 13', text: 'Son derechos: elegir y ser elegidos en la Representación Estudiantil; permanecer en la Universidad para cumplir sus actividades; ejercer libertad para acceder al conocimiento y participar en formas de aprendizaje; participar en actividades culturales y de recreación; pedir audiencia ante la superioridad por canales regulares; solicitar certificados; evaluar a sus profesores; informar a las Autoridades sobre fallas u omisiones mediante exposición razonada y respetuosa.' },
        ],
      },
      {
        id: 'faltas',
        title: 'Capítulo V — De las Faltas Disciplinarias',
        articles: [
          { id: 'a14', number: 'Artículo 14', text: 'Se entiende como falta toda conducta por acción u omisión del estudiante que afecte o entorpezca el normal desenvolvimiento de las actividades de la Universidad.' },
          { id: 'a15', number: 'Artículo 15', text: 'Las faltas se clasifican en: a) leves, b) medianas y c) graves.' },
          { id: 'a16', number: 'Artículo 16 — Faltas leves', text: '1) No asistir puntualmente; 2) Uso incorrecto del uniforme o descuido en el aseo; 3) Daños leves por negligencia; 4) Falta de respeto a las autoridades; 5) Abandono de clases sin autorización (primera vez); 6) Descortesía en escritos; 7) Uso indebido de equipos; 8) Entrar a sitios prohibidos; 9) Trasladar mobiliario sin autorización; 10) No usar conducto regular; 11) Trato desatento; 12) No brindar respeto a símbolos patrios; 13) Fomentar escándalos.' },
          { id: 'a17', number: 'Artículo 17 — Faltas medianas', text: '1) Reincidir en uso incorrecto del uniforme; 2) Presentarse bajo efectos de sustancias psicotrópicas o alcohol; 3) Ocultar o falsear la verdad; 4) Proferir murmuraciones en descrédito de autoridades o compañeros; 5) Ofender, provocar o reñir; 6) Perjuicio por negligencia manifiesta; 7) Representar a la Universidad sin autorización; 8) Irrespeto de estudiantes militares a autoridades de rango inferior; 9) Reincidencia en faltas leves.' },
          { id: 'a18', number: 'Artículo 18 — Faltas graves', text: '1) Reincidir en faltas medianas (numeral 8 del Art. 17); 2) Fraude en evaluación (copiar, dejar copiar); 3) Negarse a usar uniforme o carnet; 4) Sustracción de cuestionarios; 5) Suplantación de un estudiante en una evaluación; 6) Alteración de exámenes; 7) Perturbación de actividades curriculares; 8) Perjudicar la imagen de la UNEFA; 9) Falta de probidad u ofensas a la moral; 10) Incitar actividades colectivas violentas; 11) Ser cómplice de falta grave; 12) Causar perjuicio material grave intencional; 13) Introducir, consumir o comercializar sustancias estupefacientes o alcohol; 14) Presentarse en estado de embriaguez; 15) Portar armas en las instalaciones; 16) No acatar normas de seguridad; 17) Sustracción de bienes; 18) Presentar documentos falsos para beneficios; 19) Violentar oficinas o archivos; 20) Irrespeto a autoridades en público; 21) Conducta inmoral o lesiva al buen nombre; 22) Perjuicio material grave intencional o por negligencia; 23) Falsificar o alterar documentos oficiales; 24) Ser reincidente en faltas medianas.' },
          { id: 'a19', number: 'Artículo 19', text: 'Cualquier otra falta no contemplada será sancionada por el Consejo Universitario previa sustanciación del debido procedimiento. Las faltas prescribirán a los noventa (90) días académicos.' },
        ],
      },
      {
        id: 'competencia',
        title: 'Capítulo VI — De la Competencia Disciplinaria',
        articles: [
          { id: 'a20', number: 'Artículo 20', text: 'El Consejo Disciplinario en cada Núcleo es el órgano colegiado responsable de la investigación exhaustiva del hecho denunciado, con facultades correctivas, y puede proceder de oficio.' },
          { id: 'a21', number: 'Artículo 21', text: 'El Consejo Disciplinario estará constituido por el Decano (quien lo preside), Jefes de Divisiones y Jefes de Departamentos.' },
          { id: 'a22', number: 'Artículo 22', text: 'El Consejo Disciplinario de cada Núcleo instruirá y decidirá, en primera instancia, los procedimientos por faltas leves o medianas.' },
          { id: 'a23', number: 'Artículo 23', text: 'Será competencia exclusiva del Consejo Universitario sancionar las faltas graves, previo análisis de la Consultoría Jurídica.' },
        ],
      },
      {
        id: 'sanciones',
        title: 'Capítulo VII — De las Sanciones Disciplinarias',
        articles: [
          { id: 'a24', number: 'Artículo 24 — Medidas disciplinarias', text: 'a) Amonestación verbal o llamado de atención; b) Amonestación escrita; c) Trabajo comunitario; d) Suspensión temporal de la condición de estudiante; e) Expulsión definitiva. Tienen por objeto sancionar y corregir las conductas contrarias al orden académico o disciplinario.' },
          { id: 'a26', number: 'Artículo 26', text: 'Son causales de amonestación escrita: a) reincidir en faltas leves después de amonestación verbal; b) ser reincidente en faltas medianas; c) haber cometido una falta grave.' },
        ],
      },
    ],
  },
  {
    id: 'reglamento-general',
    title: 'Reforma del Reglamento General de la UNEFA',
    shortTitle: 'Reglamento General',
    year: '2017',
    description:
      'Decreto N° 2.766 publicado en Gaceta Oficial N° 6.291 Extraordinario del 21 de marzo de 2017. Establece estructura, organización y funcionamiento general de la UNEFA.',
    pdfUrl: '/regulations/reglamento-general.pdf',
    chapters: [
      {
        id: 'generales',
        title: 'Capítulo I — Disposiciones Generales',
        articles: [
          { id: 'a1', number: 'Artículo 1', text: 'Este Reglamento tiene por objeto establecer la estructura, organización y funcionamiento general de la UNEFA, acorde con las exigencias del Ministerio del Poder Popular para la Defensa y del Ministerio para Educación Universitaria, Ciencia y Tecnología.' },
          { id: 'a2', number: 'Artículo 2', text: 'Las disposiciones de este Reglamento se aplican a todas las dependencias que integran la UNEFA.' },
          { id: 'a3', number: 'Artículo 3', text: 'La UNEFA es una institución cívico-militar de educación universitaria con una estructura dinámica proyectada al ensayo de nuevas orientaciones en aprendizaje-enseñanza, investigación, extensión y producción.' },
          { id: 'a4', number: 'Artículo 4', text: 'Deberá caracterizarse por su excelencia educativa, orientada a la búsqueda de la verdad y al afianzamiento de los valores trascendentales del hombre.' },
          { id: 'a5', number: 'Artículo 5', text: 'Tiene su sede principal en la región capital y utilizará para su funcionamiento las regiones, núcleos, extensiones u otros espacios educativos acorde a las políticas del Estado.' },
          { id: 'a6', number: 'Artículo 6', text: 'La UNEFA está enmarcada dentro de la organización del Ministerio del Poder Popular para la Defensa y articulada con el Ministerio para Educación Universitaria, Ciencia y Tecnología.' },
          { id: 'a7', number: 'Artículo 7 — Objetivos', text: 'a) Formar profesionales universitarios; b) Desarrollar estudios avanzados para graduados; c) Apoyar con investigación e innovación el mejoramiento científico y tecnológico de la FANB; d) Formar talento humano para la seguridad de la Nación; e) Conducir actividades de cooperación; f) Realizar actividades de extensión; g) Incentivar la unión cívico-militar.' },
          { id: 'a8', number: 'Artículo 8 — Patrimonio', text: 'Conformado por: a) bienes del antiguo IUPFAN; b) bienes transferidos por el Ejecutivo; c) aportes ordinarios de leyes de presupuesto; d) ingresos por prestación de servicios; e) donaciones; f) recursos de convenios autorizados por el Ministerio para la Defensa.' },
          { id: 'a9', number: 'Artículo 9', text: 'El personal docente y de investigación se regirá por las leyes y reglamentos del ejercicio de la función docente y normas del órgano rector del sector defensa.' },
          { id: 'a10', number: 'Artículo 10', text: 'El personal administrativo se regirá por la ley especial en materia de Función Pública.' },
          { id: 'a11', number: 'Artículo 11', text: 'El personal contratado y obrero se regirá por la legislación laboral.' },
        ],
      },
      {
        id: 'consejo-universitario',
        title: 'Capítulo II — Estructura y Organización — Del Consejo Universitario',
        articles: [
          { id: 'a12', number: 'Artículo 12', text: 'Los órganos de dirección son colegiados (Consejo Universitario) o individuales (Rector, Vicerrectores, Secretario, Decanos y Directores). La estructura se establece en el Manual de Organización.' },
          { id: 'a13', number: 'Artículo 13', text: 'El Consejo Universitario es la máxima autoridad de planificación, coordinación, dirección, seguimiento, control y evaluación de la Universidad.' },
          { id: 'a14', number: 'Artículo 14', text: 'Integrado por: a) Rector (preside); b) Vicerrectores; c) Secretario General; d) Consultor Jurídico (con voz, sin voto). Puede requerir presencia de cualquier integrante con derecho a voz pero sin voto.' },
          { id: 'a15', number: 'Artículo 15', text: 'Los miembros del Consejo Universitario serán de libre nombramiento y remoción por el Ministro del Poder Popular para la Defensa.' },
          { id: 'a16', number: 'Artículo 16 — Atribuciones del Consejo Universitario', text: 'a) Cumplir lineamientos de los Ministerios; b) Aprobar planes y proyectos; c) Aprobar anteproyecto de presupuesto; d) Decidir creación/modificaciones de estructura académica/administrativa; e) Aprobar nombramientos y ascensos del personal docente; f) Aprobar reglamentos internos; g) Designar representantes; h) Aprobar aranceles; i) Resolver reválidas y equivalencias; j) Aprobar diseños curriculares; k) Decidir medidas por faltas graves; l) Conferir títulos Honoris Causa; m) Autorizar adquisición de bienes; n) Aprobar convenios; o) Conocer ejecución presupuestaria; p) Aprobar Memoria y Cuenta; q) Las demás establecidas por ley.' },
          { id: 'a17', number: 'Artículo 17', text: 'El Consejo Universitario sesionará ordinariamente o extraordinariamente a solicitud del Rector.' },
          { id: 'a18', number: 'Artículo 18', text: 'El quórum válido será la asistencia de la mitad más uno de los miembros.' },
          { id: 'a19', number: 'Artículo 19', text: 'Las decisiones se toman por mayoría simple. En caso de empate, el Rector puede ejercer doble voto.' },
        ],
      },
      {
        id: 'rector',
        title: 'Capítulo II — De los Órganos Individuales — Del Rector',
        articles: [
          { id: 'a20', number: 'Artículo 20', text: 'El Rector es la máxima autoridad ejecutiva y representante legal de la Universidad. Será un Oficial General o Almirante designado por el Presidente de la República.' },
          { id: 'a21', number: 'Artículo 21 — Atribuciones del Rector', text: 'a) Representación legal; b) Órgano de relación con los Ministerios; c) Cumplir y hacer cumplir reglamentos; d) Presidir Consejo Universitario; e) Velar por el normal desenvolvimiento; f-h) Tramitar modificaciones ante los Ministerios; i) Designar comisiones; j) Efectuar nombramientos; k) Conferir títulos; l) Obtener fondos; m) Presentar Memoria y Cuenta; n) Promover la Universidad; o) Suscribir contratos; p) Informar al Consejo; q) Decidir expedientes disciplinarios del personal; r) Presentar proyecto de presupuesto; s) Diseñar lineamientos para normas internas; t) Mantener orden y disciplina; u) Mantener vinculación con los Ministerios; v) Propiciar relaciones nacionales e internacionales.' },
          { id: 'a22', number: 'Artículo 22', text: 'Los Vicerrectores son designados por el Ministro para la Defensa; deberán ser oficial militar o docente ordinario con título de Doctor o Magister.' },
          { id: 'a23', number: 'Artículo 23 — Vicerrectorados', text: 'Nivel sustantivo: a) Académico; b) Administrativo; c) Defensa Integral; d) Asuntos Sociales y Participación Ciudadana; e) Investigación, Desarrollo e Innovación. Nivel operativo: Vicerrectorados Regionales. Otros propuestos por el Consejo Universitario.' },
        ],
      },
      {
        id: 'estudiantes',
        title: 'Capítulo IV — De los Estudiantes',
        articles: [
          { id: 'a54', number: 'Artículo 54', text: 'El régimen disciplinario de los estudiantes será establecido en el reglamento respectivo aprobado por el Consejo Universitario.' },
          { id: 'a55', number: 'Artículo 55 — Deberes de los estudiantes', text: 'a) Asistir puntualmente a clases, trabajos prácticos, seminarios y demás actividades docentes previstas en los planes y programas de estudios; (y demás establecidos en el reglamento).' },
        ],
      },
    ],
  },
];

export interface SearchHit {
  regulation: Regulation;
  chapter: RegulationChapter;
  article: RegulationArticle;
  snippet: string;
}

export const searchRegulations = (query: string): SearchHit[] => {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];

  for (const reg of regulations) {
    for (const ch of reg.chapters) {
      for (const art of ch.articles) {
        const haystack = `${art.number} ${art.title ?? ''} ${art.text}`.toLowerCase();
        if (tokens.every((t) => haystack.includes(t))) {
          const idx = haystack.indexOf(tokens[0]);
          const start = Math.max(0, idx - 60);
          const end = Math.min(art.text.length, idx + 160);
          hits.push({
            regulation: reg,
            chapter: ch,
            article: art,
            snippet: (start > 0 ? '…' : '') + art.text.slice(start, end) + (end < art.text.length ? '…' : ''),
          });
        }
      }
    }
  }
  return hits;
};
