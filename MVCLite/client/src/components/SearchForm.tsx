import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Program } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchFormData {
  nombre_campania?: string;
  medio?: string;
  programa_interes?: string;
  facultad?: string;
  tipo_campana?: string;
}

interface SearchFormProps {
  onSearch: (filters: SearchFormData) => void;
  onReset: () => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, onReset, loading = false }: SearchFormProps) {
  // Fetch programs data for dynamic filters
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['/api/programs'],
    queryFn: async () => {
      const response = await fetch('/api/programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      return response.json() as Promise<Program[]>;
    }
  });

  // Extract unique values for dropdowns from programs data
  const uniqueFacultades = Array.from(new Set(programs.map(p => p.facultad).filter((f): f is string => f !== null && f !== undefined))).sort();
  const uniqueProgramas = Array.from(new Set(programs.map(p => p.nombre_programa).filter((p): p is string => p !== null && p !== undefined))).sort();

  const form = useForm<SearchFormData>({
    defaultValues: {
      nombre_campania: "",
      medio: "",
      programa_interes: "",
      facultad: "",
      tipo_campana: "",
    },
  });

  const handleSubmit = (data: SearchFormData) => {
    // Filter out empty values
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value && value.trim() !== "") {
        acc[key as keyof SearchFormData] = value;
      }
      return acc;
    }, {} as SearchFormData);
    
    console.log('Search filters applied:', filteredData);
    onSearch(filteredData);
  };

  const handleReset = () => {
    form.reset();
    onReset();
    console.log('Search filters cleared');
  };

  // Static options for medios and tipos de campaña
  const medios = [
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

  const tiposCampana = [
    "Conversión",
    "Reconocimiento",
    "Tráfico",
    "Generación de leads",
    "Retargeting",
    "Brand Awareness"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Búsqueda Avanzada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_campania">Nombre de Campaña</Label>
              <Input
                id="nombre_campania"
                {...form.register("nombre_campania")}
                data-testid="input-search-nombre-campania"
                placeholder="Buscar por nombre..."
              />
            </div>

            <div className="space-y-2">
              <Label>Programa de Interés</Label>
              {programsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={(value) => form.setValue("programa_interes", value)}>
                  <SelectTrigger data-testid="select-search-programa-interes">
                    <SelectValue placeholder="Seleccionar programa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueProgramas.map((programa) => (
                      <SelectItem key={programa} value={programa}>
                        {programa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Medio</Label>
              <Select onValueChange={(value) => form.setValue("medio", value)}>
                <SelectTrigger data-testid="select-search-medio">
                  <SelectValue placeholder="Seleccionar medio..." />
                </SelectTrigger>
                <SelectContent>
                  {medios.map((medio) => (
                    <SelectItem key={medio} value={medio}>
                      {medio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Facultad</Label>
              {programsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={(value) => form.setValue("facultad", value)}>
                  <SelectTrigger data-testid="select-search-facultad">
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
              <Label>Tipo de Campaña</Label>
              <Select onValueChange={(value) => form.setValue("tipo_campana", value)}>
                <SelectTrigger data-testid="select-search-tipo-campana">
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposCampana.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              data-testid="button-search"
              className="hover-elevate active-elevate-2"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleReset}
              data-testid="button-reset-search"
              className="hover-elevate active-elevate-2"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}