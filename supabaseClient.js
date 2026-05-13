import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anon ? createClient(url, anon) : null;

export async function saveGame(userId, state) {
  if (!supabase || !userId) {
    localStorage.setItem('deliver_save', JSON.stringify(state));
    return { mode: 'local' };
  }
  const { error } = await supabase.from('game_saves').upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
  if (error) throw error;
  return { mode: 'cloud' };
}

export async function loadGame(userId) {
  if (!supabase || !userId) {
    const raw = localStorage.getItem('deliver_save');
    return raw ? JSON.parse(raw) : null;
  }
  const { data, error } = await supabase.from('game_saves').select('state').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data?.state || null;
}

export async function submitLeaderboard(userId, state) {
  if (!supabase || !userId) return { mode: 'disabled' };
  const score = state.level * 1000 + state.xp * 10 + state.metrics.reputation * 5 - state.metrics.burnout * 2;
  const { error } = await supabase.from('leaderboard').upsert({ user_id: userId, score, level: state.level, updated_at: new Date().toISOString() });
  if (error) throw error;
  return { mode: 'cloud', score };
}
