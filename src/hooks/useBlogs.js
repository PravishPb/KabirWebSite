import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching blogs:', error);
      setError(error);
    } else {
      setBlogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const addBlog = async (blogData) => {
    const { error } = await supabase.from('blogs').insert([blogData]);
    if (!error) {
      await fetchBlogs();
    }
    return { error };
  };

  const updateBlog = async (id, blogData) => {
    const { error } = await supabase.from('blogs').update(blogData).eq('id', id);
    if (!error) {
      await fetchBlogs();
    }
    return { error };
  };

  const deleteBlog = async (id) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) {
      await fetchBlogs();
    }
    return { error };
  };

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    addBlog,
    updateBlog,
    deleteBlog
  };
}
