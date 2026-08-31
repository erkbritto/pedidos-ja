import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PEDIDO_STATUS, type PedidoStatus } from "@/types/pedido";

export type StatusFilter = PedidoStatus | "TODOS";
export type SortOption = "recentes" | "antigos" | "id_asc" | "id_desc";

interface PedidoFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  recentes: "Mais recentes primeiro",
  antigos: "Mais antigos primeiro",
  id_asc: "ID crescente",
  id_desc: "ID decrescente",
};

export function PedidoFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: PedidoFiltersProps) {
  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
      <div className="space-y-1.5">
        <Label htmlFor="pedido-busca">Pesquisar</Label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="pedido-busca"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por ID, cliente ou produto..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pedido-status">Status</Label>
        <Select value={status} onValueChange={(value) => onStatusChange(value as StatusFilter)}>
          <SelectTrigger id="pedido-status" className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            {PEDIDO_STATUS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pedido-ordenacao">Ordenação</Label>
        <Select value={sort} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger id="pedido-ordenacao" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <SelectItem key={option} value={option}>
                {sortLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
