# 🎓 Juega con las Tildes

Aplicación web educativa para alumnos de **5º de Primaria** que enseña a usar
correctamente las tildes en español: sílaba tónica, clasificación de palabras
por su acentuación (agudas, llanas, esdrújulas y sobresdrújulas) y aplicación
de las reglas de acentuación.

## 🚀 Cómo usar

No necesita instalación ni servidor. Solo abre `index.html` en cualquier
navegador moderno (Chrome, Firefox, Edge, Safari).

```bash
# Opcional: servirlo con un servidor local
python3 -m http.server 8000
# Y abre http://localhost:8000
```

## 🎮 Juegos incluidos

1. **📖 Reglas** — Repaso de las reglas de acentuación con ejemplos.
2. **🔤 Sílaba tónica** — Identifica qué sílaba se pronuncia más fuerte.
3. **📊 Clasifica** — Decide si la palabra es aguda, llana, esdrújula o sobresdrújula.
4. **✏️ ¿Lleva tilde?** — Aplica las reglas para decidir si la palabra lleva tilde.
5. **🎯 Pon la tilde** — Coloca la tilde en la vocal correcta.
6. **🎲 Mezcla** — Todos los retos mezclados al azar.

## ⭐ Características

- Más de 60 palabras con sus sílabas y clasificación.
- Sistema de puntuación con aciertos y fallos (se guarda en el navegador).
- Explicación pedagógica de la regla aplicada en cada respuesta.
- Diseño adaptado a móvil y tableta.
- Sin dependencias externas: HTML + CSS + JavaScript puros.

## 📁 Estructura

```
juegoseducativos/
├── index.html   # Página principal
├── styles.css   # Estilos
├── app.js       # Lógica de los juegos y banco de palabras
└── README.md
```
