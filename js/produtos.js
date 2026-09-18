/* ============================================
   PRODUTOS - carregados do Supabase
   Fallback local só se a base estiver vazia/offline
============================================ */

let produtosIniciais = [];

const produtosFallback = [
  { id: 'b1', nome: 'Bolo Personalizado (por kg)', descricao: 'Bolo sob encomenda com o tema e sabor que desejar.', preco: 18000, categoria: 'bolos', imagem: 'imagens/produtos/bolo-casamento.jpg', destaque: true },
  { id: 's1', nome: 'Coxinha de Frango (unid.)', descricao: 'Coxinha crocante com recheio cremoso de frango.', preco: 500, categoria: 'salgados', imagem: 'imagens/produtos/coxinhas.jpg', destaque: true }
];

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-AO') + ' Kz';
}

function normalizarImg(u) {
  if (!u) return '/imagens/logo.png';
  if (u.startsWith('http') || u.startsWith('/')) return u;
  return '/' + u;
}

function mapearProdutoDB(p) {
  return {
    id: p.id,
    nome: p.nome,
    descricao: p.descricao || '',
    preco: Number(p.preco),
    categoria: p.categoria || 'outros',
    imagem: normalizarImg(p.imagem_url),
    destaque: !!p.destaque
  };
}

async function carregarProdutosDoSupabase() {
  if (typeof buscarProdutosActivos === 'function') {
    const lista = await buscarProdutosActivos();
    if (lista && lista.length > 0) {
      produtosIniciais = lista.map(mapearProdutoDB);
      return true;
    }
  }
  return false;
}

function renderizarProdutos(filtro) {
  const contentor = document.getElementById('grelhaProdutos') || document.getElementById('listaProdutos');
  if (!contentor) return;

  let lista = produtosIniciais;
  if (filtro && filtro !== 'todos') {
    lista = produtosIniciais.filter(p => p.categoria === filtro);
  }

  if (!lista.length) {
    contentor.innerHTML = '<p style="text-align:center;padding:2rem;color:#888">Nenhum produto disponível de momento.</p>';
    return;
  }

  if (typeof quantidadesTemp === 'undefined') window.quantidadesTemp = {};

  contentor.innerHTML = lista.map(p => `
    <article class="cartao-produto" data-categoria="${p.categoria}">
      <div class="cartao-produto-imagem">
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy" onerror="this.src='/imagens/logo.png'">
        ${p.destaque ? '<span class="etiqueta-destaque">Destaque</span>' : ''}
      </div>
      <div class="cartao-produto-corpo">
        <h3>${p.nome}</h3>
        <p class="descricao">${p.descricao}</p>
        <div class="preco-area">
          <span class="preco">${formatarPreco(p.preco)}</span>
        </div>
        <div class="controlos-quantidade">
          <button class="botao-qtd" onclick="alterarQtdProduto('${p.id}', -1)" aria-label="Diminuir">−</button>
          <span class="qtd-valor" id="qtd-${p.id}">1</span>
          <button class="botao-qtd" onclick="alterarQtdProduto('${p.id}', 1)" aria-label="Aumentar">+</button>
        </div>
        <button class="botao-adicionar-carrinho" onclick="adicionarAoCarrinhoComQtd('${p.id}')">
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  `).join('');
}

function alterarQtdProduto(id, delta) {
  if (!window.quantidadesTemp) window.quantidadesTemp = {};
  if (!window.quantidadesTemp[id]) window.quantidadesTemp[id] = 1;
  window.quantidadesTemp[id] = Math.max(1, window.quantidadesTemp[id] + delta);
  const el = document.getElementById('qtd-' + id);
  if (el) el.textContent = window.quantidadesTemp[id];
}

function adicionarAoCarrinhoComQtd(id) {
  const qtd = (window.quantidadesTemp && window.quantidadesTemp[id]) || 1;
  if (typeof adicionarAoCarrinho === 'function') {
    adicionarAoCarrinho(id, qtd);
  }
  if (window.quantidadesTemp) window.quantidadesTemp[id] = 1;
  const el = document.getElementById('qtd-' + id);
  if (el) el.textContent = '1';
}

function filtrarCategoria(cat) {
  document.querySelectorAll('.filtro-btn, .botao-filtro').forEach(btn => {
    btn.classList.toggle('activo', btn.dataset.categoria === cat || (cat === 'todos' && (btn.dataset.categoria === 'todos' || !btn.dataset.categoria)));
  });
  renderizarProdutos(cat);
}

document.addEventListener('DOMContentLoaded', async () => {
  // Tentar Supabase primeiro
  if (typeof iniciarSupabase === 'function') iniciarSupabase();

  const ok = await carregarProdutosDoSupabase();
  if (!ok) {
    console.warn('Usando produtos locais (fallback).');
    produtosIniciais = produtosFallback;
  }

  renderizarProdutos('todos');

  document.querySelectorAll('[data-categoria]').forEach(btn => {
    btn.addEventListener('click', () => filtrarCategoria(btn.dataset.categoria));
  });
});
