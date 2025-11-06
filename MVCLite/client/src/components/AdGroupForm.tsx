import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertAdGroupSchema, type InsertAdGroup, type Campaign } from "@shared/schema";

interface AdGroupFormProps {
  onSubmit: (data: InsertAdGroup) => void;
  initialData?: InsertAdGroup;
  isEditing: boolean;
  campaigns: Campaign[];
}

export function AdGroupForm({ onSubmit, initialData, isEditing, campaigns }: AdGroupFormProps) {
  const form = useForm<InsertAdGroup>({
    resolver: zodResolver(insertAdGroupSchema),
    defaultValues: initialData || {
      campaign_id: campaigns.length > 0 ? campaigns[0].id : 0,
      nombre_grupo: "",
      numero_grupo: 1,
      fsa: "",
      cohorte: "",
      tipo_publico: "",
    },
  });

  const handleSubmit = (data: InsertAdGroup) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Grupo de Anuncios" : "Nuevo Grupo de Anuncios"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="campaign_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaña *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-campaign">
                          <SelectValue placeholder="Selecciona una campaña" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campaigns.map((campaign) => (
                          <SelectItem 
                            key={campaign.id} 
                            value={campaign.id.toString()}
                          >
                            {campaign.nombre_campania}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombre_grupo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Grupo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Ejecutivos Senior"
                        data-testid="input-nombre-grupo"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero_grupo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Grupo *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        data-testid="input-numero-grupo"
                        {...field}
                        value={field.value || 1}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fsa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FSA *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: FSA-EXE-001"
                        data-testid="input-fsa"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cohorte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cohorte *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 2024-Q1"
                        data-testid="input-cohorte"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_publico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Público *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Ejecutivos C-Level"
                        data-testid="input-tipo-publico"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" data-testid="button-submit">
                {isEditing ? "Actualizar Grupo" : "Crear Grupo"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}