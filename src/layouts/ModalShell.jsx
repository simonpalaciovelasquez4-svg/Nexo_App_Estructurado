function ModalShell({children,onClose,size='medium'}){
  useEffect(()=>{
    const handleKey=event=>{if(event.key==='Escape') onClose()}
    window.addEventListener('keydown',handleKey)
    document.body.style.overflow='hidden'
    return ()=>{window.removeEventListener('keydown',handleKey); document.body.style.overflow=''}
  },[onClose])
  return <div className="modal-overlay" onMouseDown={event=>{if(event.target===event.currentTarget) onClose()}}>
    <div className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-label="Diálogo de Nexo">{children}</div>
  </div>
}

export default ModalShell