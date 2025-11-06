import { CompleteView } from '../CompleteView';

export default function CompleteViewExample() {
  //todo: remove mock functionality
  const mockData = {
    campaigns: [
      {
        id: 1,
        nombre_campania: 'MBA Ejecutivo 2024',
        medio: 'Google Ads',
        programa_interes: 'MBA Ejecutivo',
        facultad: 'Administración',
        tipo_campana: 'Conversión',
        linea: 'Postgrado',
        modalidad_estudio: 'Presencial',
        lista_pardot: 'LST-MBA-001',
        url_programa: 'https://example.com/mba',
        adGroups: [
          {
            id: 1,
            nombre_grupo: 'Grupo Ejecutivos Senior',
            numero_grupo: 1,
            fsa: 'FSA-001',
            cohorte: '2024-1',
            tipo_publico: 'Ejecutivos',
            ads: [
              {
                id: 1,
                nombre_anuncio: 'MBA para Líderes',
                tipo_anuncio: 'Texto',
                nomenclatura_pardot: 'AD-MBA-001'
              },
              {
                id: 2,
                nombre_anuncio: 'Impulsa tu Carrera',
                tipo_anuncio: 'Display',
                nomenclatura_pardot: 'AD-MBA-002'
              }
            ]
          },
          {
            id: 2,
            nombre_grupo: 'Grupo Profesionales',
            numero_grupo: 2,
            fsa: 'FSA-002',
            cohorte: '2024-1',
            tipo_publico: 'Profesionales',
            ads: [
              {
                id: 3,
                nombre_anuncio: 'MBA Flexible',
                tipo_anuncio: 'Video',
                nomenclatura_pardot: 'AD-MBA-003'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        nombre_campania: 'Ingeniería de Sistemas',
        medio: 'Facebook Ads',
        programa_interes: 'Ingeniería de Sistemas',
        facultad: 'Ingeniería',
        tipo_campana: 'Reconocimiento',
        linea: 'Pregrado',
        modalidad_estudio: 'Virtual',
        lista_pardot: 'LST-ING-001',
        url_programa: 'https://example.com/ingenieria',
        adGroups: [
          {
            id: 3,
            nombre_grupo: 'Grupo Tecnología',
            numero_grupo: 1,
            fsa: 'FSA-003',
            cohorte: '2024-2',
            tipo_publico: 'Estudiantes',
            ads: [
              {
                id: 4,
                nombre_anuncio: 'Futuro en Tech',
                tipo_anuncio: 'Imagen',
                nomenclatura_pardot: 'AD-ING-001'
              }
            ]
          }
        ]
      }
    ]
  };

  const handleExportCSV = () => {
    console.log('CSV export requested');
  };

  return (
    <div className="p-4">
      <CompleteView data={mockData} onExportCSV={handleExportCSV} />
    </div>
  );
}