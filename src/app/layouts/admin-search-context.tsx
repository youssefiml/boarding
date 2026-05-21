import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface AdminSearchContextValue {
  search: string;
  debouncedSearch: string;
  setSearch: (value: string) => void;
}

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');

  const value = useMemo(
    () => ({
      search,
      debouncedSearch: search,
      setSearch,
    }),
    [search]
  );

  return <AdminSearchContext.Provider value={value}>{children}</AdminSearchContext.Provider>;
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);

  if (!context) {
    return {
      search: '',
      debouncedSearch: '',
      setSearch: () => undefined,
    };
  }

  return context;
}
