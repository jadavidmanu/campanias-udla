import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramSchema, type InsertProgram } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ProgramFormProps {
  onSubmit: (data: InsertProgram) => void;
  initialData?: Partial<InsertProgram>;
  isEditing?: boolean;
}

function ProgramForm({ onSubmit, initialData, isEditing = false }: ProgramFormProps) {
  const form = useForm<InsertProgram>({
    resolver: zodResolver(insertProgramSchema),
    defaultValues: {
      nombre_programa: initialData?.nombre_programa || "",
      nomenclatura_programa: initialData?.nomenclatura_programa || "",
      linea_negocio: initialData?.linea_negocio || "",
      modalidad: initialData?.modalidad || "",
      facultad: initialData?.facultad || "",
      nomenclatura_facultad: initialData?.nomenclatura_facultad || "",
      codigo_banner: initialData?.codigo_banner || "",
      lista_pardot: initialData?.lista_pardot || "",
      periodo: initialData?.periodo || "",
      codigo_carrera: initialData?.codigo_carrera || "",
      nombre_programa2: initialData?.nombre_programa2 || "",
      link_programa: initialData?.link_programa || "",
      pp1: initialData?.pp1 || "",
      pp1d: initialData?.pp1d || "",
      pp2: initialData?.pp2 || "",
      pp2d: initialData?.pp2d || "",
      pp3: initialData?.pp3 || "",
      pp3d: initialData?.pp3d || "",
      pp4: initialData?.pp4 || "",
      pp4d: initialData?.pp4d || "",
    },
  });

  const handleSubmit = (data: InsertProgram) => {
    onSubmit(data);
    console.log('Program form submitted:', data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Programa' : 'Nuevo Programa'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_programa">Nombre del Programa *</Label>
                <Input
                  id="nombre_programa"
                  {...form.register("nombre_programa")}
                  placeholder="Ingrese el nombre del programa"
                  data-testid="input-nombre-programa"
                />
                {form.formState.errors.nombre_programa && (
                  <p className="text-sm text-destructive">{form.formState.errors.nombre_programa.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomenclatura_programa">Nomenclatura del Programa</Label>
                <Input
                  id="nomenclatura_programa"
                  {...form.register("nomenclatura_programa")}
                  placeholder="Nomenclatura"
                  data-testid="input-nomenclatura-programa"
                />
                {form.formState.errors.nomenclatura_programa && (
                  <p className="text-sm text-destructive">{form.formState.errors.nomenclatura_programa.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facultad">Facultad</Label>
                <Input
                  id="facultad"
                  {...form.register("facultad")}
                  placeholder="Facultad"
                  data-testid="input-facultad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalidad">Modalidad</Label>
                <Input
                  id="modalidad"
                  {...form.register("modalidad")}
                  placeholder="Modalidad"
                  data-testid="input-modalidad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linea_negocio">Línea de Negocio</Label>
                <Input
                  id="linea_negocio"
                  {...form.register("linea_negocio")}
                  placeholder="Línea de negocio"
                  data-testid="input-linea-negocio"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo_banner">Código Banner</Label>
                <Input
                  id="codigo_banner"
                  {...form.register("codigo_banner")}
                  placeholder="Código Banner"
                  data-testid="input-codigo-banner"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo_carrera">Código Carrera</Label>
                <Input
                  id="codigo_carrera"
                  {...form.register("codigo_carrera")}
                  placeholder="Código de la carrera"
                  data-testid="input-codigo-carrera"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo">Periodo</Label>
                <Input
                  id="periodo"
                  {...form.register("periodo")}
                  placeholder="Periodo"
                  data-testid="input-periodo"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomenclatura_facultad">Nomenclatura Facultad</Label>
                <Input
                  id="nomenclatura_facultad"
                  {...form.register("nomenclatura_facultad")}
                  placeholder="Nomenclatura de la facultad"
                  data-testid="input-nomenclatura-facultad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre_programa2">Nombre Programa 2</Label>
                <Input
                  id="nombre_programa2"
                  {...form.register("nombre_programa2")}
                  placeholder="Nombre alternativo del programa"
                  data-testid="input-nombre-programa2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link_programa">Link del Programa</Label>
                <Input
                  id="link_programa"
                  type="url"
                  {...form.register("link_programa")}
                  placeholder="https://..."
                  data-testid="input-link-programa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lista_pardot">Lista Pardot</Label>
                <Input
                  id="lista_pardot"
                  {...form.register("lista_pardot")}
                  placeholder="Lista Pardot"
                  data-testid="input-lista-pardot"
                />
              </div>
            </div>
          </div>

          {/* PP Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Campos PP</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pp1">PP1</Label>
                <Input
                  id="pp1"
                  {...form.register("pp1")}
                  placeholder="PP1"
                  data-testid="input-pp1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp1d">PP1D</Label>
                <Input
                  id="pp1d"
                  {...form.register("pp1d")}
                  placeholder="PP1D"
                  data-testid="input-pp1d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp2">PP2</Label>
                <Input
                  id="pp2"
                  {...form.register("pp2")}
                  placeholder="PP2"
                  data-testid="input-pp2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp2d">PP2D</Label>
                <Input
                  id="pp2d"
                  {...form.register("pp2d")}
                  placeholder="PP2D"
                  data-testid="input-pp2d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp3">PP3</Label>
                <Input
                  id="pp3"
                  {...form.register("pp3")}
                  placeholder="PP3"
                  data-testid="input-pp3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp3d">PP3D</Label>
                <Input
                  id="pp3d"
                  {...form.register("pp3d")}
                  placeholder="PP3D"
                  data-testid="input-pp3d"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp4">PP4</Label>
                <Input
                  id="pp4"
                  {...form.register("pp4")}
                  placeholder="PP4"
                  data-testid="input-pp4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp4d">PP4D</Label>
                <Input
                  id="pp4d"
                  {...form.register("pp4d")}
                  placeholder="PP4D"
                  data-testid="input-pp4d"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              data-testid="button-submit-program"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Programa' : 'Crear Programa')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              data-testid="button-reset-form"
            >
              Restablecer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProgramForm;