import { CompleteView } from "@/components/CompleteView";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function CompletePage() {
  const { toast } = useToast();

  // Fetch complete hierarchy data from API
  const { data: completeData, isLoading, error } = useQuery({
    queryKey: ['/api/complete'],
    queryFn: async () => {
      const response = await fetch('/api/complete');
      if (!response.ok) {
        throw new Error('Failed to fetch complete hierarchy');
      }
      return response.json();
    }
  });

  // Handle errors with useEffect to avoid re-triggering toasts
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Error al cargar la vista completa",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleExportCSV = () => {
    if (!completeData?.campaigns) {
      toast({
        title: "Error",
        description: "No hay datos disponibles para exportar",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Exporting complete data to CSV...');
      
      // Helper function to escape CSV values
      const escapeCSV = (value: any) => {
        const str = value === null || value === undefined ? '' : String(value);
        if (/[",\n]/.test(str)) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      // Build rows as arrays first, then escape and join
      const rows = completeData.campaigns.flatMap((campaign: any) =>
        (campaign.adGroups || []).flatMap((group: any) =>
          (group.ads || []).map((ad: any) => [
            campaign.nombre_campania ?? '',
            campaign.medio ?? '',
            campaign.programa_interes ?? '',
            campaign.facultad ?? '',
            campaign.tipo_campana ?? '',
            campaign.linea ?? '',
            campaign.modalidad_estudio ?? '',
            campaign.lista_pardot ?? '',
            campaign.url_programa ?? '',
            `${group.numero_grupo ?? ''} - ${group.nombre_grupo ?? ''}`,
            group.fsa ?? '',
            group.cohorte ?? '',
            group.tipo_publico ?? '',
            ad.nombre_anuncio ?? '',
            ad.tipo_anuncio ?? '',
            ad.nomenclatura_pardot ?? ''
          ])
        )
      );

      const header = [
        'Campaña', 'Medio', 'Programa', 'Facultad', 'Tipo', 'Línea', 
        'Modalidad', 'Lista Pardot', 'URL', 'Grupo', 'FSA', 'Cohorte', 
        'Tipo Público', 'Anuncio', 'Tipo Anuncio', 'Nomenclatura Pardot'
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
        link.setAttribute('download', `vista-completa-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Éxito",
        description: "CSV exportado exitosamente",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Vista Completa</h1>
        <p className="text-muted-foreground mt-1">
          Visualización jerárquica completa de campañas, grupos de anuncios y anuncios individuales
        </p>
      </div>

      <CompleteView 
        data={completeData || { campaigns: [] }}
        onExportCSV={handleExportCSV}
        loading={isLoading}
      />
    </div>
  );
}