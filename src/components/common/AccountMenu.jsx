import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronRight, UserRound, LogIn, UserPlus, LogOut } from 'lucide-react'
import Avatar from './Avatar' // Ajusta esta ruta si Avatar.jsx está en otra carpeta respecto a AccountMenu
import { DEMO_ACCOUNT_ID } from '../../features/auth/services/auth' // Ajusta según la ruta real de tu auth

function AccountMenu({account,navigate,onLogout}){
  const [open,setOpen]=useState(false)
  const menuRef=useRef(null)
  useEffect(()=>{
    if(!open)return
    const outside=event=>{if(!menuRef.current?.contains(event.target))setOpen(false)}
    const escape=event=>{if(event.key==='Escape')setOpen(false)}
    document.addEventListener('pointerdown',outside)
    document.addEventListener('keydown',escape)
    return ()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
  },[open])
  const go=page=>{setOpen(false);navigate(page)}
  return <div className="account-menu" ref={menuRef}>
    <button className={`account-trigger ${open?'is-open':''}`} onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-haspopup="menu" aria-label="Abrir menú de cuenta" title="Menú de cuenta">
      <Avatar name={account?.nombre||'Invitado'} index={account?.id===DEMO_ACCOUNT_ID?4:1}/><ChevronDown size={14}/>
    </button>
    {open&&<div className="account-dropdown" role="menu" aria-label="Opciones de cuenta">
      <div className="dropdown-user"><Avatar name={account?.nombre||'Invitado'} index={account?.id===DEMO_ACCOUNT_ID?4:1}/><div><strong>{account?.nombre||'Invitado'}</strong><span>{account?.correo||'Sin sesión iniciada'}</span></div></div>
      <div className="dropdown-caption">MI CUENTA</div>
      <button role="menuitem" className="dropdown-action" onClick={()=>go('perfil')}><UserRound size={17}/> Mi perfil <ChevronRight size={15}/></button>
      <button role="menuitem" className="dropdown-action" onClick={()=>go('login')}><LogIn size={17}/> {account?'Cambiar de cuenta':'Iniciar sesión'} <ChevronRight size={15}/></button>
      <button role="menuitem" className="dropdown-action" onClick={()=>go('registro')}><UserPlus size={17}/> Registrarse <ChevronRight size={15}/></button>
      {account&&<><div className="dropdown-separator"/><button role="menuitem" className="dropdown-action logout" onClick={()=>{setOpen(false);onLogout()}}><LogOut size={17}/> Cerrar sesión</button></>}
      <div className="dropdown-bottom"><span className="mini-live"/> Modo demostración · datos locales</div>
    </div>}
  </div>
}

export default AccountMenu
