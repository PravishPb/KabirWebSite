import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching events:', error);
      setError(error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    const { error } = await supabase.from('events').insert([eventData]);
    if (!error) {
      await fetchEvents();
    }
    return { error };
  };

  const updateEvent = async (id, eventData) => {
    const { error } = await supabase.from('events').update(eventData).eq('id', id);
    if (!error) {
      await fetchEvents();
    }
    return { error };
  };

  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      await fetchEvents();
    }
    return { error };
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
}
