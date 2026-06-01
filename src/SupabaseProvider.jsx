import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase.js'

const Ctx = createContext(null)
export const useDB = () => useContext(Ctx)

// camelCase <-> snake_case helpers
const toCamel = (s) => s.replace(/_([a-z])/g, (_,c) => c.toUpperCase())
const toSnake = (s) => s.replace(/([A-Z])/g, '_$1').toLowerCase()

function mapKeys(obj, fn) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(i => mapKeys(i, fn))
  return Object.fromEntries(Object.entries(obj).map(([k,v]) => [fn(k), mapKeys(v, fn)]))
}

const fromDB = (row) => mapKeys(row, toCamel)
const toDB   = (obj) => mapKeys(obj, toSnake)

function useTable(table) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*')
    if (!error && data) setRows(data.map(fromDB))
    setLoading(false)
  }, [table])

  useEffect(() => {
    fetch()
    const ch = supabase.channel(`${table}-changes-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, fetch)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [table, fetch])

  const upsert = async (row) => {
    const { data, error } = await supabase.from(table).upsert(toDB(row)).select().single()
    if (!error) fetch()
    return { data: data ? fromDB(data) : null, error }
  }

  const insert = async (row) => {
    const { data, error } = await supabase.from(table).insert(toDB(row)).select().single()
    if (!error) fetch()
    return { data: data ? fromDB(data) : null, error }
  }

  const update = async (id, changes) => {
    const { error } = await supabase.from(table).update(toDB(changes)).eq('id', id)
    if (!error) fetch()
    return { error }
  }

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) fetch()
    return { error }
  }

  return { rows, loading, fetch, upsert, insert, update, remove, setRows }
}

export function SupabaseProvider({ children }) {
  const users        = useTable('et_users')
  const equipTypes   = useTable('et_equipment_types')
  const units        = useTable('et_units')
  const cableStock   = useTable('et_cable_stock')
  const projects     = useTable('et_projects')
  const quotes       = useTable('et_quotes')
  const faults       = useTable('et_fault_reports')
  const vehicles     = useTable('et_vehicles')
  const stockTakes   = useTable('et_stock_takes')
  const dryHire      = useTable('et_dry_hire')
  const freelancers  = useTable('et_freelancers')
  const prepSheets   = useTable('et_prep_sheets')
  const crew         = useTable('et_crew')

  // Login helper
  const loginUser = async (email, password) => {
    const { data, error } = await supabase
      .from('et_users').select('*')
      .eq('email', email).eq('password', password).single()
    return { data: data ? fromDB(data) : null, error }
  }

  const loading = users.loading || equipTypes.loading || units.loading

  const value = {
    users, equipTypes, units, cableStock, projects, quotes,
    faults, vehicles, stockTakes, dryHire, freelancers, prepSheets, crew,
    loginUser, loading, fromDB, toDB
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
