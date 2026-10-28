import React from 'react'
import { ArrowUpRight, BookOpen, ChevronDown, Layers3, RotateCcw, Sparkles, X, LayoutDashboard, Target, Building2, Tags, Flag, UsersRound, ClipboardList } from 'lucide-react'
import { DEMO_ACCOUNT_ID } from '../features/auth/services/auth.js' // 👈 Asegúrate de ajustar esta ruta si tu data está en otro archivo
import { navItems } from '../utils/data.js' // 👈 Asegúrate de ajustar esta ruta si tu data está en otro archivo
import Logo from '../components/common/Logo'
import Avatar from '../components/common/Avatar'

// Objeto para mapear los iconos que vienen en navItems
const icons = {
  LayoutDashboard,
  Target,
  Building2,
  Tags,
  Flag,
  UsersRound,
  ClipboardList
}

function Sidebar({ active, onNavigate, open, onClose, counts, onReset, account }) {
  return <>
    {open && <div className="mobile-backdrop" onClick={onClose} />}
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-top">
        <Logo />
        <button className="icon-only sidebar-close" onClick={onClose} aria-label="Cerrar menú">
          <X size={19} />
        </button>
      </div>
      <div className="sidebar-workspace">
        <span className="workspace-icon"><Layers3 size={19} /></span>
        <div><strong>Espacio de trabajo</strong><small>Proyecto integrador III</small></div>
        <ChevronDown size={15} />
      </div>
      <div className="menu-caption">MENÚ PRINCIPAL</div>
      <nav aria-label="Navegación principal" className="nav-items">
        {navItems.map(nav => {
          const Icon = icons[nav.icon]
          return (
            <button 
              key={nav.id} 
              className={`nav-item ${active === nav.id ? 'active' : ''}`} 
              onClick={() => { onNavigate(nav.id); onClose(); }}
            >
              {Icon && <Icon size={19} strokeWidth={1.95} />}
              <span>{nav.label}</span>
              {nav.id === 'registros' && <span className="nav-count">{counts.registros}</span>}
            </button>
          )
        })}
      </nav>
      <div className="sidebar-lower">
        <div className="menu-caption">TU ESPACIO</div>
        <button className="nav-item" onClick={() => { onNavigate('acerca'); onClose(); }}>
          <BookOpen size={19} /><span>Sobre el proyecto</span>
        </button>
        <div className="sidebar-promo">
          <span className="sparkle-surface"><Sparkles size={22} /></span>
          <strong>Las grandes ideas empiezan con un reto.</strong>
          <p>Conecta empresas con soluciones que generan impacto.</p>
          <button onClick={() => { onNavigate('retos'); onClose(); }}>
            Explorar retos <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="sidebar-profile">
          <button className="sidebar-account-link" onClick={() => { onNavigate('perfil'); onClose(); }} aria-label="Ir a mi perfil">
            <Avatar name={account?.nombre || 'Invitado'} index={account?.id === DEMO_ACCOUNT_ID ? 4 : 1} />
            <span>
              <strong>{account?.nombre || 'Invitado'}</strong>
              <small>{account?.rol || 'Sin sesión'} · Demostración</small>
            </span>
          </button>
          <button className="icon-only profile-options" aria-label="Restablecer datos de demostración" title="Restablecer datos demo" onClick={onReset}>
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </aside>
  </>
}

export default Sidebar