import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../services/supabase';

export function useDatabase(table) {
  const queryClient = useQueryClient();

  // Fetch all records from a table
  const useGetAll = (options = {}, queryOptions = {}) => {
    return useQuery(
      [table, options], 
      () => db.getAll(table, options),
      queryOptions
    );
  };

  // Create a new record
  const useCreate = () => {
    return useMutation(
      (data) => db.create(table, data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([table]);
        },
      }
    );
  };

  // Update a record
  const useUpdate = () => {
    return useMutation(
      ({ id, data }) => db.update(table, id, data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([table]);
        },
      }
    );
  };

  // Delete a record
  const useDelete = () => {
    return useMutation(
      (id) => db.delete(table, id),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([table]);
        },
      }
    );
  };

  return {
    useGetAll,
    useCreate,
    useUpdate,
    useDelete
  };
}