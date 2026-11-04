
function IconBubble({icon:Icon,variant='rose',size=18}) {
  return <span className={`icon-bubble ${variant}`}><Icon size={size} strokeWidth={2}/></span>
}
export default IconBubble