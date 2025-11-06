import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  loading?: boolean;
}

export function DataTable({ 
  title, 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  loading = false 
}: DataTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="secondary" data-testid="text-count">
          {data.length} elementos
        </Badge>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay datos para mostrar
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left py-3 px-4 font-medium text-sm text-muted-foreground"
                    >
                      {column.label}
                    </th>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="border-b hover:bg-muted/30 transition-colors"
                    data-testid={`row-item-${row.id || index}`}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4 text-sm">
                        {column.render 
                          ? column.render(row[column.key], row)
                          : row[column.key] || '-'
                        }
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-1 justify-end">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                console.log('Viewing item:', row);
                                onView(row);
                              }}
                              data-testid={`button-view-${row.id || index}`}
                              className="h-8 w-8 hover-elevate"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                console.log('Editing item:', row);
                                onEdit(row);
                              }}
                              data-testid={`button-edit-${row.id || index}`}
                              className="h-8 w-8 hover-elevate"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('¿Está seguro de que desea eliminar este elemento?')) {
                                  console.log('Deleting item:', row);
                                  onDelete(row);
                                }
                              }}
                              data-testid={`button-delete-${row.id || index}`}
                              className="h-8 w-8 hover-elevate text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}