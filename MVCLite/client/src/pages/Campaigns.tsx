import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { CampaignForm } from "@/components/CampaignForm";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import type { Campaign, InsertCampaign } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function CampaignsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  // Fetch campaigns data
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['/api/campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      return response.json() as Promise<Campaign[]>;
    }
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: InsertCampaign) => {
      const response = await apiRequest('POST', '/api/campaigns', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      toast({
        title: "Éxito",
        description: "Campaña creada exitosamente",
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la campaña",
        variant: "destructive",
      });
    }
  });

  // Update campaign mutation
  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertCampaign }) => {
      const response = await apiRequest('PUT', `/api/campaigns/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      toast({
        title: "Éxito",
        description: "Campaña actualizada exitosamente",
      });
      setEditingCampaign(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la campaña",
        variant: "destructive",
      });
    }
  });

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      toast({
        title: "Éxito",
        description: "Campaña eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la campaña",
        variant: "destructive",
      });
    }
  });

  const columns = [
    { key: 'nombre_campania', label: 'Campaña' },
    { key: 'medio', label: 'Medio' },
    { key: 'programa_interes', label: 'Programa de Interés' },
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
    { key: 'modalidad_estudio', label: 'Modalidad' },
  ];

  const handleCreateCampaign = (data: InsertCampaign) => {
    createCampaignMutation.mutate(data);
  };

  const handleUpdateCampaign = (data: InsertCampaign) => {
    if (editingCampaign) {
      updateCampaignMutation.mutate({ id: editingCampaign.id, data });
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    deleteCampaignMutation.mutate(campaign.id);
  };

  const handleNewCampaign = () => {
    setEditingCampaign(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Campañas</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Campañas</h1>
        </div>
        <div className="text-center py-12 text-destructive">
          Error al cargar las campañas. Por favor, intenta de nuevo.
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            {editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setEditingCampaign(null);
            }}
            data-testid="button-cancel-form"
            className="hover-elevate active-elevate-2"
          >
            Volver a Lista
          </Button>
        </div>
        <CampaignForm
          onSubmit={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
          initialData={editingCampaign ? {
            medio: editingCampaign.medio || "",
            programa_interes: editingCampaign.programa_interes || "",
            tipo_campana: editingCampaign.tipo_campana || "",
            nombre_campania: editingCampaign.nombre_campania || "",
            nomenclatura_programa: editingCampaign.nomenclatura_programa || "",
            modalidad_estudio: editingCampaign.modalidad_estudio || "",
            linea: editingCampaign.linea || "",
            facultad: editingCampaign.facultad || "",
            nomenclatura_modalidad: editingCampaign.nomenclatura_modalidad || "",
            nomenclatura_linea: editingCampaign.nomenclatura_linea || "",
            nomenclatura_tipo_campana: editingCampaign.nomenclatura_tipo_campana || "",
            nomenclatura_modalidad3: editingCampaign.nomenclatura_modalidad3 || "",
            nombre_sf: editingCampaign.nombre_sf || "",
            url_programa: editingCampaign.url_programa || "",
            lista_pardot: editingCampaign.lista_pardot || "",
          } : undefined}
          isEditing={!!editingCampaign}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Campañas</h1>
        <Button 
          onClick={handleNewCampaign}
          data-testid="button-new-campaign"
          className="hover-elevate active-elevate-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-total-campaigns">
              {campaigns.length}
            </div>
            <p className="text-xs text-muted-foreground">Total Campañas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-active-campaigns">
              {campaigns.filter(c => c.tipo_campana === 'Conversión').length}
            </div>
            <p className="text-xs text-muted-foreground">Conversión</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-recognition-campaigns">
              {campaigns.filter(c => c.tipo_campana === 'Reconocimiento').length}
            </div>
            <p className="text-xs text-muted-foreground">Reconocimiento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-unique-programs">
              {new Set(campaigns.map(c => c.programa_interes)).size}
            </div>
            <p className="text-xs text-muted-foreground">Programas Únicos</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Lista de Campañas"
        columns={columns}
        data={campaigns}
        onEdit={handleEditCampaign}
        onDelete={handleDeleteCampaign}
      />
    </div>
  );
}