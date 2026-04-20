import { format } from "date-fns";

export function ClosureTicket({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div id="printable-ticket" className="p-4 bg-white text-black text-sm font-mono w-[80mm]">
      <div className="text-center border-b border-dashed border-black pb-2 mb-2">
        <h2 className="text-xl font-bold uppercase">CLUB 22</h2>
        <p className="text-xs font-bold">CIERRE DE CAJA DIARIO</p>
        <p className="text-[10px]">{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
      </div>

      <div className="space-y-1 mb-4 border-b border-dashed border-black pb-2">
        <div className="flex justify-between">
          <span>VENTAS TOTALES:</span>
          <span className="font-bold">${data.total?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>EFECTIVO:</span>
          <span className="font-bold">${data.cash?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>TRANSFERENCIAS:</span>
          <span className="font-bold">${data.transfer?.toLocaleString()}</span>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-[10px] italic">*** Registro Guardado en Supabase ***</p>
      </div>
    </div>
  );
}