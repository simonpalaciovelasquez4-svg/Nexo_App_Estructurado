import IconBubble from './IconBubble.jsx'
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
} from '../../utils/data.js'
function StatCard({icon:Icon,label,value,change,variant}){
  return <div className="stat-card">
    <div className="stat-heading"><IconBubble icon={Icon} variant={variant}/><ArrowUpRight size={17} className="stat-arrow"/></div>
    <strong className="stat-value">{displayCount(value)}</strong>
    <span className="stat-label">{label}</span>
    <div className="stat-footer"><span className={`stat-trend ${variant}`}><TrendingUp size={13}/>{change}</span><span>datos simulados</span></div>
  </div>
}

export default StatCard