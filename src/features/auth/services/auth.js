// Autenticación exclusivamente simulada en el navegador. NO usar para producción.
export const ACCOUNTS_KEY = 'nexo-auth-accounts-v1'
export const SESSION_KEY = 'nexo-auth-session-v1'
export const DEMO_ACCOUNT_ID = 'demo-admin'

const demoAccount = {
  id: DEMO_ACCOUNT_ID,
  nombre: 'Administrador Demo',
  correo: 'admin@nexo.demo',
  rol: 'Administrador',
  empresa: 'Nexo · Proyecto Integrador',
  telefono: '',
  biografia: 'Explorando retos empresariales y oportunidades de innovación.',
  creadoEl: '2026-10-01',
  usuarioId: null,
  passwordHash: null,
  salt: null,
}

export const getDemoAccount = () => ({...demoAccount})
export function loadAccounts(){
  try {
    const saved = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || 'null')
    if (Array.isArray(saved)) {
      const demo = saved.find(account => account?.id === DEMO_ACCOUNT_ID)
      const users = saved.filter(account => account?.id && account.id !== DEMO_ACCOUNT_ID && account.correo)
      return [{...demoAccount,...demo},...users]
    }
  } catch { /* corrupted or disabled localStorage */ }
  return [getDemoAccount()]
}

export function loadSession(){
  try {
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved === null) return DEMO_ACCOUNT_ID // Preserve original AD demo avatar on first visit.
    return saved === 'guest' ? null : saved
  } catch { return DEMO_ACCOUNT_ID }
}

export function newSalt(){
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('')
}

export async function hashPassword(password, salt){
  const bytes = new TextEncoder().encode(`${salt}:${password}`)
  const result = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(result), b => b.toString(16).padStart(2,'0')).join('')
}
