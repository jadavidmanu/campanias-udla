import { DataTable } from '../DataTable';
import { Badge } from '@/components/ui/badge';

export default function DataTableExample() {
  //todo: remove mock functionality
  const mockData = [
    { 
      id: 1, 
      nombre_campania: 'Campaña MBA 2024', 
      medio: 'Google Ads',
      programa_interes: 'MBA Ejecutivo',
      facultad: 'Administración',
      tipo_campana: 'Conversión'
    },
    { 
      id: 2, 
      nombre_campania: 'Ingeniería Digital', 
      medio: 'Facebook Ads',
      programa_interes: 'Ing. Sistemas',
      facultad: 'Ingeniería',
      tipo_campana: 'Reconocimiento'
    },
    { 
      id: 3, 
      nombre_campania: 'Derecho Corporativo', 
      medio: 'LinkedIn Ads',
      programa_interes: 'Derecho',
      facultad: 'Derecho',
      tipo_campana: 'Conversión'
    }
  ];

  const columns = [
    { key: 'nombre_campania', label: 'Campaña' },
    { key: 'medio', label: 'Medio' },
    { key: 'programa_interes', label: 'Programa' },
    { key: 'facultad', label: 'Facultad' },
    { 
      key: 'tipo_campana', 
      label: 'Tipo',
      render: (value: string) => (
        <Badge variant={value === 'Conversión' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const handleEdit = (item: any) => console.log('Edit:', item);
  const handleDelete = (item: any) => console.log('Delete:', item);
  const handleView = (item: any) => console.log('View:', item);

  return (
    <div className="p-4">
      <DataTable
        title="Campañas Activas"
        columns={columns}
        data={mockData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}