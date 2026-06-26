### 📖 Documentación Técnica Autogenerada
Para generar y visualizar el sitio web estático con la documentación técnica de las funciones del sistema, ejecute localmente:
```npm run doc``` o ```bun run doc```
# Plataforma de Capacitación Integral y Control de Estudios de Cadetes

Aplicación web automatizada y protegida diseñada para la gestión del plan de estudios y el progreso de conocimientos militares.

## 1. Paridad de Entornos
Las variables de entorno necesarias para levantar el proyecto de forma local se detallan en el archivo `.env.example`.

---

## 2. Arquitectura del Sistema (Doc-as-Code)

```mermaid
graph TD
    classDef frontend fill:#ffffff,stroke:#ffd54f,stroke-width:2px,color:#000000;
    classDef core fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,color:#000000;
    classDef supabase fill:#eceff1,stroke:#37474f,stroke-width:2px,color:#000000;
    classDef db fill:#ffffff,stroke:#1565c0,stroke-width:2px,color:#000000;

    subgraph STACK_CLIENTE [STACK CLIENTE: React 18 / Vite / TypeScript / Tailwind CSS / shadcn/ui / React Router v6]
        A[INTERFAZ DE USUARIO INTERACTIVA<br>Desarrollada con herramientas modernas para navegación intuitiva]
    end
    class STACK_CLIENTE,A frontend;

    subgraph CAPA_APLICACION [CAPA DE APLICACIÓN (LÓGICA DE NEGOCIO)]
        subgraph CORE [CAPA DE SERVICIOS DE LÓGICA DE NEGOCIO (INTERNAL CORE)]
            subgraph COMPONENTES [COMPONENTES DE SERVICIO MODULAR / LÓGICA DE NEGOCIO PRINCIPAL]
                B1[GESTOR DE EVALUACIONES<br>Cálculo de Notas y Gestión de Preguntas in-memory]
                B2[MOTOR DE NOTIFICACIONES<br>Emisión de Alertas y Actualizaciones Asíncronas]
            end
        end
    end
    class CAPA_APLICACION,CORE,COMPONENTES,B1,B2 core;

    subgraph CAPA_DATOS [CAPA DE DATOS (BACKEND)]
        subgraph BAAS [SERVICIOS DE DATOS BaaS INTEGRADOS (Supabase)]
            C[AUTENTICACIÓN Y AUTORIZACIÓN<br>(Supabase Auth)]
        end
    end
    class CAPA_DATOS,BAAS,C supabase;

    subgraph CAPA_ALMACENAMIENTO [CAPA DE ALMACENAMIENTO]
        D[(BASE DE DATOS RELACIONAL<br>(Supabase PostgreSQL))]
    end
    class CAPA_ALMACENAMIENTO,D db;

    A <--> |Internal Service Endpoints| CORE
    A <--> |Salida del API Gateway: con JWT token| BAAS
    A --> |JWT Issuing| BAAS
    CORE --> BAAS
    BAAS <--> D
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
erDiagram
    USUARIO ||--o{ PROGRESO : Registra
    USUARIO ||--o{ NOTIFICACION : Recibe
    USUARIO }o--|| ROL : Recibe
    ROL ||--|{ ROL_PERMISO : Posee
    PERMISO ||--|{ ROL_PERMISO : Asigna
    MODULO ||--o{ PROGRESO : Pertenece
    MODULO ||--o{ NOTIFICACION : "Gestionado por Motor de Notificaciones Asincrono"
    MODULO ||--o{ RECURSO : Contiene
    MODULO ||--|| EVALUACION : Posee
    EVALUACION ||--|{ PREGUNTA : Compone
    EVALUACION ||--|{ EVALUACION_RESULTADO : "Realiza en su computadora / Mejora altas respuestas en un anca"
    PREGUNTA ||--|{ OPCION : Ofrece
    PREGUNTA ||--|| GABARITO_COMPLETO : "Compose"
    OPCION ||--|| GABARITO_COMPLETO : "gabarito_id"

    USUARIO {
        int usuario_id PK
        Varchar nombre_completo
        Varchar rango
        int rol_id FK
    }
    PROGRESO {
        int progreso_id PK
        int usuario_id FK
        int modulo_id FK
        Varchar estado
        Decimal calificacion
        Date fecha_completada
    }
    NOTIFICACION {
        int notificacion_id PK
        int usuario_id FK
        int modulo_id FK
        Varchar mensaje
        Datetime fecha_envio
        Boolean leida
    }
    ROL {
        int rol_id PK
        Varchar nombre_rol
        Varchar descripcion
    }
    PERMISO {
        int permiso_id PK
        Varchar nombre_permiso
        Varchar descripcion
    }
    ROL_PERMISO {
        int rol_id PK, FK
        int permiso_id PK, FK
    }
    MODULO {
        int modulo_id PK
        Varchar titulo
        Varchar eje_tematico
        Varchar contenido_url
    }
    RECURSO {
        int recurso_id PK
        int modulo_id FK
        Varchar nombre
        Varchar tipo
        Varchar url
    }
    EVALUACION {
        int evaluacion_id PK
        int modulo_id FK
        Decimal puntaje_minimo
    }
    PREGUNTA {
        int pregunta_id PK "Indexed"
        int evaluacion_id FK
        Varchar texto_pregunta
    }
    OPCION {
        int opcion_id PK "Indexed"
        int evaluacion_id FK "Indexed"
        Varchar texto_opcion
        Boolean es_correcta
    }
    EVALUACION_RESULTADO {
        int resultado_id PK
        int evaluacion_id PK, FK
        int usuario_id PK, FK
        JSON respuestas_json_consolidado "Store todas las respuestas en una voza"
        Decimal puntaje_total
        Varchar estado "Uniqur: Varchar(20), e.g. Aprobado"
        Date fecha_completada
    }
    GABARITO_COMPLETO {
        int gabarito_id PK
        JSON respuestas_json "Cargado en cache del Servidor"
    }
```

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant UI as Interfaz de Usuario (Pantalla)
    participant LN as Servidor de Aplicación (Lógica de Negocio)
    participant BD as Base de Datos (Almacenamiento)

    Usuario->>BD: Llamar a Supabase Auth
    BD-->>Usuario: Devolver Token JWT

    Usuario->>UI: Ingresar datos de acceso con Token JWT
    UI->>LN: Enviar petición (con Token en Header)
    
    activate LN
    LN->>LN: Validar Token (Middleware)
    LN->>LN: Llamar a evaluacionService
    LN->>LN: Procesar nota en memoria
    deactivate LN

    LN->>BD: Consultar respuestas correctas
    BD-->>LN: Retornar gabarito de respuestas
    
    LN->>LN: Calificar respuestas y calcular nota

    LN->>BD: Guardar calificación y progreso
    BD-->>LN: Confirmar guardado exitoso
    LN-->>UI: Enviar calificación y estadísticas
    UI-->>Usuario: Mostrar nota final
    UI-->>Usuario: Generar notificación de éxito
```

📌 **Bitácora del Proyecto:** El historial detallado de tareas y el cumplimiento de la *Definition of Done (DoD)* se encuentran documentados de forma independiente en el archivo [CHANGELOG.md](./CHANGELOG.md).
