function FormModal({type,item,data,onClose,onSave,initialValues}){
  const cfg=entityConfig[type]
  const initial=useMemo(()=>cfg.fields.reduce((acc,field)=>{
    acc[field.name]=item?.[field.name]??initialValues?.[field.name]??(field.name==='fechaRegistro'||field.name==='fechaInicio'?todayString():field.type==='select'?field.options[0]:'')
    return acc
  },{}),[cfg,item,initialValues])
  const [form,setForm]=useState(initial)
  const [error,setError]=useState('')
  const save=event=>{
    event.preventDefault()
    const missing=cfg.fields.find(field=>field.required&&!String(form[field.name]??'').trim())
    if(missing){setError(`Completa el campo «${missing.label}».`);return}
    if(type==='retos'&&form.fechaFin<form.fechaInicio){setError('La fecha de cierre no puede ser anterior a la fecha de inicio.');return}
    if(type==='registros'&&data.registros.some(reg=>reg.usuarioId===form.usuarioId&&reg.retoId===form.retoId&&reg.id!==item?.id)){
      setError('Este usuario ya está inscrito en ese reto. Elige otra combinación.');return
    }
    if((type==='usuarios'||type==='empresas')&&form.correo&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)){setError('Ingresa un correo electrónico válido.');return}
    if(type==='usuarios'&&data.usuarios.some(user=>user.correo.toLowerCase()===form.correo.toLowerCase()&&user.id!==item?.id)){setError('Ese correo ya está registrado.');return}
    const cleaned={...form}
    for(const field of cfg.fields){if(field.type==='number') cleaned[field.name]=Number(form[field.name]);else cleaned[field.name]=String(form[field.name]??'').trim()}
    onSave(type,{...cleaned,id:item?.id??makeId(type.slice(0,1))},Boolean(item))
  }
  return <ModalShell onClose={onClose} size="large"><form onSubmit={save}>
    <div className="modal-header"><div><div className="eyebrow">{item?'EDITAR REGISTRO':'CREAR NUEVO REGISTRO'}</div><h2>{item?'Editar':'Nuevo'} {cfg.singular}</h2><p>Completa la información para {item?'actualizar':'agregar'} {type==='registros'?'la participación':`este ${cfg.singular}`}.</p></div><button type="button" className="modal-x" onClick={onClose} aria-label="Cerrar"><X size={21}/></button></div>
    <div className="modal-body"><div className="form-grid">{cfg.fields.map(field=><label key={field.name} className={`form-field ${field.span===2?'full':''}`}><span>{field.label}{field.required&&<em>*</em>}</span>{field.type==='textarea'?<textarea rows={4} value={form[field.name]??''} placeholder={field.placeholder??''} onChange={event=>{setForm(v=>({...v,[field.name]:event.target.value}));setError('')}}/>:field.type==='relation'?<select required={field.required} value={form[field.name]??''} onChange={event=>{setForm(v=>({...v,[field.name]:event.target.value}));setError('')}}><option value="">Selecciona {field.label.toLowerCase()}</option>{data[field.source].map(source=><option key={source.id} value={source.id}>{source.nombre}</option>)}</select>:field.type==='select'?<select required={field.required} value={form[field.name]??''} onChange={event=>{setForm(v=>({...v,[field.name]:event.target.value}));setError('')}}>{field.options.map(option=><option key={option}>{option}</option>)}</select>:<input required={field.required} type={field.type||'text'} min={field.min??undefined} placeholder={field.placeholder??''} value={form[field.name]??''} onChange={event=>{setForm(v=>({...v,[field.name]:event.target.value}));setError('')}}/>}</label>)}</div>
      {type==='registros'&&<div className="form-hint"><Info size={16}/> Cada usuario puede tener una inscripción por reto. Las inscripciones son simuladas.</div>}
      {error&&<div className="form-error" role="alert"><CircleAlert size={17}/>{error}</div>}
    </div>
    <div className="modal-footer"><button className="btn btn-outline" type="button" onClick={onClose}>Cancelar</button><button className="btn btn-primary" type="submit"><Check size={18}/>{item?'Guardar cambios':'Crear registro'}</button></div>
  </form></ModalShell>
}

export default FormModal