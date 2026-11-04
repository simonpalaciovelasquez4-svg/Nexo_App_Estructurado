import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  LayoutDashboard, Target, Building2, Tags, Flag, UsersRound, ClipboardList, Search,
  Bell, ChevronDown, ChevronRight, ArrowUpRight, Plus, ArrowRight, CalendarDays,
  ArrowLeft, Check, CheckCircle2, Clock3, CircleAlert, X, Menu, PanelLeftClose,
  Download, SlidersHorizontal, Pencil, Trash2, Eye, List, LayoutGrid, Sparkles,
  TrendingUp, Layers3, Zap, BookOpen, RotateCcw, ExternalLink, LockKeyhole,
  UserRound, CircleDot, MapPin, Mail, Phone, Hash, MoreHorizontal, ShieldCheck,
  FolderOpen, Info, AlertTriangle, CircleHelp, LogIn, LogOut, UserPlus, Settings2
} from 'lucide-react'
import {
  STORAGE_KEY, initialData, navItems, entityConfig, loadData, getName,
  formatDate, initials, firstName, displayCount
} from './utils/data.js'
import { LoginPage, RegisterPage, ProfilePage } from './features/auth/pages/AuthPages.jsx'
import { ACCOUNTS_KEY, SESSION_KEY, DEMO_ACCOUNT_ID, getDemoAccount, loadAccounts, loadSession, hashPassword, newSalt } from './features/auth/services/auth.js'
import  Dashboard  from './pages/Dashboard.jsx'
import AboutPage from './pages/AboutPage.jsx'
import  EntityPage  from './pages/EntityPage.jsx'
import  Sidebar  from './layouts/Sidebar.jsx'
import ModalShell from './layouts/ModalShell.jsx'
import AccountMenu from './components/common/AccountMenu.jsx'
import Avatar from './components/common/Avatar.jsx'
import ChallengeCard from './components/common/ChallengeCard.jsx'
import IconBubble from './components/common/IconBubble.jsx'
import Logo from './components/common/Logo.jsx'
import SectionHeading from './components/common/SectionHeading.jsx'
import StatCard from './components/common/StatCard.jsx'
import StatusBadge from './components/common/StatusBadge.jsx'
import FormModal from './components/modals/FormModal.jsx'
import DeleteModal from './components/modals/DeleteModal.jsx'
import DetailModal from './components/modals/DetailModal.jsx'
import ResetModal from './components/modals/ResetModal.jsx'

const icons = {LayoutDashboard,Target,Building2,Tags,Flag,UsersRound,ClipboardList}
const relationBlocking = {
  empresas:[['retos','empresaId','retos']],
  categorias:[['retos','categoriaId','retos']],
  prioridades:[['retos','prioridadId','retos']],
  usuarios:[['registros','usuarioId','registros']],
  retos:[['registros','retoId','registros']],
}
const colors = ['#f1a3bf','#94a9f8','#9bdcca','#fed69a','#b5a3e9','#c1c8d7']
const todayString = () => {
  const d=new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const makeId = prefix => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
const csvValue = value => `"${String(value ?? '').replace(/"/g,'""')}"`



export default function App(){
  const [data,setData]=useState(loadData)
  const [accounts,setAccounts]=useState(loadAccounts)
  const [sessionId,setSessionId]=useState(loadSession)
  const activeAccount=accounts.find(account=>account.id===sessionId)||null
  const resolvePage=()=>{const page=window.location.hash.slice(1)||'dashboard';return page==='dashboard'||page==='acerca'||page==='login'||page==='registro'||page==='perfil'||entityConfig[page]?page:'dashboard'}
  const [page,setPage]=useState(resolvePage)
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [modal,setModal]=useState(null)
  const [searches,setSearches]=useState({})
  const [filters,setFilters]=useState({})
  const [viewMode,setViewMode]=useState('cards')
  const [toast,setToast]=useState('')
  const searchRef=useRef(null)
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch{ /* storage can be unavailable */ }},[data])
  useEffect(()=>{try{localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(accounts))}catch{ /* no storage */ }},[accounts])
  useEffect(()=>{try{localStorage.setItem(SESSION_KEY,sessionId||'guest')}catch{ /* no storage */ }},[sessionId])
  useEffect(()=>{const sync=()=>setPage(resolvePage());window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[])
  useEffect(()=>{const handler=event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(page!=='retos')window.location.hash='retos';setTimeout(()=>searchRef.current?.focus(),60)}};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler)},[page])
  useEffect(()=>{if(!toast)return;const timeout=setTimeout(()=>setToast(''),4200);return()=>clearTimeout(timeout)},[toast])
  const navigate=next=>{window.location.hash=next;setPage(next);window.scrollTo({top:0,behavior:'smooth'})}
  const notify=message=>setToast(message)
  const login=async (email,password)=>{
    const normalized=email.trim().toLocaleLowerCase('es')
    const candidate=accounts.find(a=>a.id!==DEMO_ACCOUNT_ID&&a.correo.toLocaleLowerCase('es')===normalized)
    if(!candidate) return {ok:false,message:'Correo o contraseña incorrectos. Puedes crear una cuenta o entrar como demo.'}
    if(!candidate.salt||!candidate.passwordHash)return {ok:false,message:'Esta cuenta no tiene credenciales configuradas.'}
    if(await hashPassword(password,candidate.salt)!==candidate.passwordHash)return {ok:false,message:'Correo o contraseña incorrectos.'}
    const linked=data.usuarios.find(user=>user.id===candidate.usuarioId)
    if(!linked||linked.estado!=='Activo')return {ok:false,message:'Esta cuenta no está activa en el módulo Usuarios.'}
    setSessionId(candidate.id)
    navigate('perfil')
    notify(`¡Bienvenido de nuevo, ${candidate.nombre.split(' ')[0]}!`)
    return {ok:true}
  }
  const loginDemo=()=>{setSessionId(DEMO_ACCOUNT_ID);navigate('dashboard');notify('Ingresaste como administrador demo.')}
  const logout=()=>{setSessionId(null);navigate('login');notify('Sesión de demostración cerrada.')}
  const register=async form=>{
    const email=form.correo.trim().toLocaleLowerCase('es')
    if(accounts.some(a=>a.correo.toLocaleLowerCase('es')===email)||data.usuarios.some(u=>u.correo.toLocaleLowerCase('es')===email)){
      return {ok:false,message:'Este correo ya está registrado. Prueba con uno diferente.'}
    }
    const salt=newSalt()
    const passwordHash=await hashPassword(form.password,salt)
    const usuarioId=makeId('u')
    const account={id:makeId('cuenta'),usuarioId,nombre:form.nombre.trim(),correo:email,empresa:form.empresa.trim(),telefono:'',biografia:'',rol:'Participante',creadoEl:todayString(),salt,passwordHash}
    setAccounts(prev=>[...prev,account])
    setData(prev=>({...prev,usuarios:[{id:usuarioId,nombre:account.nombre,correo:email,rol:'Participante',estado:'Activo'},...prev.usuarios]}))
    setSessionId(account.id)
    navigate('perfil')
    notify('¡Tu cuenta ficticia está lista! Ya apareces en Usuarios.')
    return {ok:true}
  }
  const saveProfile=form=>{
    if(!activeAccount)return {ok:false,message:'Inicia sesión para editar tu perfil.'}
    const email=form.correo.trim().toLocaleLowerCase('es')
    if(accounts.some(a=>a.id!==activeAccount.id&&a.correo.toLocaleLowerCase('es')===email)||data.usuarios.some(u=>u.id!==activeAccount.usuarioId&&u.correo.toLocaleLowerCase('es')===email)){
      return {ok:false,message:'Este correo ya pertenece a otra cuenta o usuario.'}
    }
    const updated={nombre:form.nombre.trim(),correo:email,empresa:form.empresa.trim(),telefono:form.telefono.trim(),biografia:form.biografia.trim()}
    setAccounts(prev=>prev.map(a=>a.id===activeAccount.id?{...a,...updated}:a))
    if(activeAccount.usuarioId){setData(prev=>({...prev,usuarios:prev.usuarios.map(u=>u.id===activeAccount.usuarioId?{...u,nombre:updated.nombre,correo:email}:u)}))}
    notify('Perfil actualizado correctamente.')
    return {ok:true}
  }
  const openCreate=(type,values)=>setModal({kind:'form',type,initialValues:values})
  const openEdit=(type,item)=>setModal({kind:'form',type,item})
  const openView=item=>setModal({kind:'detail',itemId:item.id})
  const openDelete=(type,item)=>setModal({kind:'delete',type,item})
  const save=(type,row,isEdit)=>{
    setData(prev=>({...prev,[type]:isEdit?prev[type].map(r=>r.id===row.id?row:r):[row,...prev[type]]}))
    if(type==='usuarios'&&isEdit){setAccounts(prev=>prev.map(a=>a.usuarioId===row.id?{...a,nombre:row.nombre,correo:row.correo,rol:row.rol}:a))}
    setModal(null);notify(`${entityConfig[type].singular[0].toUpperCase()+entityConfig[type].singular.slice(1)} ${isEdit?'actualizado':'creado'} correctamente.`)
  }
  const deleteRow=(type,id)=>{
    setData(prev=>({...prev,[type]:prev[type].filter(r=>r.id!==id)}))
    if(type==='usuarios'){setAccounts(prev=>prev.filter(a=>a.usuarioId!==id));if(activeAccount?.usuarioId===id){setSessionId(null);navigate('login')}}
    setModal(null);notify('Registro eliminado correctamente.')
  }
  const reset=()=>{setData(structuredClone(initialData));setAccounts([getDemoAccount()]);setSessionId(DEMO_ACCOUNT_ID);setModal(null);setSearches({});setFilters({});navigate('dashboard');notify('Datos y cuentas ficticias restablecidos correctamente.')}
  const activeItem=navItems.find(nav=>nav.id===page)
  const accountPageLabels={login:'Iniciar sesión',registro:'Crear cuenta',perfil:'Mi perfil'}
  const relatedItem=modal?.kind==='detail'?data.retos.find(r=>r.id===modal.itemId):null
  const headerSearch=searches.retos??''
  const totalCounts={registros:data.registros.length}
  return <div className="app-shell">
    <Sidebar active={page} onNavigate={navigate} open={sidebarOpen} onClose={()=>setSidebarOpen(false)} counts={totalCounts} account={activeAccount} onReset={()=>setModal({kind:'reset'})}/>
    <div className="main-area"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-only" onClick={()=>setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={22}/></button><span className="topbar-location"><span>Workspace</span><ChevronRight size={14}/><strong>{activeItem?.label||accountPageLabels[page]||'Sobre el proyecto'}</strong></span></div>
      <div className="topbar-right"><label className="topbar-search"><Search size={18}/><input ref={searchRef} aria-label="Buscar retos globalmente" value={headerSearch} onFocus={()=>{if(page!=='retos') navigate('retos')}} onChange={event=>{setSearches(v=>({...v,retos:event.target.value}));if(page!=='retos')navigate('retos')}} placeholder="Buscar retos..."/><kbd>⌘ K</kbd></label><span className="topbar-divider"/><span className="demo-pill"><span/> DEMO</span><AccountMenu account={activeAccount} navigate={navigate} onLogout={logout}/></div>
    </header>
    <main id="contenido">{page==='login'?<LoginPage navigate={navigate} onLogin={login} onDemo={loginDemo} account={activeAccount}/>:page==='registro'?<RegisterPage navigate={navigate} onRegister={register}/>:page==='perfil'?<ProfilePage account={activeAccount} data={data} navigate={navigate} onSave={saveProfile} onLogout={logout} onView={openView}/>:page==='dashboard'?<Dashboard data={data} navigate={navigate} onView={openView} onCreate={openCreate} onRegister={values=>openCreate('registros',values)}/>:page==='acerca'?<AboutPage navigate={navigate} onReset={()=>setModal({kind:'reset'})} data={data}/>:entityConfig[page]?<EntityPage type={page} data={data} onCreate={openCreate} onEdit={openEdit} onDelete={openDelete} onView={openView} onRegister={values=>openCreate('registros',values)} search={searches[page]||''} setSearch={value=>setSearches(prev=>({...prev,[page]:value}))} filter={filters[page]||''} setFilter={value=>setFilters(prev=>({...prev,[page]:value}))} viewMode={viewMode} setViewMode={setViewMode} onNotify={notify}/>:null}</main>
    <footer className="app-footer"><span>© {new Date().getFullYear()} Nexo · Plataforma de retos empresariales</span><span>Frontend demo <span className="footer-dot">•</span> React + localStorage</span></footer>
    </div>
    {modal?.kind==='form'&&<FormModal key={`${modal.type}-${modal.item?.id||'new'}`} type={modal.type} item={modal.item} initialValues={modal.initialValues} data={data} onClose={()=>setModal(null)} onSave={save}/>}
    {modal?.kind==='delete'&&<DeleteModal type={modal.type} item={modal.item} data={data} onClose={()=>setModal(null)} onConfirm={deleteRow}/>}
    {modal?.kind==='detail'&&relatedItem&&<DetailModal item={relatedItem} data={data} onClose={()=>setModal(null)} onEdit={openEdit} onRegister={values=>openCreate('registros',values)}/>}
    {modal?.kind==='reset'&&<ResetModal onClose={()=>setModal(null)} onConfirm={reset}/>}
    {toast&&<div className="toast" role="status"><span className="toast-icon"><Check size={17}/></span>{toast}<button aria-label="Cerrar notificación" onClick={()=>setToast('')}><X size={16}/></button></div>}
  </div>
}
