/* ============================================
   CONFIGURAÇÃO SUPABASE - NDONGALA
   Substitua as duas constantes abaixo pelos
   valores do seu projecto Supabase.
============================================ */

const SUPABASE_URL = 'https://SEU-PROJECTO.supabase.co';      // ← coloque a URL
const SUPABASE_ANON_KEY = 'SUA-CHAVE-ANON-AQUI';             // ← coloque a chave anon

// Cliente global (só é criado se as chaves estiverem preenchidas)
let supabaseCliente = null;

function iniciarSupabase() {
  if (SUPABASE_URL.includes('SEU-PROJECTO') || SUPABASE_ANON_KEY.includes('SUA-CHAVE')) {
    console.warn('Supabase ainda não configurado. Os pedidos serão enviados só para o WhatsApp.');
    return null;
  }

  if (typeof supabase === 'undefined') {
    console.error('Biblioteca supabase-js não carregada.');
    return null;
  }

  supabaseCliente = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase ligado com sucesso.');
  return supabaseCliente;
}

/**
 * Grava o pedido na base de dados Supabase
 * Retorna o número do pedido ou null em caso de erro
 */
async function gravarPedidoSupabase(dadosPedido) {
  if (!supabaseCliente) {
    supabaseCliente = iniciarSupabase();
  }
  if (!supabaseCliente) return null;

  try {
    // 1. Inserir o pedido principal
    const { data: pedido, error: erroPedido } = await supabaseCliente
      .from('pedidos')
      .insert([{
        numero_pedido: dadosPedido.numeroPedido,
        nome_cliente: dadosPedido.nome,
        telefone: dadosPedido.telefone,
        localizacao: dadosPedido.localizacao,
        tipo_entrega: dadosPedido.tipo,
        endereco: dadosPedido.endereco || null,
        observacoes: dadosPedido.observacoes || null,
        subtotal: dadosPedido.subtotal,
        taxa_entrega: dadosPedido.taxa,
        total: dadosPedido.total,
        status: 'pendente'
      }])
      .select()
      .single();

    if (erroPedido) {
      console.error('Erro ao gravar pedido:', erroPedido);
      return null;
    }

    // 2. Inserir os itens do pedido
    const itens = dadosPedido.itens.map(item => ({
      pedido_id: pedido.id,
      produto_id: item.id,
      nome_produto: item.nome,
      preco_unitario: item.preco,
      quantidade: item.quantidade,
      total: item.preco * item.quantidade
    }));

    const { error: erroItens } = await supabaseCliente
      .from('itens_pedido')
      .insert(itens);

    if (erroItens) {
      console.error('Erro ao gravar itens:', erroItens);
      // O pedido principal já foi criado, mas os itens falharam
    }

    return pedido.numero_pedido;
  } catch (err) {
    console.error('Erro geral ao gravar no Supabase:', err);
    return null;
  }
}

/**
 * Busca todos os pedidos (para o painel admin)
 */
async function buscarPedidos() {
  if (!supabaseCliente) {
    supabaseCliente = iniciarSupabase();
  }
  if (!supabaseCliente) return [];

  const { data, error } = await supabaseCliente
    .from('pedidos')
    .select(`
      *,
      itens_pedido (*)
    `)
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
  return data || [];
}

/**
 * Actualiza o status de um pedido
 */
async function actualizarStatusPedido(idPedido, novoStatus) {
  if (!supabaseCliente) {
    supabaseCliente = iniciarSupabase();
  }
  if (!supabaseCliente) return false;

  const { error } = await supabaseCliente
    .from('pedidos')
    .update({ 
      status: novoStatus,
      actualizado_em: new Date().toISOString()
    })
    .eq('id', idPedido);

  if (error) {
    console.error('Erro ao actualizar status:', error);
    return false;
  }
  return true;
}
