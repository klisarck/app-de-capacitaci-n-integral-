
# Plataforma de Capacitación Integral y Control de Estudios de Cadetes

Aplicación web automatizada y protegida diseñada para la gestión del plan de estudios y el progreso de conocimientos militares.

## 1. Paridad de Entornos
Las variables de entorno necesarias para levantar el proyecto de forma local se detallan en el archivo `.env.example`.

---

## 2. Arquitectura del Sistema (Doc-as-Code)

```mermaid
graph TD
    User((Usuario)) --> FE[Frontend: React + Vite + TypeScript]
    FE --> State[Gestión de Estado Local]
    FE --> SB[(Cloud Backend: Supabase)]
    SB --> DB1[Autenticación de Cadetes]
    SB --> DB2[Base de Datos: Plan de Estudios]
    SB --> DB3[Bitácora de Progreso y Notas]

```

```mermaid
graph LR
    classDef actorStyle fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef ucStyle fill:#ffe0e0,stroke:#fa8072,stroke-width:2px,color:#000;

    subgraph Actores [Personal del Sistema]
        Estudiante((Estudiante))
        Militar((Militar))
        Instructor((Instructor))
        Servidor[Servidor de Aplicación]
    end
    class Estudiante,Militar,Instructor,Servidor actorStyle;

    subgraph PITV [Límite de la Plataforma de Instrucción Táctica]
        UC1(abrir cuenta)
        UC2(iniciar sesion)
        UC3(Realizar capacitaciones)
        UC4(Realizar simulaciones)
        UC5(Gestionar currículo<br>Para subir temas)
        UC6(Supervisar rendimiento)
        
        UC1_1(validar datos)
        UC2_1(validar datos)
        UC3_1(Presentar evaluación)
        UC3_2(Ver contenido multimedia)
        UC3_3(Revisar puntaje obtenido)
        
        UC_S1(Calificar automáticamente)
        UC_S2(Generar notificaciones)
        UC_S3(Respaldar progreso)
    end
    class UC1,UC2,UC3,UC4,UC5,UC6,UC1_1,UC2_1,UC3_1,UC3_2,UC3_3,UC_S1,UC_S2,UC_S3 ucStyle;

    Estudiante --> UC1
    Estudiante --> UC2
    Estudiante --> UC3

    Militar --> UC1
    Militar --> UC2
    Militar --> UC3
    Militar --> UC4

    Instructor --> UC5
    Instructor --> UC6

    UC1 -.->|include| UC1_1
    UC2 -.->|include| UC2_1
    UC3 -.->|include| UC3_1
    UC3 -.->|include| UC3_2
    UC3 -.->|include| UC3_3

    Servidor --> UC_S1
    Servidor --> UC_S2
    Servidor --> UC_S3

```

```mermaid
graph TD
    classDef inicioFin fill:#a5d6a7,stroke:#2e7d32,stroke-width:2px,color:#000;
    classDef proceso fill:#fff59d,stroke:#fbc02d,stroke-width:2px,color:#000;
    classDef decision fill:#90caf9,stroke:#1565c0,stroke-width:2px,color:#000;

    In([Inicio]) --> Step1[El estudiante entra a la sección de exámenes]
    Step1 -->|Ingreso| Step2[El sistema busca las preguntas en la Base de Datos]
    Step2 -->|Carga| Step3[El estudiante responde todas las preguntas]
    
    Step3 -->|Verificación| Dec1{"¿El estudiante terminó<br>el examen?"}
    Dec1 -->|No| Step3
    
    Dec1 -->|Sí| Step4[El sistema compara las respuestas con la clave correcta y calcula la nota]
    Step4 -->|Cálculo| Step5[El sistema guarda la calificación final en la Base de Datos]
    Step5 -->|Registro| Step6[Se muestra la nota en pantalla y se envía notificación de éxito]
    Step6 -->|Finaliza| Out([Fin])

    class In,Out inicioFin;
    class Step1,Step2,Step3,Step4,Step5,Step6 proceso;
    class Dec1 decision;

```

```mermaid
graph TD
    classDef inicioFin fill:#a5d6a7,stroke:#2e7d32,stroke-width:2px,color:#000;
    classDef proceso fill:#fff59d,stroke:#fbc02d,stroke-width:2px,color:#000;
    classDef control fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000;
    classDef manual fill:#c8e6c9,stroke:#388e3c,stroke-width:2px,color:#000;
    classDef decision fill:#ffe082,stroke:#fbc02d,stroke-width:2px,color:#000;
    classDef db fill:#bbdefb,stroke:#1976d2,stroke-width:2px,color:#000;
    classDef error fill:#ffcdd2,stroke:#d32f2f,stroke-width:2px,color:#000;

    I([Inicio]) --> S1([El instructor entra al panel de administración])
    S1 --> S2[/Instructor ingresa credenciales/]
    S2 --> S3[(Validar credenciales en BD)]
    
    S3 --> D1{"¿Credenciales<br>válidas?"}
    D1 -->|NO| E1[Error de autenticación] --> F1([Fin - Acceso denegado])
    
    D1 -->|SÍ| S4[(Verificar rol de usuario en BD)]
    S4 --> D2{"¿Rol =<br>Instructor?"}
    
    D2 -->|NO| E2[Sin permisos de instructor] --> F2([Fin - No permitir ingreso])
    D2 -->|SÍ| S5([Accede al panel de administración])
    
    S5 --> S6[/Instructor sube archivo<br>video, PDF o lectura/]
    S6 --> S7[Sistema valida formato del archivo]
    
    S7 --> D3{"¿Archivo<br>válido?"}
    D3 -->|NO| E3[Formato inválido - Solicitar archivo nuevamente] --> S6
    
    D3 -->|SÍ| S8[Guardar archivo en servidor]
    S8 --> S9[(Vincular dirección en Base de Datos)]
    S9 --> S10[Actualizar módulo de estudio]
    S10 --> S11([Enviar notificación a estudiantes])
    S11 --> F2
    
    class I,F1,F2,S1,S11 inicioFin;
    class S2,S6 manual;
    class S7,S8,S10 proceso;
    class S5 control;
    class D1,D2,D3 decision;
    class S3,S4,S9 db;
    class E1,E2,E3 error;

```

```mermaid
graph TD
    classDef capaUsuario fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#000;
    classDef capaAplicacion fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,color:#000;
    classDef capaDatos fill:#eceff1,stroke:#37474f,stroke-width:2px,color:#000;
    classDef capaAlmacenamiento fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#000;

    subgraph CU [CAPA DE USUARIO - FRONTEND]
        A[Interfaz de Usuario Interactiva<br>React 18 / Vite / TypeScript / Tailwind CSS]
    end
    class CU,A capaUsuario;

    subgraph CA [CAPA DE APLICACIÓN - LÓGICA DE NEGOCIO]
        subgraph MS [Runtime y API: Node.js con TypeScript / Express]
            B[Gestor de Evaluaciones<br>Calificación Automática]
            C[Motor de Notificaciones<br>Alertas de Progreso]
        end
    end
    class CA,MS,B,C capaAplicacion;

    subgraph CD [CAPA DE DATOS - BACKEND]
        D[Servicio de Persistencia de Datos<br>BaaS Platform: Supabase]
        E[Autenticación y Autorización<br>Supabase Auth & Edge Functions]
    end
    class CD,D,E capaDatos;

    subgraph CB [CAPA DE ALMACENAMIENTO - BASE DE DATOS]
        F[(Base de Datos Relacional<br>PostgreSQL Database - Supabase)]
    end
    class CB,F capaAlmacenamiento;

    A <--> |HTTP / WebSockets| MS
    B & C <--> D
    D --> E
    E <--> F

```

```mermaid
erDiagram
    USUARIO ||--o{ PROGRESO : Registra
    USUARIO ||--o{ NOTIFICACION : Recibe
    USUARIO ||--|| ROL : Posee
    ROL ||--|{ ROL_PERMISO : Contiene
    PERMISO ||--|{ ROL_PERMISO : Asigna
    MODULO ||--o{ PROGRESO : Pertenece
    MODULO ||--o{ NOTIFICACION : Alerta
    MODULO ||--o{ RECURSO : Contiene
    MODULO ||--|| EVALUACION : Posee
    EVALUACION ||--|{ PREGUNTA : Compone
    PREGUNTA ||--|{ OPCION : Ofrece

    USUARIO {
        int usuario_id PK
        string nombre_completo
        string rango
        int rol_id FK
    }
    PROGRESO {
        int progreso_id PK
        int usuario_id FK
        int modulo_id FK
        string estado
        decimal calificacion
        date fecha_completada
    }
    NOTIFICACION {
        int notificacion_id PK
        int usuario_id FK
        int modulo_id FK
        string mensaje
        datetime fecha_envio
        boolean leida
    }
    ROL {
        int rol_id PK
        string nombre_rol
        string descripcion
    }
    PERMISO {
        int permiso_id PK
        string nombre_permiso
        string descripcion
    }
    ROL_PERMISO {
        int rol_id PK, FK
        int permiso_id PK, FK
    }
    MODULO {
        int modulo_id PK
        string titulo
        string eje_tematico
        string contenido_url
    }
    RECURSO {
        int recurso_id PK
        int modulo_id FK
        string nombre
        string tipo
        string url
    }
    EVALUACION {
        int evaluacion_id PK
        int modulo_id FK
        decimal puntaje_minimo
    }
    PREGUNTA {
        int pregunta_id PK
        int evaluacion_id FK
        string texto_pregunta
    }
    OPCION {
        int opcion_id PK
        int pregunta_id FK
        string texto_opcion
        boolean es_correcta
    }

```

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario (Cadete/Instructor)
    participant UI as Interfaz de Usuario (Pantalla)
    participant LN as Servidor de Aplicación (Lógica)
    participant BD as Base de Datos (Almacenamiento)

    Note over U, BD: Flujo de Autenticación y Acceso
    U->>UI: Ingresar datos de acceso
    UI->>LN: Enviar solicitud de autenticación
    LN->>BD: Consultar credenciales de usuario
    BD-->>LN: Retornar datos de usuario validados
    LN-->>UI: Enviar permiso de acceso
    UI-->>U: Mostrar acceso concedido

    Note over U, BD: Carga de Contenido Académico Militar
    U->>UI: Solicitar temas de estudio
    UI->>LN: Pedir información de lecciones
    LN->>BD: Buscar lecciones y archivos multimedia
    BD-->>LN: Retornar contenido didáctico
    LN-->>UI: Enviar lecciones estructuradas
    UI-->>U: Mostrar contenido de estudio

    Note over U, BD: Ejecución y Calificación de la Evaluación
    U->>UI: Enviar respuestas del examen
    UI->>LN: Transmitir respuestas para calificación
    LN->>BD: Consultar respuestas correctas
    BD-->>LN: Retornar gabarito de respuestas
    Note over LN: Calificar respuestas y calcular nota
    LN->>BD: Guardar calificación y progreso
    BD-->>LN: Confirmar guardado exitoso
    LN-->>UI: Enviar calificación y estadísticas
    UI-->>U: Mostrar nota final
    UI-->>U: Generar notificación de éxito

```

```


```
