import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { AdGroupForm } from "@/components/AdGroupForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowLeft } from "lucide-react";
import type { AdGroup, Campaign, InsertAdGroup } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdGroupsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingAdGroup, setEditingAdGroup] = useState<(AdGroup & { campaign_name: string }) | null>(null);
  const { toast } = useToast();

  // Fetch ad groups data with campaign names
  const { data: adGroups = [], isLoading, error } = useQuery({
    queryKey: ['/api/ad-groups'],
    queryFn: async () => {
      const [adGroupsResponse, campaignsResponse] = await Promise.all([
        fetch('/api/ad-groups'),
        fetch('/api/campaigns')
      ]);
      
      if (!adGroupsResponse.ok || !campaignsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const adGroups = await adGroupsResponse.json() as AdGroup[];
      const campaigns = await campaignsResponse.json() as Campaign[];
      
      // Join ad groups with campaign names
      return adGroups.map(adGroup => {
        const campaign = campaigns.find(c => c.id === adGroup.campaign_id);
        return {
          ...adGroup,
          campaign_name: campaign?.nombre_campania || 'Unknown Campaign'
        };
      });
    }
  });

  // Fetch campaigns for dropdown
  const { data: campaigns = [] } = useQuery({
    queryKey: ['/api/campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      return response.json() as Promise<Campaign[]>;
    }
  });

  // Create ad group mutation
  const createAdGroupMutation = useMutation({
    mutationFn: async (data: InsertAdGroup) => {
      const response = await fetch('/api/ad-groups', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to create ad group');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-groups'] });
      toast({
        title: "Éxito",
        description: "Grupo de anuncios creado exitosamente",
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el grupo de anuncios",
        variant: "destructive",
      });
    }
  });

  // Update ad group mutation
  const updateAdGroupMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertAdGroup }) => {
      const response = await fetch(`/api/ad-groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to update ad group');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-groups'] });
      toast({
        title: "Éxito",
        description: "Grupo de anuncios actualizado exitosamente",
      });
      setEditingAdGroup(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el grupo de anuncios",
        variant: "destructive",
      });
    }
  });

  // Delete ad group mutation
  const deleteAdGroupMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/ad-groups/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete ad group');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-groups'] });
      toast({
        title: "Éxito",
        description: "Grupo de anuncios eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el grupo de anuncios",
        variant: "destructive",
      });
    }
  });

  const columns = [
    { key: 'campaign_name', label: 'Campaña' },
    { key: 'nombre_grupo', label: 'Nombre del Grupo' },
    { key: 'numero_grupo', label: 'Número' },
    { key: 'fsa', label: 'FSA' },
    { key: 'cohorte', label: 'Cohorte' },
    { key: 'tipo_publico', label: 'Tipo de Público' },
  ];

  const handleCreateAdGroup = (data: InsertAdGroup) => {
    createAdGroupMutation.mutate(data);
  };

  const handleUpdateAdGroup = (data: InsertAdGroup) => {
    if (editingAdGroup) {
      updateAdGroupMutation.mutate({ id: editingAdGroup.id, data });
    }
  };

  const handleEditAdGroup = (adGroup: AdGroup & { campaign_name: string }) => {
    setEditingAdGroup(adGroup);
    setShowForm(true);
  };

  const handleDeleteAdGroup = (adGroup: AdGroup & { campaign_name: string }) => {
    deleteAdGroupMutation.mutate(adGroup.id);
  };

  const handleNewAdGroup = () => {
    setEditingAdGroup(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Grupos de Anuncios</h1>
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
          <h1 className="text-2xl font-semibold text-foreground">Grupos de Anuncios</h1>
        </div>
        <div className="text-center py-12 text-destructive">
          Error al cargar los grupos de anuncios. Por favor, intenta de nuevo.
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            {editingAdGroup ? 'Editar Grupo de Anuncios' : 'Nuevo Grupo de Anuncios'}
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setEditingAdGroup(null);
            }}
            data-testid="button-back-to-list"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Lista
          </Button>
        </div>
        <AdGroupForm
          onSubmit={editingAdGroup ? handleUpdateAdGroup : handleCreateAdGroup}
          initialData={editingAdGroup ? {
            campaign_id: editingAdGroup.campaign_id,
            nombre_grupo: editingAdGroup.nombre_grupo || "",
            numero_grupo: editingAdGroup.numero_grupo,
            fsa: editingAdGroup.fsa || "",
            cohorte: editingAdGroup.cohorte || "",
            tipo_publico: editingAdGroup.tipo_publico || "",
          } : undefined}
          isEditing={!!editingAdGroup}
          campaigns={campaigns}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Grupos de Anuncios</h1>
        <Button 
          onClick={handleNewAdGroup}
          data-testid="button-new-ad-group"
          className="hover-elevate active-elevate-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Grupo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-total-ad-groups">
              {adGroups.length}
            </div>
            <p className="text-xs text-muted-foreground">Total Grupos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-unique-campaigns">
              {new Set(adGroups.map(ag => ag.campaign_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Campañas Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-unique-cohorts">
              {new Set(adGroups.map(ag => ag.cohorte)).size}
            </div>
            <p className="text-xs text-muted-foreground">Cohortes</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Lista de Grupos de Anuncios"
        columns={columns}
        data={adGroups}
        onEdit={handleEditAdGroup}
        onDelete={handleDeleteAdGroup}
      />
    </div>
  );
}