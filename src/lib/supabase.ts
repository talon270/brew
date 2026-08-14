/**
 * Supabase client.
 *
 * The app is fully usable signed-out and with no backend configured at all —
 * the guide, grinders, beans, timer and tracker are local. Supabase only backs
 * the community cafe layer, so everything here degrades to `null` rather than
 * throwing when the environment variables are absent.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { BrewMethod } from './types'

export type CafeStatus = 'pending' | 'approved' | 'rejected'
export type RoastProfile = 'light' | 'medium' | 'dark' | 'mixed'
export type PriceBand = 'budget' | 'mid' | 'premium'
export type UserRole = 'user' | 'moderator' | 'admin'

export interface Cafe {
  id: string
  name: string
  area: string
  address: string | null
  lat: number | null
  lng: number | null
  roaster: string | null
  roasts_own: boolean
  brew_methods: BrewMethod[]
  serves_filter_coffee: boolean
  roast_profile: RoastProfile | null
  price_band: PriceBand | null
  has_seating: boolean | null
  has_wifi: boolean | null
  has_outdoor: boolean | null
  notes: string | null
  status: CafeStatus
  created_by: string | null
  created_at: string
}

export interface Profile {
  id: string
  display_name: string | null
  role: UserRole
  created_at: string
}

export interface CafeReview {
  id: string
  cafe_id: string
  author_id: string
  rating: number
  what_you_ordered: string | null
  body: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> }
      cafes: {
        Row: Cafe
        Insert: Omit<Cafe, 'id' | 'created_at' | 'status'> & { status?: CafeStatus }
        Update: Partial<Cafe>
      }
      cafe_reviews: {
        Row: CafeReview
        Insert: Omit<CafeReview, 'id' | 'created_at'>
        Update: Partial<CafeReview>
      }
    }
  }
}

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Null when the backend is not configured. Callers must handle that — it is
 * the normal state during Phases 1-2 and for anyone running the app locally
 * without a Supabase project.
 */
export const supabase: SupabaseClient<Database> | null =
  url && anonKey ? createClient<Database>(url, anonKey) : null

export function isBackendConfigured(): boolean {
  return supabase !== null
}
