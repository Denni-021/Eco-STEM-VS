# Eco-STEM: Plataforma web para análisis vegetal, monitoreo ambiental y apoyo al cultivo mediante inteligencia artificial

## Portada

**Nombre del proyecto:** Eco-STEM  
**Modalidad:** Tics aplicada  a la informática
**Institución:** CTP Vázquez de Coronado, especialidad Desarrollo de Aplicaciones Móviles  
**Nivel:** Undécimo
**Año:** 2026  



## Resumen


Eco-STEM es un proyecto web desarrollado por estudiantes del CTP Vázquez de Coronado con el propósito de apoyar el cuidado de plantas mediante herramientas digitales accesibles. El sistema integra una interfaz web construida con HTML, CSS y JavaScript, un backend modular, un sistema de monitoreo ambiental simulado con enfoque IoT y servicios de inteligencia artificial para análisis vegetal, chat de apoyo y recomendaciones de siembra.

La propuesta surgió a partir de una observación sencilla pero constante: muchas personas tienen interés en cuidar plantas o iniciar pequeños cultivos, pero no siempre cuentan con orientación clara sobre riego, luz, clima, terreno o síntomas visibles de estrés vegetal. A partir de esa necesidad, se diseñó una plataforma que combina funciones prácticas, como análisis por imagen, recomendaciones según condiciones del entorno y visualización de variables ambientales.

Durante el desarrollo se buscó mantener una arquitectura separada entre frontend y backend, permitiendo que la interfaz funcionara de forma web y que la lógica sensible, como autenticación, pagos, recomendaciones y llamadas a IA, se administrara desde el servidor. También se consideró el almacenamiento estructurado en SQL Server para sesiones, usuarios, análisis, pagos, lecturas IoT y notificaciones.

Una parte importante del proyecto fue mantener una postura técnica honesta. Por eso, el sistema no plantea diagnósticos absolutos ni promete resultados infalibles. En su lugar, presenta recomendaciones y análisis con base en la información disponible, aclarando que ciertos casos requieren observación adicional o criterio humano.




## 1. Introducción

Actualmente existe un creciente interés por el cultivo doméstico, el cuidado de plantas ornamentales y el uso de herramientas tecnológicas para apoyar decisiones ambientales. Sin embargo, en muchos casos las personas cuidan sus plantas mediante prueba y error, lo que puede provocar riegos inadecuados, mala ubicación según la luz disponible o interpretaciones equivocadas de síntomas visibles.

Eco-STEM nace como una respuesta a esa situación. El proyecto busca unir tecnología e innovación ambiental en una plataforma que permita analizar imágenes de plantas, consultar un asistente de apoyo, visualizar datos ambientales y recibir sugerencias de qué sembrar según el contexto de la persona usuaria.

Desde el inicio se planteó que el sistema debía cumplir con varias condiciones. Primero, debía ser funcional como proyecto web real, no solo como maqueta visual. Segundo, debía mostrar una arquitectura separada y ordenada. Tercero, debía incorporar inteligencia artificial de forma útil, pero sin exagerar sus capacidades. Y cuarto, debía poder ser defendido con transparencia frente a jurados, explicando tanto sus fortalezas como sus límites.

En ese sentido, Eco-STEM no se diseñó como un producto comercial terminado, sino como una propuesta estudiantil seria, progresiva y técnicamente coherente. Su valor está en demostrar integración de tecnologías, razonamiento de diseño, conciencia ambiental y capacidad de documentación del proceso.



## 2. Planteamiento del problema

En el entorno cotidiano es común encontrar personas interesadas en cultivar plantas comestibles, aromáticas u ornamentales, pero con poca información sobre sus necesidades específicas. Algunas decisiones importantes, como cuánta agua aplicar, qué tipo de luz conviene o qué especies se adaptan mejor a una vivienda, suelen tomarse con información incompleta.

Además, muchos problemas visibles en plantas, como amarillamiento, manchas, bordes secos o pérdida de firmeza, pueden tener varias causas posibles. Por ejemplo, una hoja amarilla no siempre significa falta de agua; también puede relacionarse con exceso de riego, iluminación insuficiente, mal drenaje o estrés general. Esto hace que una recomendación automática demasiado simple sea poco confiable.

Por otra parte, en proyectos tecnológicos escolares suele presentarse software con buena apariencia visual pero con poca relación entre lo que dice la documentación y lo que realmente hace el sistema. Por eso, en Eco-STEM se consideró importante que el desarrollo estuviera respaldado por funciones implementadas en código, rutas reales de backend y una estructura de almacenamiento coherente.

Con base en esto, el problema principal se definió así:

**¿Cómo desarrollar una plataforma web ue ayude a interpretar el estado visible de una planta, relacione datos ambientales y ofrezca recomendaciones útiles de cultivo, manteniendo una arquitectura técnica clara y defendible para una feria científica?**



## 3. Objetivos

### Objetivo general

Desarrollar una plataforma web llamada Eco-STEM que apoye el cuidado de plantas mediante análisis visual, recomendaciones contextuales, monitoreo ambiental y asistencia basada en inteligencia artificial.

###  Objetivos específicos

1. Diseñar una interfaz web clara e interactiva utilizando HTML, CSS y JavaScript.
2. Implementar un backend modular para autenticación, análisis, monitoreo, contacto, suscripciones y recomendaciones.
3. Integrar servicios de inteligencia artificial para chat, análisis de imágenes y recomendaciones de siembra.
4. Registrar datos relevantes del sistema en una base de datos SQL Server con estructura organizada.
5. Presentar una documentación técnica coherente con el funcionamiento real del proyecto.



## 4. Justificación

Eco-STEM es relevante porque responde a una necesidad real con un enfoque accesible. El proyecto no intenta sustituir conocimiento agronómico profesional ni mediciones especializadas de laboratorio, pero sí puede servir como apoyo inicial para personas interesadas en comprender mejor el cuidado de sus plantas.

El proyecto también tiene valor educativo. Desde el punto de vista técnico, permitió trabajar integración entre frontend, backend, base de datos y APIs de IA. Desde el punto de vista metodológico, obligó a tomar decisiones reales sobre validación, límites del sistema, seguridad básica y organización modular del código. Desde el punto de vista ambiental, promueve prácticas de observación, siembra y manejo más consciente de plantas en contextos domésticos, además de que así lgramos comprender y percibir la variedad de flora en el país y su importancia, ya que a veces simplemente creemos que son plantas sin importancia que solo necesitan agua y realmente no es así.

Otro elemento importante es que el sistema fue pensado para sostenerse con honestidad técnica. En lugar de afirmar que “la IA sabe todo”, se configuró para responder con más cautela. Por ejemplo, en el servicio de análisis vegetal se le indica explícitamente al modelo que no diga automáticamente que la planta necesita agua si no hay evidencia suficiente.



## 5. Marco teórico breve

### Desarrollo web

El desarrollo web consiste en crear una aplicación accesible mediante navegador, separando normalmente la capa de presentación, la lógica del servidor y el almacenamiento de datos. En Eco-STEM esta separación se observa entre el frontend web y el backend modular.

### Monitoreo ambiental

El monitoreo ambiental permite observar variables del entorno relacionadas con el cultivo, como humedad, temperatura, luz o pH. Aunque en esta etapa varias lecturas son simuladas o ajustadas según contexto, el proyecto demuestra la lógica necesaria para trabajar con variables ambientales y vincularlas con recomendaciones.

### Inteligencia artificial aplicada

La inteligencia artificial puede apoyar en tareas de lenguaje natural, visión por computadora y generación de recomendaciones.Su uso en este proyecto se maneja como apoyo probabilístico, no como verdad absoluta. Esto es importante desde el punto de vista ético y técnico.

### Arquitectura separada

La arquitectura separada facilita mantenimiento, seguridad y escalabilidad. En Eco-STEM, la interfaz web realiza solicitudes a rutas del backend configuradas desde un archivo de parámetros, lo que permite cambiar endpoints sin reescribir toda la lógica del cliente.

## 6. Metodología de desarrollo

El desarrollo del proyecto se realizó de forma progresiva e iterativa. No se trabajó como un sistema cerrado desde el inicio, sino como una plataforma que fue creciendo por módulos.

###  Etapa de análisis

Primero se definieron funciones principales útiles para una persona usuaria:

- analizar imágenes de plantas
- conversar con un asistente
- visualizar datos ambientales
- recibir recomendaciones de qué sembrar
- registrar cuenta y membresía

En esta etapa también se identificó que el proyecto debía mantener coherencia entre interfaz y backend. Por eso no se dejó el sistema únicamente en frontend.

###  Etapa de diseño

Se diseñó una interfaz web con secciones visibles para:

- inicio
- analizador IA
- panel IoT
- recomendador
- membresías
- cuenta
- contacto

La intención fue que cada parte del sitio correspondiera a una función real o, al menos, a una lógica ya preparada para conectarse con backend.

###  Etapa de implementación

La implementación se dividió en dos capas principales:

**Frontend web**

- [index.html](E:\Eco-STEM-Source\index.html)
- [style.css](E:\Eco-STEM-Source\style.css)
- [app.js](E:\Eco-STEM-Source\app.js)
- [config.js](E:\Eco-STEM-Source\config.js)

**Backend modular**

- [server/src/server.js](E:\Eco-STEM-Source\server\src\server.js)
- rutas separadas por función
- servicios de IA
- conexión a SQL Server

###  Etapa de prueba y ajustes
Durante el proceso se hicieron ajustes reales en:

- validación de inicio de sesión
- formularios de pago
- lógica de cookies
- textos legales
- ubicación exacta
- límite del analizador
- recomendador de plantas

Estos cambios muestran que el sistema no se construyó de una sola vez. Fue necesario corregir errores de funcionamiento, problemas de usabilidad y detalles de presentación, algo normal en un desarrollo real.



## 7. Descripción técnica del sistema

## Frontend

El frontend principal fue desarrollado en HTML, CSS y JavaScript. La página organiza sus secciones por bloques funcionales y maneja estado en navegador mediante constantes, objetos globales y almacenamiento local.

En [app.js](E:\Eco-STEM-Source\app.js) se observan decisiones importantes:

- `MAX_ANALYSIS_IMAGES = 3`, lo que limita la subida a tres imágenes por análisis
- `ANALYSIS_LIMIT_FREE = Infinity`, lo que deja el analizador sin límite para demostración
- `CONTACT_WHATSAPP_NUMBER = '50664098842'`, usado para la integración de contacto por WhatsApp
- `COOKIE_CONSENT_VERSION`, para controlar el consentimiento legal

También se usa un objeto `appConfig` que toma rutas desde `window.ECOSTEM_CONFIG`, definido en [config.js](E:\Eco-STEM-Source\config.js). Esto permite conectar el frontend con el backend sin acoplar todas las URLs directamente en cada función.

Entre las funciones implementadas en el frontend destacan:

- carga y análisis de imágenes
- control de métodos de pago
- uso de ubicación exacta
- simulación de sensores
- recomendador local de plantas
- interfaz de chat
- registro e inicio de sesión

### Ejemplo real del frontend

En el código existe un catálogo local de plantas llamado `plantRecommendationCatalog`, donde se registran especies como lechuga, albahaca, culantro, lavanda, anturio y lengua de suegra. Cada planta incluye:

- objetivo
- espacio recomendado
- luz
- nivel de cuidado
- rango de temperatura
- plan de cuidado
- evidencia o criterio de selección

Esto permite explicar que no todo depende únicamente de IA externa. Parte del recomendador también trabaja con lógica local estructurada.

## Backend

El backend principal fue organizado de forma modular con Express. En [server/src/server.js](E:\Eco-STEM-Source\server\src\server.js) se observa que cada función del sistema tiene una ruta específica:

- `/api/auth`
- `/api/analysis`
- `/api/chat`
- `/api/contact`
- `/api/subscriptions`
- `/api/iot`
- `/api/preferences`
- `/api/recommendations`
- `/api/status`

Esta separación facilita mantenimiento y claridad técnica. En lugar de tener un solo archivo gigante, cada área del proyecto fue distribuida por responsabilidad.

### Rutas destacadas

**Autenticación**

La ruta [server/src/routes/auth.js](E:\Eco-STEM-Source\server\src\routes\auth.js) maneja:

- registro de usuarios
- inicio de sesión
- verificación básica de credenciales

En el registro se guardan campos como:

- `FirstName`
- `LastName`
- `Email`
- `Phone`
- `PasswordHash`
- `PlanStatus`

**Análisis**

La ruta [server/src/routes/analysis.js](E:\Eco-STEM-Source\server\src\routes\analysis.js) recibe imágenes para análisis visual y también guarda resultados cuando el usuario está autenticado.

**Chat**

La ruta [server/src/routes/chat.js](E:\Eco-STEM-Source\server\src\routes\chat.js) recibe un mensaje y devuelve una respuesta del asistente.

**IoT**

La ruta [server/src/routes/iot.js](E:\Eco-STEM-Source\server\src\routes\iot.js) genera lecturas basadas en ubicación, elevación, terreno y factores simulados, mostrando cómo se podrían adaptar condiciones del entorno.

**Recomendaciones**

La ruta [server/src/routes/recommendations.js](E:\Eco-STEM-Source\server\src\routes\recommendations.js) recibe filtros, ubicación y sensores, y utiliza IA para devolver sugerencias de plantas si OpenAI está configurado.

## 7.3 Base de datos

La estructura principal de base de datos está en [server/database/EcoStemDB.sql](E:\Eco-STEM-Source\server\database\EcoStemDB.sql).

Las tablas muestran que el proyecto fue pensado con cierta formalidad técnica. Entre las principales se encuentran:

- `app.Users`
- `app.Sessions`
- `app.Plants`
- `app.Subscriptions`
- `app.Payments`
- `app.Analyses`
- `app.AnalysisImages`
- `app.IoTReadings`
- `app.ContactMessages`
- `app.CookieConsents`
- `app.NewsletterSubscriptions`
- `app.Notifications`

Esto permite justificar que el sistema no solo guarda usuarios, sino también:

- resultados de análisis
- imágenes asociadas
- historial de pagos
- lecturas ambientales
- consentimientos
- suscripciones



## 8. Integración de inteligencia artificial

La integración principal de IA se maneja en [server/src/services/openaiService.js](E:\Eco-STEM-Source\server\src\services\openaiService.js).

Allí se distinguen tres funciones reales:

1. `getPlantChatAnswer`
2. `analyzePlantImages`
3. `getPlantRecommendations`

### Chat inteligente

La función `getPlantChatAnswer` utiliza un prompt de sistema donde el asistente se define como experto en plantas y agricultura de precisión. También se le pide responder en español, con claridad y sin inventar diagnósticos definitivos.

Este detalle es importante para la defensa del proyecto, porque muestra un uso responsable de IA. No se diseñó para “hablar bonito”, sino para responder con límites.

###  Análisis visual

La función `analyzePlantImages` usa imágenes recibidas desde el frontend y pide al modelo evaluar:

- coloración
- manchas
- textura
- turgencia
- bordes
- tallos
- señales de plaga
- daño mecánico
- exceso o falta de agua
- exceso o falta de luz

Además, en el prompt se indica algo muy importante:

> No decir automáticamente que falta agua si no hay evidencia suficiente.

Este tipo de ajuste refleja una mejora real del proyecto, porque justamente uno de los problemas detectados al inicio fue la tendencia a respuestas demasiado genéricas.

###  Recomendaciones de siembra

La función `getPlantRecommendations` genera recomendaciones según:

- filtros de la persona usuaria
- ubicación
- sensores

El modelo devuelve resultados estructurados en formato JSON con:

- nombre de planta
- objetivo
- puntaje
- resumen
- evidencia
- razones
- plan de cuidado

Esto es útil para defender que la IA no se usa solo como “chat”, sino también como motor de apoyo a decisiones.


## 9. Sistema de monitoreo ambiental

El módulo IoT del proyecto no depende únicamente de un país general, sino que intenta ajustar valores según información más precisa. En la ruta [server/src/routes/iot.js](E:\Eco-STEM-Source\server\src\routes\iot.js) se utilizan datos como:

- latitud
- longitud
- precisión de ubicación
- elevación
- tipo de terreno

A partir de estos factores se calculan valores simulados de:

- humedad del suelo
- temperatura
- luz
- pH
- humedad ambiental

Aunque no todas las lecturas provienen todavía de hardware físico real, la lógica permite demostrar cómo un sistema de monitoreo puede personalizar sus resultados según el contexto geográfico.

Esto es una fortaleza para feria científica porque permite hablar de:

- sensores
- contexto ambiental
- geolocalización
- adaptación de variables

sin afirmar falsamente que todo ya proviene de dispositivos instalados en campo.



## 10. Funcionalidades principales observables

De acuerdo con el sistema actual, Eco-STEM ya presenta las siguientes funciones visibles o conectadas:

### Funciones web visibles

- análisis de plantas por imagen
- carga de hasta tres imágenes
- panel de monitoreo IoT
- activación de ubicación exacta
- recomendador de qué sembrar
- asistente de chat
- sistema de membresías
- formulario de contacto
- aviso de cookies y uso legal

###  Funciones de backend integradas

- autenticación
- compras de suscripción
- registro de pagos
- lectura IoT contextual
- rutas de IA
- almacenamiento estructurado

###  Funciones en proceso o con nivel demostrativo

- pagos reales dependen de proveedor externo
- notificaciones reales dependen de correo/servicio configurado
- precisión del análisis depende de calidad de imagen y configuración de IA
- algunas lecturas IoT siguen siendo simuladas o mixtas


## 11. Evidencia real del desarrollo

Una parte importante del valor del proyecto es que se pueden mostrar decisiones concretas de implementación:

1. El sistema web usa configuración centralizada en [config.js](E:\Eco-STEM-Source\config.js), donde se definen endpoints para análisis, chat, autenticación, IoT, pagos, recomendaciones y estado.
2. El backend modular en [server/src/server.js](E:\Eco-STEM-Source\server\src\server.js) refleja una arquitectura ordenada por rutas.
3. El análisis de imágenes en [server/src/services/openaiService.js](E:\Eco-STEM-Source\server\src\services\openaiService.js) fue afinado para evitar respuestas automáticas poco confiables.
4. La base de datos en [server/database/EcoStemDB.sql](E:\Eco-STEM-Source\server\database\EcoStemDB.sql) muestra una organización profesional de entidades y relaciones.
5. En [app.js](E:\Eco-STEM-Source\app.js) existe un catálogo local de plantas recomendado según variables del entorno, lo cual evidencia trabajo lógico adicional y no solo dependencia de IA externa.

Estos puntos sirven como evidencia frente al jurado porque permiten mostrar código, estructuras y decisiones reales.



## 12. Limitaciones del proyecto

Para mantener honestidad técnica, es importante reconocer algunas limitaciones:

1. El análisis visual no reemplaza diagnóstico agronómico o biológico especializado.
2. La calidad de las recomendaciones depende de la calidad de la imagen y de los datos entregados al sistema.
3. Las lecturas IoT aún no representan una implementación completa con hardware físico permanente en todos los casos.
4. Los pagos, correos y algunas integraciones requieren configuración externa real para operar en producción completa.
5. La IA puede ofrecer sugerencias útiles, pero no debe presentarse como infalible.

Reconocer estas limitaciones fortalece la defensa del proyecto, porque muestra criterio crítico y transparencia.



## 13. Resultados del proceso

Como resultado del desarrollo se obtuvo una plataforma web con varios módulos funcionales integrados. Más allá del diseño visual, el proyecto demuestra:

- separación entre frontend y backend
- integración de IA con prompts ajustados a un caso real
- base de datos estructurada
- lógica de membresías y autenticación
- uso de geolocalización para contexto ambiental
- recomendador híbrido con reglas locales y apoyo de IA

También se logró consolidar una propuesta que une desarrollo de software con interés ambiental, lo cual es coherente con el enfoque de una feria científica tecnológica.


## 14. Conclusiones

El proyecto Eco-STEM permitió demostrar que una plataforma estudiantil puede integrar desarrollo web, backend modular, base de datos, monitoreo ambiental e inteligencia artificial dentro de una sola propuesta coherente. Uno de los principales aprendizajes fue que no basta con “hacer una página bonita”; era necesario construir una solución que realmente conectara interfaz, lógica, datos y documentación.

Otro resultado importante fue comprender que la inteligencia artificial debe usarse con criterio. En vez de presentar respuestas absolutas, se decidió orientar el sistema hacia recomendaciones prudentes y análisis condicionados por evidencia visible. Esto hizo el proyecto más defendible y más realista.

También se concluye que la organización modular del backend y la estructura de base de datos fortalecen bastante la propuesta. No solo ayudan a nivel técnico, sino que permiten explicar mejor el proyecto frente a un jurado, porque cada parte tiene una responsabilidad clara.

Desde una perspectiva estudiantil, Eco-STEM refleja un proceso de mejora continua. Hubo ajustes en textos, validaciones, interfaz, IA y coherencia interna. Eso lejos de ser una debilidad, demuestra que el proyecto fue desarrollado y corregido de forma progresiva, como ocurre en trabajos reales de software.

Finalmente, Eco-STEM muestra que la tecnología puede apoyar el aprendizaje ambiental y el cuidado de plantas de manera accesible. Aunque todavía tiene aspectos por mejorar, el sistema ya constituye una base sólida, transparente y técnicamente justificable para una ExpoTécnica colegial.

## 15. Recomendaciones

1. Continuar la integración con sensores físicos reales para fortalecer el módulo IoT.
2. Incorporar historial visual de cada planta para comparar evolución en el tiempo.
3. Mejorar la clasificación de especie con más datos y pruebas.
4. Implementar validaciones adicionales de seguridad y manejo de sesiones.
5. Mantener la documentación técnica sincronizada con los cambios del código.

---

## 16. Referencias básicas en formato APA

OpenAI. (2026). *OpenAI API documentation*. https://platform.openai.com/docs  

Microsoft. (2026). *SQL Server documentation*. https://learn.microsoft.com/sql  

Mozilla Developer Network. (2026). *HTML, CSS, and JavaScript documentation*. https://developer.mozilla.org/  

Express.js. (2026). *Express web framework documentation*. https://expressjs.com/  


## 17. Anexo: evidencia de módulos reales del sistema

### Frontend principal

- [index.html](E:\Eco-STEM-Source\index.html)
- [style.css](E:\Eco-STEM-Source\style.css)
- [app.js](E:\Eco-STEM-Source\app.js)
- [config.js](E:\Eco-STEM-Source\config.js)

### Backend principal

- [server/src/server.js](E:\Eco-STEM-Source\server\src\server.js)
- [server/src/routes/auth.js](E:\Eco-STEM-Source\server\src\routes\auth.js)
- [server/src/routes/analysis.js](E:\Eco-STEM-Source\server\src\routes\analysis.js)
- [server/src/routes/chat.js](E:\Eco-STEM-Source\server\src\routes\chat.js)
- [server/src/routes/iot.js](E:\Eco-STEM-Source\server\src\routes\iot.js)
- [server/src/routes/recommendations.js](E:\Eco-STEM-Source\server\src\routes\recommendations.js)
- [server/src/routes/subscriptions.js](E:\Eco-STEM-Source\server\src\routes\subscriptions.js)

### Servicios de IA

- [server/src/services/openaiService.js](E:\Eco-STEM-Source\server\src\services\openaiService.js)

### Base de datos

- [server/database/EcoStemDB.sql](E:\Eco-STEM-Source\server\database\EcoStemDB.sql)
