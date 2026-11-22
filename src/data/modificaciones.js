// Reporte de las modificaciones de la revisión previa a la liberación (Unidad 4).
export const MODIFICACIONES = [
  { id: 'M-01', prioridad: 'Must', titulo: 'Activar GitHub Pages', estado: 'Pendiente', resultado: 'Depende de la configuración del repositorio, que solo hace su propietario. Las pruebas y la compilación pasan en GitHub Actions.', commits: [] },
  { id: 'M-02', prioridad: 'Must', titulo: 'Prueba de humo en producción', estado: 'Pendiente', resultado: 'La regresión acepta la URL pública (BASE) y se ejecuta en cuanto M-01 esté activo.', commits: [] },
  { id: 'M-03', prioridad: 'Must', titulo: 'Contraseña de administración fuera del código', estado: 'Hecha', resultado: 'Solo se configura su huella SHA-256 fuera del repositorio; sin ella el panel queda cerrado.', commits: ['d40a6bf'] },
  { id: 'M-04', prioridad: 'Must', titulo: 'Backlog de la versión 1.1', estado: 'Hecha', resultado: 'El backlog agrupa las propuestas en T-06 a T-09 y define la versión 1.1.', commits: ['5b13b53', '951a64d'] },
  { id: 'M-05', prioridad: 'Should', titulo: 'Aviso de privacidad y términos de uso', estado: 'Hecha', resultado: 'Dos pantallas nuevas con botón para borrar los datos del navegador.', commits: ['2545e7e'] },
  { id: 'M-06', prioridad: 'Should', titulo: 'Carga diferida de las pantallas', estado: 'Parcial', resultado: 'JavaScript inicial de 102.5 a 92.1 KB e imagen en 3G de 4.2 a 4.0 s; las metas de 70 KB y 1.5 s no se alcanzan.', commits: ['8da48e9', '8731913'] },
  { id: 'M-07', prioridad: 'Should', titulo: 'Regresión en GitHub Actions', estado: 'Hecha', resultado: 'La regresión (hoy 20 recorridos) corre en Chrome en cada push; detectó y se corrigió un desbordamiento en móvil que solo ocurría en Linux.', commits: ['042b314', '19a2fd3', '1a851f1'] },
  { id: 'M-08', prioridad: 'Should', titulo: 'Actualizar dependencias', estado: 'Hecha', resultado: 'React 19.3.1, Vite 8.3.6, Vitest 5.1.0; 0 vulnerabilidades.', commits: ['1855821'] },
  { id: 'M-09', prioridad: 'Should', titulo: 'Licencia y versión 1.0.0', estado: 'Hecha', resultado: 'Licencia MIT, versión 1.0.0 y README actualizado.', commits: ['8f533e5'] },
  { id: 'M-10', prioridad: 'Should', titulo: 'Manual de uso', estado: 'Hecha', resultado: 'docs/MANUAL.md para comprador y administrador con capturas.', commits: ['4ad3483'] },
  { id: 'M-11', prioridad: 'Could', titulo: 'Revisión de accesibilidad', estado: 'Hecha', resultado: 'axe-core en 18 pantallas (incluido el menú): 1 problema grave encontrado y corregido; 0 graves.', commits: ['d249593'] },
  { id: 'M-12', prioridad: 'Could', titulo: 'Fotos reales del catálogo', estado: 'Versión 1.1', resultado: 'Pospuesta: requiere las fotos de los 24 productos (T-09).', commits: [] },
  { id: 'M-13', prioridad: 'Should', titulo: 'Menú del proyecto', estado: 'Hecha', resultado: 'Botón «Menú» con actividades del curso, sistema, código fuente y este reporte (entrega final).', commits: ['06cf9be'] },
]
