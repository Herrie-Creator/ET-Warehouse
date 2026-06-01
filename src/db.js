// ── Supabase DB helpers — all CRUD + realtime ──────────────────
import { supabase } from './supabase.js'

// ── USERS ─────────────────────────────────────────────────────
export const getUsers      = () => supabase.from('et_users').select('*')
export const createUser    = (u) => supabase.from('et_users').insert(u).select().single()
export const updateUser    = (id,u) => supabase.from('et_users').update(u).eq('id',id)
export const deleteUser    = (id) => supabase.from('et_users').delete().eq('id',id)
export const loginUser     = (email,pw) => supabase.from('et_users').select('*').eq('email',email).eq('password',pw).single()

// ── EQUIPMENT TYPES ───────────────────────────────────────────
export const getEquipTypes  = () => supabase.from('et_equipment_types').select('*').order('category').order('name')
export const createEquipType= (t) => supabase.from('et_equipment_types').insert(t).select().single()
export const updateEquipType= (id,t) => supabase.from('et_equipment_types').update(t).eq('id',id)
export const deleteEquipType= (id) => supabase.from('et_equipment_types').delete().eq('id',id)

// ── UNITS ─────────────────────────────────────────────────────
export const getUnits   = () => supabase.from('et_units').select('*').order('serial')
export const createUnit = (u) => supabase.from('et_units').insert(u).select().single()
export const updateUnit = (id,u) => supabase.from('et_units').update(u).eq('id',id)
export const deleteUnit = (id) => supabase.from('et_units').delete().eq('id',id)

// ── CABLE STOCK ───────────────────────────────────────────────
export const getCableStock   = () => supabase.from('et_cable_stock').select('*')
export const updateCableStock= (id,c) => supabase.from('et_cable_stock').update(c).eq('id',id)
export const createCableStock= (c) => supabase.from('et_cable_stock').insert(c).select().single()

// ── PROJECTS ─────────────────────────────────────────────────
export const getProjects   = () => supabase.from('et_projects').select('*').order('start_date')
export const createProject = (p) => supabase.from('et_projects').insert(p).select().single()
export const updateProject = (id,p) => supabase.from('et_projects').update(p).eq('id',id)
export const deleteProject = (id) => supabase.from('et_projects').delete().eq('id',id)

// ── QUOTES ───────────────────────────────────────────────────
export const getQuotes   = () => supabase.from('et_quotes').select('*').order('created_at',{ascending:false})
export const createQuote = (q) => supabase.from('et_quotes').insert(q).select().single()
export const updateQuote = (id,q) => supabase.from('et_quotes').update(q).eq('id',id)
export const deleteQuote = (id) => supabase.from('et_quotes').delete().eq('id',id)

// ── FAULT REPORTS ─────────────────────────────────────────────
export const getFaults   = () => supabase.from('et_fault_reports').select('*').order('logged_at',{ascending:false})
export const createFault = (f) => supabase.from('et_fault_reports').insert(f).select().single()
export const updateFault = (id,f) => supabase.from('et_fault_reports').update(f).eq('id',id)

// ── VEHICLES ─────────────────────────────────────────────────
export const getVehicles   = () => supabase.from('et_vehicles').select('*')
export const createVehicle = (v) => supabase.from('et_vehicles').insert(v).select().single()
export const updateVehicle = (id,v) => supabase.from('et_vehicles').update(v).eq('id',id)
export const deleteVehicle = (id) => supabase.from('et_vehicles').delete().eq('id',id)

// ── STOCK TAKES ───────────────────────────────────────────────
export const getStockTakes   = () => supabase.from('et_stock_takes').select('*').order('created_at',{ascending:false})
export const createStockTake = (s) => supabase.from('et_stock_takes').insert(s).select().single()

// ── DRY HIRE ─────────────────────────────────────────────────
export const getDryHire   = () => supabase.from('et_dry_hire').select('*').order('logged_at',{ascending:false})
export const createDryHire= (d) => supabase.from('et_dry_hire').insert(d).select().single()
export const updateDryHire= (id,d) => supabase.from('et_dry_hire').update(d).eq('id',id)
export const deleteDryHire= (id) => supabase.from('et_dry_hire').delete().eq('id',id)

// ── FREELANCERS ───────────────────────────────────────────────
export const getFreelancers   = () => supabase.from('et_freelancers').select('*')
export const createFreelancer = (f) => supabase.from('et_freelancers').insert(f).select().single()
export const updateFreelancer = (id,f) => supabase.from('et_freelancers').update(f).eq('id',id)
export const deleteFreelancer = (id) => supabase.from('et_freelancers').delete().eq('id',id)

// ── PREP SHEETS ───────────────────────────────────────────────
export const getPrepSheets   = () => supabase.from('et_prep_sheets').select('*').order('uploaded_at',{ascending:false})
export const createPrepSheet = (p) => supabase.from('et_prep_sheets').insert(p).select().single()
export const updatePrepSheet = (id,p) => supabase.from('et_prep_sheets').update(p).eq('id',id)
export const deletePrepSheet = (id) => supabase.from('et_prep_sheets').delete().eq('id',id)

// ── CREW ─────────────────────────────────────────────────────
export const getCrew   = () => supabase.from('et_crew').select('*')
export const createCrew= (c) => supabase.from('et_crew').insert(c).select().single()
export const updateCrew= (id,c) => supabase.from('et_crew').update(c).eq('id',id)
export const deleteCrew= (id) => supabase.from('et_crew').delete().eq('id',id)

// ── REALTIME SUBSCRIPTIONS ────────────────────────────────────
export function subscribeAll(handlers) {
  const tables = ['et_projects','et_quotes','et_units','et_equipment_types',
    'et_cable_stock','et_fault_reports','et_vehicles','et_stock_takes',
    'et_dry_hire','et_freelancers','et_prep_sheets','et_crew','et_users']
  const channels = tables.map(table =>
    supabase.channel(`rt-${table}`)
      .on('postgres_changes',{event:'*',schema:'public',table},(payload)=>{
        if(handlers[table]) handlers[table](payload)
      })
      .subscribe()
  )
  return () => channels.forEach(c => supabase.removeChannel(c))
}
