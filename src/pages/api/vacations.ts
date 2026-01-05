import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('vacations').select('*').order('start_date', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    }

    if (req.method === 'POST') {
      const payload = req.body;
      const { data, error } = await supabase.from('vacations').insert([payload]).select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ data });
    }

    return res.setHeader('Allow', ['GET', 'POST']).status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}
