import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';

export const useSupabaseData = (tableName, localStorageKey) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  const fetchData = async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      const { data: supabaseData, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        toast({
          title: "Erreur de synchronisation",
          description: `Impossible de charger les données ${tableName}`,
          variant: "destructive"
        });
        return;
      }

      setData(supabaseData || []);
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Save data to Supabase
  const saveData = async (newData) => {
    if (!user) return;

    try {
      const dataToSave = {
        ...newData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (newData.id) {
        // Update existing record
        const { error } = await supabase
          .from(tableName)
          .update(dataToSave)
          .eq('id', newData.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from(tableName)
          .insert([{
            ...dataToSave,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error(`Error saving to ${tableName}:`, error);
      toast({
        title: "Erreur de sauvegarde",
        description: `Impossible de sauvegarder dans ${tableName}`,
        variant: "destructive"
      });
    }
  };

  // Delete data from Supabase
  const deleteData = async (id) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      toast({
        title: "Erreur de suppression",
        description: `Impossible de supprimer de ${tableName}`,
        variant: "destructive"
      });
    }
  };

  // Update multiple records
  const updateData = async (updatedData) => {
    setData(updatedData);
    // Note: For bulk updates, you might want to implement batch operations
  };

  useEffect(() => {
    fetchData();
  }, [user, tableName]);

  return [data, updateData, loading, saveData, deleteData, fetchData];
};