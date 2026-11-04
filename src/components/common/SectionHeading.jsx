function SectionHeading({eyebrow,title,subtitle,right}){
  return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{right}</div>
}

export default SectionHeading