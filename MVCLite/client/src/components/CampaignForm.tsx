import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCampaignSchema, type InsertCampaign, type Program } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignFormProps {
  onSubmit: (data: InsertCampaign) => void;
  initialData?: Partial<InsertCampaign>;
  isEditing?: boolean;
}

export function CampaignForm({ onSubmit, initialData, isEditing = false }: CampaignFormProps) {
  // Fetch programs data
  const { data: programs = [], isLoading: programsLoading, error: programsError } = useQuery({
    queryKey: ['/api/programs'],
    queryFn: async () => {
      const response = await fetch('/api/programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      return response.json() as Promise<Program[]>;
    }
  });

  // Extract unique values for dropdowns
  const uniqueFacultades = Array.from(new Set(programs.map(p => p.facultad).filter((f): f is string => f !== null && f !== undefined))).sort();
  const uniqueModalidades = Array.from(new Set(programs.map(p => p.modalidad).filter((m): m is string => m !== null && m !== undefined))).sort();
  const uniqueLineas = Array.from(new Set(programs.map(p => p.linea_negocio).filter((l): l is string => l !== null && l !== undefined))).sort();

  // Predefined options that don't come from programs
  const mediosOptions = [
    "Google Ads",
    "Facebook Ads", 
    "Instagram Ads",
    "LinkedIn Ads",
    "YouTube Ads",
    "Twitter Ads",
    "Email Marketing",
    "Display",
    "Programmatic"
  ];

  const tiposCampanaOptions = [
    "Conversión",
    "Reconocimiento",
    "Tráfico",
    "Generación de leads",
    "Retargeting",
    "Brand Awareness"
  ];

  const form = useForm<InsertCampaign>({
    resolver: zodResolver(insertCampaignSchema),
    defaultValues: {
      medio: initialData?.medio || "",
      programa_interes: initialData?.programa_interes || "",
      tipo_campana: initialData?.tipo_campana || "",
      nombre_campania: initialData?.nombre_campania || "",
      nomenclatura_programa: initialData?.nomenclatura_programa || "",
      modalidad_estudio: initialData?.modalidad_estudio || "",
      linea: initialData?.linea || "",
      facultad: initialData?.facultad || "",
      nomenclatura_modalidad: initialData?.nomenclatura_modalidad || "",
      nomenclatura_linea: initialData?.nomenclatura_linea || "",
      nomenclatura_tipo_campana: initialData?.nomenclatura_tipo_campana || "",
      nomenclatura_modalidad3: initialData?.nomenclatura_modalidad3 || "",
      nombre_sf: initialData?.nombre_sf || "",
      url_programa: initialData?.url_programa || "",
      lista_pardot: initialData?.lista_pardot || "",
    },
  });

  const handleSubmit = (data: InsertCampaign) => {
    onSubmit(data);
    console.log('Campaign form submitted:', data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Campaña' : 'Nueva Campaña'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Medio *</Label>
              <Select onValueChange={(value) => form.setValue("medio", value)} value={form.watch("medio") || ""}>
                <SelectTrigger data-testid="select-medio">
                  <SelectValue placeholder="Seleccionar medio..." />
                </SelectTrigger>
                <SelectContent>
                  {mediosOptions.map((medio) => (
                    <SelectItem key={medio} value={medio}>
                      {medio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.medio && (
                <p className="text-sm text-destructive">{form.formState.errors.medio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Programa de Interés *</Label>
              {programsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : programsError ? (
                <div className="text-sm text-destructive">Error cargando programas</div>
              ) : (
                <Select onValueChange={(value) => form.setValue("programa_interes", value)} value={form.watch("programa_interes") || ""}>
                  <SelectTrigger data-testid="select-programa-interes">
                    <SelectValue placeholder="Seleccionar programa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.filter(p => p.nombre_programa).map((programa) => (
                      <SelectItem key={programa.id} value={programa.nombre_programa!}>
                        {programa.nombre_programa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {form.formState.errors.programa_interes && (
                <p className="text-sm text-destructive">{form.formState.errors.programa_interes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de Campaña *</Label>
              <Select onValueChange={(value) => form.setValue("tipo_campana", value)} value={form.watch("tipo_campana") || ""}>
                <SelectTrigger data-testid="select-tipo-campana">
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposCampanaOptions.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.tipo_campana && (
                <p className="text-sm text-destructive">{form.formState.errors.tipo_campana.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_campania">Nombre de Campaña *</Label>
              <Input
                id="nombre_campania"
                {...form.register("nombre_campania")}
                data-testid="input-nombre-campania"
                placeholder="Nombre descriptivo de la campaña"
              />
              {form.formState.errors.nombre_campania && (
                <p className="text-sm text-destructive">{form.formState.errors.nombre_campania.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Modalidad de Estudio</Label>
              {programsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={(value) => form.setValue("modalidad_estudio", value)} value={form.watch("modalidad_estudio") || ""}>
                  <SelectTrigger data-testid="select-modalidad-estudio">
                    <SelectValue placeholder="Seleccionar modalidad..." />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueModalidades.map((modalidad) => (
                      <SelectItem key={modalidad} value={modalidad}>
                        {modalidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Facultad</Label>
              {programsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={(value) => form.setValue("facultad", value)} value={form.watch("facultad") || ""}>
                  <SelectTrigger data-testid="select-facultad">
                    <SelectValue placeholder="Seleccionar facultad..." />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueFacultades.map((facultad) => (
                      <SelectItem key={facultad} value={facultad}>
                        {facultad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Línea</Label>
              {programsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={(value) => form.setValue("linea", value)} value={form.watch("linea") || ""}>
                  <SelectTrigger data-testid="select-linea">
                    <SelectValue placeholder="Seleccionar línea..." />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueLineas.map((linea) => (
                      <SelectItem key={linea} value={linea}>
                        {linea}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_sf">Nombre SF</Label>
              <Input
                id="nombre_sf"
                {...form.register("nombre_sf")}
                data-testid="input-nombre-sf"
                placeholder="Nombre en Salesforce"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url_programa">URL Programa</Label>
              <Input
                id="url_programa"
                {...form.register("url_programa")}
                data-testid="input-url-programa"
                placeholder="https://..."
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lista_pardot">Lista Pardot</Label>
              <Input
                id="lista_pardot"
                {...form.register("lista_pardot")}
                data-testid="input-lista-pardot"
                placeholder="ID de lista Pardot"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomenclatura_programa">Nomenclatura Programa</Label>
              <Textarea
                id="nomenclatura_programa"
                {...form.register("nomenclatura_programa")}
                data-testid="input-nomenclatura-programa"
                placeholder="Detalles de nomenclatura..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomenclatura_modalidad">Nomenclatura Modalidad</Label>
              <Textarea
                id="nomenclatura_modalidad"
                {...form.register("nomenclatura_modalidad")}
                data-testid="input-nomenclatura-modalidad"
                placeholder="Detalles de nomenclatura..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              data-testid="button-submit-campaign"
              className="hover-elevate active-elevate-2"
            >
              {isEditing ? 'Actualizar' : 'Crear'} Campaña
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              data-testid="button-cancel-campaign"
              onClick={() => console.log('Form cancelled')}
              className="hover-elevate active-elevate-2"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}