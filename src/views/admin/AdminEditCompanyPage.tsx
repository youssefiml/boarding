import { useParams } from 'react-router-dom';

import { AdminCreateCompanyForm } from '@/views/admin/create-company/AdminCreateCompanyForm';

export function AdminEditCompanyPage() {
  const { companyId = '' } = useParams();

  return <AdminCreateCompanyForm mode="edit" companyId={companyId} />;
}
