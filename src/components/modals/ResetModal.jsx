function ResetModal({onClose,onConfirm}){
  return <ModalShell onClose={onClose} size="small"><div className="delete-body"><span className="delete-icon blocked"><RotateCcw size={26}/></span><h2>¿Restablecer la demo?</h2><p>Se restaurarán los datos ficticios originales y se eliminarán las cuentas creadas para la demo en este navegador. Esta acción no se puede deshacer.</p></div><div className="modal-footer"><button className="btn btn-outline" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={onConfirm}><RotateCcw size={17}/> Restablecer</button></div></ModalShell>
}

export default ResetModal