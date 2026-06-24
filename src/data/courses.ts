export interface InteractiveElement {
  type: 'video' | 'timeline' | 'battlemap';
  videoId?: string;
  videoTitle?: { es: string; en: string };
  timelineData?: import('@/components/InteractiveTimeline').TimelineEvent[];
  timelineTitle?: { es: string; en: string };
  battleMapData?: {
    title: { es: string; en: string };
    movements: {
      id: string;
      label: { es: string; en: string };
      description: { es: string; en: string };
      path: string;
      color: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      waypoints?: { x: number; y: number }[];
    }[];
    locations: {
      id: string;
      label: { es: string; en: string };
      x: number;
      y: number;
      type: 'city' | 'battlefield' | 'camp';
    }[];
  };
}

export interface Course {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  image?: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: { es: string; en: string };
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: { es: string; en: string };
  type: 'text' | 'pdf' | 'video';
  content: { es: string; en: string };
  videoUrl?: string;
  interactiveElements?: InteractiveElement[];
}

export interface QuizQuestion {
  id: string;
  question: { es: string; en: string };
  options: { es: string[]; en: string[] };
  correctIndex: number;
}

export const sampleCourses: Course[] = [
  {
    id: 'historia-militar',
    title: { es: 'Historia Militar de Venezuela', en: 'Military History of Venezuela' },
    description: {
      es: 'Estudio de las batallas y campañas de la independencia venezolana, figuras militares clave y su impacto en la formación de la nación.',
      en: 'Study of the battles and campaigns of Venezuelan independence, key military figures and their impact on nation building.',
    },
    modules: [
      {
        id: 'batallas-independencia',
        title: { es: 'Batallas de la Independencia', en: 'Battles of Independence' },
        lessons: [
          {
            id: 'batalla-carabobo',
            title: { es: 'La Batalla de Carabobo', en: 'The Battle of Carabobo' },
            type: 'text',
            content: {
              es: `# La Batalla de Carabobo\n\nLa Batalla de Carabobo, librada el **24 de junio de 1821**, fue el enfrentamiento bélico más importante de la Guerra de Independencia de Venezuela. Tuvo lugar en el Campo de Carabobo, cerca de la ciudad de Valencia, estado Carabobo.\n\n## Contexto Histórico\n\nTras el fracaso de la Primera y Segunda República, Simón Bolívar reorganizó las fuerzas patriotas. El Congreso de Angostura de 1819 había establecido las bases de la Gran Colombia, y la victoria en Carabobo era fundamental para consolidar la independencia. El **Armisticio de Santa Ana** (noviembre de 1820), firmado por Bolívar y Morillo, permitió a los patriotas reorganizarse antes de la ofensiva final.\n\n## Desarrollo de la Batalla\n\nEl ejército patriota, comandado por el General Simón Bolívar, contaba con aproximadamente **6.500 hombres** organizados en tres divisiones:\n\n- **Primera División**: Comandada por José Antonio Páez, incluía la Legión Británica y el Batallón Bravos de Apure.\n- **Segunda División**: Comandada por Manuel Cedeño.\n- **Tercera División**: Comandada por Ambrosio Plaza.\n\nLa estrategia de Bolívar consistió en un movimiento envolvente por el flanco derecho del ejército realista, comandado por el Mariscal de Campo Miguel de la Torre, aprovechando una quebrada poco vigilada.\n\n## Héroes y Bajas\n\n- **Pedro Camejo (Negro Primero)**: lancero del Batallón Bravos de Apure, único soldado en regresar al campo de batalla para despedirse de Páez con la célebre frase: *"Mi General, vengo a decirle adiós porque estoy muerto"*.\n- Murieron en el campo los generales **Manuel Cedeño** y **Ambrosio Plaza**.\n- Las bajas patriotas se estimaron en 200 hombres; las realistas superaron los 2.900 entre muertos, heridos y prisioneros.\n\n## Resultado y Consecuencias\n\nLa victoria patriota en Carabobo selló prácticamente la independencia de Venezuela. Bolívar entró en Caracas el 29 de junio de 1821. La independencia se completó con la **Batalla Naval del Lago de Maracaibo** del 24 de julio de 1823. El Campo de Carabobo fue declarado **Monumento Histórico Nacional** y allí se erige el Arco de Triunfo y el Altar de la Patria.`,
              en: `# The Battle of Carabobo\n\nThe Battle of Carabobo, fought on **June 24, 1821**, was the most important military engagement of the Venezuelan War of Independence. It took place at the Field of Carabobo, near the city of Valencia, Carabobo state.\n\n## Historical Context\n\nAfter the failure of the First and Second Republic, Simón Bolívar reorganized the patriot forces. The Congress of Angostura in 1819 had established the foundations of Gran Colombia, and victory at Carabobo was fundamental to consolidating independence. The **Armistice of Santa Ana** (November 1820), signed by Bolívar and Morillo, allowed the patriots to reorganize before the final offensive.\n\n## Battle Development\n\nThe patriot army, commanded by General Simón Bolívar, had approximately **6,500 men** organized in three divisions:\n\n- **First Division**: Commanded by José Antonio Páez, included the British Legion and the Bravos de Apure Battalion.\n- **Second Division**: Commanded by Manuel Cedeño.\n- **Third Division**: Commanded by Ambrosio Plaza.\n\nBolívar's strategy was an enveloping movement on the right flank of the royalist army, commanded by Field Marshal Miguel de la Torre, exploiting a lightly guarded ravine.\n\n## Heroes and Casualties\n\n- **Pedro Camejo (Negro Primero)**: lancer of the Bravos de Apure Battalion, the only soldier to return to the battlefield to bid farewell to Páez with the famous phrase: *"My General, I come to say goodbye because I am dead"*.\n- Generals **Manuel Cedeño** and **Ambrosio Plaza** died on the field.\n- Patriot casualties were estimated at 200; royalist losses exceeded 2,900 dead, wounded and prisoners.\n\n## Result and Consequences\n\nThe patriot victory at Carabobo practically sealed Venezuela's independence. Bolívar entered Caracas on June 29, 1821. Independence was completed with the **Naval Battle of Lake Maracaibo** on July 24, 1823. The Field of Carabobo was declared a **National Historic Monument**, where the Triumphal Arch and the Altar of the Homeland now stand.`,
            },
            interactiveElements: [
              {
                type: 'video',
                videoId: 'c6A_NRaWA0w',
                videoTitle: {
                  es: '📹 Documental: La Batalla de Carabobo',
                  en: '📹 Documentary: The Battle of Carabobo',
                },
              },
              {
                type: 'battlemap',
                battleMapData: {
                  title: {
                    es: '🗺️ Mapa Táctico: Batalla de Carabobo',
                    en: '🗺️ Tactical Map: Battle of Carabobo',
                  },
                  movements: [
                    {
                      id: 'paez',
                      label: { es: '1ra División — Páez', en: '1st Division — Páez' },
                      description: {
                        es: 'Movimiento envolvente por el flanco derecho a través de la quebrada, sorprendiendo a las fuerzas realistas.',
                        en: 'Flanking movement through the right side via the ravine, surprising royalist forces.',
                      },
                      path: 'M 80 320 Q 150 250 200 180 Q 250 130 320 120',
                      color: '#2563eb',
                      startX: 80, startY: 320,
                      endX: 320, endY: 120,
                    },
                    {
                      id: 'cedeno',
                      label: { es: '2da División — Cedeño', en: '2nd Division — Cedeño' },
                      description: {
                        es: 'Avance por el centro apoyando el movimiento de la primera división.',
                        en: 'Central advance supporting the first division\'s movement.',
                      },
                      path: 'M 100 350 Q 200 280 300 200 Q 350 170 380 150',
                      color: '#16a34a',
                      startX: 100, startY: 350,
                      endX: 380, endY: 150,
                    },
                    {
                      id: 'plaza',
                      label: { es: '3ra División — Plaza', en: '3rd Division — Plaza' },
                      description: {
                        es: 'Reserva que avanzó por el camino principal para fijar al enemigo.',
                        en: 'Reserve that advanced on the main road to fix the enemy.',
                      },
                      path: 'M 150 370 Q 250 330 350 280 Q 420 240 450 200',
                      color: '#dc2626',
                      startX: 150, startY: 370,
                      endX: 450, endY: 200,
                    },
                  ],
                  locations: [
                    { id: 'valencia', label: { es: 'Valencia', en: 'Valencia' }, x: 500, y: 100, type: 'city' },
                    { id: 'carabobo', label: { es: 'Campo de Carabobo', en: 'Carabobo Field' }, x: 320, y: 180, type: 'battlefield' },
                    { id: 'patriotas', label: { es: 'Campamento Patriota', en: 'Patriot Camp' }, x: 80, y: 350, type: 'camp' },
                    { id: 'realistas', label: { es: 'Posición Realista', en: 'Royalist Position' }, x: 400, y: 140, type: 'camp' },
                  ],
                },
              },
            ],
          },
          {
            id: 'batalla-boyaca',
            title: { es: 'La Batalla de Boyacá', en: 'The Battle of Boyacá' },
            type: 'text',
            content: {
              es: `# La Batalla de Boyacá\n\nLibrada el **7 de agosto de 1819**, la Batalla de Boyacá fue decisiva para la independencia de la Nueva Granada (actual Colombia) y fortaleció el proyecto de la Gran Colombia.\n\n## La Campaña Libertadora\n\nBolívar emprendió una audaz campaña cruzando los Andes desde los Llanos venezolanos con cerca de **2.500 hombres**, entre ellos la **Legión Británica**. La travesía por el **Páramo de Pisba** —a más de 4.000 metros de altitud— bajo lluvias, vientos helados y sin abrigo adecuado, es considerada una de las hazañas más notables de la historia militar.\n\n## El Combate\n\nEl ejército patriota interceptó a las fuerzas realistas del **Coronel José María Barreiro** en el puente sobre el río Boyacá, a unos 150 km de Bogotá. La batalla, organizada en dos cuerpos —la vanguardia al mando de **Francisco de Paula Santander** y la retaguardia al mando de **José Antonio Anzoátegui**— duró apenas **dos horas**.\n\nLas fuerzas realistas, divididas y sin posibilidad de unirse, fueron derrotadas. Barreiro y más de **1.600 soldados** fueron hechos prisioneros.\n\n## Consecuencias\n\n- Bolívar entró triunfante en Bogotá el **10 de agosto de 1819**; el virrey Juan de Sámano huyó con el tesoro real.\n- La victoria permitió la creación oficial de la **República de Colombia** (Gran Colombia) el 17 de diciembre de 1819 en el Congreso de Angostura.\n- Sentó las bases para las campañas de liberación de Ecuador (Pichincha, 1822) y Perú (Junín y Ayacucho, 1824).\n- El 7 de agosto es **Día del Ejército Nacional de Colombia**.`,
              en: `# The Battle of Boyacá\n\nFought on **August 7, 1819**, the Battle of Boyacá was decisive for the independence of New Granada (present-day Colombia) and strengthened the project of Gran Colombia.\n\n## The Liberating Campaign\n\nBolívar undertook a bold campaign crossing the Andes from the Venezuelan Llanos with about **2,500 men**, including the **British Legion**. The crossing of the **Páramo de Pisba** —at over 4,000 meters altitude— under rain, freezing winds and without adequate clothing, is considered one of the most remarkable feats in military history.\n\n## The Combat\n\nThe patriot army intercepted the royalist forces of **Colonel José María Barreiro** at the bridge over the Boyacá River, about 150 km from Bogotá. The battle, organized in two corps —the vanguard under **Francisco de Paula Santander** and the rearguard under **José Antonio Anzoátegui**— lasted barely **two hours**.\n\nThe royalist forces, divided and unable to unite, were defeated. Barreiro and more than **1,600 soldiers** were taken prisoner.\n\n## Consequences\n\n- Bolívar entered Bogotá triumphantly on **August 10, 1819**; Viceroy Juan de Sámano fled with the royal treasury.\n- The victory enabled the official creation of the **Republic of Colombia** (Gran Colombia) on December 17, 1819 at the Congress of Angostura.\n- It paved the way for the liberation campaigns of Ecuador (Pichincha, 1822) and Peru (Junín and Ayacucho, 1824).\n- August 7 is the **Day of the National Army of Colombia**.`,
            },
            interactiveElements: [
              {
                type: 'video',
                videoId: '0lz_FfRMpJ8',
                videoTitle: {
                  es: '📹 La Campaña Libertadora y Boyacá',
                  en: '📹 The Liberating Campaign and Boyacá',
                },
              },
              {
                type: 'timeline',
                timelineTitle: {
                  es: '📅 Cronología: Campaña Libertadora de 1819',
                  en: '📅 Timeline: Liberating Campaign of 1819',
                },
                timelineData: [
                  {
                    year: 'May 1819',
                    title: { es: 'Inicio de la Campaña', en: 'Campaign Begins' },
                    icon: '🚩',
                    description: {
                      es: 'Bolívar parte desde los Llanos venezolanos con aproximadamente 2,500 hombres, incluyendo la legión británica. Se reúnen en el pueblo de Mantecal para iniciar la marcha.',
                      en: 'Bolívar departs from the Venezuelan Llanos with approximately 2,500 men, including the British Legion. They gather in the town of Mantecal to begin the march.',
                    },
                  },
                  {
                    year: '4 Jun 1819',
                    title: { es: 'Cruce del Río Arauca', en: 'Crossing of the Arauca River' },
                    icon: '🥾',
                    description: {
                      es: 'El ejército cruza el caudaloso río Arauca bajo lluvias torrenciales. Las corrientes arrastran suministros y caballos. Es el primer gran obstáculo de la campaña.',
                      en: 'The army crosses the swollen Arauca River under torrential rains. Currents sweep away supplies and horses. It is the first major obstacle of the campaign.',
                    },
                  },
                  {
                    year: 'Jun 1819',
                    title: { es: 'Cruce del Páramo de Pisba', en: 'Crossing of Páramo de Pisba' },
                    icon: '🏔️',
                    description: {
                      es: 'La travesía de los Andes a más de 4,000 metros de altitud. Muchos soldados mueren de frío y altitud. Una hazaña considerada imposible por los realistas.',
                      en: 'The crossing of the Andes at over 4,000 meters altitude. Many soldiers die from cold and altitude. A feat considered impossible by the royalists.',
                    },
                  },
                  {
                    year: '12 Jul 1819',
                    title: { es: 'Llegada a Socha', en: 'Arrival at Socha' },
                    icon: '📍',
                    description: {
                      es: 'El ejército, diezmado y exhausto, llega a Socha donde los habitantes los reciben y proveen alimentos, ropa y caballos frescos. Es un punto de inflexión moral.',
                      en: 'The decimated and exhausted army arrives at Socha where inhabitants welcome them and provide food, clothing, and fresh horses. A moral turning point.',
                    },
                  },
                  {
                    year: '25 Jul 1819',
                    title: { es: 'Batalla del Pantano de Vargas', en: 'Battle of Pantano de Vargas' },
                    icon: '⚔️',
                    description: {
                      es: 'Victoria patriota decisiva gracias a la carga de caballería del Coronel Rondón. Abrió el camino hacia Tunja y Bogotá.',
                      en: 'Decisive patriot victory thanks to Colonel Rondón\'s cavalry charge. Opened the path to Tunja and Bogotá.',
                    },
                  },
                  {
                    year: '5 Ago 1819',
                    title: { es: 'Toma de Tunja', en: 'Capture of Tunja' },
                    icon: '🛡️',
                    description: {
                      es: 'Bolívar captura Tunja, cortando las líneas de suministro y comunicación de Barreiro con Bogotá. Posición estratégica clave.',
                      en: 'Bolívar captures Tunja, cutting Barreiro\'s supply and communication lines with Bogotá. Key strategic position.',
                    },
                  },
                  {
                    year: '7 Ago 1819',
                    title: { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' },
                    icon: '⭐',
                    description: {
                      es: 'Victoria decisiva en el puente sobre el río Boyacá. Barreiro y 1,600 realistas son capturados. La batalla duró solo 2 horas. Sello de la independencia de Nueva Granada.',
                      en: 'Decisive victory at the bridge over the Boyacá River. Barreiro and 1,600 royalists are captured. The battle lasted only 2 hours. Seal of New Granada\'s independence.',
                    },
                  },
                  {
                    year: '10 Ago 1819',
                    title: { es: 'Entrada triunfal en Bogotá', en: 'Triumphal entry into Bogotá' },
                    icon: '🚩',
                    description: {
                      es: 'Bolívar entra en la capital como libertador. El virrey Sámano huye con el tesoro real. La Nueva Granada es libre y se consolida el sueño de la Gran Colombia.',
                      en: 'Bolívar enters the capital as liberator. Viceroy Sámano flees with the royal treasury. New Granada is free and the dream of Gran Colombia is consolidated.',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'leyes-reglamentos',
    title: { es: 'Leyes y Reglamentos Militares', en: 'Military Laws and Regulations' },
    description: {
      es: 'Estudio de la Ley Orgánica de la Fuerza Armada Nacional Bolivariana y normativas relacionadas con la defensa nacional.',
      en: 'Study of the Organic Law of the Bolivarian National Armed Forces and regulations related to national defense.',
    },
    modules: [
      {
        id: 'ley-organica-fanb',
        title: { es: 'Ley Orgánica de la FANB', en: 'FANB Organic Law' },
        lessons: [
          {
            id: 'estructura-fanb',
            title: { es: 'Estructura de la FANB', en: 'Structure of the FANB' },
            type: 'text',
            content: {
              es: `# Estructura de la Fuerza Armada Nacional Bolivariana\n\nLa **Fuerza Armada Nacional Bolivariana (FANB)** es la institución encargada de la defensa integral de la nación, establecida en el artículo 328 de la Constitución de la República Bolivariana de Venezuela y desarrollada en la Ley Orgánica de la Fuerza Armada Nacional Bolivariana (LOFANB).\n\n## Naturaleza\n\nEs una institución esencialmente profesional, sin militancia política, organizada por el Estado para garantizar la independencia y soberanía de la Nación, asegurar la integridad del espacio geográfico, mediante la defensa militar, la cooperación en el mantenimiento del orden interno y la participación activa en el desarrollo nacional.\n\n## Componentes\n\nLa FANB está integrada por cuatro componentes:\n\n1. **Ejército Nacional Bolivariano (EB)** — Defensa terrestre, operaciones convencionales y no convencionales en todo el territorio nacional.\n2. **Armada Nacional Bolivariana (AB)** — Defensa naval, fluvial y costera; control de espacios acuáticos y soberanía marítima.\n3. **Aviación Militar Bolivariana (AMB)** — Defensa del espacio aéreo, operaciones aéreas estratégicas, tácticas y de transporte.\n4. **Guardia Nacional Bolivariana (GNB)** — Orden interno, seguridad ciudadana, resguardo aduanero, ambiental y de fronteras.\n\n## Milicia Nacional Bolivariana\n\nCuerpo especial integrado por ciudadanos que participan voluntariamente en la defensa integral, conformado por la Reserva Militar y las Milicias Territoriales.\n\n## Jerarquía y Mando\n\n- **Comandante en Jefe**: el Presidente de la República.\n- **Ministro del Poder Popular para la Defensa**: máxima autoridad administrativa.\n- **Comando Estratégico Operacional (CEOFANB)**: dirige las operaciones militares.\n- **Regiones Estratégicas de Defensa Integral (REDI)** y **Zonas Operativas (ZODI)**: organización territorial.\n\n## Principios Fundamentales\n\n- Obediencia y subordinación\n- Disciplina militar\n- No deliberancia política\n- Profesionalismo y honor militar\n- Servicio a la Nación y respeto a los derechos humanos`,
              en: `# Structure of the Bolivarian National Armed Forces\n\nThe **Bolivarian National Armed Forces (FANB)** is the institution responsible for the comprehensive defense of the nation, established in article 328 of the Constitution and developed in the Organic Law of the FANB (LOFANB).\n\n## Nature\n\nIt is an essentially professional institution, with no political militancy, organized by the State to guarantee the nation's independence and sovereignty and the integrity of its geographic space, through military defense, cooperation in maintaining internal order and active participation in national development.\n\n## Components\n\nThe FANB is composed of four components:\n\n1. **Bolivarian National Army (EB)** — Land defense, conventional and unconventional operations.\n2. **Bolivarian National Navy (AB)** — Naval, riverine and coastal defense; maritime sovereignty.\n3. **Bolivarian Military Aviation (AMB)** — Airspace defense, strategic, tactical and transport air operations.\n4. **Bolivarian National Guard (GNB)** — Internal order, citizen security, customs, environmental and border protection.\n\n## Bolivarian National Militia\n\nSpecial body of citizens who voluntarily participate in comprehensive defense, made up of the Military Reserve and the Territorial Militias.\n\n## Hierarchy and Command\n\n- **Commander in Chief**: the President of the Republic.\n- **Minister of People's Power for Defense**: highest administrative authority.\n- **Strategic Operational Command (CEOFANB)**: directs military operations.\n- **Strategic Regions of Comprehensive Defense (REDI)** and **Operational Zones (ZODI)**: territorial organization.\n\n## Fundamental Principles\n\n- Obedience and subordination\n- Military discipline\n- Political non-deliberation\n- Professionalism and military honor\n- Service to the Nation and respect for human rights`,
            },
            interactiveElements: [
              {
                type: 'video',
                videoId: 'upAHD6_fsE0',
                videoTitle: {
                  es: '📹 Estructura y componentes de la FANB',
                  en: '📹 Structure and components of the FANB',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'orden-cerrado',
    title: { es: 'Orden Cerrado', en: 'Close Order Drill' },
    description: {
      es: 'Fundamentos teóricos del orden cerrado, voces de mando, formaciones y movimientos a pie firme y sobre la marcha.',
      en: 'Theoretical foundations of close order drill, commands, formations, and movements at halt and on the march.',
    },
    modules: [
      {
        id: 'fundamentos',
        title: { es: 'Fundamentos del Orden Cerrado', en: 'Close Order Drill Fundamentals' },
        lessons: [
          {
            id: 'voces-de-mando',
            title: { es: 'Voces de Mando', en: 'Commands' },
            type: 'text',
            content: {
              es: `# Voces de Mando en el Orden Cerrado\n\nLas voces de mando son las órdenes verbales dadas por un superior para la ejecución de movimientos militares. Su correcta emisión y comprensión es fundamental para la disciplina, la uniformidad y la coordinación de la tropa.\n\n## Clasificación de las Voces de Mando\n\n### 1. Voz Preventiva\nAlerta al ejecutante sobre el movimiento que va a realizar. Debe ser clara, prolongada y con suficiente intensidad. Ejemplo: **"Atención..."**\n\n### 2. Voz Ejecutiva\nOrdena la ejecución inmediata del movimiento. Es corta, enérgica, vibrante y firme. Ejemplo: **"...¡FIR!"**\n\n## Voces de Mando Fundamentales\n\n| Voz de Mando | Descripción |\n|---|---|\n| ¡Atención... FIR! | Posición fundamental del militar |\n| ¡A discreción... YA! | Posición reglamentaria de descanso |\n| ¡A la derecha... YA! | Giro de 90° a la derecha |\n| ¡A la izquierda... YA! | Giro de 90° a la izquierda |\n| ¡Media vuelta... AR! | Giro de 180° |\n| ¡De frente... MAR! | Inicio de la marcha |\n| ¡Pelotón... ALTO! | Detener la marcha |\n| ¡Saludar al frente... YA! | Saludo militar reglamentario |\n\n## Posición Fundamental (A Pie Firme / Firmes)\n\n- Talones unidos formando un ángulo de 45°\n- Piernas rectas, sin rigidez excesiva\n- Cuerpo erguido, pecho afuera, hombros atrás\n- Brazos extendidos a los costados, manos semicerradas con el pulgar al costado de la pierna\n- Vista al frente, mentón recogido\n- Respiración natural y silencio absoluto\n\n## Posición A Discreción\n\nPosición de descanso reglamentaria. A la voz "A discreción… ¡YA!", el soldado lleva el pie izquierdo a la altura del hombro izquierdo, manteniendo la pierna derecha firme, y cruza las manos a la espalda. El cuerpo se distiende sin perder la formación.\n\n## Giros A Pie Firme\n\n- **A la derecha**: giro de 90° sobre el talón derecho y la punta del pie izquierdo.\n- **A la izquierda**: giro de 90° sobre el talón izquierdo y la punta del pie derecho.\n- **Media vuelta**: giro de 180° sobre el talón derecho y la punta del pie izquierdo.\n\n## Saludo Militar\n\nMano derecha al borde del cubrecabeza, dedos unidos y extendidos, palma ligeramente hacia abajo, codo a la altura del hombro. Es la manifestación más visible de respeto y disciplina militar.\n\n## Importancia del Orden Cerrado\n\nEl orden cerrado no es solo un conjunto de movimientos: es la base de la disciplina, la cohesión y el espíritu de cuerpo. Forma el carácter del soldado y permite el desplazamiento ordenado de las unidades en formación.`,
              en: `# Commands in Close Order Drill\n\nCommands are verbal orders given by a superior for the execution of military movements. Correct delivery and understanding is fundamental for discipline, uniformity and coordination of the troop.\n\n## Classification of Commands\n\n### 1. Preparatory Command\nAlerts the executor about the movement to be performed. It must be clear, prolonged and intense enough. Example: **"Attention..."**\n\n### 2. Command of Execution\nOrders the immediate execution of the movement. Short, energetic, vibrant and firm. Example: **"...HUT!"**\n\n## Fundamental Commands\n\n| Command | Description |\n|---|---|\n| Attention! | Fundamental military position |\n| At ease! | Regulation rest position |\n| Right face! | 90° turn to the right |\n| Left face! | 90° turn to the left |\n| About face! | 180° turn |\n| Forward march! | Begin marching |\n| Platoon halt! | Stop marching |\n| Hand salute! | Regulation military salute |\n\n## Position of Attention (Standing Fast)\n\n- Heels together forming a 45° angle\n- Legs straight, without excessive rigidity\n- Body erect, chest out, shoulders back\n- Arms extended at sides, hands semi-closed with thumb at the side of the leg\n- Eyes forward, chin tucked\n- Natural breathing and absolute silence\n\n## At Ease Position\n\nRegulation rest position. On the command "At ease… NOW!", the soldier moves the left foot shoulder-width apart, keeps the right leg firm, and crosses the hands behind the back, relaxing the body without breaking formation.\n\n## Standing Turns\n\n- **Right face**: 90° turn on the right heel and left toe.\n- **Left face**: 90° turn on the left heel and right toe.\n- **About face**: 180° turn on the right heel and left toe.\n\n## Military Salute\n\nRight hand to the edge of the headgear, fingers together and extended, palm slightly down, elbow at shoulder height. It is the most visible expression of respect and military discipline.\n\n## Importance of Close Order Drill\n\nClose order drill is not just a set of movements: it is the foundation of discipline, cohesion and esprit de corps. It shapes the soldier's character and allows the ordered movement of units in formation.`,
            },
          },
        ],
      },
    ],
  },
];
