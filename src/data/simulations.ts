export interface SimulationOption {
  text: { es: string; en: string };
  nextNodeId: string;
  scores: {
    tactical: number;    // 0-100
    risk: number;        // 0-100
    leadership: number;  // 0-100
  };
}

export interface SimulationNode {
  id: string;
  situation: { es: string; en: string };
  image?: string;
  options?: SimulationOption[];
  isFinal?: boolean;
  outcome?: { es: string; en: string };
}

export interface Simulation {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  difficulty: 'medium' | 'hard' | 'critical';
  category: { es: string; en: string };
  estimatedTime: number; // minutes
  nodes: SimulationNode[];
  startNodeId: string;
}

export const simulations: Simulation[] = [
  // =====================================================
  // SIMULATION 1: BORDER INCIDENT (deep branching)
  // =====================================================
  {
    id: 'incidente-fronterizo',
    title: {
      es: 'Incidente Fronterizo',
      en: 'Border Incident',
    },
    description: {
      es: 'Un grupo armado no identificado ha sido detectado cerca de un puesto de control fronterizo. Como oficial al mando, debe tomar decisiones tácticas inmediatas.',
      en: 'An unidentified armed group has been detected near a border checkpoint. As commanding officer, you must make immediate tactical decisions.',
    },
    difficulty: 'hard',
    category: { es: 'Defensa Territorial', en: 'Territorial Defense' },
    estimatedTime: 20,
    startNodeId: 'start',
    nodes: [
      {
        id: 'start',
        situation: {
          es: '🔴 ALERTA: A las 0430 horas, el puesto de vigilancia reporta movimiento de un grupo de 8-12 individuos armados a 2 km del puesto de control fronterizo "Sierra-7". Usted es el Capitán al mando de la guarnición con 25 efectivos disponibles. Las comunicaciones con el comando superior tienen un retraso de 20 minutos. ¿Cuál es su primera acción?',
          en: '🔴 ALERT: At 0430 hours, the surveillance post reports movement of a group of 8-12 armed individuals 2 km from border checkpoint "Sierra-7". You are the Captain commanding the garrison with 25 personnel available. Communications with higher command have a 20-minute delay. What is your first action?',
        },
        options: [
          {
            text: {
              es: 'Activar protocolo de defensa: posicionar francotiradores, reforzar perímetro y enviar patrulla de reconocimiento',
              en: 'Activate defense protocol: position snipers, reinforce perimeter and send reconnaissance patrol',
            },
            nextNodeId: 'node-defense',
            scores: { tactical: 90, risk: 75, leadership: 85 },
          },
          {
            text: {
              es: 'Esperar confirmación del comando superior antes de tomar cualquier acción',
              en: 'Wait for confirmation from higher command before taking any action',
            },
            nextNodeId: 'node-wait',
            scores: { tactical: 30, risk: 20, leadership: 25 },
          },
          {
            text: {
              es: 'Enviar toda la guarnición a interceptar al grupo directamente',
              en: 'Send the entire garrison to intercept the group directly',
            },
            nextNodeId: 'node-intercept',
            scores: { tactical: 40, risk: 85, leadership: 50 },
          },
        ],
      },
      // PATH A: Defense protocol
      {
        id: 'node-defense',
        situation: {
          es: 'Ha activado el protocolo de defensa. La patrulla de reconocimiento reporta que el grupo se ha dividido en dos: un grupo de 5 avanza por el camino principal y otro de 6 flanquea por el río. Tienen equipo táctico pero no se han identificado vehículos. ¿Cómo procede?',
          en: 'You have activated the defense protocol. The recon patrol reports the group has split: a group of 5 advances on the main road and another 6 flanks via the river. They have tactical gear but no vehicles identified. How do you proceed?',
        },
        options: [
          {
            text: {
              es: 'Emboscada coordinada: interceptar ambos grupos simultáneamente con fuego cruzado',
              en: 'Coordinated ambush: intercept both groups simultaneously with crossfire',
            },
            nextNodeId: 'node-defense-ambush',
            scores: { tactical: 85, risk: 70, leadership: 90 },
          },
          {
            text: {
              es: 'Concentrar fuerzas en el grupo del camino principal y bloquear el acceso del río con obstáculos',
              en: 'Concentrate forces on the main road group and block river access with obstacles',
            },
            nextNodeId: 'node-defense-concentrate',
            scores: { tactical: 70, risk: 60, leadership: 70 },
          },
          {
            text: {
              es: 'Replegar al puesto de control y adoptar posición defensiva total',
              en: 'Fall back to the checkpoint and adopt full defensive position',
            },
            nextNodeId: 'node-defense-fallback',
            scores: { tactical: 50, risk: 40, leadership: 45 },
          },
        ],
      },
      // A1: Ambush
      {
        id: 'node-defense-ambush',
        situation: {
          es: 'La emboscada está lista. Sus equipos están en posición. El grupo del camino principal entra en la zona de emboscada. En ese momento, el grupo del río dispara una bengala — parece que detectaron a su equipo. ¿Qué ordena?',
          en: 'The ambush is set. Your teams are in position. The main road group enters the ambush zone. At that moment, the river group fires a flare — they seem to have detected your team. What do you order?',
        },
        options: [
          {
            text: {
              es: 'Ejecutar la emboscada inmediatamente sobre el grupo del camino antes de perder el elemento sorpresa',
              en: 'Execute the ambush immediately on the road group before losing the element of surprise',
            },
            nextNodeId: 'node-defense-ambush-execute',
            scores: { tactical: 90, risk: 75, leadership: 85 },
          },
          {
            text: {
              es: 'Abortar la emboscada y reagrupar todas las fuerzas en posición defensiva',
              en: 'Abort the ambush and regroup all forces in a defensive position',
            },
            nextNodeId: 'node-defense-ambush-abort',
            scores: { tactical: 55, risk: 50, leadership: 50 },
          },
        ],
      },
      {
        id: 'node-defense-ambush-execute',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO EXCELENTE: La emboscada se ejecutó con precisión. El grupo del camino principal fue neutralizado (5 capturados). El grupo del río, al escuchar el enfrentamiento, intentó huir pero fue interceptado por la patrulla de reconocimiento. Total: 11 individuos capturados, armamento decomisado, cero bajas propias. Inteligencia reveló que planeaban atacar el puesto al amanecer.',
          en: '✅ EXCELLENT RESULT: The ambush was executed with precision. The main road group was neutralized (5 captured). The river group, hearing the engagement, tried to flee but was intercepted by the recon patrol. Total: 11 individuals captured, weapons seized, zero friendly casualties. Intelligence revealed they planned to attack the post at dawn.',
        },
        outcome: { es: 'Decisión rápida bajo presión. Ejecución táctica sobresaliente.', en: 'Quick decision under pressure. Outstanding tactical execution.' },
      },
      {
        id: 'node-defense-ambush-abort',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El repliegue fue ordenado pero ambos grupos hostiles detectaron el movimiento. Se produjo un intercambio de fuego a distancia. 2 de sus efectivos resultaron heridos levemente. Los grupos hostiles se retiraron con la llegada del amanecer. No se logró la captura.',
          en: '⚠️ RESULT: The withdrawal was orderly but both hostile groups detected the movement. A long-range firefight ensued. 2 of your personnel were lightly wounded. The hostile groups retreated at dawn. No captures were made.',
        },
        outcome: { es: 'Exceso de precaución. Se perdió la ventaja táctica.', en: 'Excessive caution. Tactical advantage lost.' },
      },
      // A2: Concentrate
      {
        id: 'node-defense-concentrate',
        situation: {
          es: 'Ha concentrado fuerzas en el camino principal. Los obstáculos en el río ralentizan al segundo grupo. El grupo del camino principal se detiene a 500m al ver su dispositivo defensivo. Parecen comunicarse por radio. ¿Siguiente acción?',
          en: 'You have concentrated forces on the main road. River obstacles slow the second group. The main road group stops 500m away upon seeing your defensive setup. They appear to be communicating by radio. Next action?',
        },
        options: [
          {
            text: {
              es: 'Usar altavoz para exigir que se identifiquen y depongan armas, manteniendo posición de fuerza',
              en: 'Use loudspeaker to demand they identify themselves and lay down arms, maintaining position of strength',
            },
            nextNodeId: 'node-defense-concentrate-demand',
            scores: { tactical: 75, risk: 65, leadership: 80 },
          },
          {
            text: {
              es: 'Enviar equipo de maniobra para flanquearlos mientras están detenidos',
              en: 'Send maneuver team to flank them while they are stationary',
            },
            nextNodeId: 'node-defense-concentrate-flank',
            scores: { tactical: 80, risk: 70, leadership: 75 },
          },
        ],
      },
      {
        id: 'node-defense-concentrate-demand',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El grupo del camino principal se rindió tras la demanda. 5 individuos capturados con armas. Sin embargo, el grupo del río logró superar los obstáculos y escapó por una ruta alternativa. Resultado parcial: 5 de 11 capturados.',
          en: '⚠️ RESULT: The main road group surrendered after the demand. 5 individuals captured with weapons. However, the river group managed to bypass the obstacles and escaped via an alternate route. Partial result: 5 of 11 captured.',
        },
        outcome: { es: 'Captura parcial. La fuerza dividida escapó.', en: 'Partial capture. The split force escaped.' },
      },
      {
        id: 'node-defense-concentrate-flank',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO: La maniobra de flanqueo sorprendió al grupo del camino principal. 5 capturados. El grupo del río fue contenido por los obstáculos hasta que llegaron refuerzos. Total: 8 de 11 capturados. Operación exitosa.',
          en: '✅ RESULT: The flanking maneuver surprised the main road group. 5 captured. The river group was contained by the obstacles until reinforcements arrived. Total: 8 of 11 captured. Successful operation.',
        },
        outcome: { es: 'Buena combinación de contención y maniobra.', en: 'Good combination of containment and maneuver.' },
      },
      // A3: Fallback
      {
        id: 'node-defense-fallback',
        situation: {
          es: 'Ha replegado al puesto. La posición es sólida pero estática. El grupo armado rodea el puesto a distancia. Comienzan a excavar posiciones. Parece que se preparan para un asedio prolongado. ¿Qué hace?',
          en: 'You have fallen back to the post. The position is solid but static. The armed group surrounds the post at distance. They begin to dig positions. They seem to be preparing for a prolonged siege. What do you do?',
        },
        options: [
          {
            text: {
              es: 'Salida agresiva con elemento de choque mientras están cavando y vulnerables',
              en: 'Aggressive sortie with shock element while they are digging and vulnerable',
            },
            nextNodeId: 'node-defense-fallback-sortie',
            scores: { tactical: 70, risk: 65, leadership: 70 },
          },
          {
            text: {
              es: 'Mantener posición y esperar refuerzos que llegarán en 3 horas',
              en: 'Hold position and wait for reinforcements arriving in 3 hours',
            },
            nextNodeId: 'node-defense-fallback-hold',
            scores: { tactical: 45, risk: 35, leadership: 40 },
          },
        ],
      },
      {
        id: 'node-defense-fallback-sortie',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La salida agresiva tomó por sorpresa a los hostiles. 6 capturados, 5 huyeron. Sin embargo, el puesto quedó temporalmente desprotegido durante la salida. Resultado aceptable pero con riesgo innecesario previo.',
          en: '⚠️ RESULT: The aggressive sortie caught hostiles off guard. 6 captured, 5 fled. However, the post was temporarily unprotected during the sortie. Acceptable result but with prior unnecessary risk.',
        },
        outcome: { es: 'El repliegue inicial fue un error. La corrección posterior fue adecuada.', en: 'Initial fallback was a mistake. Subsequent correction was adequate.' },
      },
      {
        id: 'node-defense-fallback-hold',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Los refuerzos llegaron pero el grupo hostil detectó su aproximación y se retiró antes. No hubo capturas. El puesto resistió sin bajas pero la amenaza no fue neutralizada. Se perdió tiempo e iniciativa.',
          en: '⚠️ RESULT: Reinforcements arrived but the hostile group detected their approach and retreated beforehand. No captures. The post held without casualties but the threat was not neutralized. Time and initiative were lost.',
        },
        outcome: { es: 'Postura excesivamente pasiva. Oportunidad táctica perdida.', en: 'Excessively passive posture. Tactical opportunity lost.' },
      },
      // PATH B: Wait
      {
        id: 'node-wait',
        situation: {
          es: 'Han pasado 15 minutos esperando respuesta del comando superior. El grupo armado ha avanzado a 800 metros del puesto. Un centinela reporta que se están dispersando en formación de asalto. La situación es crítica. ¿Qué hace ahora?',
          en: '15 minutes have passed waiting for higher command response. The armed group has advanced to 800 meters from the post. A sentry reports they are dispersing into assault formation. The situation is critical. What do you do now?',
        },
        options: [
          {
            text: {
              es: 'Activar defensa de emergencia y preparar posición de combate inmediata',
              en: 'Activate emergency defense and prepare immediate combat position',
            },
            nextNodeId: 'node-wait-emergency',
            scores: { tactical: 55, risk: 50, leadership: 40 },
          },
          {
            text: {
              es: 'Ordenar evacuación del puesto y replegar a posición secundaria',
              en: 'Order evacuation of the post and fall back to secondary position',
            },
            nextNodeId: 'node-wait-retreat',
            scores: { tactical: 35, risk: 30, leadership: 30 },
          },
        ],
      },
      {
        id: 'node-wait-emergency',
        situation: {
          es: 'La defensa se activa tarde pero sus hombres responden. El grupo hostil lanza un asalto coordinado. El combate es intenso. Tras 20 minutos, los hostiles se repliegan pero reagrupan a 400m. Tiene 2 heridos. El comando superior finalmente responde y ofrece apoyo aéreo en 45 minutos. ¿Qué decide?',
          en: 'Defense activates late but your men respond. The hostile group launches a coordinated assault. Combat is intense. After 20 minutes, hostiles pull back but regroup at 400m. You have 2 wounded. Higher command finally responds and offers air support in 45 minutes. What do you decide?',
        },
        options: [
          {
            text: {
              es: 'Resistir y esperar apoyo aéreo manteniendo a los heridos protegidos',
              en: 'Hold and wait for air support while keeping wounded protected',
            },
            nextNodeId: 'node-wait-emergency-hold',
            scores: { tactical: 60, risk: 55, leadership: 55 },
          },
          {
            text: {
              es: 'Contraatacar ahora mientras el enemigo está desorganizado',
              en: 'Counterattack now while the enemy is disorganized',
            },
            nextNodeId: 'node-wait-emergency-counter',
            scores: { tactical: 65, risk: 60, leadership: 60 },
          },
        ],
      },
      {
        id: 'node-wait-emergency-hold',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Resistió hasta la llegada del apoyo aéreo. Los hostiles se dispersaron al detectar el helicóptero. 3 capturados por la patrulla de persecución. Sin embargo, la demora inicial causó bajas que pudieron evitarse. La investigación señaló que la espera fue injustificada.',
          en: '⚠️ RESULT: Held until air support arrived. Hostiles dispersed upon detecting the helicopter. 3 captured by pursuit patrol. However, the initial delay caused preventable casualties. Investigation found the wait was unjustified.',
        },
        outcome: { es: 'La espera inicial fue un error grave. La resistencia posterior fue correcta.', en: 'Initial wait was a serious error. Subsequent resistance was correct.' },
      },
      {
        id: 'node-wait-emergency-counter',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El contraataque aprovechó la desorganización del enemigo. 6 hostiles capturados. Sin embargo, un tercer herido durante la acción. La operación tuvo éxito parcial pero el costo en bajas fue alto debido a la inacción inicial.',
          en: '⚠️ RESULT: The counterattack exploited enemy disorganization. 6 hostiles captured. However, a third casualty during the action. The operation was partially successful but the casualty cost was high due to initial inaction.',
        },
        outcome: { es: 'Buena recuperación táctica pero el error inicial tuvo consecuencias.', en: 'Good tactical recovery but the initial error had consequences.' },
      },
      // B2: Retreat
      {
        id: 'node-wait-retreat',
        situation: {
          es: 'La evacuación está en curso. El grupo hostil detecta el movimiento y acelera su avance. La retaguardia reporta contacto visual a 200m. Está en terreno abierto con su personal parcialmente cargado con equipo. ¿Cómo maneja la retirada?',
          en: 'Evacuation is underway. The hostile group detects the movement and accelerates their advance. The rear guard reports visual contact at 200m. You are in open terrain with your personnel partially loaded with equipment. How do you manage the withdrawal?',
        },
        options: [
          {
            text: {
              es: 'Retaguardia de contención: 5 hombres cubren mientras el resto se repliega ordenadamente',
              en: 'Covering rear guard: 5 men provide cover while the rest withdraw in order',
            },
            nextNodeId: 'node-wait-retreat-cover',
            scores: { tactical: 45, risk: 40, leadership: 45 },
          },
          {
            text: {
              es: 'Abandonar equipo pesado y correr hacia la posición secundaria',
              en: 'Abandon heavy equipment and run to the secondary position',
            },
            nextNodeId: 'node-wait-retreat-run',
            scores: { tactical: 20, risk: 15, leadership: 15 },
          },
        ],
      },
      {
        id: 'node-wait-retreat-cover',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La retaguardia contuvo el avance hostil. El repliegue fue ordenado pero el puesto fue tomado. Se perdió equipo de comunicaciones y armamento. Refuerzos recuperaron el puesto 6 horas después. 1 herido en la retaguardia.',
          en: '⚠️ RESULT: The rear guard contained the hostile advance. Withdrawal was orderly but the post was taken. Communication equipment and weapons were lost. Reinforcements recovered the post 6 hours later. 1 wounded in the rear guard.',
        },
        outcome: { es: 'Resultado deficiente. La indecisión inicial causó la pérdida del puesto.', en: 'Poor result. Initial indecision caused loss of the post.' },
      },
      {
        id: 'node-wait-retreat-run',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: La huida desordenada dejó equipo valioso, documentos y armamento en manos hostiles. 4 hombres se separaron del grupo durante la retirada. El puesto fue tomado y usado como base temporal. Investigación disciplinaria abierta.',
          en: '🔴 CRITICAL RESULT: The disorderly flight left valuable equipment, documents, and weapons in hostile hands. 4 men became separated during the retreat. The post was taken and used as a temporary base. Disciplinary investigation opened.',
        },
        outcome: { es: 'Fallo total. Abandono del puesto y pérdida de material clasificado.', en: 'Total failure. Post abandoned and classified material lost.' },
      },
      // PATH C: Intercept
      {
        id: 'node-intercept',
        situation: {
          es: 'Ha enviado toda la guarnición. El puesto de control queda desprotegido. A mitad de camino, la patrulla descubre que el grupo se ha dividido y un segundo grupo se dirige al puesto abandonado. ¿Qué ordena?',
          en: 'You have sent the entire garrison. The checkpoint is left unprotected. Halfway there, the patrol discovers the group has split and a second group is heading to the abandoned post. What do you order?',
        },
        options: [
          {
            text: {
              es: 'Dividir fuerzas: la mitad continúa la persecución, la otra regresa al puesto',
              en: 'Split forces: half continue pursuit, the other half returns to the post',
            },
            nextNodeId: 'node-intercept-split',
            scores: { tactical: 50, risk: 55, leadership: 45 },
          },
          {
            text: {
              es: 'Todos regresan al puesto de control inmediatamente',
              en: 'Everyone returns to the checkpoint immediately',
            },
            nextNodeId: 'node-intercept-return',
            scores: { tactical: 45, risk: 40, leadership: 40 },
          },
          {
            text: {
              es: 'Continuar con toda la fuerza hacia el grupo principal y solicitar refuerzos para el puesto',
              en: 'Continue with full force toward the main group and request reinforcements for the post',
            },
            nextNodeId: 'node-intercept-continue',
            scores: { tactical: 55, risk: 70, leadership: 50 },
          },
        ],
      },
      {
        id: 'node-intercept-split',
        situation: {
          es: 'Ha dividido fuerzas. El grupo de persecución (12 hombres) localiza a 5 hostiles en una quebrada. Pero están en posición elevada. El grupo de regreso (13 hombres) encuentra que 3 hostiles ya entraron al puesto desprotegido. Dos crisis simultáneas. ¿Cómo prioriza?',
          en: 'You have split forces. The pursuit group (12 men) locates 5 hostiles in a ravine. But they are in an elevated position. The returning group (13 men) finds that 3 hostiles have already entered the unprotected post. Two simultaneous crises. How do you prioritize?',
        },
        options: [
          {
            text: {
              es: 'Grupo del puesto: negociar rendición. Grupo de persecución: rodear y contener',
              en: 'Post group: negotiate surrender. Pursuit group: surround and contain',
            },
            nextNodeId: 'node-intercept-split-negotiate',
            scores: { tactical: 60, risk: 55, leadership: 60 },
          },
          {
            text: {
              es: 'Ambos grupos atacan simultáneamente a la señal por radio',
              en: 'Both groups attack simultaneously on radio signal',
            },
            nextNodeId: 'node-intercept-split-attack',
            scores: { tactical: 50, risk: 65, leadership: 50 },
          },
        ],
      },
      {
        id: 'node-intercept-split-negotiate',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Los 3 hostiles del puesto se rindieron tras negociación (sin bajas). El grupo de la quebrada fue contenido pero 2 escaparon por la noche. Total: 6 capturados. El error estratégico inicial redujo la efectividad.',
          en: '⚠️ RESULT: The 3 hostiles at the post surrendered after negotiation (no casualties). The ravine group was contained but 2 escaped at night. Total: 6 captured. The initial strategic error reduced effectiveness.',
        },
        outcome: { es: 'Recuperación aceptable tras error inicial de desproteger el puesto.', en: 'Acceptable recovery after initial error of leaving post unprotected.' },
      },
      {
        id: 'node-intercept-split-attack',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El ataque simultáneo fue caótico. En el puesto, 3 hostiles capturados pero con daños al equipo. En la quebrada, 3 capturados pero 2 propios heridos por posición desventajosa. Resultado costoso.',
          en: '⚠️ RESULT: The simultaneous attack was chaotic. At the post, 3 hostiles captured but with equipment damage. In the ravine, 3 captured but 2 friendly casualties from disadvantageous position. Costly result.',
        },
        outcome: { es: 'Exceso de agresividad sin preparación adecuada.', en: 'Excessive aggression without adequate preparation.' },
      },
      {
        id: 'node-intercept-return',
        situation: {
          es: 'Toda la guarnición regresa al puesto. Al llegar, encuentran que 3 hostiles están intentando entrar por la puerta trasera. Los ven llegar y huyen. El grupo principal también se dispersa al perder su distracción. ¿Persigue o asegura?',
          en: 'The entire garrison returns to the post. Upon arrival, they find 3 hostiles trying to enter the back door. They see you coming and flee. The main group also disperses after losing their distraction. Do you pursue or secure?',
        },
        options: [
          {
            text: {
              es: 'Asegurar el puesto y establecer patrullas de perímetro ampliado',
              en: 'Secure the post and establish extended perimeter patrols',
            },
            nextNodeId: 'node-intercept-return-secure',
            scores: { tactical: 55, risk: 45, leadership: 50 },
          },
          {
            text: {
              es: 'Enviar equipo de persecución rápida (8 hombres) tras los que huyen',
              en: 'Send quick pursuit team (8 men) after those fleeing',
            },
            nextNodeId: 'node-intercept-return-pursue',
            scores: { tactical: 50, risk: 55, leadership: 45 },
          },
        ],
      },
      {
        id: 'node-intercept-return-secure',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El puesto fue asegurado sin daños. Las patrullas no encontraron a los hostiles. Todos escaparon. La amenaza no fue neutralizada y la inteligencia no obtuvo información.',
          en: '⚠️ RESULT: The post was secured without damage. Patrols did not locate the hostiles. All escaped. The threat was not neutralized and intelligence gained no information.',
        },
        outcome: { es: 'Decisión reactiva. El envío total fue un error estratégico.', en: 'Reactive decision. Full deployment was a strategic error.' },
      },
      {
        id: 'node-intercept-return-pursue',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La persecución capturó a 2 hostiles rezagados que proporcionaron información valiosa. Sin embargo, el resto escapó y el puesto estuvo nuevamente desprotegido durante la persecución. Resultado mixto.',
          en: '⚠️ RESULT: The pursuit captured 2 straggling hostiles who provided valuable intelligence. However, the rest escaped and the post was again unprotected during pursuit. Mixed result.',
        },
        outcome: { es: 'Se repitió el mismo error. La captura parcial fue por suerte.', en: 'Same mistake repeated. The partial capture was luck.' },
      },
      {
        id: 'node-intercept-continue',
        situation: {
          es: 'Continúa con toda la fuerza. Localiza al grupo principal de 8 hostiles en terreno abierto. Están en desventaja numérica y sin cobertura. Sin embargo, por radio le informan que el segundo grupo ya entró al puesto y tiene acceso al armamento almacenado. ¿Qué decide?',
          en: 'You continue with full force. You locate the main group of 8 hostiles in open terrain. They are outnumbered and without cover. However, by radio you are informed the second group has entered the post and has access to stored weapons. What do you decide?',
        },
        options: [
          {
            text: {
              es: 'Capturar al grupo principal rápidamente y luego regresar al puesto con prisioneros',
              en: 'Capture the main group quickly then return to the post with prisoners',
            },
            nextNodeId: 'node-intercept-continue-capture',
            scores: { tactical: 60, risk: 65, leadership: 55 },
          },
          {
            text: {
              es: 'Dejar un perímetro de contención sobre el grupo y regresar con la mayoría al puesto',
              en: 'Leave a containment perimeter around the group and return with most forces to the post',
            },
            nextNodeId: 'node-intercept-continue-contain',
            scores: { tactical: 55, risk: 50, leadership: 55 },
          },
        ],
      },
      {
        id: 'node-intercept-continue-capture',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El grupo principal se rindió sin combate (8 capturados). Pero al regresar al puesto, encontraron que el segundo grupo había robado municiones y equipo de comunicaciones antes de huir. Pérdida de material sensible.',
          en: '⚠️ RESULT: The main group surrendered without combat (8 captured). But upon returning to the post, they found the second group had stolen ammunition and communication equipment before fleeing. Loss of sensitive material.',
        },
        outcome: { es: 'Captura parcial exitosa pero pérdida de material crítico.', en: 'Partial capture successful but loss of critical material.' },
      },
      {
        id: 'node-intercept-continue-contain',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El grupo de contención mantuvo al grupo principal acorralado. Al regresar al puesto, el segundo grupo fue sorprendido y 3 capturados. Pero el grupo principal aprovechó la inferioridad del perímetro y 5 de 8 escaparon. Total: 6 capturados.',
          en: '⚠️ RESULT: The containment group kept the main group cornered. Upon returning to the post, the second group was surprised and 3 captured. But the main group exploited the perimeter\'s weakness and 5 of 8 escaped. Total: 6 captured.',
        },
        outcome: { es: 'Recursos insuficientes para cubrir ambos frentes. Error inicial irreversible.', en: 'Insufficient resources to cover both fronts. Irreversible initial error.' },
      },
    ],
  },

  // =====================================================
  // SIMULATION 2: NATURAL DISASTER (deep branching)
  // =====================================================
  {
    id: 'desastre-natural',
    title: {
      es: 'Respuesta ante Desastre Natural',
      en: 'Natural Disaster Response',
    },
    description: {
      es: 'Lluvias torrenciales han causado inundaciones severas que afectan una base militar y comunidades civiles cercanas. Debe coordinar la respuesta de emergencia.',
      en: 'Torrential rains have caused severe flooding affecting a military base and nearby civilian communities. You must coordinate the emergency response.',
    },
    difficulty: 'medium',
    category: { es: 'Operaciones Humanitarias', en: 'Humanitarian Operations' },
    estimatedTime: 20,
    startNodeId: 'start',
    nodes: [
      {
        id: 'start',
        situation: {
          es: '🌊 EMERGENCIA: Lluvias continuas de 72 horas han desbordado el río Guaire. El nivel del agua sube rápidamente. La base militar "Fuerte Tiuna Sur" tiene agua a 30 cm y subiendo. A 3 km, el pueblo "San Rafael" (500 habitantes) reporta familias atrapadas en techos. Tiene 40 efectivos, 3 camiones, 2 lanchas inflables y suministros para 48 horas. ¿Cuál es su prioridad?',
          en: '🌊 EMERGENCY: 72 hours of continuous rain have overflowed the Guaire River. Water level is rising rapidly. Military base "Fort Tiuna South" has 30 cm of water and rising. 3 km away, the town of "San Rafael" (500 inhabitants) reports families trapped on rooftops. You have 40 personnel, 3 trucks, 2 inflatable boats, and 48 hours of supplies. What is your priority?',
        },
        options: [
          {
            text: {
              es: 'Operación dual: asegurar equipamiento crítico de la base mientras se envía equipo de rescate a San Rafael con las lanchas',
              en: 'Dual operation: secure critical base equipment while sending rescue team to San Rafael with the boats',
            },
            nextNodeId: 'node-dual',
            scores: { tactical: 85, risk: 80, leadership: 90 },
          },
          {
            text: {
              es: 'Priorizar el rescate civil: enviar la mayoría de efectivos y recursos a San Rafael inmediatamente',
              en: 'Prioritize civilian rescue: send most personnel and resources to San Rafael immediately',
            },
            nextNodeId: 'node-civil-first',
            scores: { tactical: 65, risk: 70, leadership: 75 },
          },
          {
            text: {
              es: 'Asegurar primero la base militar y su equipamiento, luego proceder al rescate civil',
              en: 'Secure the military base and equipment first, then proceed to civilian rescue',
            },
            nextNodeId: 'node-base-first',
            scores: { tactical: 50, risk: 45, leadership: 40 },
          },
        ],
      },
      // PATH A: Dual operation
      {
        id: 'node-dual',
        situation: {
          es: 'La operación dual está en marcha. El equipo de rescate ha llegado a San Rafael y reporta 35 familias atrapadas. Las lanchas pueden transportar 8 personas por viaje (20 min ida y vuelta). El agua sigue subiendo. Un helicóptero de la Aviación puede llegar en 2 horas. ¿Cómo optimiza el rescate?',
          en: 'The dual operation is underway. The rescue team has reached San Rafael and reports 35 trapped families. The boats can transport 8 people per trip (20 min round trip). Water continues rising. An Aviation helicopter can arrive in 2 hours. How do you optimize the rescue?',
        },
        options: [
          {
            text: {
              es: 'Evacuar primero a niños, ancianos y heridos. Solicitar helicóptero. Establecer punto de acopio en terreno alto',
              en: 'Evacuate children, elderly, and injured first. Request helicopter. Establish collection point on high ground',
            },
            nextNodeId: 'node-dual-priority',
            scores: { tactical: 95, risk: 85, leadership: 95 },
          },
          {
            text: {
              es: 'Evacuar casa por casa en orden geográfico para no dejar a nadie atrás',
              en: 'Evacuate house by house in geographical order to leave no one behind',
            },
            nextNodeId: 'node-dual-systematic',
            scores: { tactical: 65, risk: 60, leadership: 65 },
          },
        ],
      },
      {
        id: 'node-dual-priority',
        situation: {
          es: 'La priorización funciona. 20 personas vulnerables evacuadas en la primera hora. El helicóptero está en camino. Pero un techo donde hay una familia de 6 comienza a ceder. Están a 400m de la lancha más cercana. Al mismo tiempo, el punto de acopio empieza a inundarse. ¿Qué atiende primero?',
          en: 'Prioritization is working. 20 vulnerable people evacuated in the first hour. Helicopter is en route. But a roof where a family of 6 is sheltering begins to collapse. They are 400m from the nearest boat. At the same time, the collection point begins to flood. What do you address first?',
        },
        options: [
          {
            text: {
              es: 'Desviar lancha al techo en colapso (rescate urgente) y reubicar punto de acopio con personal de tierra',
              en: 'Divert boat to the collapsing roof (urgent rescue) and relocate collection point with ground personnel',
            },
            nextNodeId: 'node-dual-priority-rescue',
            scores: { tactical: 90, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Priorizar la reubicación del punto de acopio (proteger a los 20 ya evacuados) y enviar nadadores al techo',
              en: 'Prioritize relocating the collection point (protect the 20 already evacuated) and send swimmers to the roof',
            },
            nextNodeId: 'node-dual-priority-relocate',
            scores: { tactical: 75, risk: 70, leadership: 75 },
          },
        ],
      },
      {
        id: 'node-dual-priority-rescue',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO EXCELENTE: La familia del techo fue rescatada justo antes del colapso. El punto de acopio fue reubicado sin incidentes. El helicóptero aceleró la evacuación restante. En 4 horas, las 35 familias (158 personas) fueron evacuadas sin pérdidas. La base mantuvo su capacidad operativa. Felicitaciones del Alto Mando.',
          en: '✅ EXCELLENT RESULT: The family on the roof was rescued just before collapse. The collection point was relocated without incident. The helicopter accelerated remaining evacuation. In 4 hours, all 35 families (158 people) were evacuated without losses. The base maintained operational capability. Commendation from High Command.',
        },
        outcome: { es: 'Liderazgo ejemplar. Priorización correcta en crisis múltiple.', en: 'Exemplary leadership. Correct prioritization in multiple crisis.' },
      },
      {
        id: 'node-dual-priority-relocate',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Los evacuados fueron reubicados a salvo. Los nadadores llegaron al techo pero 2 personas cayeron al agua durante el rescate. Fueron recuperadas pero con hipotermia severa. Todas las familias fueron finalmente evacuadas pero con 3 hospitalizados.',
          en: '⚠️ RESULT: Evacuees were safely relocated. Swimmers reached the roof but 2 people fell into the water during rescue. They were recovered but with severe hypothermia. All families were eventually evacuated but with 3 hospitalized.',
        },
        outcome: { es: 'La priorización de los ya evacuados sobre la emergencia inmediata causó complicaciones.', en: 'Prioritizing already-evacuated over immediate emergency caused complications.' },
      },
      {
        id: 'node-dual-systematic',
        situation: {
          es: 'La evacuación geográfica avanza pero es lenta. Tras 3 horas, solo 60 personas han sido evacuadas. El nivel del agua sube más rápido de lo previsto. Una escuela con 25 niños y 3 maestros queda aislada por la crecida. No estaba en su sector actual. ¿Qué hace?',
          en: 'Geographic evacuation proceeds but is slow. After 3 hours, only 60 people have been evacuated. Water level rises faster than predicted. A school with 25 children and 3 teachers becomes isolated by the flood. It was not in your current sector. What do you do?',
        },
        options: [
          {
            text: {
              es: 'Cambiar prioridad: enviar ambas lanchas a la escuela inmediatamente',
              en: 'Change priority: send both boats to the school immediately',
            },
            nextNodeId: 'node-dual-systematic-school',
            scores: { tactical: 80, risk: 75, leadership: 80 },
          },
          {
            text: {
              es: 'Mantener el plan: terminar el sector actual y luego ir a la escuela',
              en: 'Maintain the plan: finish the current sector then go to the school',
            },
            nextNodeId: 'node-dual-systematic-plan',
            scores: { tactical: 40, risk: 35, leadership: 35 },
          },
        ],
      },
      {
        id: 'node-dual-systematic-school',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Los niños y maestros de la escuela fueron rescatados exitosamente. Sin embargo, la evacuación del sector original se retrasó significativamente. Una anciana tuvo que ser atendida por hipotermia. Total: todas las personas rescatadas en 7 horas, con 2 hospitalizados.',
          en: '⚠️ RESULT: Children and teachers from the school were successfully rescued. However, the original sector evacuation was significantly delayed. An elderly woman had to be treated for hypothermia. Total: all people rescued in 7 hours, with 2 hospitalized.',
        },
        outcome: { es: 'La falta de priorización inicial causó la crisis. La corrección fue adecuada.', en: 'Lack of initial prioritization caused the crisis. The correction was adequate.' },
      },
      {
        id: 'node-dual-systematic-plan',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO: El sector actual fue completado pero la escuela quedó aislada 4 horas adicionales. Un niño con asma sufrió un ataque severo sin medicación. El helicóptero tuvo que hacer un rescate de emergencia médica. Investigación por negligencia iniciada.',
          en: '🔴 RESULT: The current sector was completed but the school remained isolated for 4 additional hours. A child with asthma suffered a severe attack without medication. The helicopter had to perform a medical emergency rescue. Negligence investigation opened.',
        },
        outcome: { es: 'Rigidez en el plan. Incapacidad de adaptar prioridades ante emergencias.', en: 'Plan rigidity. Inability to adapt priorities to emergencies.' },
      },
      // PATH B: Civil first
      {
        id: 'node-civil-first',
        situation: {
          es: 'Ha enviado 30 efectivos con las lanchas y 2 camiones a San Rafael. Solo 10 permanecen en la base. El rescate avanza bien: 40 personas evacuadas en la primera hora. Sin embargo, el agua en la base sube a 60 cm. El depósito de combustible y el generador principal están en riesgo. ¿Qué ordena?',
          en: 'You have sent 30 personnel with boats and 2 trucks to San Rafael. Only 10 remain at the base. Rescue progresses well: 40 people evacuated in the first hour. However, water at the base rises to 60 cm. The fuel depot and main generator are at risk. What do you order?',
        },
        options: [
          {
            text: {
              es: 'Los 10 en la base protegen combustible y generador con sacos de arena improvisados',
              en: 'The 10 at base protect fuel and generator with improvised sandbags',
            },
            nextNodeId: 'node-civil-first-protect',
            scores: { tactical: 70, risk: 65, leadership: 70 },
          },
          {
            text: {
              es: 'Llamar de regreso a 10 efectivos de San Rafael para reforzar la base',
              en: 'Call back 10 personnel from San Rafael to reinforce the base',
            },
            nextNodeId: 'node-civil-first-recall',
            scores: { tactical: 55, risk: 50, leadership: 50 },
          },
        ],
      },
      {
        id: 'node-civil-first-protect',
        situation: {
          es: 'Los 10 hombres trabajan arduamente con sacos. Logran proteger el generador pero el depósito de combustible tiene una fisura y empieza a fugar diesel al agua de inundación. Contaminación ambiental en proceso. ¿Cómo maneja esta nueva crisis?',
          en: 'The 10 men work hard with sandbags. They protect the generator but the fuel depot has a crack and diesel begins leaking into floodwater. Environmental contamination in progress. How do you handle this new crisis?',
        },
        options: [
          {
            text: {
              es: 'Contener la fuga con material absorbente disponible y reportar a autoridades ambientales',
              en: 'Contain the leak with available absorbent material and report to environmental authorities',
            },
            nextNodeId: 'node-civil-first-protect-contain',
            scores: { tactical: 75, risk: 70, leadership: 75 },
          },
          {
            text: {
              es: 'Drenar el combustible restante a contenedores portátiles de emergencia',
              en: 'Drain remaining fuel into emergency portable containers',
            },
            nextNodeId: 'node-civil-first-protect-drain',
            scores: { tactical: 80, risk: 75, leadership: 80 },
          },
        ],
      },
      {
        id: 'node-civil-first-protect-contain',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La contención fue parcial. El rescate en San Rafael fue exitoso (todas las familias evacuadas en 5 horas). Sin embargo, 200 litros de diesel contaminaron el agua. La base perdió equipo no asegurado. Costo de remediación ambiental significativo.',
          en: '⚠️ RESULT: Containment was partial. San Rafael rescue was successful (all families evacuated in 5 hours). However, 200 liters of diesel contaminated the water. The base lost unsecured equipment. Significant environmental remediation cost.',
        },
        outcome: { es: 'Buen enfoque humanitario pero descuido de activos y medio ambiente.', en: 'Good humanitarian approach but neglect of assets and environment.' },
      },
      {
        id: 'node-civil-first-protect-drain',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO: El drenaje de emergencia salvó el combustible y evitó contaminación mayor. El rescate en San Rafael fue exitoso. La base sufrió daños menores. Operación general evaluada como buena, con recomendación de mejorar la planificación dual.',
          en: '✅ RESULT: Emergency drainage saved the fuel and prevented major contamination. San Rafael rescue was successful. Base suffered minor damage. Overall operation rated as good, with recommendation to improve dual planning.',
        },
        outcome: { es: 'Buena adaptación ante crisis inesperada. Rescate civil exitoso.', en: 'Good adaptation to unexpected crisis. Civilian rescue successful.' },
      },
      {
        id: 'node-civil-first-recall',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Los 10 efectivos regresaron pero el rescate en San Rafael se ralentizó. La base fue parcialmente protegida. Ambas operaciones tuvieron resultados mediocres: 3 familias esperaron 6 horas adicionales y el generador sufrió daños parciales.',
          en: '⚠️ RESULT: The 10 personnel returned but the San Rafael rescue slowed down. The base was partially protected. Both operations had mediocre results: 3 families waited 6 extra hours and the generator suffered partial damage.',
        },
        outcome: { es: 'Indecisión entre prioridades causó resultado mediocre en ambos frentes.', en: 'Indecision between priorities caused mediocre results on both fronts.' },
      },
      // PATH C: Base first
      {
        id: 'node-base-first',
        situation: {
          es: 'La base está siendo asegurada. Equipos mueven equipo a pisos superiores. Mientras tanto, recibe una llamada de emergencia por radio: una familia con un bebé de 3 meses está atrapada y el agua llega al segundo piso de su casa en San Rafael. Tiene agua hasta la cintura en la base. ¿Cuánto más espera?',
          en: 'The base is being secured. Teams move equipment to upper floors. Meanwhile, you receive an emergency radio call: a family with a 3-month-old baby is trapped and water reaches the second floor of their house in San Rafael. You have waist-deep water at the base. How much longer do you wait?',
        },
        options: [
          {
            text: {
              es: 'Enviar una lancha con 5 hombres inmediatamente al rescate de emergencia mientras se continúa en la base',
              en: 'Send one boat with 5 men immediately for emergency rescue while continuing at base',
            },
            nextNodeId: 'node-base-first-partial',
            scores: { tactical: 65, risk: 60, leadership: 65 },
          },
          {
            text: {
              es: 'Completar la protección de la base (30 minutos más) antes de enviar cualquier equipo',
              en: 'Complete base protection (30 more minutes) before sending any teams',
            },
            nextNodeId: 'node-base-first-complete',
            scores: { tactical: 35, risk: 30, leadership: 25 },
          },
        ],
      },
      {
        id: 'node-base-first-partial',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La lancha rescató a la familia con el bebé a tiempo. Sin embargo, el retraso general de 2 horas causó que otras familias sufrieran. Dos ancianos con hipotermia. La base se protegió parcialmente. Mejor que la alternativa, pero la priorización inicial fue cuestionada.',
          en: '⚠️ RESULT: The boat rescued the family with the baby in time. However, the general 2-hour delay caused other families to suffer. Two elderly people with hypothermia. The base was partially protected. Better than the alternative, but initial prioritization was questioned.',
        },
        outcome: { es: 'Corrección tardía. Las vidas civiles debieron ser primera prioridad.', en: 'Late correction. Civilian lives should have been first priority.' },
      },
      {
        id: 'node-base-first-complete',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO: La base fue asegurada completamente pero la demora de 3 horas en iniciar el rescate civil fue devastadora. El bebé y su familia fueron rescatados por vecinos en una balsa improvisada (milagrosamente). 2 familias fueron arrastradas por la corriente y rescatadas después por helicóptero con heridos graves. Investigación abierta por negligencia.',
          en: '🔴 RESULT: The base was fully secured but the 3-hour delay in starting civilian rescue was devastating. The baby and family were rescued by neighbors on an improvised raft (miraculously). 2 families were swept away and later rescued by helicopter with serious injuries. Negligence investigation opened.',
        },
        outcome: { es: 'Priorización incorrecta. Las vidas humanas deben ser la primera prioridad.', en: 'Incorrect prioritization. Human lives must be the first priority.' },
      },
    ],
  },

  // =====================================================
  // SIMULATION 3: INTERNAL SECURITY (deep branching)
  // =====================================================
  {
    id: 'amenaza-interna',
    title: {
      es: 'Amenaza de Seguridad Interna',
      en: 'Internal Security Threat',
    },
    description: {
      es: 'Actividad sospechosa ha sido detectada en las inmediaciones de una instalación de infraestructura crítica. Debe evaluar la amenaza y tomar decisiones de seguridad.',
      en: 'Suspicious activity has been detected near a critical infrastructure facility. You must assess the threat and make security decisions.',
    },
    difficulty: 'critical',
    category: { es: 'Seguridad Interna', en: 'Internal Security' },
    estimatedTime: 20,
    startNodeId: 'start',
    nodes: [
      {
        id: 'start',
        situation: {
          es: '🔒 ALERTA DE SEGURIDAD: Cámaras de vigilancia de la subestación eléctrica "El Guri" detectan 3 vehículos desconocidos estacionados a 500 metros durante las últimas 4 horas. Individuos con equipo fotográfico han sido vistos tomando imágenes de las instalaciones. Usted comanda el destacamento de seguridad (15 efectivos). Es de noche (2100 horas). ¿Cómo evalúa y responde?',
          en: '🔒 SECURITY ALERT: Surveillance cameras at the "El Guri" electrical substation detect 3 unknown vehicles parked 500 meters away for the past 4 hours. Individuals with photographic equipment have been seen taking pictures of the facilities. You command the security detachment (15 personnel). It is nighttime (2100 hours). How do you assess and respond?',
        },
        options: [
          {
            text: {
              es: 'Reconocimiento encubierto: enviar pareja de observadores, verificar placas de vehículos, alertar a inteligencia y mantener fuerza de reacción lista',
              en: 'Covert reconnaissance: send observer pair, verify vehicle plates, alert intelligence and keep reaction force ready',
            },
            nextNodeId: 'node-recon',
            scores: { tactical: 90, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Confrontación directa: enviar patrulla motorizada a identificar a los individuos y requisar los vehículos',
              en: 'Direct confrontation: send motorized patrol to identify individuals and search vehicles',
            },
            nextNodeId: 'node-confront',
            scores: { tactical: 55, risk: 50, leadership: 55 },
          },
          {
            text: {
              es: 'Incrementar vigilancia pasiva y reportar al comando superior sin intervenir',
              en: 'Increase passive surveillance and report to higher command without intervening',
            },
            nextNodeId: 'node-passive',
            scores: { tactical: 40, risk: 35, leadership: 35 },
          },
        ],
      },
      // PATH A: Recon
      {
        id: 'node-recon',
        situation: {
          es: 'Los observadores reportan: placas de otro estado, equipo de alta tecnología (drones, cámaras térmicas). Un individuo fue identificado en la base de datos de inteligencia como vinculado a redes de sabotaje. La situación es más grave de lo esperado. ¿Siguiente paso?',
          en: 'Observers report: out-of-state plates, high-tech equipment (drones, thermal cameras). One individual was identified in the intelligence database as linked to sabotage networks. The situation is more serious than expected. Next step?',
        },
        options: [
          {
            text: {
              es: 'Operación de cerco y captura: bloquear vías de escape, detener a todos los individuos y preservar evidencia',
              en: 'Cordon and capture operation: block escape routes, detain all individuals and preserve evidence',
            },
            nextNodeId: 'node-recon-capture',
            scores: { tactical: 95, risk: 80, leadership: 95 },
          },
          {
            text: {
              es: 'Mantener vigilancia y seguimiento hasta que lleguen unidades especializadas de inteligencia',
              en: 'Maintain surveillance and tracking until specialized intelligence units arrive',
            },
            nextNodeId: 'node-recon-wait',
            scores: { tactical: 70, risk: 65, leadership: 65 },
          },
        ],
      },
      {
        id: 'node-recon-capture',
        situation: {
          es: 'El cerco está listo. Al momento de la captura, 2 individuos intentan destruir dispositivos electrónicos (laptops, discos duros). Un tercero intenta huir a pie hacia una zona boscosa. Los demás se rinden. ¿Cómo maneja la situación?',
          en: 'The cordon is set. At the moment of capture, 2 individuals try to destroy electronic devices (laptops, hard drives). A third tries to flee on foot toward a wooded area. The others surrender. How do you manage the situation?',
        },
        options: [
          {
            text: {
              es: 'Prioridad 1: evitar destrucción de evidencia (sujetar a los que destruyen equipos). Enviar binomio tras el fugitivo',
              en: 'Priority 1: prevent evidence destruction (restrain those destroying equipment). Send pair after the fugitive',
            },
            nextNodeId: 'node-recon-capture-evidence',
            scores: { tactical: 95, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Prioridad 1: capturar al fugitivo (puede ser el líder). Dejar que los otros destruyan lo que puedan',
              en: 'Priority 1: capture the fugitive (could be the leader). Let the others destroy what they can',
            },
            nextNodeId: 'node-recon-capture-fugitive',
            scores: { tactical: 70, risk: 70, leadership: 70 },
          },
        ],
      },
      {
        id: 'node-recon-capture-evidence',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO EXCELENTE: Se salvó el 80% de la evidencia digital, incluyendo planos detallados de la subestación, cronogramas de ataque y una lista de objetivos adicionales. El fugitivo fue capturado 2 km después por el binomio de persecución. Total: 7 capturados con evidencia abundante. La investigación desmanteló una red de 23 personas en 3 estados.',
          en: '✅ EXCELLENT RESULT: 80% of digital evidence was saved, including detailed substation blueprints, attack schedules, and a list of additional targets. The fugitive was captured 2 km later by the pursuit pair. Total: 7 captured with abundant evidence. The investigation dismantled a 23-person network across 3 states.',
        },
        outcome: { es: 'Operación de inteligencia y captura ejemplar. Red de sabotaje desmantelada.', en: 'Exemplary intelligence and capture operation. Sabotage network dismantled.' },
      },
      {
        id: 'node-recon-capture-fugitive',
        situation: {
          es: 'El fugitivo fue capturado tras una persecución de 15 minutos. Efectivamente era el coordinador. Sin embargo, los otros destruyeron 2 laptops y 3 discos duros. Solo se recuperó un teléfono con información parcial. El coordinador se niega a hablar. ¿Cómo procede?',
          en: 'The fugitive was captured after a 15-minute chase. He was indeed the coordinator. However, the others destroyed 2 laptops and 3 hard drives. Only one phone with partial information was recovered. The coordinator refuses to talk. How do you proceed?',
        },
        options: [
          {
            text: {
              es: 'Enviar el teléfono a análisis forense digital y solicitar interrogatorio especializado para el coordinador',
              en: 'Send phone for digital forensic analysis and request specialized interrogation for the coordinator',
            },
            nextNodeId: 'node-recon-capture-fugitive-forensic',
            scores: { tactical: 75, risk: 70, leadership: 75 },
          },
          {
            text: {
              es: 'Buscar en los vehículos y pertenencias cualquier evidencia adicional antes de que sean contaminadas',
              en: 'Search vehicles and belongings for any additional evidence before it is contaminated',
            },
            nextNodeId: 'node-recon-capture-fugitive-search',
            scores: { tactical: 80, risk: 75, leadership: 80 },
          },
        ],
      },
      {
        id: 'node-recon-capture-fugitive-forensic',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El análisis forense del teléfono reveló información parcial sobre la red. Se identificaron 8 miembros adicionales. Sin embargo, la pérdida de las laptops impidió conocer el plan completo. Resultado bueno pero incompleto.',
          en: '⚠️ RESULT: Phone forensic analysis revealed partial network information. 8 additional members were identified. However, the loss of laptops prevented knowing the full plan. Good but incomplete result.',
        },
        outcome: { es: 'Captura del líder exitosa pero pérdida de evidencia digital crítica.', en: 'Leader capture successful but loss of critical digital evidence.' },
      },
      {
        id: 'node-recon-capture-fugitive-search',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO: En los vehículos se encontraron mapas físicos, notas manuscritas y un segundo teléfono oculto con comunicaciones encriptadas. Combinado con el teléfono recuperado, se logró reconstruir el 60% del plan. 15 miembros de la red identificados y 10 capturados en operaciones subsiguientes.',
          en: '✅ RESULT: Maps, handwritten notes, and a hidden second phone with encrypted communications were found in the vehicles. Combined with the recovered phone, 60% of the plan was reconstructed. 15 network members identified and 10 captured in subsequent operations.',
        },
        outcome: { es: 'Buena investigación de campo compensó la pérdida de evidencia digital.', en: 'Good field investigation compensated for loss of digital evidence.' },
      },
      // A2: Wait for intel
      {
        id: 'node-recon-wait',
        situation: {
          es: 'Ha pasado 1 hora. Las unidades de inteligencia estiman 2 horas más para llegar. Uno de los vehículos enciende el motor. Parece que se preparan para irse. Si se van, perderá la oportunidad. ¿Qué decide?',
          en: '1 hour has passed. Intelligence units estimate 2 more hours to arrive. One vehicle starts its engine. They seem to be preparing to leave. If they leave, you will lose the opportunity. What do you decide?',
        },
        options: [
          {
            text: {
              es: 'Actuar ahora: ejecutar operación de captura con sus propios medios',
              en: 'Act now: execute capture operation with your own resources',
            },
            nextNodeId: 'node-recon-wait-act',
            scores: { tactical: 80, risk: 75, leadership: 80 },
          },
          {
            text: {
              es: 'Seguir los vehículos a distancia para rastrear su destino',
              en: 'Follow the vehicles at a distance to track their destination',
            },
            nextNodeId: 'node-recon-wait-follow',
            scores: { tactical: 65, risk: 60, leadership: 60 },
          },
          {
            text: {
              es: 'Dejarlos ir y reportar la información recopilada a inteligencia',
              en: 'Let them go and report collected information to intelligence',
            },
            nextNodeId: 'node-recon-wait-let-go',
            scores: { tactical: 40, risk: 35, leadership: 35 },
          },
        ],
      },
      {
        id: 'node-recon-wait-act',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO: La captura fue exitosa. 5 de 7 individuos detenidos (2 del vehículo en movimiento escaparon). Se incautó equipo de reconocimiento, planos y dispositivos de comunicación. La información permitió prevenir un ataque planificado.',
          en: '✅ RESULT: Capture was successful. 5 of 7 individuals detained (2 from the moving vehicle escaped). Reconnaissance equipment, plans, and communication devices were seized. Information helped prevent a planned attack.',
        },
        outcome: { es: 'Decisión correcta de actuar ante la ventana de oportunidad que se cerraba.', en: 'Correct decision to act as the window of opportunity was closing.' },
      },
      {
        id: 'node-recon-wait-follow',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El seguimiento fue detectado en la carretera. Los 3 vehículos se separaron en diferentes direcciones. Solo se pudo seguir a uno. Se llegó a una casa segura donde se capturó a 3 personas con información limitada. Los otros 4 desaparecieron.',
          en: '⚠️ RESULT: The tail was detected on the highway. The 3 vehicles split in different directions. Only one could be followed. A safe house was reached where 3 people were captured with limited information. The other 4 disappeared.',
        },
        outcome: { es: 'El seguimiento fue insuficiente sin medios especializados.', en: 'Tailing was insufficient without specialized resources.' },
      },
      {
        id: 'node-recon-wait-let-go',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO: Los individuos se marcharon sin ser perturbados. La información reportada fue insuficiente para identificarlos completamente. Dos semanas después, un ataque con explosivos dañó un transformador, causando un apagón de 36 horas. La investigación reveló que los mismos individuos ejecutaron el ataque.',
          en: '🔴 RESULT: The individuals departed undisturbed. Reported information was insufficient for full identification. Two weeks later, an explosive attack damaged a transformer, causing a 36-hour blackout. Investigation revealed the same individuals carried out the attack.',
        },
        outcome: { es: 'Fallo crítico. La inacción permitió el ataque.', en: 'Critical failure. Inaction allowed the attack.' },
      },
      // PATH B: Confront
      {
        id: 'node-confront',
        situation: {
          es: 'La patrulla se acerca con luces y sirena. Los individuos reaccionan rápidamente: 2 vehículos arrancan y huyen por diferentes rutas. El tercer vehículo tiene un neumático ponchado y 2 personas intentan huir a pie. ¿Cómo maneja esto?',
          en: 'The patrol approaches with lights and sirens. Individuals react quickly: 2 vehicles start and flee on different routes. The third vehicle has a flat tire and 2 people try to flee on foot. How do you handle this?',
        },
        options: [
          {
            text: {
              es: 'Capturar a los 2 a pie y asegurar el vehículo como evidencia. Reportar los otros vehículos',
              en: 'Capture the 2 on foot and secure the vehicle as evidence. Report other vehicles',
            },
            nextNodeId: 'node-confront-capture',
            scores: { tactical: 60, risk: 55, leadership: 60 },
          },
          {
            text: {
              es: 'Perseguir los vehículos que huyen con la patrulla motorizada',
              en: 'Pursue the fleeing vehicles with the motorized patrol',
            },
            nextNodeId: 'node-confront-pursue',
            scores: { tactical: 45, risk: 55, leadership: 40 },
          },
        ],
      },
      {
        id: 'node-confront-capture',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Los 2 individuos fueron capturados. En el vehículo se encontraron cámaras con fotos de la instalación y un drone. Sin embargo, los individuos alegaron ser periodistas y la falta de reconocimiento previo dificultó los cargos. Los otros 5 escaparon con información más sensible.',
          en: '⚠️ RESULT: The 2 individuals were captured. Cameras with facility photos and a drone were found in the vehicle. However, the individuals claimed to be journalists and the lack of prior reconnaissance made charges difficult. The other 5 escaped with more sensitive information.',
        },
        outcome: { es: 'Abordaje precipitado. Sin inteligencia previa, la evidencia es débil.', en: 'Hasty approach. Without prior intelligence, evidence is weak.' },
      },
      {
        id: 'node-confront-pursue',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO: La persecución por carretera oscura fue peligrosa. Un vehículo escapó. El otro fue interceptado pero los ocupantes alegaron ser turistas y no se encontró evidencia (la habían lanzado por la ventana). Los 2 del vehículo ponchado también escaparon durante la persecución. Resultado: cero capturas, cero evidencia.',
          en: '🔴 RESULT: The highway chase in darkness was dangerous. One vehicle escaped. The other was intercepted but occupants claimed to be tourists and no evidence was found (they had thrown it out the window). The 2 from the flat tire vehicle also escaped during the chase. Result: zero captures, zero evidence.',
        },
        outcome: { es: 'Persecución imprudente con resultado nulo. Se perdió toda oportunidad.', en: 'Reckless pursuit with null result. All opportunity lost.' },
      },
      // PATH C: Passive
      {
        id: 'node-passive',
        situation: {
          es: 'Han pasado 2 horas. Los individuos han completado lo que parece ser un reconocimiento exhaustivo. Ahora están usando un drone que vuela sobre la subestación. Esto es claramente una violación de espacio aéreo restringido. ¿Reacciona ahora?',
          en: '2 hours have passed. The individuals have completed what appears to be a thorough reconnaissance. Now they are using a drone flying over the substation. This is clearly a violation of restricted airspace. Do you react now?',
        },
        options: [
          {
            text: {
              es: 'Activar protocolo anti-drones y movilizar fuerzas para confrontar a los operadores',
              en: 'Activate anti-drone protocol and mobilize forces to confront operators',
            },
            nextNodeId: 'node-passive-react',
            scores: { tactical: 60, risk: 55, leadership: 50 },
          },
          {
            text: {
              es: 'Continuar documentando y reportando sin intervenir directamente',
              en: 'Continue documenting and reporting without direct intervention',
            },
            nextNodeId: 'node-passive-continue',
            scores: { tactical: 25, risk: 20, leadership: 20 },
          },
        ],
      },
      {
        id: 'node-passive-react',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El drone fue derribado por interferencia electrónica. Los operadores intentaron huir pero 4 de 7 fueron capturados. Se recuperó el drone con imágenes detalladas de vulnerabilidades de la subestación. Sin embargo, las 2 horas de observación permitieron completar la mayor parte del reconocimiento.',
          en: '⚠️ RESULT: The drone was brought down by electronic interference. Operators tried to flee but 4 of 7 were captured. The drone was recovered with detailed images of substation vulnerabilities. However, the 2 hours of observation allowed completing most of the reconnaissance.',
        },
        outcome: { es: 'Reacción tardía pero parcialmente efectiva. La demora fue criticada.', en: 'Late reaction but partially effective. The delay was criticized.' },
      },
      {
        id: 'node-passive-continue',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: Los individuos completaron su reconocimiento sin ser perturbados y se marcharon con toda su información. Una semana después, un ataque coordinado con drones y explosivos causó daños severos a 3 transformadores. Apagón de 48 horas afectando a 5 millones de personas. Su inacción fue directamente responsable.',
          en: '🔴 CRITICAL RESULT: The individuals completed their reconnaissance undisturbed and departed with all their information. One week later, a coordinated attack with drones and explosives caused severe damage to 3 transformers. 48-hour blackout affecting 5 million people. Your inaction was directly responsible.',
        },
        outcome: { es: 'Fallo catastrófico. Pasividad total ante amenaza evidente y escalante.', en: 'Catastrophic failure. Total passivity against evident and escalating threat.' },
      },
    ],
  },
  // =====================================================
  // SIMULATION 4: CYBER WARFARE
  // =====================================================
  {
    id: 'guerra-cibernetica',
    title: {
      es: 'Guerra Cibernética',
      en: 'Cyber Warfare',
    },
    description: {
      es: 'Un ataque cibernético coordinado ha comprometido sistemas críticos de defensa nacional. Como jefe de ciberdefensa, debe contener la amenaza y proteger la infraestructura.',
      en: 'A coordinated cyber attack has compromised critical national defense systems. As cyber defense chief, you must contain the threat and protect infrastructure.',
    },
    difficulty: 'critical',
    category: { es: 'Ciberdefensa', en: 'Cyber Defense' },
    estimatedTime: 25,
    startNodeId: 'cyber-start',
    nodes: [
      {
        id: 'cyber-start',
        situation: {
          es: '🔴 ALERTA MÁXIMA: A las 0200 horas, los sistemas de monitoreo detectan actividad anómala masiva. El firewall principal del Centro de Comando ha sido vulnerado. Se detectan exfiltraciones de datos en curso desde servidores de inteligencia. Simultáneamente, el sistema SCADA de la red eléctrica militar muestra manipulaciones no autorizadas. Usted es el Coronel a cargo del Centro de Ciberdefensa Nacional con un equipo de 15 analistas. ¿Cuál es su primera acción?',
          en: '🔴 MAXIMUM ALERT: At 0200 hours, monitoring systems detect massive anomalous activity. The main firewall of the Command Center has been breached. Ongoing data exfiltrations detected from intelligence servers. Simultaneously, the military power grid SCADA system shows unauthorized manipulations. You are the Colonel in charge of the National Cyber Defense Center with a team of 15 analysts. What is your first action?',
        },
        options: [
          {
            text: {
              es: 'Aislar inmediatamente los sistemas comprometidos de la red, activar protocolos de contingencia y dividir el equipo: 8 en contención, 7 en análisis forense',
              en: 'Immediately isolate compromised systems from the network, activate contingency protocols and split the team: 8 on containment, 7 on forensic analysis',
            },
            nextNodeId: 'cyber-isolate',
            scores: { tactical: 90, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Mantener los sistemas activos para rastrear al atacante y recopilar inteligencia sobre su origen',
              en: 'Keep systems active to trace the attacker and gather intelligence on their origin',
            },
            nextNodeId: 'cyber-trace',
            scores: { tactical: 60, risk: 40, leadership: 55 },
          },
          {
            text: {
              es: 'Desconectar toda la red militar de internet y activar sistemas de comunicación alternativos',
              en: 'Disconnect the entire military network from the internet and activate alternative communication systems',
            },
            nextNodeId: 'cyber-disconnect',
            scores: { tactical: 70, risk: 70, leadership: 65 },
          },
        ],
      },
      // PATH A: Isolate
      {
        id: 'cyber-isolate',
        situation: {
          es: 'El aislamiento fue efectivo. La exfiltración de datos se detuvo al 23% de completarse. Su equipo forense identifica el vector de ataque: un correo de spear-phishing abierto por un oficial de alto rango hace 72 horas. El malware es sofisticado — tiene capacidades de movimiento lateral y ya se detectan 3 backdoors adicionales. El sistema SCADA sigue comprometido. ¿Cómo prioriza?',
          en: 'Isolation was effective. Data exfiltration stopped at 23% completion. Your forensic team identifies the attack vector: a spear-phishing email opened by a high-ranking officer 72 hours ago. The malware is sophisticated — it has lateral movement capabilities and 3 additional backdoors are detected. The SCADA system remains compromised. How do you prioritize?',
        },
        options: [
          {
            text: {
              es: 'Priorizar SCADA: el control de la red eléctrica es crítico. Enviar equipo especializado mientras el resto limpia backdoors',
              en: 'Prioritize SCADA: power grid control is critical. Send specialized team while the rest cleans backdoors',
            },
            nextNodeId: 'cyber-isolate-scada',
            scores: { tactical: 85, risk: 90, leadership: 85 },
          },
          {
            text: {
              es: 'Limpiar primero todos los backdoors para evitar reinfección antes de abordar SCADA',
              en: 'Clean all backdoors first to prevent reinfection before addressing SCADA',
            },
            nextNodeId: 'cyber-isolate-backdoors',
            scores: { tactical: 70, risk: 60, leadership: 65 },
          },
          {
            text: {
              es: 'Operación simultánea: dividir equipo en tres — SCADA, backdoors y contraataque digital',
              en: 'Simultaneous operation: split team in three — SCADA, backdoors and digital counterattack',
            },
            nextNodeId: 'cyber-isolate-simultaneous',
            scores: { tactical: 75, risk: 75, leadership: 80 },
          },
        ],
      },
      // A1: SCADA priority
      {
        id: 'cyber-isolate-scada',
        situation: {
          es: 'El equipo SCADA descubre que el atacante ha implantado comandos de sobrecarga programados para las 0600 — en 2 horas. Si se ejecutan, quemarán 12 transformadores de la base principal. El equipo necesita 90 minutos para desactivarlos manualmente, pero detectan que el atacante está monitoreando en tiempo real y podría adelantar la ejecución. ¿Qué ordena?',
          en: 'The SCADA team discovers the attacker has implanted overload commands scheduled for 0600 — in 2 hours. If executed, they will burn 12 transformers at the main base. The team needs 90 minutes to manually disable them, but they detect the attacker is monitoring in real time and could advance execution. What do you order?',
        },
        options: [
          {
            text: {
              es: 'Desconexión física de emergencia de los transformadores mientras el equipo trabaja en la desactivación digital',
              en: 'Emergency physical disconnection of transformers while the team works on digital deactivation',
            },
            nextNodeId: 'cyber-isolate-scada-physical',
            scores: { tactical: 95, risk: 90, leadership: 90 },
          },
          {
            text: {
              es: 'Inyectar datos falsos al sistema de monitoreo del atacante para ganar tiempo',
              en: 'Inject false data into the attacker\'s monitoring system to buy time',
            },
            nextNodeId: 'cyber-isolate-scada-deception',
            scores: { tactical: 80, risk: 75, leadership: 85 },
          },
        ],
      },
      {
        id: 'cyber-isolate-scada-physical',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO EXCELENTE: La desconexión física salvó los transformadores. El equipo digital completó la limpieza del SCADA en 90 minutos. Los backdoors fueron eliminados en las siguientes 4 horas. El análisis forense identificó al grupo atacante como una APT estatal. La exfiltración del 23% contenía datos de bajo nivel de clasificación. La base mantuvo operatividad continua gracias a generadores de respaldo.',
          en: '✅ EXCELLENT RESULT: Physical disconnection saved the transformers. The digital team completed SCADA cleanup in 90 minutes. Backdoors were eliminated over the next 4 hours. Forensic analysis identified the attacking group as a state APT. The 23% exfiltration contained low-classification data. The base maintained continuous operations thanks to backup generators.',
        },
        outcome: { es: 'Respuesta ejemplar. Combinación de acción física y digital. Daño mínimo.', en: 'Exemplary response. Combination of physical and digital action. Minimal damage.' },
      },
      {
        id: 'cyber-isolate-scada-deception',
        situation: {
          es: 'La decepción funciona parcialmente — el atacante reduce su vigilancia durante 40 minutos. Su equipo avanza al 60% de la desactivación. Pero entonces el atacante detecta la inyección de datos falsos y adelanta la ejecución de los comandos de sobrecarga. Quedan 8 transformadores sin desactivar. ¿Acción inmediata?',
          en: 'The deception partially works — the attacker reduces surveillance for 40 minutes. Your team reaches 60% deactivation. But then the attacker detects the false data injection and advances the overload command execution. 8 transformers remain undeactivated. Immediate action?',
        },
        options: [
          {
            text: {
              es: 'Corte de emergencia manual de los 8 transformadores restantes — aceptar apagón parcial controlado',
              en: 'Emergency manual cutoff of remaining 8 transformers — accept controlled partial blackout',
            },
            nextNodeId: 'cyber-isolate-scada-deception-cut',
            scores: { tactical: 75, risk: 70, leadership: 75 },
          },
          {
            text: {
              es: 'Intentar desactivación acelerada de los comandos restantes antes de que se ejecuten',
              en: 'Attempt accelerated deactivation of remaining commands before execution',
            },
            nextNodeId: 'cyber-isolate-scada-deception-race',
            scores: { tactical: 50, risk: 40, leadership: 45 },
          },
        ],
      },
      {
        id: 'cyber-isolate-scada-deception-cut',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El corte manual salvó los transformadores pero causó un apagón de 6 horas en la base. Los generadores de respaldo cubrieron sistemas críticos. 4 de los transformadores desactivados digitalmente se recuperaron sin daño. La decepción inicial fue creativa pero arriesgada.',
          en: '⚠️ RESULT: Manual cutoff saved the transformers but caused a 6-hour blackout at the base. Backup generators covered critical systems. 4 of the digitally deactivated transformers recovered without damage. The initial deception was creative but risky.',
        },
        outcome: { es: 'Buena recuperación de una situación deteriorada. La decepción añadió complejidad innecesaria.', en: 'Good recovery from a deteriorating situation. Deception added unnecessary complexity.' },
      },
      {
        id: 'cyber-isolate-scada-deception-race',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: La desactivación acelerada solo logró cubrir 3 de los 8 transformadores. Los 5 restantes sufrieron sobrecarga. 3 quedaron destruidos. Apagón de 36 horas en la base principal. Pérdidas de equipo estimadas en millones. La decisión de arriesgarse fue cuestionada.',
          en: '🔴 CRITICAL RESULT: Accelerated deactivation only covered 3 of 8 transformers. The remaining 5 suffered overload. 3 were destroyed. 36-hour blackout at the main base. Equipment losses estimated in millions. The decision to take the risk was questioned.',
        },
        outcome: { es: 'Error de cálculo grave. Debió priorizar la contención física.', en: 'Serious miscalculation. Should have prioritized physical containment.' },
      },
      // A2: Backdoors first
      {
        id: 'cyber-isolate-backdoors',
        situation: {
          es: 'Su equipo encuentra y elimina 2 de los 3 backdoors. El tercero está profundamente integrado en el kernel del sistema. Mientras trabajan, el atacante usa el SCADA comprometido para activar una secuencia de prueba que apaga brevemente el sistema de ventilación del centro de datos. Es una advertencia. ¿Cómo responde?',
          en: 'Your team finds and removes 2 of 3 backdoors. The third is deeply integrated into the system kernel. While working, the attacker uses the compromised SCADA to activate a test sequence that briefly shuts down the data center ventilation. It\'s a warning. How do you respond?',
        },
        options: [
          {
            text: {
              es: 'Abandonar la limpieza del tercer backdoor y redirigir todo el equipo a SCADA inmediatamente',
              en: 'Abandon third backdoor cleanup and redirect entire team to SCADA immediately',
            },
            nextNodeId: 'cyber-isolate-backdoors-redirect',
            scores: { tactical: 70, risk: 65, leadership: 70 },
          },
          {
            text: {
              es: 'Continuar con el tercer backdoor — la ventilación fue solo una distracción',
              en: 'Continue with third backdoor — the ventilation was just a distraction',
            },
            nextNodeId: 'cyber-isolate-backdoors-continue',
            scores: { tactical: 40, risk: 30, leadership: 35 },
          },
        ],
      },
      {
        id: 'cyber-isolate-backdoors-redirect',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El equipo logró estabilizar SCADA pero el tercer backdoor permaneció activo durante 18 horas adicionales. El atacante lo usó para exfiltrar otro 15% de datos antes de ser finalmente eliminado. La priorización de SCADA previno daños físicos pero la limpieza incompleta tuvo costos de inteligencia.',
          en: '⚠️ RESULT: The team stabilized SCADA but the third backdoor remained active for another 18 hours. The attacker used it to exfiltrate another 15% of data before it was finally removed. SCADA prioritization prevented physical damage but incomplete cleanup had intelligence costs.',
        },
        outcome: { es: 'Priorización tardía de SCADA. El enfoque inicial en backdoors fue un error.', en: 'Late SCADA prioritization. Initial focus on backdoors was a mistake.' },
      },
      {
        id: 'cyber-isolate-backdoors-continue',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: Mientras el equipo trabajaba en el backdoor, el atacante ejecutó una secuencia completa de sobrecarga en SCADA. 7 transformadores destruidos. Apagón de 48 horas. El tercer backdoor fue eliminado pero el daño físico fue devastador. Su priorización fue gravemente errónea.',
          en: '🔴 CRITICAL RESULT: While the team worked on the backdoor, the attacker executed a full overload sequence on SCADA. 7 transformers destroyed. 48-hour blackout. The third backdoor was removed but physical damage was devastating. Your prioritization was severely wrong.',
        },
        outcome: { es: 'Fallo catastrófico en priorización. El daño físico debió ser la prioridad.', en: 'Catastrophic prioritization failure. Physical damage should have been the priority.' },
      },
      // A3: Simultaneous
      {
        id: 'cyber-isolate-simultaneous',
        situation: {
          es: 'Con el equipo dividido en tres, cada grupo tiene solo 5 personas. El equipo SCADA progresa lentamente. El equipo de backdoors encuentra 2 de 3. El equipo de contraataque ha localizado uno de los servidores del atacante. Todos reportan que necesitan más personal. ¿Cómo redistribuye?',
          en: 'With the team split three ways, each group has only 5 people. The SCADA team progresses slowly. The backdoor team finds 2 of 3. The counterattack team has located one of the attacker\'s servers. All report needing more personnel. How do you redistribute?',
        },
        options: [
          {
            text: {
              es: 'Disolver contraataque y enviar 3 a SCADA, 2 a backdoors. La contención es prioridad sobre la ofensiva',
              en: 'Dissolve counterattack and send 3 to SCADA, 2 to backdoors. Containment is priority over offense',
            },
            nextNodeId: 'cyber-isolate-simultaneous-contain',
            scores: { tactical: 80, risk: 80, leadership: 85 },
          },
          {
            text: {
              es: 'Mantener la división. Presionar al atacante en tres frentes lo obligará a cometer errores',
              en: 'Maintain the split. Pressing the attacker on three fronts will force mistakes',
            },
            nextNodeId: 'cyber-isolate-simultaneous-maintain',
            scores: { tactical: 55, risk: 50, leadership: 50 },
          },
        ],
      },
      {
        id: 'cyber-isolate-simultaneous-contain',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO: La redistribución fue efectiva. SCADA fue asegurado en 2 horas. Todos los backdoors eliminados. Aunque no se logró el contraataque, la inteligencia recopilada fue suficiente para identificar al grupo atacante. Daño total limitado al 23% de exfiltración inicial.',
          en: '✅ RESULT: Redistribution was effective. SCADA was secured in 2 hours. All backdoors removed. Although counterattack was not achieved, gathered intelligence was sufficient to identify the attacking group. Total damage limited to the initial 23% exfiltration.',
        },
        outcome: { es: 'Excelente adaptación. Reconocer límites del equipo y priorizar fue clave.', en: 'Excellent adaptation. Recognizing team limits and prioritizing was key.' },
      },
      {
        id: 'cyber-isolate-simultaneous-maintain',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El equipo disperso no logró completar ninguna tarea a tiempo. SCADA sufrió una sobrecarga parcial (3 transformadores dañados). El tercer backdoor permaneció activo 12 horas. El contraataque reveló la ubicación del servidor pero sin recursos para actuar. Resultado mediocre en todas las dimensiones.',
          en: '⚠️ RESULT: The dispersed team failed to complete any task on time. SCADA suffered partial overload (3 transformers damaged). Third backdoor remained active 12 hours. Counterattack revealed server location but without resources to act. Mediocre result across all dimensions.',
        },
        outcome: { es: 'Dispersión de recursos. Intentar todo simultáneamente fue un error.', en: 'Resource dispersion. Attempting everything simultaneously was a mistake.' },
      },
      // PATH B: Trace
      {
        id: 'cyber-trace',
        situation: {
          es: 'Mantiene los sistemas activos para rastrear. En 30 minutos, su equipo identifica que el ataque proviene de 4 servidores proxy en diferentes países. Pero durante ese tiempo, la exfiltración avanzó al 58%. El atacante también ha comenzado a cifrar archivos en los servidores de inteligencia — un ransomware. La situación empeora. ¿Qué hace?',
          en: 'You keep systems active to trace. In 30 minutes, your team identifies the attack coming from 4 proxy servers in different countries. But during that time, exfiltration advanced to 58%. The attacker has also begun encrypting files on intelligence servers — ransomware. The situation worsens. What do you do?',
        },
        options: [
          {
            text: {
              es: 'Cortar todo ahora — aislar sistemas, detener exfiltración y activar backups',
              en: 'Cut everything now — isolate systems, stop exfiltration and activate backups',
            },
            nextNodeId: 'cyber-trace-cut',
            scores: { tactical: 65, risk: 60, leadership: 60 },
          },
          {
            text: {
              es: 'Seguir rastreando — ya tiene 4 proxies, necesita encontrar el servidor real',
              en: 'Keep tracing — already have 4 proxies, need to find the real server',
            },
            nextNodeId: 'cyber-trace-continue',
            scores: { tactical: 30, risk: 20, leadership: 25 },
          },
        ],
      },
      {
        id: 'cyber-trace-cut',
        situation: {
          es: 'Los sistemas se aíslan. La exfiltración se detiene al 58%. El ransomware cifró el 40% de los archivos de inteligencia pero los backups están intactos. La restauración tomará 8 horas. Sin embargo, SCADA sigue comprometido y ahora el atacante, al ver que fue cortado, ejecuta comandos de destrucción programados. ¿Cómo actúa?',
          en: 'Systems are isolated. Exfiltration stops at 58%. Ransomware encrypted 40% of intelligence files but backups are intact. Restoration will take 8 hours. However, SCADA remains compromised and now the attacker, seeing the cutoff, executes programmed destruction commands. How do you act?',
        },
        options: [
          {
            text: {
              es: 'Desconexión física inmediata de toda la infraestructura SCADA — apagón total controlado',
              en: 'Immediate physical disconnection of all SCADA infrastructure — controlled total blackout',
            },
            nextNodeId: 'cyber-trace-cut-physical',
            scores: { tactical: 70, risk: 70, leadership: 65 },
          },
          {
            text: {
              es: 'Intentar contrarrestar los comandos digitalmente con el equipo completo enfocado en SCADA',
              en: 'Attempt to counter commands digitally with the entire team focused on SCADA',
            },
            nextNodeId: 'cyber-trace-cut-counter',
            scores: { tactical: 50, risk: 45, leadership: 50 },
          },
        ],
      },
      {
        id: 'cyber-trace-cut-physical',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La desconexión física salvó la infraestructura pero el apagón total duró 12 horas. 58% de datos exfiltrados incluían información sensible de mediana clasificación. El ransomware requirió restauración completa de backups. La demora de 30 minutos rastreando fue costosa.',
          en: '⚠️ RESULT: Physical disconnection saved infrastructure but total blackout lasted 12 hours. 58% exfiltrated data included sensitive medium-classification information. Ransomware required full backup restoration. The 30-minute tracing delay was costly.',
        },
        outcome: { es: 'Reacción tardía con consecuencias significativas. El rastreo inicial fue un error de prioridades.', en: 'Late reaction with significant consequences. Initial tracing was a prioritization error.' },
      },
      {
        id: 'cyber-trace-cut-counter',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: El equipo no logró contrarrestar todos los comandos a tiempo. 5 transformadores destruidos, 2 sistemas de refrigeración dañados. El apagón no planificado duró 72 horas. La combinación de exfiltración masiva, ransomware y destrucción SCADA fue devastadora. La investigación determinó que la decisión de rastrear en lugar de contener fue el error fundamental.',
          en: '🔴 CRITICAL RESULT: The team failed to counter all commands in time. 5 transformers destroyed, 2 cooling systems damaged. Unplanned blackout lasted 72 hours. The combination of massive exfiltration, ransomware, and SCADA destruction was devastating. Investigation determined the decision to trace instead of contain was the fundamental error.',
        },
        outcome: { es: 'Fallo sistémico por priorización incorrecta desde el inicio.', en: 'Systemic failure due to incorrect prioritization from the start.' },
      },
      // PATH B2: Keep tracing
      {
        id: 'cyber-trace-continue',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: Mientras rastreaba, la exfiltración alcanzó el 92%. El ransomware cifró el 85% de los archivos — incluyendo los backups conectados a la red. SCADA fue saboteado completamente: 10 transformadores destruidos, apagón de 96 horas. La información de inteligencia exfiltrada apareció en foros de adversarios 48 horas después. Daño catastrófico e irreversible. Su decisión de priorizar el rastreo sobre la contención fue calificada como negligencia.',
          en: '🔴 CRITICAL RESULT: While tracing, exfiltration reached 92%. Ransomware encrypted 85% of files — including network-connected backups. SCADA was completely sabotaged: 10 transformers destroyed, 96-hour blackout. Exfiltrated intelligence information appeared on adversary forums 48 hours later. Catastrophic and irreversible damage. Your decision to prioritize tracing over containment was classified as negligence.',
        },
        outcome: { es: 'Negligencia grave. La curiosidad operativa causó un desastre nacional.', en: 'Severe negligence. Operational curiosity caused a national disaster.' },
      },
      // PATH C: Disconnect all
      {
        id: 'cyber-disconnect',
        situation: {
          es: 'La desconexión total es efectiva. Toda la red militar está offline. La exfiltración se detuvo al 23%. Sin embargo, todas las comunicaciones digitales están caídas — incluyendo sistemas de radar, vigilancia fronteriza y coordinación aérea. Un vacío de inteligencia total. Su superior pregunta cuánto tiempo para restaurar operaciones seguras. ¿Cómo procede?',
          en: 'Total disconnection is effective. The entire military network is offline. Exfiltration stopped at 23%. However, all digital communications are down — including radar, border surveillance, and air coordination systems. A total intelligence vacuum. Your superior asks how long to restore secure operations. How do you proceed?',
        },
        options: [
          {
            text: {
              es: 'Restauración por fases: primero radar y vigilancia (2h), luego comunicaciones (4h), finalmente red general (8h) — cada fase con verificación de seguridad',
              en: 'Phased restoration: first radar and surveillance (2h), then communications (4h), finally general network (8h) — each phase with security verification',
            },
            nextNodeId: 'cyber-disconnect-phased',
            scores: { tactical: 80, risk: 80, leadership: 85 },
          },
          {
            text: {
              es: 'Restauración rápida de todos los sistemas simultáneamente para minimizar el vacío operativo',
              en: 'Rapid simultaneous restoration of all systems to minimize the operational vacuum',
            },
            nextNodeId: 'cyber-disconnect-rapid',
            scores: { tactical: 45, risk: 35, leadership: 40 },
          },
        ],
      },
      {
        id: 'cyber-disconnect-phased',
        situation: {
          es: 'La restauración por fases funciona. Radar y vigilancia están operativos en 2 horas. Durante la fase de comunicaciones, su equipo detecta que el atacante había dejado un rootkit en el servidor de correo — se habría reactivado con una restauración simultánea. Lo eliminan antes de continuar. Quedan 4 horas para completar. Un general exige restauración inmediata completa. ¿Cómo responde?',
          en: 'Phased restoration works. Radar and surveillance are operational in 2 hours. During the communications phase, your team detects the attacker had left a rootkit in the mail server — it would have reactivated with simultaneous restoration. They remove it before continuing. 4 hours remain to complete. A general demands immediate full restoration. How do you respond?',
        },
        options: [
          {
            text: {
              es: 'Mantener el plan por fases — explicar al general el riesgo del rootkit como evidencia de que la prudencia fue correcta',
              en: 'Maintain phased plan — explain to the general the rootkit risk as evidence that caution was correct',
            },
            nextNodeId: 'cyber-disconnect-phased-maintain',
            scores: { tactical: 85, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Acelerar las fases restantes para satisfacer la demanda del general',
              en: 'Accelerate remaining phases to satisfy the general\'s demand',
            },
            nextNodeId: 'cyber-disconnect-phased-accelerate',
            scores: { tactical: 55, risk: 50, leadership: 45 },
          },
        ],
      },
      {
        id: 'cyber-disconnect-phased-maintain',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO: La restauración completa tomó 10 horas pero todos los sistemas volvieron limpios y verificados. El rootkit descubierto habría comprometido nuevamente toda la red. La exfiltración quedó limitada al 23% de datos de baja clasificación. El general aceptó la explicación. Su equipo recibió reconocimiento por la respuesta metódica.',
          en: '✅ RESULT: Full restoration took 10 hours but all systems returned clean and verified. The discovered rootkit would have compromised the entire network again. Exfiltration was limited to 23% low-classification data. The general accepted the explanation. Your team received recognition for the methodical response.',
        },
        outcome: { es: 'Decisión inicial drástica pero respuesta de restauración impecable. Liderazgo bajo presión superior.', en: 'Initial drastic decision but flawless restoration response. Leadership under superior pressure.' },
      },
      {
        id: 'cyber-disconnect-phased-accelerate',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La aceleración permitió restaurar en 6 horas pero se pasaron por alto 2 vulnerabilidades menores. Una fue explotada 3 días después causando una brecha menor. La presión del general influyó negativamente. La investigación recomendó que en futuras crisis el equipo técnico mantenga autonomía de decisión.',
          en: '⚠️ RESULT: Acceleration allowed restoration in 6 hours but 2 minor vulnerabilities were overlooked. One was exploited 3 days later causing a minor breach. The general\'s pressure influenced negatively. Investigation recommended that in future crises the technical team maintain decision autonomy.',
        },
        outcome: { es: 'Ceder a presión política comprometió la seguridad técnica.', en: 'Yielding to political pressure compromised technical security.' },
      },
      {
        id: 'cyber-disconnect-rapid',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: La restauración rápida reactivó el rootkit oculto del atacante. En 4 horas, toda la red fue comprometida nuevamente. Segunda exfiltración masiva. El atacante ahora tenía acceso a las medidas de respuesta documentadas. Fue necesario un segundo apagón total de 48 horas y reemplazo de hardware comprometido. Daño multiplicado por la prisa.',
          en: '🔴 CRITICAL RESULT: Rapid restoration reactivated the attacker\'s hidden rootkit. In 4 hours, the entire network was compromised again. Second massive exfiltration. The attacker now had access to documented response measures. A second 48-hour total blackout and replacement of compromised hardware was necessary. Damage multiplied by haste.',
        },
        outcome: { es: 'Fallo catastrófico por restauración sin verificación. La velocidad no sustituye la seguridad.', en: 'Catastrophic failure from restoration without verification. Speed does not substitute security.' },
      },
    ],
  },

  // =====================================================
  // SIMULATION 5: MARITIME SECURITY
  // =====================================================
  {
    id: 'seguridad-maritima',
    title: {
      es: 'Seguridad Marítima',
      en: 'Maritime Security',
    },
    description: {
      es: 'Embarcaciones sospechosas han sido detectadas en aguas territoriales. Como comandante de la patrullera naval, debe proteger la soberanía marítima y evaluar la amenaza.',
      en: 'Suspicious vessels have been detected in territorial waters. As naval patrol commander, you must protect maritime sovereignty and assess the threat.',
    },
    difficulty: 'hard',
    category: { es: 'Operaciones Navales', en: 'Naval Operations' },
    estimatedTime: 25,
    startNodeId: 'naval-start',
    nodes: [
      {
        id: 'naval-start',
        situation: {
          es: '🔴 ALERTA: A las 0315 horas, el radar detecta 3 embarcaciones rápidas sin identificación AIS entrando en la Zona Económica Exclusiva a 45 nudos. Se dirigen hacia la costa norte. Usted comanda la patrullera OPV "Guaiquerí" con capacidad de 28 nudos, un helicóptero AB-412 y 35 tripulantes. Una fragata aliada está a 2 horas de distancia. Las embarcaciones no responden a comunicaciones por radio. ¿Cuál es su primera acción?',
          en: '🔴 ALERT: At 0315 hours, radar detects 3 fast vessels without AIS identification entering the Exclusive Economic Zone at 45 knots. They are heading toward the north coast. You command the OPV patrol vessel "Guaiquerí" with 28-knot capability, an AB-412 helicopter, and 35 crew. A friendly frigate is 2 hours away. The vessels are not responding to radio communications. What is your first action?',
        },
        options: [
          {
            text: {
              es: 'Lanzar el helicóptero para identificación visual, interceptar con la patrullera y solicitar apoyo de la fragata',
              en: 'Launch the helicopter for visual identification, intercept with the patrol vessel and request frigate support',
            },
            nextNodeId: 'naval-intercept',
            scores: { tactical: 90, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Posicionarse en la ruta de las embarcaciones y bloquear el paso con advertencias de fuego',
              en: 'Position in the vessels\' route and block passage with fire warnings',
            },
            nextNodeId: 'naval-block',
            scores: { tactical: 65, risk: 55, leadership: 60 },
          },
          {
            text: {
              es: 'Seguir a distancia y reportar al Comando Naval sin intervenir hasta recibir órdenes',
              en: 'Follow at distance and report to Naval Command without intervening until receiving orders',
            },
            nextNodeId: 'naval-follow',
            scores: { tactical: 40, risk: 30, leadership: 35 },
          },
        ],
      },
      // PATH A: Helicopter + Intercept
      {
        id: 'naval-intercept',
        situation: {
          es: 'El helicóptero reporta: las 3 embarcaciones son lanchas rápidas tipo "go-fast" con modificaciones de alto rendimiento. Cada una lleva 4-5 tripulantes. Se observan bultos cubiertos con lonas. Al detectar el helicóptero, las lanchas se separan en tres direcciones diferentes. ¿Cómo prioriza?',
          en: 'The helicopter reports: the 3 vessels are "go-fast" speedboats with high-performance modifications. Each carries 4-5 crew. Covered bundles are observed. Upon detecting the helicopter, the boats split in three different directions. How do you prioritize?',
        },
        options: [
          {
            text: {
              es: 'Helicóptero sigue la más rápida, patrullera intercepta la más cercana, coordinación con guardacostas para la tercera',
              en: 'Helicopter follows the fastest, patrol vessel intercepts the nearest, coordinate with coast guard for the third',
            },
            nextNodeId: 'naval-intercept-split',
            scores: { tactical: 85, risk: 80, leadership: 90 },
          },
          {
            text: {
              es: 'Concentrar todos los recursos en la lancha más grande que lleva más carga',
              en: 'Concentrate all resources on the largest boat carrying the most cargo',
            },
            nextNodeId: 'naval-intercept-concentrate',
            scores: { tactical: 70, risk: 65, leadership: 65 },
          },
          {
            text: {
              es: 'Disparar ráfagas de advertencia frente a las tres embarcaciones simultáneamente desde el helicóptero',
              en: 'Fire warning bursts in front of all three vessels simultaneously from the helicopter',
            },
            nextNodeId: 'naval-intercept-warning',
            scores: { tactical: 55, risk: 50, leadership: 50 },
          },
        ],
      },
      // A1: Split pursuit
      {
        id: 'naval-intercept-split',
        situation: {
          es: 'La coordinación funciona. El helicóptero mantiene visual sobre la lancha norte (la más rápida). Su patrullera se acerca a la lancha este. La guardacostas confirma que una embarcación se dirige a interceptar la lancha sur. La lancha este, al ver la patrullera, comienza a arrojar bultos al mar. ¿Qué ordena?',
          en: 'Coordination works. The helicopter maintains visual on the northern boat (fastest). Your patrol vessel approaches the eastern boat. Coast guard confirms a vessel is heading to intercept the southern boat. The eastern boat, seeing the patrol vessel, begins throwing bundles overboard. What do you order?',
        },
        options: [
          {
            text: {
              es: 'Priorizar captura de la lancha antes que la carga — marcar posición GPS de los bultos para recuperación posterior',
              en: 'Prioritize boat capture over cargo — mark GPS position of bundles for later recovery',
            },
            nextNodeId: 'naval-intercept-split-capture',
            scores: { tactical: 90, risk: 85, leadership: 85 },
          },
          {
            text: {
              es: 'Dividir: bote inflable a recuperar los bultos mientras la patrullera persigue la lancha',
              en: 'Split: inflatable boat to recover bundles while patrol vessel pursues the speedboat',
            },
            nextNodeId: 'naval-intercept-split-divide',
            scores: { tactical: 75, risk: 70, leadership: 75 },
          },
        ],
      },
      {
        id: 'naval-intercept-split-capture',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO EXCELENTE: La lancha este fue interceptada tras una persecución de 20 minutos. 4 tripulantes capturados. Los bultos marcados por GPS fueron recuperados al amanecer: 800 kg de cocaína. El helicóptero guió a fuerzas de interceptación que capturaron la lancha norte. La guardacostas interceptó la lancha sur. Total: 3 lanchas, 13 detenidos, 2.4 toneladas de droga decomisada.',
          en: '✅ EXCELLENT RESULT: Eastern boat was intercepted after a 20-minute chase. 4 crew captured. GPS-marked bundles were recovered at dawn: 800 kg of cocaine. The helicopter guided interception forces that captured the northern boat. Coast guard intercepted the southern boat. Total: 3 boats, 13 detained, 2.4 tons of drugs seized.',
        },
        outcome: { es: 'Coordinación multiagencia excepcional. Priorización táctica perfecta.', en: 'Exceptional multi-agency coordination. Perfect tactical prioritization.' },
      },
      {
        id: 'naval-intercept-split-divide',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El bote inflable recuperó 500 kg de carga. Sin embargo, la lancha este, más rápida que la patrullera, logró escapar. La lancha norte fue capturada por el helicóptero que guió interceptores. La lancha sur fue interceptada por la guardacostas. Total: 2 de 3 lanchas capturadas, 8 detenidos. La división de recursos comprometió una captura.',
          en: '⚠️ RESULT: Inflatable boat recovered 500 kg of cargo. However, the eastern boat, faster than the patrol vessel, managed to escape. The northern boat was captured by helicopter-guided interceptors. Southern boat was intercepted by coast guard. Total: 2 of 3 boats captured, 8 detained. Resource division compromised one capture.',
        },
        outcome: { es: 'Buena operación parcial pero la lancha este escapó por dividir recursos.', en: 'Good partial operation but eastern boat escaped due to resource division.' },
      },
      // A2: Concentrate
      {
        id: 'naval-intercept-concentrate',
        situation: {
          es: 'Concentra todos los recursos en la lancha más grande. El helicóptero la ilumina con reflector y la patrullera se acerca. La lancha intenta evadir pero está más cargada y lenta. Las otras dos lanchas escapan a máxima velocidad aprovechando que nadie las persigue. La lancha grande finalmente se detiene. ¿Cómo procede con el abordaje?',
          en: 'You concentrate all resources on the largest boat. The helicopter illuminates it and the patrol vessel closes in. The boat tries to evade but is heavier and slower. The other two boats escape at maximum speed since no one pursues them. The large boat finally stops. How do you proceed with boarding?',
        },
        options: [
          {
            text: {
              es: 'Abordaje táctico con equipo de asalto desde el bote inflable mientras el helicóptero cubre',
              en: 'Tactical boarding with assault team from inflatable while helicopter provides cover',
            },
            nextNodeId: 'naval-intercept-concentrate-board',
            scores: { tactical: 75, risk: 70, leadership: 70 },
          },
          {
            text: {
              es: 'Ordenar a los tripulantes que se tiren al agua y se rindan antes de cualquier abordaje',
              en: 'Order crew to jump in the water and surrender before any boarding',
            },
            nextNodeId: 'naval-intercept-concentrate-surrender',
            scores: { tactical: 65, risk: 65, leadership: 60 },
          },
        ],
      },
      {
        id: 'naval-intercept-concentrate-board',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El abordaje fue exitoso. 5 tripulantes capturados, 1.2 toneladas de cocaína decomisadas. Sin embargo, las otras 2 lanchas escaparon con aproximadamente 1.2 toneladas adicionales. La concentración de recursos en un solo objetivo permitió la fuga de dos tercios de la operación de narcotráfico.',
          en: '⚠️ RESULT: Boarding was successful. 5 crew captured, 1.2 tons of cocaine seized. However, the other 2 boats escaped with approximately 1.2 additional tons. Concentrating resources on a single target allowed the escape of two-thirds of the drug trafficking operation.',
        },
        outcome: { es: 'Captura parcial. Debió coordinar con otras fuerzas para las lanchas restantes.', en: 'Partial capture. Should have coordinated with other forces for remaining boats.' },
      },
      {
        id: 'naval-intercept-concentrate-surrender',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: 3 tripulantes se rindieron y saltaron al agua. Los otros 2 intentaron destruir la carga prendiendo fuego a la lancha. El fuego fue controlado. Se recuperaron 900 kg de 1.2 toneladas. Las 2 lanchas restantes escaparon completamente. Resultado parcial con pérdida de evidencia.',
          en: '⚠️ RESULT: 3 crew surrendered and jumped into the water. The other 2 tried to destroy the cargo by setting fire to the boat. Fire was controlled. 900 kg of 1.2 tons were recovered. The 2 remaining boats escaped completely. Partial result with evidence loss.',
        },
        outcome: { es: 'Enfoque demasiado pasivo permitió destrucción de evidencia y fuga de 2 lanchas.', en: 'Overly passive approach allowed evidence destruction and escape of 2 boats.' },
      },
      // A3: Warning shots
      {
        id: 'naval-intercept-warning',
        situation: {
          es: 'Las ráfagas de advertencia causan pánico. Dos lanchas aceleran al máximo. Una lancha gira bruscamente y colisiona con otra — ambas quedan dañadas y a la deriva. La tercera lancha escapa a alta velocidad. Los tripulantes de las lanchas dañadas están en el agua. ¿Qué prioriza?',
          en: 'Warning bursts cause panic. Two boats accelerate to maximum. One boat turns sharply and collides with another — both are damaged and adrift. The third boat escapes at high speed. Crew from the damaged boats are in the water. What do you prioritize?',
        },
        options: [
          {
            text: {
              es: 'Rescate inmediato de los tripulantes en el agua — la vida es prioridad, asegurar las lanchas después',
              en: 'Immediate rescue of crew in the water — life is priority, secure boats afterwards',
            },
            nextNodeId: 'naval-intercept-warning-rescue',
            scores: { tactical: 60, risk: 65, leadership: 75 },
          },
          {
            text: {
              es: 'Asegurar las lanchas y la carga primero, luego rescatar a los tripulantes',
              en: 'Secure the boats and cargo first, then rescue the crew',
            },
            nextNodeId: 'naval-intercept-warning-secure',
            scores: { tactical: 50, risk: 40, leadership: 40 },
          },
        ],
      },
      {
        id: 'naval-intercept-warning-rescue',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: 8 tripulantes rescatados del agua, ninguna pérdida de vida. Las 2 lanchas dañadas aseguradas con 1.6 toneladas de cocaína. La tercera lancha escapó con aproximadamente 800 kg. Las ráfagas de advertencia causaron la colisión — una investigación examinará si el uso de fuerza fue proporcional. Resultado mixto.',
          en: '⚠️ RESULT: 8 crew rescued from water, no loss of life. 2 damaged boats secured with 1.6 tons of cocaine. Third boat escaped with approximately 800 kg. Warning bursts caused the collision — an investigation will examine whether force was proportional. Mixed result.',
        },
        outcome: { es: 'Las advertencias causaron un incidente. El rescate fue correcto pero la táctica inicial fue cuestionable.', en: 'Warnings caused an incident. Rescue was correct but initial tactic was questionable.' },
      },
      {
        id: 'naval-intercept-warning-secure',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Las lanchas fueron aseguradas pero 2 tripulantes fallecieron ahogados durante el tiempo que tomó asegurar la carga. Una investigación por violación de protocolos de rescate marítimo fue abierta. 1.6 toneladas decomisadas pero el costo humano y legal fue alto. La tercera lancha escapó.',
          en: '⚠️ RESULT: Boats were secured but 2 crew members drowned during the time taken to secure cargo. An investigation for violation of maritime rescue protocols was opened. 1.6 tons seized but the human and legal cost was high. Third boat escaped.',
        },
        outcome: { es: 'Priorización incorrecta. La vida humana siempre es prioridad sobre la carga.', en: 'Incorrect prioritization. Human life always takes priority over cargo.' },
      },
      // PATH B: Block
      {
        id: 'naval-block',
        situation: {
          es: 'Se posiciona en la ruta. Las lanchas detectan la patrullera a 3 millas. Dos lanchas cambian rumbo para rodearlo. La tercera acelera directamente hacia usted en aparente rumbo de colisión. A 1 milla de distancia, ¿qué ordena?',
          en: 'You position in the route. The boats detect the patrol vessel at 3 miles. Two boats change course to go around you. The third accelerates directly toward you on an apparent collision course. At 1 mile distance, what do you order?',
        },
        options: [
          {
            text: {
              es: 'Maniobra evasiva y disparos de advertencia al agua frente a la lancha que se acerca',
              en: 'Evasive maneuver and warning shots into the water in front of the approaching boat',
            },
            nextNodeId: 'naval-block-evade',
            scores: { tactical: 70, risk: 65, leadership: 70 },
          },
          {
            text: {
              es: 'Mantener posición firme — es un bluff, cambiarán de rumbo',
              en: 'Hold firm position — it\'s a bluff, they will change course',
            },
            nextNodeId: 'naval-block-hold',
            scores: { tactical: 35, risk: 25, leadership: 30 },
          },
        ],
      },
      {
        id: 'naval-block-evade',
        situation: {
          es: 'La maniobra evasiva funciona. La lancha pasa a 50 metros a alta velocidad. Los disparos de advertencia la frenan brevemente pero luego acelera. Ahora las 3 lanchas están detrás de usted dirigiéndose a la costa. Su patrullera es más lenta. El helicóptero está disponible. ¿Siguiente acción?',
          en: 'The evasive maneuver works. The boat passes 50 meters away at high speed. Warning shots slow it briefly but it then accelerates. Now all 3 boats are behind you heading for the coast. Your patrol vessel is slower. The helicopter is available. Next action?',
        },
        options: [
          {
            text: {
              es: 'Lanzar helicóptero y coordinar con unidades costeras para emboscada en la zona de desembarco',
              en: 'Launch helicopter and coordinate with coastal units for ambush at the landing zone',
            },
            nextNodeId: 'naval-block-evade-heli',
            scores: { tactical: 80, risk: 75, leadership: 80 },
          },
          {
            text: {
              es: 'Perseguir a máxima velocidad aunque no pueda alcanzarlas',
              en: 'Pursue at maximum speed even though unable to catch them',
            },
            nextNodeId: 'naval-block-evade-pursue',
            scores: { tactical: 40, risk: 35, leadership: 35 },
          },
        ],
      },
      {
        id: 'naval-block-evade-heli',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El helicóptero rastreó las lanchas hasta la zona de desembarco. Las unidades costeras montaron una emboscada y capturaron 2 de las 3 lanchas al desembarcar. 8 detenidos, 1.8 toneladas decomisadas. La tercera lancha escapó por una cala no vigilada. El bloqueo inicial falló pero la adaptación fue buena.',
          en: '⚠️ RESULT: The helicopter tracked the boats to the landing zone. Coastal units set an ambush and captured 2 of 3 boats upon landing. 8 detained, 1.8 tons seized. Third boat escaped through an unmonitored cove. Initial blockade failed but adaptation was good.',
        },
        outcome: { es: 'Buena adaptación tras un bloqueo fallido. La coordinación aérea-costera salvó la operación.', en: 'Good adaptation after a failed blockade. Air-coastal coordination saved the operation.' },
      },
      {
        id: 'naval-block-evade-pursue',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO: La persecución fue inútil — las lanchas son 17 nudos más rápidas. Se perdió contacto visual en 15 minutos. Las 3 lanchas desembarcaron sin oposición. 2.4 toneladas de droga ingresaron al país. El helicóptero no fue utilizado. La decisión de perseguir en lugar de coordinar fue un error grave.',
          en: '🔴 RESULT: The pursuit was futile — the boats are 17 knots faster. Visual contact was lost in 15 minutes. All 3 boats landed unopposed. 2.4 tons of drugs entered the country. The helicopter was not utilized. The decision to chase instead of coordinate was a serious error.',
        },
        outcome: { es: 'Fallo total. No utilizar el helicóptero y los recursos disponibles fue negligencia.', en: 'Total failure. Not utilizing the helicopter and available resources was negligence.' },
      },
      // PATH B2: Hold
      {
        id: 'naval-block-hold',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: No fue un bluff. La lancha impactó la proa de la patrullera a 40 nudos. 3 tripulantes de la patrullera resultaron heridos, uno de gravedad. La lancha quedó destruida y sus tripulantes fallecieron. Las otras 2 lanchas escaparon. La investigación determinó que mantener la posición ante un rumbo de colisión evidente fue negligencia grave que puso en peligro a su tripulación.',
          en: '🔴 CRITICAL RESULT: It was not a bluff. The boat impacted the patrol vessel\'s bow at 40 knots. 3 patrol crew were injured, one seriously. The speedboat was destroyed and its crew perished. The other 2 boats escaped. Investigation determined that holding position against an evident collision course was gross negligence that endangered your crew.',
        },
        outcome: { es: 'Negligencia grave. Puso en riesgo innecesario a su tripulación y causó muertes.', en: 'Gross negligence. Unnecessarily risked crew and caused deaths.' },
      },
      // PATH C: Follow
      {
        id: 'naval-follow',
        situation: {
          es: 'Sigue a distancia. Las lanchas mantienen rumbo a la costa a 45 nudos — usted las pierde gradualmente. El Comando Naval responde después de 25 minutos: "Intercepte y detenga. Use fuerza si es necesario." Pero las lanchas ya están a 15 millas de ventaja y cerca de la costa. ¿Qué hace?',
          en: 'You follow at distance. The boats maintain course to the coast at 45 knots — you gradually fall behind. Naval Command responds after 25 minutes: "Intercept and detain. Use force if necessary." But the boats are already 15 miles ahead and near the coast. What do you do?',
        },
        options: [
          {
            text: {
              es: 'Lanzar helicóptero de emergencia y transmitir coordenadas a todas las unidades costeras',
              en: 'Emergency helicopter launch and transmit coordinates to all coastal units',
            },
            nextNodeId: 'naval-follow-heli',
            scores: { tactical: 55, risk: 50, leadership: 50 },
          },
          {
            text: {
              es: 'Continuar siguiendo a máxima velocidad para al menos identificar el punto de desembarco',
              en: 'Continue following at max speed to at least identify the landing point',
            },
            nextNodeId: 'naval-follow-continue',
            scores: { tactical: 35, risk: 30, leadership: 30 },
          },
        ],
      },
      {
        id: 'naval-follow-heli',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El helicóptero llegó tarde — las lanchas ya estaban desembarcando. Logró identificar la ubicación y transmitirla. Fuerzas terrestres capturaron a 4 individuos y 600 kg de droga. Pero 2 lanchas escaparon con la mayoría de la carga (1.8 toneladas). La demora de 25 minutos esperando órdenes fue considerada un error de liderazgo.',
          en: '⚠️ RESULT: Helicopter arrived late — boats were already landing. It managed to identify the location and transmit it. Ground forces captured 4 individuals and 600 kg of drugs. But 2 boats escaped with most cargo (1.8 tons). The 25-minute delay waiting for orders was considered a leadership error.',
        },
        outcome: { es: 'Pasividad inicial costó la operación. La espera de órdenes fue injustificada.', en: 'Initial passivity cost the operation. Waiting for orders was unjustified.' },
      },
      {
        id: 'naval-follow-continue',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: Perdió contacto visual completamente. Las 3 lanchas desembarcaron en una playa no vigilada. 2.4 toneladas de cocaína ingresaron al país sin oposición. No se realizaron capturas. El Comando Naval cuestionó por qué no lanzó el helicóptero, no coordinó con guardacostas y no tomó la iniciativa. Su pasividad fue clasificada como fallo total de mando.',
          en: '🔴 CRITICAL RESULT: You lost visual contact completely. All 3 boats landed on an unmonitored beach. 2.4 tons of cocaine entered the country unopposed. No captures were made. Naval Command questioned why you didn\'t launch the helicopter, coordinate with coast guard, or take initiative. Your passivity was classified as total command failure.',
        },
        outcome: { es: 'Fallo catastrófico de liderazgo. Pasividad total ante amenaza evidente.', en: 'Catastrophic leadership failure. Total passivity against evident threat.' },
      },
    ],
  },

  // =====================================================
  // SIMULATION 6: ANTI-NARCOTICS OPERATION
  // =====================================================
  {
    id: 'operacion-antinarcoticos',
    title: {
      es: 'Operación Antinarcóticos',
      en: 'Anti-Narcotics Operation',
    },
    description: {
      es: 'Inteligencia ha identificado un laboratorio de procesamiento de drogas en zona selvática. Como comandante de la unidad antinarcóticos, debe planificar y ejecutar la operación de desmantelamiento.',
      en: 'Intelligence has identified a drug processing laboratory in a jungle zone. As anti-narcotics unit commander, you must plan and execute the dismantling operation.',
    },
    difficulty: 'critical',
    category: { es: 'Operaciones Antinarcóticos', en: 'Anti-Narcotics Operations' },
    estimatedTime: 30,
    startNodeId: 'narco-start',
    nodes: [
      {
        id: 'narco-start',
        situation: {
          es: '🔴 OPERACIÓN "TRUENO VERDE": Inteligencia confirma un laboratorio de procesamiento de cocaína en la selva a 45 km de la población más cercana. Imágenes satelitales muestran: 3 estructuras principales, pista aérea clandestina de 600m, al menos 20 individuos armados con rifles automáticos, y un campamento periférico con civiles (posibles trabajadores forzados). Su unidad tiene 40 efectivos especializados, 2 helicópteros Black Hawk, apoyo de un avión de reconocimiento, y una ventana de 48 horas antes de que el laboratorio sea reubicado según inteligencia. ¿Cómo planifica la operación?',
          en: '🔴 OPERATION "GREEN THUNDER": Intelligence confirms a cocaine processing laboratory in the jungle 45 km from the nearest town. Satellite imagery shows: 3 main structures, 600m clandestine airstrip, at least 20 armed individuals with automatic rifles, and a peripheral camp with civilians (possible forced laborers). Your unit has 40 specialized personnel, 2 Black Hawk helicopters, reconnaissance aircraft support, and a 48-hour window before the lab is relocated per intelligence. How do you plan the operation?',
        },
        options: [
          {
            text: {
              es: 'Inserción nocturna por helicóptero con dos equipos: asalto al laboratorio y bloqueo de rutas de escape. Reconocimiento previo con drones',
              en: 'Nighttime helicopter insertion with two teams: lab assault and escape route blocking. Prior drone reconnaissance',
            },
            nextNodeId: 'narco-night-assault',
            scores: { tactical: 90, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Aproximación terrestre sigilosa durante 2 días, establecer perímetro y asaltar al amanecer del tercer día',
              en: 'Stealthy ground approach over 2 days, establish perimeter and assault at dawn on day 3',
            },
            nextNodeId: 'narco-ground',
            scores: { tactical: 70, risk: 60, leadership: 65 },
          },
          {
            text: {
              es: 'Bombardeo aéreo de la pista para inutilizarla, seguido de asalto helitransportado inmediato',
              en: 'Air strike on the airstrip to disable it, followed by immediate heliborne assault',
            },
            nextNodeId: 'narco-airstrike',
            scores: { tactical: 55, risk: 45, leadership: 50 },
          },
        ],
      },
      // PATH A: Night assault
      {
        id: 'narco-night-assault',
        situation: {
          es: 'Los drones de reconocimiento revelan información crucial: hay un cuarto edificio camuflado — un depósito subterráneo. Los centinelas rotan cada 2 horas con un punto ciego de 15 minutos al noroeste. El campamento civil tiene 12 personas incluyendo 3 menores. Los narcos tienen un sistema de alarma por radio y posiblemente minas antipersonal en el sendero principal. ¿Cómo ajusta el plan?',
          en: 'Reconnaissance drones reveal crucial information: there is a fourth camouflaged building — an underground depot. Sentries rotate every 2 hours with a 15-minute blind spot to the northwest. The civilian camp has 12 people including 3 minors. The narcos have a radio alarm system and possibly anti-personnel mines on the main trail. How do you adjust the plan?',
        },
        options: [
          {
            text: {
              es: 'Equipo Alpha ingresa por el punto ciego noroeste, equipo Bravo bloquea salidas, equipo Charlie asegura el campamento civil primero. Inhibidores de radio activados 5 minutos antes',
              en: 'Alpha team enters through northwest blind spot, Bravo team blocks exits, Charlie team secures civilian camp first. Radio jammers activated 5 minutes before',
            },
            nextNodeId: 'narco-night-coordinated',
            scores: { tactical: 95, risk: 90, leadership: 95 },
          },
          {
            text: {
              es: 'Inserción directa sobre el laboratorio con los dos helicópteros simultáneamente — velocidad es la prioridad',
              en: 'Direct insertion over the lab with both helicopters simultaneously — speed is the priority',
            },
            nextNodeId: 'narco-night-direct',
            scores: { tactical: 60, risk: 50, leadership: 55 },
          },
          {
            text: {
              es: 'Enviar primero un equipo de zapadores para desactivar minas, luego proceder con el asalto',
              en: 'Send a sapper team first to deactivate mines, then proceed with the assault',
            },
            nextNodeId: 'narco-night-sappers',
            scores: { tactical: 70, risk: 65, leadership: 65 },
          },
        ],
      },
      // A1: Coordinated assault
      {
        id: 'narco-night-coordinated',
        situation: {
          es: 'Los inhibidores de radio se activan. Equipo Charlie asegura el campamento civil sin disparos — los civiles cooperan y confirman ser trabajadores forzados. Equipo Alpha ingresa por el punto ciego. Equipo Bravo está en posición. Al llegar Alpha al laboratorio principal, un centinela que no estaba en el patrón detectado activa una alarma manual (campana). Los narcos comienzan a movilizarse. ¿Cómo reacciona?',
          en: 'Radio jammers activate. Charlie team secures civilian camp without shots — civilians cooperate and confirm being forced laborers. Alpha team enters through the blind spot. Bravo team is in position. As Alpha reaches the main lab, a sentry not in the detected pattern activates a manual alarm (bell). Narcos begin to mobilize. How do you react?',
        },
        options: [
          {
            text: {
              es: 'Orden inmediata de asalto a Alpha y Bravo simultáneamente — aprovechar los 30 segundos de confusión antes de que se organicen',
              en: 'Immediate assault order to Alpha and Bravo simultaneously — exploit the 30 seconds of confusion before they organize',
            },
            nextNodeId: 'narco-night-coordinated-assault',
            scores: { tactical: 90, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Alpha se repliega al punto ciego. Esperar a que la confusión se calme y reintentar cuando bajen la guardia',
              en: 'Alpha falls back to the blind spot. Wait for confusion to settle and retry when they lower their guard',
            },
            nextNodeId: 'narco-night-coordinated-wait',
            scores: { tactical: 45, risk: 40, leadership: 40 },
          },
        ],
      },
      {
        id: 'narco-night-coordinated-assault',
        situation: {
          es: 'El asalto simultáneo es devastador. Alpha toma el laboratorio principal en 4 minutos. Bravo intercepta a 6 individuos que intentaban huir por la pista aérea. 14 narcos capturados, 3 heridos leves entre los hostiles, cero bajas propias. Sin embargo, durante el registro descubren que el depósito subterráneo tiene una puerta blindada con explosivos conectados — una trampa. ¿Cómo procede?',
          en: 'The simultaneous assault is devastating. Alpha takes the main lab in 4 minutes. Bravo intercepts 6 individuals trying to flee via the airstrip. 14 narcos captured, 3 lightly wounded hostiles, zero friendly casualties. However, during the search they discover the underground depot has an armored door connected to explosives — a trap. How do you proceed?',
        },
        options: [
          {
            text: {
              es: 'Evacuar un perímetro de 100m, traer al equipo de desactivación de explosivos y asegurar que ningún detenido pueda activar un detonador remoto',
              en: 'Evacuate a 100m perimeter, bring the bomb disposal team and ensure no detainee can activate a remote detonator',
            },
            nextNodeId: 'narco-night-coordinated-assault-safe',
            scores: { tactical: 90, risk: 95, leadership: 90 },
          },
          {
            text: {
              es: 'Forzar la entrada rápidamente antes de que alguien active los explosivos de forma remota',
              en: 'Force entry quickly before someone activates the explosives remotely',
            },
            nextNodeId: 'narco-night-coordinated-assault-force',
            scores: { tactical: 40, risk: 25, leadership: 30 },
          },
        ],
      },
      {
        id: 'narco-night-coordinated-assault-safe',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO EXCELENTE: El equipo de explosivos desactivó la trampa en 45 minutos. El depósito contenía 4 toneladas de cocaína procesada, $2 millones en efectivo, registros contables y equipos de comunicación satelital con contactos internacionales. 14 detenidos, 12 civiles rescatados (incluyendo 3 menores), cero bajas. Laboratorio completamente desmantelado. La evidencia contable permitió desarticular 3 redes de distribución adicionales. Operación modelo.',
          en: '✅ EXCELLENT RESULT: Bomb squad deactivated the trap in 45 minutes. The depot contained 4 tons of processed cocaine, $2 million in cash, accounting records, and satellite communication equipment with international contacts. 14 detained, 12 civilians rescued (including 3 minors), zero casualties. Lab completely dismantled. Accounting evidence allowed dismantling 3 additional distribution networks. Model operation.',
        },
        outcome: { es: 'Operación perfecta. Planificación, ejecución y adaptación excepcionales.', en: 'Perfect operation. Exceptional planning, execution, and adaptation.' },
      },
      {
        id: 'narco-night-coordinated-assault-force',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: Al forzar la puerta, los explosivos detonaron. La explosión destruyó el depósito subterráneo y causó un incendio masivo. 2 de sus efectivos resultaron gravemente heridos. Toda la evidencia del depósito fue destruida. La cocaína, el dinero y los registros se perdieron. El laboratorio fue destruido pero sin evidencia, los casos judiciales contra los detenidos se debilitaron significativamente.',
          en: '🔴 CRITICAL RESULT: Upon forcing the door, the explosives detonated. The explosion destroyed the underground depot and caused a massive fire. 2 of your personnel were seriously injured. All depot evidence was destroyed. Cocaine, money, and records were lost. The lab was destroyed but without evidence, judicial cases against detainees were significantly weakened.',
        },
        outcome: { es: 'Imprudencia costosa. La prisa por acceder al depósito causó bajas y pérdida de evidencia.', en: 'Costly recklessness. Rushing to access the depot caused casualties and evidence loss.' },
      },
      // A1b: Wait after alarm
      {
        id: 'narco-night-coordinated-wait',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Mientras esperaba, los narcos organizaron su defensa, destruyeron documentos y comenzaron a evacuar carga por un túnel no detectado. Cuando finalmente atacó 40 minutos después, capturó a solo 8 individuos. Se decomisó 1 tonelada de cocaína pero se estima que evacuaron al menos 3 toneladas por el túnel. Los documentos destruidos comprometieron la investigación. Oportunidad perdida.',
          en: '⚠️ RESULT: While waiting, narcos organized their defense, destroyed documents, and began evacuating cargo through an undetected tunnel. When you finally attacked 40 minutes later, you captured only 8 individuals. 1 ton of cocaine was seized but an estimated 3 tons were evacuated through the tunnel. Destroyed documents compromised the investigation. Opportunity lost.',
        },
        outcome: { es: 'La indecisión permitió que el enemigo se organizara y destruyera evidencia.', en: 'Indecision allowed the enemy to organize and destroy evidence.' },
      },
      // A2: Direct insertion
      {
        id: 'narco-night-direct',
        situation: {
          es: 'Los helicópteros se aproximan. A 2 km, los narcos escuchan el ruido de los rotores y activan la alarma. Comienzan a disparar trazadoras hacia los helicópteros. Un RPG pasa a 30 metros del Black Hawk líder. Los pilotos solicitan autorización para abortar. ¿Qué ordena?',
          en: 'Helicopters approach. At 2 km, narcos hear the rotor noise and activate the alarm. They begin firing tracers at the helicopters. An RPG passes 30 meters from the lead Black Hawk. Pilots request authorization to abort. What do you order?',
        },
        options: [
          {
            text: {
              es: 'Abortar inserción directa, reposicionar helicópteros a 3 km y desembarcar para aproximación terrestre',
              en: 'Abort direct insertion, reposition helicopters 3 km out and disembark for ground approach',
            },
            nextNodeId: 'narco-night-direct-abort',
            scores: { tactical: 65, risk: 70, leadership: 70 },
          },
          {
            text: {
              es: 'Continuar la inserción — la velocidad y sorpresa aún están de nuestro lado',
              en: 'Continue insertion — speed and surprise are still on our side',
            },
            nextNodeId: 'narco-night-direct-continue',
            scores: { tactical: 35, risk: 20, leadership: 25 },
          },
        ],
      },
      {
        id: 'narco-night-direct-abort',
        situation: {
          es: 'Los helicópteros aterrizan a 3 km. Sus equipos comienzan la aproximación terrestre pero es de noche en selva densa. El avance es lento — 1 km por hora. Los narcos tienen 3 horas para prepararse o huir. A mitad de camino, un explorador reporta que los narcos están cargando vehículos para escapar por un camino oculto. ¿Cómo reacciona?',
          en: 'Helicopters land 3 km out. Your teams begin ground approach but it\'s night in dense jungle. Progress is slow — 1 km per hour. Narcos have 3 hours to prepare or flee. Halfway, a scout reports narcos are loading vehicles to escape via a hidden road. How do you react?',
        },
        options: [
          {
            text: {
              es: 'Enviar un helicóptero a bloquear el camino de escape mientras el equipo continúa la aproximación',
              en: 'Send one helicopter to block the escape road while the team continues approach',
            },
            nextNodeId: 'narco-night-direct-abort-block',
            scores: { tactical: 75, risk: 70, leadership: 75 },
          },
          {
            text: {
              es: 'Acelerar la aproximación terrestre aceptando el riesgo de minas y emboscadas',
              en: 'Accelerate ground approach accepting the risk of mines and ambushes',
            },
            nextNodeId: 'narco-night-direct-abort-rush',
            scores: { tactical: 45, risk: 35, leadership: 40 },
          },
        ],
      },
      {
        id: 'narco-night-direct-abort-block',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El helicóptero bloqueó el camino de escape. Los narcos abandonaron los vehículos y huyeron a pie por la selva. Cuando su equipo llegó al laboratorio, encontraron 2 toneladas de cocaína y el equipo de procesamiento intacto, pero solo capturaron a 6 individuos — los más lentos. Los líderes escaparon. Documentos parcialmente destruidos. Resultado moderado.',
          en: '⚠️ RESULT: Helicopter blocked the escape road. Narcos abandoned vehicles and fled on foot through the jungle. When your team reached the lab, they found 2 tons of cocaine and intact processing equipment but only captured 6 individuals — the slowest. Leaders escaped. Documents partially destroyed. Moderate result.',
        },
        outcome: { es: 'La inserción directa alertó al enemigo. La adaptación fue correcta pero tardía.', en: 'Direct insertion alerted the enemy. Adaptation was correct but late.' },
      },
      {
        id: 'narco-night-direct-abort-rush',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: Al acelerar, un equipo activó una mina antipersonal. 1 efectivo herido grave, 2 leves. La explosión alertó a los narcos de su posición exacta. Recibieron fuego emboscado. Otro herido. Cuando finalmente llegaron al laboratorio, estaba vacío — solo quedaban restos de químicos y hogueras de documentos quemados. Total: 4 heridos, cero capturas, cero decomiso.',
          en: '🔴 CRITICAL RESULT: While rushing, a team triggered an anti-personnel mine. 1 seriously wounded, 2 lightly. The explosion alerted narcos to their exact position. They took ambush fire. Another wounded. When they finally reached the lab, it was empty — only chemical residue and bonfires of burned documents remained. Total: 4 wounded, zero captures, zero seizures.',
        },
        outcome: { es: 'Fallo total. La precipitación causó bajas y permitió la fuga completa.', en: 'Total failure. Rushing caused casualties and allowed complete escape.' },
      },
      // A2b: Continue insertion
      {
        id: 'narco-night-direct-continue',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: Un segundo RPG impactó la cola del Black Hawk 2. El helicóptero realizó un aterrizaje de emergencia a 500m del laboratorio. 3 tripulantes heridos. El Black Hawk 1 completó la inserción bajo fuego pero su equipo quedó separado y bajo fuego cruzado. Tras una hora de combate, capturaron el laboratorio pero con 5 heridos (1 grave). Solo 8 narcos capturados. El costo humano fue inaceptablemente alto.',
          en: '🔴 CRITICAL RESULT: A second RPG hit Black Hawk 2\'s tail. The helicopter made an emergency landing 500m from the lab. 3 crew wounded. Black Hawk 1 completed insertion under fire but the team was separated and under crossfire. After an hour of combat, they captured the lab with 5 wounded (1 serious). Only 8 narcos captured. The human cost was unacceptably high.',
        },
        outcome: { es: 'Imprudencia extrema. Continuar bajo fuego RPG fue negligencia que causó bajas graves.', en: 'Extreme recklessness. Continuing under RPG fire was negligence that caused serious casualties.' },
      },
      // A3: Sappers first
      {
        id: 'narco-night-sappers',
        situation: {
          es: 'El equipo de zapadores avanza lentamente desactivando minas. Encuentran 6 minas en el sendero principal. El proceso toma 3 horas — la ventana de oscuridad se reduce. El avión de reconocimiento reporta que hay actividad inusual en el laboratorio: están quemando algo. Parece que sospechan. ¿Qué decide?',
          en: 'The sapper team advances slowly deactivating mines. They find 6 mines on the main trail. The process takes 3 hours — the darkness window is shrinking. The reconnaissance aircraft reports unusual activity at the lab: they are burning something. They seem suspicious. What do you decide?',
        },
        options: [
          {
            text: {
              es: 'Lanzar asalto inmediato por ruta alternativa sin desminado, usando las minas desactivadas como distracción',
              en: 'Launch immediate assault via alternate route without mine clearing, using deactivated mines as distraction',
            },
            nextNodeId: 'narco-night-sappers-alternative',
            scores: { tactical: 70, risk: 60, leadership: 70 },
          },
          {
            text: {
              es: 'Completar el desminado — la seguridad del equipo es primero',
              en: 'Complete mine clearing — team safety is first',
            },
            nextNodeId: 'narco-night-sappers-complete',
            scores: { tactical: 50, risk: 55, leadership: 55 },
          },
        ],
      },
      {
        id: 'narco-night-sappers-alternative',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La ruta alternativa no tenía minas pero era más difícil. El asalto llegó al amanecer. Los narcos habían quemado la mayoría de los documentos pero no lograron evacuar la droga. 2.5 toneladas decomisadas. 10 capturados, 10 huyeron por senderos no cubiertos. Sin documentos, la investigación quedó limitada. Resultado aceptable con deficiencias.',
          en: '⚠️ RESULT: The alternate route had no mines but was harder. The assault arrived at dawn. Narcos had burned most documents but couldn\'t evacuate the drugs. 2.5 tons seized. 10 captured, 10 fled through uncovered trails. Without documents, investigation was limited. Acceptable result with deficiencies.',
        },
        outcome: { es: 'Adaptación aceptable pero el enfoque inicial en zapadores causó pérdida de tiempo crucial.', en: 'Acceptable adaptation but initial focus on sappers caused loss of crucial time.' },
      },
      {
        id: 'narco-night-sappers-complete',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El desminado se completó al amanecer. Cuando el equipo llegó al laboratorio, la mitad de los narcos habían huido. Documentos y registros completamente quemados. Se decomisaron 1.5 toneladas (de un estimado de 4). 7 individuos capturados, la mayoría trabajadores de bajo rango. Los líderes escaparon. La excesiva cautela con las minas comprometió la misión.',
          en: '⚠️ RESULT: Mine clearing was completed at dawn. When the team reached the lab, half the narcos had fled. Documents and records completely burned. 1.5 tons seized (of an estimated 4). 7 individuals captured, mostly low-rank workers. Leaders escaped. Excessive caution with mines compromised the mission.',
        },
        outcome: { es: 'Exceso de precaución. La seguridad del sendero se logró pero la misión se comprometió.', en: 'Excessive caution. Trail safety was achieved but the mission was compromised.' },
      },
      // PATH B: Ground approach
      {
        id: 'narco-ground',
        situation: {
          es: 'Día 1 de aproximación terrestre. Su equipo avanza 20 km a pie por la selva. A las 1600 horas, un explorador detecta un puesto de vigilancia avanzado de los narcos — 2 hombres armados con radio a 5 km del laboratorio. No han detectado a su equipo. ¿Cómo procede?',
          en: 'Day 1 of ground approach. Your team advances 20 km on foot through the jungle. At 1600 hours, a scout detects an advanced narco lookout post — 2 armed men with radio 5 km from the lab. They haven\'t detected your team. How do you proceed?',
        },
        options: [
          {
            text: {
              es: 'Captura silenciosa con equipo especializado — evitar que alerten al laboratorio',
              en: 'Silent capture with specialized team — prevent them from alerting the lab',
            },
            nextNodeId: 'narco-ground-silent',
            scores: { tactical: 85, risk: 80, leadership: 80 },
          },
          {
            text: {
              es: 'Rodear el puesto de vigilancia sin hacer contacto y continuar la aproximación',
              en: 'Bypass the lookout post without contact and continue approach',
            },
            nextNodeId: 'narco-ground-bypass',
            scores: { tactical: 65, risk: 60, leadership: 60 },
          },
        ],
      },
      {
        id: 'narco-ground-silent',
        situation: {
          es: 'La captura silenciosa fue exitosa — 2 vigías capturados sin que transmitieran por radio. Bajo interrogatorio rápido, revelan que hay 3 puestos de vigilancia más y que el laboratorio tiene un túnel de escape. También confirman la presencia de civiles forzados. Con esta nueva inteligencia, ¿cómo ajusta su plan para el asalto del Día 2?',
          en: 'Silent capture was successful — 2 lookouts captured without radio transmission. Under rapid questioning, they reveal there are 3 more lookout posts and the lab has an escape tunnel. They also confirm the presence of forced civilians. With this new intelligence, how do you adjust your Day 2 assault plan?',
        },
        options: [
          {
            text: {
              es: 'Neutralizar los 3 puestos restantes en secuencia silenciosa durante la noche, bloquear el túnel al amanecer y asaltar',
              en: 'Neutralize 3 remaining posts in silent sequence overnight, block tunnel at dawn and assault',
            },
            nextNodeId: 'narco-ground-silent-sequence',
            scores: { tactical: 90, risk: 85, leadership: 90 },
          },
          {
            text: {
              es: 'Ignorar los puestos restantes, avanzar directamente al laboratorio y asaltar de madrugada',
              en: 'Ignore remaining posts, advance directly to lab and assault in early morning',
            },
            nextNodeId: 'narco-ground-silent-direct',
            scores: { tactical: 50, risk: 40, leadership: 45 },
          },
        ],
      },
      {
        id: 'narco-ground-silent-sequence',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO EXCELENTE: Los 3 puestos de vigilancia fueron neutralizados silenciosamente durante la noche. El túnel fue bloqueado al amanecer por un equipo dedicado. El asalto a las 0530 fue una sorpresa total. 18 narcos capturados, incluidos 2 líderes. 3.8 toneladas de cocaína, $1.5 millones, equipos de comunicación y documentación completa decomisada. 12 civiles rescatados. Cero bajas. Laboratorio completamente desmantelado.',
          en: '✅ EXCELLENT RESULT: All 3 lookout posts were silently neutralized overnight. Tunnel was blocked at dawn by a dedicated team. The 0530 assault was a total surprise. 18 narcos captured, including 2 leaders. 3.8 tons of cocaine, $1.5 million, communication equipment and complete documentation seized. 12 civilians rescued. Zero casualties. Lab completely dismantled.',
        },
        outcome: { es: 'Operación impecable. Paciencia, inteligencia y ejecución coordinada perfecta.', en: 'Flawless operation. Patience, intelligence, and perfect coordinated execution.' },
      },
      {
        id: 'narco-ground-silent-direct',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: Al pasar cerca de un puesto de vigilancia no neutralizado, fue detectado. La alarma se activó con 20 minutos de anticipación. Los narcos comenzaron a destruir evidencia y evacuar por el túnel. Cuando llegó al laboratorio, capturó a 9 individuos y decomisó 1.5 toneladas. Pero los líderes y la documentación se perdieron por el túnel. Si hubiera bloqueado el túnel, el resultado habría sido muy diferente.',
          en: '⚠️ RESULT: While passing near an un-neutralized lookout post, you were detected. Alarm activated 20 minutes early. Narcos began destroying evidence and evacuating through the tunnel. When you reached the lab, you captured 9 individuals and seized 1.5 tons. But leaders and documentation were lost through the tunnel. Had you blocked the tunnel, the result would have been very different.',
        },
        outcome: { es: 'Buena captura de inteligencia inicial pero mal aprovechada.', en: 'Good initial intelligence capture but poorly utilized.' },
      },
      // B2: Bypass
      {
        id: 'narco-ground-bypass',
        situation: {
          es: 'Rodea el puesto exitosamente pero pierde 4 horas de marcha. El Día 2, al llegar al perímetro del laboratorio, descubre que los vigías del puesto hacen una verificación por radio cada 4 horas. La próxima verificación es en 30 minutos. Si no responden (porque no los capturó), la alarma se activará. ¿Qué hace?',
          en: 'You bypass the post successfully but lose 4 hours of march. Day 2, upon reaching the lab perimeter, you discover the post lookouts do a radio check-in every 4 hours. The next check-in is in 30 minutes. If they don\'t respond (because you didn\'t capture them), the alarm will activate. What do you do?',
        },
        options: [
          {
            text: {
              es: 'Asalto inmediato antes de la próxima verificación de radio — 30 minutos para completar la operación',
              en: 'Immediate assault before the next radio check — 30 minutes to complete the operation',
            },
            nextNodeId: 'narco-ground-bypass-rush',
            scores: { tactical: 70, risk: 65, leadership: 70 },
          },
          {
            text: {
              es: 'Enviar un equipo a capturar silenciosamente el puesto de vigilancia ahora y simular la verificación por radio',
              en: 'Send a team to silently capture the lookout post now and simulate the radio check-in',
            },
            nextNodeId: 'narco-ground-bypass-simulate',
            scores: { tactical: 80, risk: 75, leadership: 80 },
          },
        ],
      },
      {
        id: 'narco-ground-bypass-rush',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: El asalto apresurado logró tomar el laboratorio en 25 minutos pero con resistencia organizada. 2 de sus efectivos heridos leves. 12 narcos capturados. 2.5 toneladas decomisadas. Pero la documentación fue parcialmente destruida durante los 25 minutos de combate. Los civiles no fueron afectados pero estuvieron en riesgo durante el fuego cruzado. Resultado aceptable pero mejorable.',
          en: '⚠️ RESULT: The rushed assault took the lab in 25 minutes but faced organized resistance. 2 of your personnel lightly wounded. 12 narcos captured. 2.5 tons seized. But documentation was partially destroyed during 25 minutes of combat. Civilians were not harmed but were at risk during crossfire. Acceptable but improvable result.',
        },
        outcome: { es: 'El haber ignorado los puestos de vigilancia complicó la operación.', en: 'Having ignored the lookout posts complicated the operation.' },
      },
      {
        id: 'narco-ground-bypass-simulate',
        isFinal: true,
        situation: {
          es: '✅ RESULTADO: El equipo capturó el puesto y simuló la verificación exitosamente. Esto ganó 4 horas adicionales para un asalto planificado. El ataque coordinado capturó 16 narcos, 3.2 toneladas de cocaína y documentación casi completa. 12 civiles rescatados. 1 herido leve propio. El error de no capturar el puesto inicialmente fue compensado por la rápida adaptación.',
          en: '✅ RESULT: The team captured the post and successfully simulated the check-in. This gained 4 additional hours for a planned assault. The coordinated attack captured 16 narcos, 3.2 tons of cocaine and nearly complete documentation. 12 civilians rescued. 1 own lightly wounded. The mistake of not capturing the post initially was compensated by rapid adaptation.',
        },
        outcome: { es: 'Buena adaptación. La simulación de radio fue una solución creativa e inteligente.', en: 'Good adaptation. The radio simulation was a creative and intelligent solution.' },
      },
      // PATH C: Air strike
      {
        id: 'narco-airstrike',
        situation: {
          es: 'El bombardeo destruye 200m de la pista aérea. La explosión alerta a todo el campamento. Los narcos activan defensas y comienzan a evacuar. Los helicópteros se aproximan para el asalto pero desde tierra disparan armas automáticas y un RPG. Además, los civiles del campamento periférico corren en pánico en todas direcciones. ¿Cómo ejecuta la inserción?',
          en: 'The bombing destroys 200m of the airstrip. The explosion alerts the entire camp. Narcos activate defenses and begin evacuating. Helicopters approach for the assault but ground fire includes automatic weapons and an RPG. Additionally, civilians from the peripheral camp are running in panic in all directions. How do you execute the insertion?',
        },
        options: [
          {
            text: {
              es: 'Inserción a 1 km de distancia para evitar fuego directo, aproximación terrestre rápida priorizando protección de civiles',
              en: 'Insertion 1 km away to avoid direct fire, rapid ground approach prioritizing civilian protection',
            },
            nextNodeId: 'narco-airstrike-distant',
            scores: { tactical: 65, risk: 60, leadership: 70 },
          },
          {
            text: {
              es: 'Inserción directa en la pista destruida — es el único claro para aterrizar',
              en: 'Direct insertion on the destroyed airstrip — it\'s the only clearing to land',
            },
            nextNodeId: 'narco-airstrike-direct',
            scores: { tactical: 40, risk: 30, leadership: 35 },
          },
        ],
      },
      {
        id: 'narco-airstrike-distant',
        isFinal: true,
        situation: {
          es: '⚠️ RESULTADO: La aproximación terrestre tomó 45 minutos. Los narcos usaron ese tiempo para destruir documentos y evacuar 2 toneladas de droga por caminos ocultos. Cuando llegó al laboratorio, decomisó 1.5 toneladas y capturó a 8 individuos. Los civiles fueron asegurados pero 2 estaban heridos por la explosión inicial del bombardeo. El bombardeo previo fue cuestionado éticamente por la presencia de civiles conocidos.',
          en: '⚠️ RESULT: Ground approach took 45 minutes. Narcos used that time to destroy documents and evacuate 2 tons of drugs via hidden paths. When you reached the lab, you seized 1.5 tons and captured 8 individuals. Civilians were secured but 2 were injured by the initial bombing explosion. The prior bombing was ethically questioned due to known civilian presence.',
        },
        outcome: { es: 'El bombardeo alertó al enemigo y puso civiles en riesgo. Resultado parcial.', en: 'Bombing alerted the enemy and endangered civilians. Partial result.' },
      },
      {
        id: 'narco-airstrike-direct',
        isFinal: true,
        situation: {
          es: '🔴 RESULTADO CRÍTICO: La pista destruida tenía cráteres que hicieron imposible un aterrizaje seguro. Un Black Hawk dañó su tren de aterrizaje. 4 efectivos heridos en el aterrizaje forzoso. Bajo fuego desde múltiples posiciones mientras intentaban desembarcar. Otro herido grave. Cuando finalmente tomaron el laboratorio, habían sufrido 6 bajas (1 grave). La mayoría de los narcos habían huido. Solo 1 tonelada decomisada de 4 estimadas. El bombardeo previo fue un error desde el inicio.',
          en: '🔴 CRITICAL RESULT: The destroyed airstrip had craters making safe landing impossible. One Black Hawk damaged its landing gear. 4 personnel injured in forced landing. Under fire from multiple positions while trying to disembark. Another seriously wounded. When they finally took the lab, they had 6 casualties (1 serious). Most narcos had fled. Only 1 ton seized of an estimated 4. The prior bombing was a mistake from the start.',
        },
        outcome: { es: 'Fallo catastrófico. El bombardeo eliminó la única zona de aterrizaje y alertó al enemigo.', en: 'Catastrophic failure. The bombing eliminated the only landing zone and alerted the enemy.' },
      },
    ],
  },
];
