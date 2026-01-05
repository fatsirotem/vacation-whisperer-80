import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (use SERVICE_ROLE on server only)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // return all vacations
      const { data, error } = await supabase.from('vacations').select('*').order('startDate', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    }

    if (req.method === 'POST') {
      const payload = req.body;
      // Expected payload shape: { employeeId, startDate, endDate, type, notes, createdAt, id }
      const { data, error } = await supabase.from('vacations').insert([payload]).select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ data });
    }

    return res.setHeader('Allow', ['GET', 'POST']).status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}
