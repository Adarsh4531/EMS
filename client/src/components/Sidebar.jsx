import { Calendar, ChevronRight, DollarSign, FileText, LayoutGridIcon, Loader2, LogOut, Menu, Settings, User, UserIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { dummyProfileData } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Sidebar = () => {

  const {pathname} = useLocation()
  const [userName, setUserName] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const{user,loading,logout} = useAuth()


  useEffect(()=>{
    api.get("/profile").then(({data})=>{
      if(data.firstName ) setUserName(`${data.firstName} ${data.lastName ||""}`.trim());
    })
  },[] )

  // close mobile sidebar on route change
 
  useEffect(()=>{
   setMobileOpen(false)
  },[pathname])

  const role = user?.role

  const navItems = [
    {name :"Dashboard",href:"/dashboard",icon:LayoutGridIcon},
    role === "ADMIN"  ? 
    {name :"Employees",href:"/employees",icon:UserIcon} : 

    {name :"Attendence",href:"/attendence",icon:Calendar},

    {name :"Leave",href:"/leave",icon:FileText},

    {name :"Payslips",href:"/payslips",icon:DollarSign},

    {name :"Settings",href:"/settings",icon:Settings},



  ]


  const handleLogOut =()=>{
    logout()
    window.location.href = "/login"
  }

  const sidebarContent = (
    <>

      {/* Brand Header */}

      <div className='px-5 pt-6 pb-5 border-b border-white/6'>
          <div className='flex items-center justify-between'>

              <div className='flex items-center gap-3'>
                    <User className='text-white size-7'/>
                  <div>
                    <p className='font-semibold text-[13px] text-white tracking-wide'>Employee MS</p>
                    <p className='text-[11px] text-slate-500 font-medium'>Management System</p>
                  </div>
              </div>
              {/* close button mobile */}
              <button onClick={()=>setMobileOpen(false)} className='lg:hidden text-slate-400 hover:text-white p-1'>
                <X size={20} />
              </button>
          </div>

      </div>

      {/* Profile Card */}

      {userName && (
        <div className='mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0'>
                <span className='text-slate-400 text-xs font-semibold'>
                    {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className='min-w-0'>
                  <p className='text-[13px] font-medium text-slate-200 truncate'>{userName}</p>
                  <p className='text-[11px] text-slate-500 truncate'>{role === "ADMIN" ? "Administration" : "Employee"}</p>
              </div>
            </div>
        </div>
      )}

      {/* Section label */}

      <div className='px-5 pt-5 pb-2'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Navigation</p>
      </div>

      {/* Nav list */}

      <div className='flex-1 px-3 space-y-o.5 overflow-y-auto'>
        {loading ? (
          <div className='flex items-center gap-2 text-slate-500'>
            <Loader2 className='w-4 h-4 animate-spin'/>
            <span className='text-sm'>Loading...</span>

          </div>
        ):(
          navItems.map((item)=>{
          const isActive = pathname.startsWith(navItems.href)
          return(
            <Link key={item.name} to={item.href} className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${isActive ? "bg-indigo-500/12 text-indigo-300" : "text-slate-300 hover:text-white hover:bg-white/4"}`}>
            {isActive && <div className='absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500'/>}

            <item.icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-indigo-300" :"text-slate-400 group-hover:text-slate-300"}`}/>
            <span className='flex-1'>{item.name}</span>
            {isActive && <ChevronRight className='w-3.5 h-3.5 text-indigo-500/50' />}
            
            </Link>
          )
        })
        )}
        

      </div>

      {/* Log Out */}

      <div className='p-3 border-t border-white/6'>
        <button onClick={handleLogOut} className='flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150'>
          <LogOut className='w-[17px] h-[17px]'/>
          <span>Log Out</span>
        </button>
      </div>


    </>
  )
  

  return (
    <>

      {/* Mobile hamburger button */}

      <button onClick={()=>setMobileOpen(true)} className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10'>
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}

      {mobileOpen && <div onClick={()=>setMobileOpen(false)} className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 '/>}

      {/* Sidebar - desktop */}

      <aside className='hidden lg:flex flex-col h-full w-[250px] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4'>
        {sidebarContent}
      </aside>
    
      {/* Sidebar - desktop */}

      <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>
     
    </>
  )
}

export default Sidebar