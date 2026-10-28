const statusColors = {
  'Abierto': 'green',
  'En revisión': 'amber',
  'Cerrado': 'neutral',
  'Aprobado': 'green',
  'Pendiente': 'amber',
  'Rechazado': 'rose',
  'Activo': 'green',
  'Inactivo': 'neutral',
}

const priorityColors = {
  Alta: 'rose',
  Media: 'amber',
  Baja: 'blue',
}

function StatusBadge({ value, priority = false }) {
  const colors = priority ? priorityColors : statusColors
  const color = colors[value]

  return <span className={`status-badge ${color || 'neutral'}`}>
    <span className="status-dot" />{value || '—'}
  </span>
}

export default StatusBadge