import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

interface SearchFormData {
  nombre_campania?: string;
  medio?: string;
  programa_interes?: string;
  facultad?: string;
  tipo_campana?: string;
}

interface SearchResult {
  id: number;
  nombre_campania: string;
  medio: string;
  programa_interes: string;
  facultad: string;
  tipo_campana: string;
  grupo_count: number;
  anuncio_count: number;
}

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (filters: SearchFormData) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Create query parameters from filters
      const queryParams = new URLSearchParams();
      if (filters.nombre_campania) queryParams.set('nombre_campania', filters.nombre_campania);
      if (filters.medio) queryParams.set('medio', filters.medio);
      if (filters.programa_interes) queryParams.set('programa_interes', filters.programa_interes);
      if (filters.facultad) queryParams.set('facultad', filters.facultad);
      if (filters.tipo_campana) queryParams.set('tipo_campana', filters.tipo_campana);
      
      const response = await fetch(`/api/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search campaigns');
      }
      
      const searchResults = await response.json() as SearchResult[];
      setResults(searchResults);
      
      toast({
        title: "Búsqueda completada",
        description: `Se encontraron ${searchResults.length} resultado(s)`,
      });
      
    } catch (error: any) {
      console.error('Error searching campaigns:', error);
      toast({
        title: "Error",
        description: error.message || "Error al buscar campañas",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    setHasSearched(false);
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (!results || results.length === 0) {
      toast({
        title: "Error",
        description: "No hay resultados de búsqueda para exportar",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Exporting search results to CSV...');
      
      // Helper function to escape CSV values
      const escapeCSV = (value: any) => {
        const str = value === null || value === undefined ? '' : String(value);
        if (/[",\n]/.test(str)) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      // Build rows as arrays first, then escape and join
      const rows = results.map((result: SearchResult) => [
        result.nombre_campania ?? '',
        result.medio ?? '',
        result.programa_interes ?? '',
        result.facultad ?? '',
        result.tipo_campana ?? '',
        result.grupo_count ?? 0,
        result.anuncio_count ?? 0
      ]);

      const header = [
        'Campaña', 'Medio', 'Programa', 'Facultad', 'Tipo', 'Grupos', 'Anuncios'
      ];
      
      // Add UTF-8 BOM for Excel compatibility and proper CSV formatting
      const csvContent = '\uFEFF' + [header, ...rows]
        .map(row => row.map(escapeCSV).join(','))
        .join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `resultados-busqueda-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Éxito",
        description: "Resultados de búsqueda exportados exitosamente",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Error",
        description: "Error al exportar CSV",
        variant: "destructive",
      });
    }
  };

  const searchColumns = [
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
    },
    { 
      key: 'grupo_count', 
      label: '# Grupos',
      render: (value: number) => (
        <Badge variant="outline" data-testid={`badge-groups-${value}`}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'anuncio_count', 
      label: '# Anuncios',
      render: (value: number) => (
        <Badge variant="outline" data-testid={`badge-ads-${value}`}>
          {value}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Búsqueda Avanzada</h1>
      
      <SearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />

      {loading && (
        <DataTable
          title="Resultados de Búsqueda"
          columns={searchColumns}
          data={[]}
          loading={true}
        />
      )}

      {!loading && hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Resultados de Búsqueda ({results.length} encontrados)
            </h2>
            {results.length > 0 && (
              <Button
                onClick={handleExportCSV}
                data-testid="button-export-search-csv"
                className="hover-elevate active-elevate-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            )}
          </div>
          <DataTable
            title=""
            columns={searchColumns}
            data={results}
          />
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Use los filtros de arriba para buscar campañas, grupos de anuncios y anuncios.</p>
          <p className="text-sm mt-2">Los resultados mostrarán información consolidada con contadores de grupos y anuncios.</p>
        </div>
      )}
    </div>
  );
}