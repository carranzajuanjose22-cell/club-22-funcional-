const handleConfirmPayment = async (
    method: string, 
    discount: number, 
    finalTotal: number, 
    method2: string | null, 
    amount1: number, 
    amount2: number
) => {
  try {
    const { error } = await supabase.from('sales').insert([{
      table_id: id || null,
      items: items,
      subtotal: total,
      discount: discount,
      total: finalTotal,
      payment_method: method, // Método principal
      payment_method_2: method2, // Segundo método
      amount_1: amount1,
      amount_2: amount2,
      type: id ? 'mesa' : 'mostrador'
    }]);

    if (error) throw error;

    if(id) closeTable(id); // Solo si es mesa
    setItems([]); // Limpiar si es mostrador
    setShowPaymentModal(false);
    navigate("/");
    
  } catch (error: any) {
    alert("Error: " + error.message);
  }
};