# Organización del proyecto NexoApp

## Criterio de organización

Se utiliza una estructura híbrida: carpetas por responsabilidad (`components`, `layouts`, `pages`, `services`, `utils`, `styles`) y por funcionalidad (`features/auth`, `features/retos`, `features/dashboard`, `features/cuentas`).

## Carpetas principales

- `src/assets/`: recursos estáticos.
- `src/components/`: componentes reutilizables y modales.
- `src/features/`: código agrupado por funcionalidad.
- `src/features/auth/pages/`: páginas de inicio de sesión, registro y perfil.
- `src/features/auth/services/`: funciones de autenticación, cuentas y sesión.
- `src/layouts/`: estructuras comunes de página.
- `src/pages/`: páginas completas.
- `src/services/`: capa de acceso y operaciones de datos.
- `src/utils/`: datos iniciales y funciones auxiliares.
- `src/styles/`: estilos globales.
- `src/main.jsx`: punto de entrada de React.
- `src/App.jsx`: componente raíz y coordinación actual de vistas.

## Decisiones importantes

Se conservaron los nombres, la lógica y el diseño existentes. Se actualizaron las rutas de importación tras mover los archivos. La interfaz principal aún concentra varios componentes en `App.jsx`; las carpetas de componentes, layouts y páginas permiten una extracción progresiva sin arriesgar una reescritura que cambie el comportamiento de la aplicación.

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Cómo verificar la compilación

```bash
npm run build
```
