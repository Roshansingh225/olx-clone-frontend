
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wnkdqesmhnydmrvlovac.supabase.co'
const supabaseKey = 'sb_publishable_CjN8aMKeJmyiyt0IbarfOg_egKbjgHf'

export const supabase = createClient(supabaseUrl, supabaseKey)

