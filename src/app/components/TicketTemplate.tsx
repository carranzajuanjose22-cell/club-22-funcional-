export function TicketTemplate({ orderData }: any) {
  const { tableNumber, items, subtotal, discount, total, paymentMethod } = orderData;
  const date = new Date().toLocaleString();

  return (
    <div id="ticket-print" className="p-4 text-black bg-white w-[80mm] font-mono text-sm leading-tight">
      <div className="text-center mb-4 border-b border-dashed border-black pb-2">
        <h2 className="text-xl font-bold">CLUB 22</h2>
        <p>Vinería & Bar</p>
        <p className="text-[10px]">{date}</p>
      </div>

      <div className="mb-2">
        <p className="font-bold">Mesa: {tableNumber || "Mostrador"}</p>
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr className="border-b border-dashed border-black text-left">
            <th className="py-1">Cant</th>
            <th>Producto</th>
            <th className="text-right">Subt.</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, i: number) => (
            <tr key={i}>
              <td className="py-1">{item.quantity}</td>
              <td>{item.productName}</td>
              <td className="text-right">${item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span>Descuento:</span>
            <span>-${discount}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-black">
          <span>TOTAL:</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="mt-4 text-center text-[10px]">
        <p>Forma de Pago: {paymentMethod}</p>
        <p className="mt-2 italic">¡Gracias por su visita!</p>
      </div>
    </div>
  );
}