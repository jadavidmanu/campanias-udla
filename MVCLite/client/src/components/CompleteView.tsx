import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Download, ExternalLink } from "lucide-react";

interface CompleteViewData {
  campaigns: Array<{
    id: number;
    nombre_campania: string;
    medio: string;
    programa_interes: string;
    facultad: string;
    tipo_campana: string;
    linea: string;
    modalidad_estudio: string;
    lista_pardot: string;
    url_programa: string;
    adGroups: Array<{
      id: number;
      nombre_grupo: string;
      numero_grupo: number;
      fsa: string;
      cohorte: string;
      tipo_publico: string;
      ads: Array<{
        id: number;
        nombre_anuncio: string;
        tipo_anuncio: string;
        nomenclatura_pardot: string;
      }>;
    }>;
  }>;
}

interface CompleteViewProps {
  data: CompleteViewData;
  onExportCSV: () => void;
  loading?: boolean;
}

export function CompleteView({ data, onExportCSV, loading = false }: CompleteViewProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const totalAdGroups = data.campaigns.reduce((sum, campaign) => sum + campaign.adGroups.length, 0);
  const totalAds = data.campaigns.reduce(
    (sum, campaign) => sum + campaign.adGroups.reduce((adSum, group) => adSum + group.ads.length, 0), 
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vista Completa - Estructura Jerárquica</CardTitle>
            <div className="flex gap-4 mt-2">
              <Badge variant="outline" data-testid="text-campaigns-count">
                {data.campaigns.length} Campañas
              </Badge>
              <Badge variant="outline" data-testid="text-ad-groups-count">
                {totalAdGroups} Grupos
              </Badge>
              <Badge variant="outline" data-testid="text-ads-count">
                {totalAds} Anuncios
              </Badge>
            </div>
          </div>
          <Button 
            onClick={() => {
              console.log('Exporting CSV data');
              onExportCSV();
            }}
            data-testid="button-export-csv"
            className="hover-elevate active-elevate-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>
      </Card>

      {data.campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No hay datos para mostrar
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {data.campaigns.map((campaign) => (
            <AccordionItem 
              key={campaign.id} 
              value={campaign.id.toString()}
              className="border rounded-lg"
              data-testid={`accordion-campaign-${campaign.id}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover-elevate">
                <div className="flex items-center justify-between w-full mr-4">
                  <div className="text-left">
                    <div className="font-semibold">{campaign.nombre_campania}</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.medio} • {campaign.programa_interes} • {campaign.facultad}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{campaign.tipo_campana}</Badge>
                    <Badge variant="outline">
                      {campaign.adGroups.length} grupos
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Línea:</span>
                      <div>{campaign.linea || '-'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Modalidad:</span>
                      <div>{campaign.modalidad_estudio || '-'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Lista Pardot:</span>
                      <div>{campaign.lista_pardot || '-'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">URL Programa:</span>
                      {campaign.url_programa ? (
                        <a 
                          href={campaign.url_programa} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Ver <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <div>-</div>
                      )}
                    </div>
                  </div>

                  {campaign.adGroups.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Grupos de Anuncios</h4>
                      {campaign.adGroups.map((group) => (
                        <Card key={group.id} className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">
                                Grupo #{group.numero_grupo}: {group.nombre_grupo}
                              </div>
                              <Badge variant="outline">
                                {group.ads.length} anuncios
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-3">
                              <div>
                                <span className="text-muted-foreground">FSA:</span> {group.fsa || '-'}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Cohorte:</span> {group.cohorte || '-'}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tipo Público:</span> {group.tipo_publico || '-'}
                              </div>
                            </div>

                            {group.ads.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Anuncios:</div>
                                <div className="space-y-2">
                                  {group.ads.map((ad) => (
                                    <div 
                                      key={ad.id} 
                                      className="bg-card border rounded p-3"
                                      data-testid={`card-ad-${ad.id}`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="font-medium">{ad.nombre_anuncio}</div>
                                        <Badge variant="secondary" className="text-xs">
                                          {ad.tipo_anuncio}
                                        </Badge>
                                      </div>
                                      {ad.nomenclatura_pardot && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                          Pardot: {ad.nomenclatura_pardot}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}