import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import ProgramForm from "../components/ProgramForm";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import type { Program, InsertProgram } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function ProgramsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string>("");
  const [modalityFilter, setModalityFilter] = useState<string>("");
  const [businessLineFilter, setBusinessLineFilter] = useState<string>("");
  const { toast } = useToast();

  // Fetch programs data
  const { data: programs = [], isLoading, error } = useQuery({
    queryKey: ['/api/programs'],
    queryFn: async () => {
      const response = await fetch('/api/programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      return response.json() as Promise<Program[]>;
    }
  });

  // Create program mutation
  const createProgramMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      const response = await apiRequest('POST', '/api/programs', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Éxito",
        description: "Programa creado exitosamente",
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el programa",
        variant: "destructive",
      });
    }
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProgram }) => {
      const response = await apiRequest('PUT', `/api/programs/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Éxito",
        description: "Programa actualizado exitosamente",
      });
      setEditingProgram(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el programa",
        variant: "destructive",
      });
    }
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Éxito",
        description: "Programa eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el programa",
        variant: "destructive",
      });
    }
  });

  // Extract unique values for filters
  const uniqueFaculties = Array.from(new Set(programs.map(p => p.facultad).filter((f): f is string => f !== null && f !== undefined))).sort();
  const uniqueModalities = Array.from(new Set(programs.map(p => p.modalidad).filter((m): m is string => m !== null && m !== undefined))).sort();
  const uniqueBusinessLines = Array.from(new Set(programs.map(p => p.linea_negocio).filter((l): l is string => l !== null && l !== undefined))).sort();

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = !searchTerm || 
      (program.nombre_programa && program.nombre_programa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (program.nomenclatura_programa && program.nomenclatura_programa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (program.codigo_banner && program.codigo_banner.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFaculty = !facultyFilter || program.facultad === facultyFilter;
    const matchesModality = !modalityFilter || program.modalidad === modalityFilter;
    const matchesBusinessLine = !businessLineFilter || program.linea_negocio === businessLineFilter;
    
    return matchesSearch && matchesFaculty && matchesModality && matchesBusinessLine;
  });

  const columns = [
    { key: 'nombre_programa', label: 'Nombre del Programa' },
    { key: 'nomenclatura_programa', label: 'Nomenclatura' },
    { key: 'facultad', label: 'Facultad' },
    { key: 'modalidad', label: 'Modalidad' },
    { key: 'linea_negocio', label: 'Línea de Negocio' },
    { key: 'codigo_banner', label: 'Código Banner' },
    { key: 'periodo', label: 'Periodo' },
  ];

  const handleCreateProgram = (data: InsertProgram) => {
    createProgramMutation.mutate(data);
  };

  const handleUpdateProgram = (data: InsertProgram) => {
    if (editingProgram) {
      updateProgramMutation.mutate({ id: editingProgram.id, data });
    }
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleDeleteProgram = (program: Program) => {
    deleteProgramMutation.mutate(program.id);
  };

  const handleNewProgram = () => {
    setEditingProgram(null);
    setShowForm(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFacultyFilter("");
    setModalityFilter("");
    setBusinessLineFilter("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Programas</h1>
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
          <h1 className="text-2xl font-semibold text-foreground">Programas</h1>
        </div>
        <div className="text-center py-12 text-destructive">
          Error al cargar programas: {(error as Error).message}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            {editingProgram ? 'Editar Programa' : 'Nuevo Programa'}
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setEditingProgram(null);
            }}
            data-testid="button-cancel-form"
          >
            Cancelar
          </Button>
        </div>
        <ProgramForm
          onSubmit={editingProgram ? handleUpdateProgram : handleCreateProgram}
          initialData={editingProgram ? {
            nombre_programa: editingProgram.nombre_programa || '',
            nomenclatura_programa: editingProgram.nomenclatura_programa,
            linea_negocio: editingProgram.linea_negocio,
            modalidad: editingProgram.modalidad,
            facultad: editingProgram.facultad,
            nomenclatura_facultad: editingProgram.nomenclatura_facultad,
            codigo_banner: editingProgram.codigo_banner,
            lista_pardot: editingProgram.lista_pardot,
            periodo: editingProgram.periodo,
            codigo_carrera: editingProgram.codigo_carrera,
            nombre_programa2: editingProgram.nombre_programa2,
            link_programa: editingProgram.link_programa,
            pp1: editingProgram.pp1,
            pp1d: editingProgram.pp1d,
            pp2: editingProgram.pp2,
            pp2d: editingProgram.pp2d,
            pp3: editingProgram.pp3,
            pp3d: editingProgram.pp3d,
            pp4: editingProgram.pp4,
            pp4d: editingProgram.pp4d,
          } : undefined}
          isEditing={!!editingProgram}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Programas</h1>
        <Button onClick={handleNewProgram} data-testid="button-new-program">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Programa
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar programas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Facultad</Label>
              <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                <SelectTrigger data-testid="select-faculty-filter">
                  <SelectValue placeholder="Todas las facultades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las facultades</SelectItem>
                  {uniqueFaculties.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modalidad</Label>
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger data-testid="select-modality-filter">
                  <SelectValue placeholder="Todas las modalidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las modalidades</SelectItem>
                  {uniqueModalities.map((modality) => (
                    <SelectItem key={modality} value={modality}>
                      {modality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Línea de Negocio</Label>
              <Select value={businessLineFilter} onValueChange={setBusinessLineFilter}>
                <SelectTrigger data-testid="select-business-line-filter">
                  <SelectValue placeholder="Todas las líneas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las líneas</SelectItem>
                  {uniqueBusinessLines.map((line) => (
                    <SelectItem key={line} value={line}>
                      {line}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="outline" data-testid="text-total-count">
                Total: {programs.length}
              </Badge>
              <Badge variant="secondary" data-testid="text-filtered-count">
                Filtrado: {filteredPrograms.length}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              data-testid="button-clear-filters"
              className="hover-elevate"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Programs Table */}
      <DataTable
        title="Lista de Programas"
        columns={columns}
        data={filteredPrograms}
        onEdit={handleEditProgram}
        onDelete={handleDeleteProgram}
        loading={isLoading}
      />
    </div>
  );
}