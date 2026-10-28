import { initials } from '../../utils/data.js'

function Avatar({ name, size = 'regular', index = 0 }) {
  return (
    <span
      className={`avatar ${size} av-${index % 6}`}
      title={name}
    >
      {initials(name)}
    </span>
  )
}

export default Avatar
