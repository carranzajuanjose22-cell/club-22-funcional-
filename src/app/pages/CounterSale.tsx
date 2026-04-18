const handleConfirmPayment = async (
  method: string, 
  discount: number, 
  finalTotal: number, 
  method2: string | null = null, 
  amount1: number = 0, 
  amount2: number = 0
) => {
  try {
    // Verificamos que supabase esté disponible
    if (!supabase) throw new Error("No se pudo conectar con la base de datos");

    const { error } = await supabase.from('sales').insert([{
      table_id: id || null,
      items: items,
      subtotal: total,
      discount: discount,
      total: finalTotal,
      payment_method: method,
      payment_method_2: method2,
      amount_1: amount1,
      amount_2: amount2,
      type: id ? 'mesa' : 'mostrador'
    }]);

    if (error) throw error;

    // Lógica de cierre
    if (id && typeof closeTable === 'function') {
      closeTable(id);
    }
    
    setItems([]);
    setShowPaymentModal(false);
    navigate("/");
    
  } catch (error: any) {
    console.error("Error en el pago:", error);
    alert("Error: " + (error.message || "Error desconocido"));
  }
};