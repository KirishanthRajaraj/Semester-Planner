# Technologieentscheid

## Frontend
Next.js. Mit jedem Frontend, kann man mehr oder weniger dasselbe machen. Hier muss ich das Rad nicht neu erfinden. 
- ich kenne Next.js bereits
- Server side rendering & API routes, kann ich gut gebrauchen für z. B. externe API Anbindungen
- einfaches publish auf vercel

### Libraries

#### UI Library
shadcn
- sehr gute kompatibilität mit next.js
- minimalistisch
- tailwind customizing
- kenne ich bereits
MaterialUI wäre zu heavy für meinen use case.

#### State Library
| Kriterium | Zustand | Redux (Toolkit) | Gewichtung |
|---|---|---|---|
| Boilerplate | Minimal, 1 File | höher, Mehr Struktur nötig (actions, reducers, slicers) | Mittel |
| Lernkurve | Niedrig | hoch, Verständnis verschiedener Konzepte benötigt | Mittel |
| Bundle Size | Niedrig | höher | Niedrig |
| localStorage persistence | built in middleware | manuell oder über redux-persist | hoch |
| Skalierbarkeit bei komplexem State | Ausreichend für mittlere Komplexität | Hoch | Niedrig (für dieses Projekt) |
| DevTools / Debugging | Vorhanden, aber schlanker | Sehr ausgereift | Niedrig |
| Ökosystem / Community | Kleiner, aber aktiv | Grösser, mehr Ressourcen | Mittel |
| Migrationsaufwand zu Server-State später | Gering | Ähnlich gering, aber mehr Overhead | Mittel |
| Passung zum Scope (kein Server-State) | Sehr gut | Eher Overkill | Mittel |
| Relevanz auf dem Arbeitsmarkt | Tief | Hoch | Hoch |

Hier sieht man klar, dass sich State management mit Zustand mehr lohnt. Ich wollte zwar etwas grösseres neues lernen, was mir später auch weiterhelfen würde, aber da ich den Fokus auf user cenetered design & requirements engineering setzen möchte, denke ich wäre das Learning einer grossen library wie Redux unpassend in den Aufwand den ich übrig habe in diesem Projekt. Ausserdem wäre Redux für den Scope dieses Projektes sehr wahrscheinlich overkill. Falls ich Zeit habe könnte ich eine Migration von Zustand auf Redux durchführen, aber vorerst fahre ich mit Zustand weiter.

### posthog - noch nicht entschieden
Posthog habe ich bisher noch nie verwendet. Ein grobes User tracking. Datenschutz müsste hier beachtet werden. Möglicherweise overkill für dieses Projekt, vorallem, da ich bereits viel Feedback erhalte von direkten Userinteraktionen.

### LLM Anbindung - noch nicht entschieden
- Für besseres Natural Language Processing
- Für Ratschlag Gebung mit der aktuellen Einplanungen als Quelle
- Sonstiges Features
Ich lehne eher dagegen, da dies teuer werden kann und laut den User Interviews, User eher skeptisch gegenüber AI Features sind

## Eigenes Backend - noch nicht entschieden
Ich tendiere eher dagegen.
- Auth & Usermanagement kann ich mit next.js api routes und externen Anbietern einbinden
- Eigenes Auth mit eigenem Backend ist sehr unsicher
- Eher Overkill für ein kleines Studentenprojekt
- Ich will den Fokus auf User Centeres Design und Requirements Engineering (Modul ucdre) setzen, da habe ich auch viele Features geplant und werde da genügend zu tun haben