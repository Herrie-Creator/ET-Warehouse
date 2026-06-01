import { createClient } from '@supabase/supabase-js'
const URL = 'https://spatewquhntltwyoitbm.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYXRld3F1aG50bHR3eW9pdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTkwNjQsImV4cCI6MjA5NTMzNTA2NH0.379V-ooNcM3gj-BuYlPkGbByhju6p2_2brxmx_IKZew'
export const supabase = createClient(URL, KEY)
