/* ============================================
   CONFIGURAÇÃO SUPABASE - NDONGALA
============================================ */

const SUPABASE_URL = 'https://btlyloiuqmgvhsnczmyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bHlsb2l1cW1ndmhzbmN6bXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MTQ0NTksImV4cCI6MjEwNTA5MDQ1OX0.xG1kQjac_pKpTfOEAWKuFUg5uSY8uqp9GWiKqHQelAc';

let supabaseCliente = null;

function supabaseConfigurado() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 40);
}

function iniciarSupabase() {
  if (!supabaseConfigurado()) return null;
  if (typeof supabase === 'undefined') {
    console.error('Biblioteca supabase-js não carregada.');
    return null;
  }
  if (!supabaseCliente) {
    supabaseCliente = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase ligado.');
  }
  return supabaseCliente;
}

/* ========== PEDIDOS ========== */

async function gravarPedidoSupabase(dadosPedido) {
  const client = iniciarSupabase();
  if (!client) return null;

  try {
    const { data: pedido, error } = await client
      .from('pedidos')
      .insert([{
        numero_pedido: dadosPedido.numeroPedido,
        nome_cliente: dadosPedido.nome,
        telefone: dadosPedido.telefone,
        localizacao: dadosPedido.localizacao || null,
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

    if (error) {
      console.error('Erro pedido:', error);
      return null;
    }

    const itens = dadosPedido.itens.map(item => ({
      pedido_id: pedido.id,
      produto_id: String(item.id),
      nome_produto: item.nome,
      preco_unitario: item.preco,
      quantidade: item.quantidade,
      total: item.preco * item.quantidade
    }));

    await client.from('itens_pedido').insert(itens);
    return pedido.numero_pedido;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function buscarPedidos() {
  const client = iniciarSupabase();
  if (!client) return { erro: 'nao_configurado', dados: [] };

  const { data, error } = await client
    .from('pedidos')
    .select('*, itens_pedido(*)')
    .order('criado_em', { ascending: false });

  if (error) return { erro: error.message, dados: [] };
  return { erro: null, dados: data || [] };
}

async function actualizarStatusPedido(idPedido, novoStatus) {
  const client = iniciarSupabase();
  if (!client) return false;

  const { error } = await client
    .from('pedidos')
    .update({ status: novoStatus, actualizado_em: new Date().toISOString() })
    .eq('id', idPedido);

  return !error;
}

/* ========== PRODUTOS (CRUD) ========== */

async function buscarProdutosDB() {
  const client = iniciarSupabase();
  if (!client) return { erro: 'nao_configurado', dados: [] };

  const { data, error } = await client
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) return { erro: error.message, dados: [] };
  return { erro: null, dados: data || [] };
}

async function buscarProdutosActivos() {
  const client = iniciarSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('produtos')
    .select('*')
    .eq('activo', true)
    .order('nome');

  if (error) {
    console.error('Erro produtos activos:', error);
    return [];
  }
  return data || [];
}

async function criarProduto(produto) {
  const client = iniciarSupabase();
  if (!client) return { ok: false, erro: 'Supabase não ligado' };

  const { data, error } = await client
    .from('produtos')
    .insert([{
      nome: produto.nome,
      descricao: produto.descricao || null,
      preco: Number(produto.preco),
      imagem_url: produto.imagem_url || null,
      destaque: !!produto.destaque,
      activo: produto.activo !== false,
      slug: (produto.nome || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }])
    .select()
    .single();

  if (error) return { ok: false, erro: error.message };
  return { ok: true, dados: data };
}

async function actualizarProduto(id, produto) {
  const client = iniciarSupabase();
  if (!client) return { ok: false, erro: 'Supabase não ligado' };

  const { data, error } = await client
    .from('produtos')
    .update({
      nome: produto.nome,
      descricao: produto.descricao || null,
      preco: Number(produto.preco),
      imagem_url: produto.imagem_url || null,
      destaque: !!produto.destaque,
      activo: produto.activo !== false,
      actualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { ok: false, erro: error.message };
  return { ok: true, dados: data };
}

async function eliminarProduto(id) {
  const client = iniciarSupabase();
  if (!client) return { ok: false, erro: 'Supabase não ligado' };

  const { error } = await client
    .from('produtos')
    .delete()
    .eq('id', id);

  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}
