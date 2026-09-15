/* ============================================
   PRODUTOS DA PASTELARIA NDONGALA
   Com imagens reais – ajuste preços depois
============================================ */

const produtosIniciais = [
  // BOLOS
  {
    id: 'b1',
    nome: 'Bolo Personalizado (por kg)',
    descricao: 'Bolo sob encomenda com o tema e sabor que desejar. Ideal para aniversários e eventos.',
    preco: 18000,
    categoria: 'bolos',
    imagem: 'imagens/produtos/bolo-casamento.jpg',
    destaque: true
  },
  {
    id: 'b2',
    nome: 'Bolo Temático Infantil',
    descricao: 'Bolos personalizados com temas infantis (Minnie, Boss Baby, etc.). Consulte-nos!',
    preco: 22000,
    categoria: 'bolos',
    imagem: 'imagens/produtos/bolo-minnie.jpg',
    destaque: true
  },
  {
    id: 'b3',
    nome: 'Bolo de Frutas',
    descricao: 'Bolo fresco decorado com kiwi, laranja, maçã e cereja.',
    preco: 15000,
    categoria: 'bolos',
    imagem: 'imagens/produtos/bolo-frutas.jpg',
    destaque: false
  },
  {
    id: 'b4',
    nome: 'Bolo de Amendoim',
    descricao: 'Bolo recheado e coberto com amendoim e doce de leite.',
    preco: 14000,
    categoria: 'bolos',
    imagem: 'imagens/produtos/bolo-amendoim.jpg',
    destaque: true
  },
  {
    id: 'b5',
    nome: 'Bolo de Morango',
    descricao: 'Bolo delicado coberto com morangos frescos.',
    preco: 16000,
    categoria: 'bolos',
    imagem: 'imagens/produtos/bolo-morango.jpg',
    destaque: false
  },
  {
    id: 'b6',
    nome: 'Bolo Institucional / Corporativo',
    descricao: 'Bolos personalizados para empresas, igrejas e instituições.',
    preco: 20000,
    categoria: 'bolos',
    imagem: 'imagens/produtos/bolo-institucional.jpg',
    destaque: false
  },

  // SALGADOS
  {
    id: 's1',
    nome: 'Coxinha de Frango (unid.)',
    descricao: 'Coxinha crocante com recheio cremoso de frango.',
    preco: 500,
    categoria: 'salgados',
    imagem: 'imagens/produtos/coxinhas.jpg',
    destaque: true
  },
  {
    id: 's2',
    nome: 'Enrolado de Salsicha (unid.)',
    descricao: 'Massa dourada recheada com salsicha.',
    preco: 400,
    categoria: 'salgados',
    imagem: 'imagens/produtos/salgados-misto.jpg',
    destaque: false
  },
  {
    id: 's3',
    nome: 'Rissole / Croquete (unid.)',
    descricao: 'Salgado frito crocante, várias opções de recheio.',
    preco: 450,
    categoria: 'salgados',
    imagem: 'imagens/produtos/salgados-festa.jpg',
    destaque: false
  },
  {
    id: 's4',
    nome: 'Mix de Salgados (50 unidades)',
    descricao: 'Seleção de coxinhas, enrolados e rissoles para festa.',
    preco: 20000,
    categoria: 'salgados',
    imagem: 'imagens/produtos/salgados-misto.jpg',
    destaque: true
  },
  {
    id: 's5',
    nome: 'Mini Bolos de Chocolate',
    descricao: 'Mini bolos húmidos com cobertura de chocolate.',
    preco: 800,
    categoria: 'salgados',
    imagem: 'imagens/produtos/salgados-chocolate.jpg',
    destaque: false
  },

  // DOCES
  {
    id: 'd1',
    nome: 'Bolinho de Coco (unid.)',
    descricao: 'Bolinho fofinho coberto com coco ralado.',
    preco: 400,
    categoria: 'doces',
    imagem: 'imagens/produtos/bolinhos-coco.jpg',
    destaque: true
  },
  {
    id: 'd2',
    nome: 'Sonho / Bola de Berlim',
    descricao: 'Massa fofinha polvilhada com açúcar e coco.',
    preco: 500,
    categoria: 'doces',
    imagem: 'imagens/produtos/bolinhos-coco2.jpg',
    destaque: false
  },

  // PÃES E OUTROS
  {
    id: 'p1',
    nome: 'Pães Doces Variados',
    descricao: 'Selecção de pães doces com diferentes formatos e coberturas.',
    preco: 600,
    categoria: 'paes',
    imagem: 'imagens/produtos/paes-doces.jpg',
    destaque: false
  },
  {
    id: 'p2',
    nome: 'Focaccia / Pão Recheado',
    descricao: 'Pão macio com azeitonas, tomate e ervas.',
    preco: 2500,
    categoria: 'paes',
    imagem: 'imagens/produtos/focaccia.jpg',
    destaque: false
  }
];

function formatarPreco(valor) {
  return valor.toLocaleString('pt-AO') + ' Kz';
}

function renderizarProdutos(lista = produtosIniciais) {
  const contentor = document.getElementById('listaProdutos');
  if (!contentor) return;

  if (lista.length === 0) {
    contentor.innerHTML = '<p class="texto-centro" style="grid-column:1/-1;padding:2.5rem;">Nenhum produto encontrado nesta categoria.</p>';
    return;
  }

  contentor.innerHTML = lista.map(p => `
    <article class="cartao-produto" data-categoria="${p.categoria}">
      <div class="cartao-produto-imagem">
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
        ${p.destaque ? '<span class="etiqueta-destaque">Destaque</span>' : ''}
      </div>
      <div class="cartao-produto-corpo">
        <h3>${p.nome}</h3>
        <p class="descricao">${p.descricao}</p>
        <div class="preco-area">
          <span class="preco">${formatarPreco(p.preco)}</span>
        </div>
        <div class="controlos-quantidade">
          <button class="botao-qtd" onclick="alterarQtdProduto('${p.id}', -1)" aria-label="Diminuir quantidade">−</button>
          <span class="qtd-valor" id="qtd-${p.id}">1</span>
          <button class="botao-qtd" onclick="alterarQtdProduto('${p.id}', 1)" aria-label="Aumentar quantidade">+</button>
        </div>
        <button class="botao-adicionar-carrinho" onclick="adicionarAoCarrinhoComQtd('${p.id}')">
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  `).join('');
}

/* Quantidade temporária por produto (antes de adicionar) */
const quantidadesTemp = {};

function alterarQtdProduto(id, delta) {
  if (!quantidadesTemp[id]) quantidadesTemp[id] = 1;
  quantidadesTemp[id] = Math.max(1, quantidadesTemp[id] + delta);
  const el = document.getElementById('qtd-' + id);
  if (el) el.textContent = quantidadesTemp[id];
}

function adicionarAoCarrinhoComQtd(id) {
  const qtd = quantidadesTemp[id] || 1;
  adicionarAoCarrinho(id, qtd);
  // Resetar quantidade visual para 1
  quantidadesTemp[id] = 1;
  const el = document.getElementById('qtd-' + id);
  if (el) el.textContent = '1';
}

function filtrarPorCategoria(categoria) {
  document.querySelectorAll('.filtro-botao').forEach(btn => {
    btn.classList.toggle('activo', btn.dataset.categoria === categoria);
  });

  if (categoria === 'todos') {
    renderizarProdutos(produtosIniciais);
  } else {
    renderizarProdutos(produtosIniciais.filter(p => p.categoria === categoria));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
  document.querySelectorAll('.filtro-botao').forEach(botao => {
    botao.addEventListener('click', () => filtrarPorCategoria(botao.dataset.categoria));
  });
});
