export function TicketTemplate({ orderData }: any) {
  // Verificación de seguridad: si no hay datos, no renderiza nada
  if (!orderData || !orderData.items) return null;

  const { tableNumber, items, subtotal, discount, total, paymentMethod } = orderData;
  
  // Fecha formateada de manera simple
  const date = new Date().toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="p-4 text-black bg-white w-[80mm] font-mono text-xs leading-tight"
      style={{ backgroundColor: 'white', color: 'black' }} // Refuerzo para la impresora
    >
      {/* Encabezado */}
      <div className="text-center mb-4 border-b border-dashed border-black pb-2">
        <h2 className="text-xl font-bold uppercase tracking-tighter">CLUB 22</h2>
        <p className="text-sm font-bold">Vinería & Bar</p>
        <p className="text-[10px] mt-1">{date}</p>
      </div>

      {/* Info de la Orden */}
      <div className="mb-2">
        <p className="font-bold text-sm">
          ORDEN: {tableNumber ? (typeof tableNumber === 'number' ? `Mesa ${tableNumber}` : tableNumber) : "Mostrador"}
        </p>
      </div>

      {/* Tabla de Productos */}
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border-b border-dashed border-black text-left">
            <th className="py-1 w-8">Cant</th>
            <th className="py-1">Producto</th>
            <th className="py-1 text-right w-20">Subt.</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, i: number) => (
            <tr key={i} className="align-top">
              <td className="py-1 pr-1">{item.quantity}</td>
              <td className="py-1 uppercase text-[11px]">{item.productName}</td>
              <td className="py-1 text-right font-bold">
                ${(item.subtotal || 0).toLocaleString('es-AR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div className="border-t border-dashed border-black pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${(subtotal || 0).toLocaleString('es-AR')}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between font-bold">
            <span>Descuento:</span>
            <span>-${(discount || 0).toLocaleString('es-AR')}</span>
          </div>
        )}
        
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-black mt-1">
          <span>TOTAL:</span>
          <span>${(total || 0).toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Pie de ticket */}
      <div className="mt-6 text-center text-[10px] border-t border-dashed border-black pt-4">
        <p className="font-bold uppercase">Forma de Pago: {paymentMethod || "A definir"}</p>
        <p className="mt-3 font-bold italic tracking-widest">*** ¡GRACIAS POR VENIR! ***</p>
        <p className="mt-1">Córdoba, Argentina</p>
      </div>
    </div>
  );
}