import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { AdForm } from "@/components/AdForm";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowLeft } from "lucide-react";
import type { Ad, AdGroup, Campaign, InsertAd } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function AdsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<(Ad & { group_name: string; campaign_name: string }) | null>(null);
  const { toast } = useToast();

  // Fetch ads data with group and campaign names
  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['/api/ads'],
    queryFn: async () => {
      const [adsResponse, adGroupsResponse, campaignsResponse] = await Promise.all([
        fetch('/api/ads'),
        fetch('/api/ad-groups'),
        fetch('/api/campaigns')
      ]);
      
      if (!adsResponse.ok || !adGroupsResponse.ok || !campaignsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const ads = await adsResponse.json() as Ad[];
      const adGroups = await adGroupsResponse.json() as AdGroup[];
      const campaigns = await campaignsResponse.json() as Campaign[];
      
      // Join ads with ad group and campaign names
      return ads.map(ad => {
        const adGroup = adGroups.find(ag => ag.id === ad.ad_group_id);
        const campaign = campaigns.find(c => c.id === adGroup?.campaign_id);
        return {
          ...ad,
          group_name: adGroup?.nombre_grupo || 'Unknown Group',
          campaign_name: campaign?.nombre_campania || 'Unknown Campaign'
        };
      });
    }
  });

  // Fetch ad groups with campaign names for form dropdown
  const { data: adGroupsWithCampaigns = [] } = useQuery({
    queryKey: ['/api/ad-groups-with-campaigns'],
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
      
      return adGroups.map(adGroup => {
        const campaign = campaigns.find(c => c.id === adGroup.campaign_id);
        return {
          ...adGroup,
          campaign_name: campaign?.nombre_campania || 'Unknown Campaign'
        };
      });
    }
  });

  // Create ad mutation
  const createAdMutation = useMutation({
    mutationFn: async (data: InsertAd) => {
      const response = await fetch('/api/ads', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to create ad');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ads'] });
      toast({
        title: "Éxito",
        description: "Anuncio creado exitosamente",
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el anuncio",
        variant: "destructive",
      });
    }
  });

  // Update ad mutation
  const updateAdMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertAd }) => {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to update ad');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ads'] });
      toast({
        title: "Éxito",
        description: "Anuncio actualizado exitosamente",
      });
      setEditingAd(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el anuncio",
        variant: "destructive",
      });
    }
  });

  // Delete ad mutation
  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete ad');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ads'] });
      toast({
        title: "Éxito",
        description: "Anuncio eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el anuncio",
        variant: "destructive",
      });
    }
  });

  const columns = [
    { key: 'campaign_name', label: 'Campaña' },
    { key: 'group_name', label: 'Grupo' },
    { key: 'nombre_anuncio', label: 'Nombre del Anuncio' },
    { 
      key: 'tipo_anuncio', 
      label: 'Tipo',
      render: (value: string) => {
        const getVariant = (tipo: string) => {
          switch (tipo) {
            case 'Texto Expandido': return 'default';
            case 'Display Responsivo': return 'secondary';
            case 'Video': return 'outline';
            default: return 'secondary';
          }
        };
        return (
          <Badge variant={getVariant(value)}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'nomenclatura_pardot', label: 'Pardot ID' },
  ];

  const handleCreateAd = (data: InsertAd) => {
    createAdMutation.mutate(data);
  };

  const handleUpdateAd = (data: InsertAd) => {
    if (editingAd) {
      updateAdMutation.mutate({ id: editingAd.id, data });
    }
  };

  const handleEditAd = (ad: Ad & { group_name: string; campaign_name: string }) => {
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleDeleteAd = (ad: Ad & { group_name: string; campaign_name: string }) => {
    deleteAdMutation.mutate(ad.id);
  };

  const handleNewAd = () => {
    setEditingAd(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Anuncios</h1>
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
          <h1 className="text-2xl font-semibold text-foreground">Anuncios</h1>
        </div>
        <div className="text-center py-12 text-destructive">
          Error al cargar los anuncios. Por favor, intenta de nuevo.
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            {editingAd ? 'Editar Anuncio' : 'Nuevo Anuncio'}
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setEditingAd(null);
            }}
            data-testid="button-back-to-list"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Lista
          </Button>
        </div>
        <AdForm
          onSubmit={editingAd ? handleUpdateAd : handleCreateAd}
          initialData={editingAd ? {
            ad_group_id: editingAd.ad_group_id,
            nombre_anuncio: editingAd.nombre_anuncio || "",
            tipo_anuncio: editingAd.tipo_anuncio || "",
            numero_grupo: editingAd.numero_grupo,
            nomenclatura_pardot: editingAd.nomenclatura_pardot || "",
          } : undefined}
          isEditing={!!editingAd}
          adGroups={adGroupsWithCampaigns}
        />
      </div>
    );
  }

  const adTypeStats = ads.reduce((acc, ad) => {
    const tipoAnuncio = ad.tipo_anuncio || 'Sin especificar';
    acc[tipoAnuncio] = (acc[tipoAnuncio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Anuncios</h1>
        <Button 
          onClick={handleNewAd}
          data-testid="button-new-ad"
          className="hover-elevate active-elevate-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Anuncio
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-total-ads">
              {ads.length}
            </div>
            <p className="text-xs text-muted-foreground">Total Anuncios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-active-groups">
              {new Set(ads.map(ad => ad.ad_group_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Grupos Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-ad-types">
              {Object.keys(adTypeStats).length}
            </div>
            <p className="text-xs text-muted-foreground">Tipos de Anuncio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary" data-testid="text-campaigns-with-ads">
              {new Set(ads.map(ad => ad.campaign_name)).size}
            </div>
            <p className="text-xs text-muted-foreground">Campañas con Anuncios</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Lista de Anuncios"
        columns={columns}
        data={ads}
        onEdit={handleEditAd}
        onDelete={handleDeleteAd}
      />
    </div>
  );
}