import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSakhis() {
  const [sakhis, setSakhis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSakhis();
  }, []);

  async function fetchSakhis() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sakhis')
        .select('*')
        .order('sequence_order', { ascending: true });

      if (error) {
        console.error('Error fetching sakhis:', error);
        setError(error);
      } else {
        setSakhis(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching sakhis:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return { sakhis, loading, error, refetch: fetchSakhis };
}
