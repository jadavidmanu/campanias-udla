import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertAdSchema, type InsertAd, type AdGroup } from "@shared/schema";

interface AdFormProps {
  onSubmit: (data: InsertAd) => void;
  initialData?: InsertAd;
  isEditing: boolean;
  adGroups: (AdGroup & { campaign_name: string })[];
}

export function AdForm({ onSubmit, initialData, isEditing, adGroups }: AdFormProps) {
  const form = useForm<InsertAd>({
    resolver: zodResolver(insertAdSchema),
    defaultValues: initialData || {
      ad_group_id: adGroups.length > 0 ? adGroups[0].id : 0,
      nombre_anuncio: "",
      tipo_anuncio: "",
      numero_grupo: 1,
      nomenclatura_pardot: "",
    },
  });

  const handleSubmit = (data: InsertAd) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Anuncio" : "Nuevo Anuncio"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ad_group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo de Anuncios *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-ad-group">
                          <SelectValue placeholder="Selecciona un grupo de anuncios" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {adGroups.map((adGroup) => (
                          <SelectItem 
                            key={adGroup.id} 
                            value={adGroup.id.toString()}
                          >
                            {adGroup.campaign_name} - {adGroup.nombre_grupo}
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
                name="nombre_anuncio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Anuncio *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: MBA para Líderes Corporativos"
                        data-testid="input-nombre-anuncio"
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
                name="tipo_anuncio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Anuncio *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-tipo-anuncio">
                          <SelectValue placeholder="Selecciona el tipo de anuncio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Texto Expandido">Texto Expandido</SelectItem>
                        <SelectItem value="Display Responsivo">Display Responsivo</SelectItem>
                        <SelectItem value="Búsqueda">Búsqueda</SelectItem>
                        <SelectItem value="Imagen">Imagen</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Carrusel">Carrusel</SelectItem>
                        <SelectItem value="Sponsored Content">Sponsored Content</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                      </SelectContent>
                    </Select>
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
                name="nomenclatura_pardot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomenclatura Pardot *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: AD-MBA-LDR-001"
                        data-testid="input-nomenclatura-pardot"
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
                {isEditing ? "Actualizar Anuncio" : "Crear Anuncio"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}