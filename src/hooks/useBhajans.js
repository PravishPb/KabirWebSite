import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useBhajans() {
  const [bhajans, setBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBhajans();
  }, []);

  async function fetchBhajans() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bhajans')
        .select('*')
        .order('sequence_order', { ascending: true });

      if (error) {
        console.error('Error fetching bhajans:', error);
        setError(error);
      } else {
        setBhajans(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching bhajans:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  // Admin functions
  async function addBhajan(bhajan) {
    const { data, error } = await supabase.from('bhajans').insert([bhajan]).select();
    if (!error && data) {
      setBhajans([...bhajans, data[0]]);
    }
    return { data, error };
  }

  async function updateBhajan(id, updates) {
    const { data, error } = await supabase.from('bhajans').update(updates).eq('id', id).select();
    if (!error && data) {
      setBhajans(bhajans.map(b => b.id === id ? data[0] : b));
    }
    return { data, error };
  }

  async function deleteBhajan(id) {
    const { error } = await supabase.from('bhajans').delete().eq('id', id);
    if (!error) {
      setBhajans(bhajans.filter(b => b.id !== id));
    }
    return { error };
  }

  return { bhajans, loading, error, addBhajan, updateBhajan, deleteBhajan, refetch: fetchBhajans };
}
