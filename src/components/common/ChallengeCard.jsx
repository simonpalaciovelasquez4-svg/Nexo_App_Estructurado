
function ChallengeCard({reto,data,onView,onRegister,index=0}) {
  const empresa=getName(data,'empresas',reto.empresaId)
  const prioridad=getName(data,'prioridades',reto.prioridadId)
  const categoria=getName(data,'categorias',reto.categoriaId)
  return <article className="challenge-card">
    <div className="challenge-card-head"><span className={`challenge-icon challenge-tone-${index%5}`}><Target size={21}/></span><StatusBadge value={reto.estado}/></div>
    <div className="challenge-company">{empresa}</div>
    <button className="challenge-title" onClick={()=>onView(reto)}>{reto.nombre}</button>
    <p>{reto.descripcion}</p>
    <div className="challenge-tags"><span>{categoria}</span><StatusBadge priority value={prioridad}/></div>
    <div className="challenge-card-footer"><span><CalendarDays size={15}/> Hasta {formatDate(reto.fechaFin)}</span><button onClick={()=>onView(reto)} aria-label={`Ver detalle de ${reto.nombre}`}><ArrowUpRight size={20}/></button></div>
  </article>
}

export default ChallengeCard