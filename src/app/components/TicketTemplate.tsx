export function TicketTemplate({ orderData }: any) {
  // Si no hay datos, evitamos que rompa
  if (!orderData) return null;

  const { tableNumber, items, subtotal, discount, total, paymentMethod } = orderData;
  const date = new Date().toLocaleString();

  return (
    /* CAMBIAMOS EL ID ACÁ ABAJO A printable-ticket */
    <div id="printable-ticket" className="p-4 text-black bg-white w-[80mm] font-mono text-sm leading-tight">
      <div className="text-center mb-4 border-b border-dashed border-black pb-2">
        <h2 className="text-xl font-bold uppercase">CLUB 22</h2>
        <p>Vinería & Bar</p>
        <p className="text-[10px]">{date}</p>
      </div>

      <div className="mb-2">
        <p className="font-bold">ORDEN: {tableNumber || "Mostrador"}</p>
      </div>

      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border-b border-dashed border-black text-left">
            <th className="py-1 w-12">Cant</th>
            <th>Producto</th>
            <th className="text-right w-20">Subt.</th>
          </tr>
        </thead>
        <tbody>
          {items && items.map((item: any, i: number) => (
            <tr key={i} className="align-top">
              <td className="py-1">{item.quantity}</td>
              <td className="py-1 uppercase">{item.productName}</td>
              <td className="py-1 text-right">${item.subtotal.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal?.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between font-bold">
            <span>Descuento:</span>
            <span>-${discount?.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-black">
          <span>TOTAL:</span>
          <span>${total?.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 text-center text-[10px] border-t border-dashed border-black pt-4">
        <p className="font-bold uppercase">Pago: {paymentMethod}</p>
        <p className="mt-2 italic font-medium">*** ¡Gracias por su visita! ***</p>
        <p className="mt-1">Córdoba, Argentina</p>
      </div>
    </div>
  );
}