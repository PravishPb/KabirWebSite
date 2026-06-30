import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news_announcements')
      .select('*')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching news:', error);
      setError(error);
    } else {
      setNews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const addNews = async (newsData) => {
    const { error } = await supabase.from('news_announcements').insert([newsData]);
    if (!error) {
      await fetchNews();
    }
    return { error };
  };

  const updateNews = async (id, newsData) => {
    const { error } = await supabase.from('news_announcements').update(newsData).eq('id', id);
    if (!error) {
      await fetchNews();
    }
    return { error };
  };

  const deleteNews = async (id) => {
    const { error } = await supabase.from('news_announcements').delete().eq('id', id);
    if (!error) {
      await fetchNews();
    }
    return { error };
  };

  return {
    news,
    loading,
    error,
    fetchNews,
    addNews,
    updateNews,
    deleteNews
  };
}
