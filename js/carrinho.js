/* ============================================
   SISTEMA DE CARRINHO - NDONGALA PASTELARIA
============================================ */

const CHAVE_CARRINHO = 'ndongala_carrinho';
const TAXA_ENTREGA = 1500; // Kz

let carrinho = [];

function carregarCarrinho() {
  const guardado = localStorage.getItem(CHAVE_CARRINHO);
  carrinho = guardado ? JSON.parse(guardado) : [];
  actualizarInterfaceCarrinho();
}

function guardarCarrinho() {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  actualizarInterfaceCarrinho();
}

function adicionarAoCarrinho(idProduto, quantidade = 1) {
  const produto = produtosIniciais.find(p => p.id === idProduto);
  if (!produto) return;

  const existente = carrinho.find(i => i.id === idProduto);
  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: quantidade
    });
  }
  guardarCarrinho();
  mostrarFeedback(produto.nome + (quantidade > 1 ? ` (${quantidade}x)` : '') + ' adicionado!');
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) carrinho = carrinho.filter(i => i.id !== id);
  guardarCarrinho();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  guardarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  guardarCarrinho();
}

function calcularTotal() {
  return carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
}

function actualizarInterfaceCarrinho() {
  const contador = document.getElementById('contadorCarrinho');
  const contentor = document.getElementById('itensCarrinho');
  const totalEl = document.getElementById('totalCarrinho');
  const botaoFinalizar = document.getElementById('botaoFinalizar');
  const totalCheckout = document.getElementById('totalCheckout');

  const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
  if (contador) contador.textContent = totalItens;

  if (contentor) {
    if (carrinho.length === 0) {
      contentor.innerHTML = '<div class="carrinho-vazio">O carrinho está vazio.<br>Adicione produtos deliciosos!</div>';
    } else {
      contentor.innerHTML = carrinho.map(item => `
        <div class="item-carrinho">
          <img src="${item.imagem}" alt="${item.nome}">
          <div class="item-carrinho-info">
            <h4>${item.nome}</h4>
            <div class="preco-unit">${formatarPreco(item.preco)} × ${item.quantidade}</div>
            <div class="quantidade-control">
              <button onclick="alterarQuantidade('${item.id}', -1)">−</button>
              <span>${item.quantidade}</span>
              <button onclick="alterarQuantidade('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="remover-item" onclick="removerDoCarrinho('${item.id}')">🗑️</button>
        </div>
      `).join('');
    }
  }

  const total = calcularTotal();
  if (totalEl) totalEl.textContent = formatarPreco(total);
  if (totalCheckout) totalCheckout.textContent = formatarPreco(total);
  if (botaoFinalizar) botaoFinalizar.disabled = carrinho.length === 0;
}

function mostrarFeedback(msg) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#2E7D32;color:#fff;padding:0.75rem 1.4rem;border-radius:50px;z-index:9999;font-weight:600;box-shadow:0 4px 15px rgba(0,0,0,0.2);';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

function abrirCarrinho() {
  document.getElementById('sidebarCarrinho').classList.add('aberto');
  document.getElementById('overlayCarrinho').classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  document.getElementById('sidebarCarrinho').classList.remove('aberto');
  document.getElementById('overlayCarrinho').classList.remove('aberto');
  document.body.style.overflow = '';
}

function abrirCheckout() {
  if (carrinho.length === 0) return;
  fecharCarrinho();
  document.getElementById('modalCheckout').classList.remove('escondido');
  document.getElementById('overlayCheckout').classList.add('aberto');
  document.getElementById('totalCheckout').textContent = formatarPreco(calcularTotal());
  document.body.style.overflow = 'hidden';
}

function fecharCheckout() {
  document.getElementById('modalCheckout').classList.add('escondido');
  document.getElementById('overlayCheckout').classList.remove('aberto');
  document.body.style.overflow = '';
}

function enviarPedido(e) {
  e.preventDefault();
  const nome = document.getElementById('nomeCliente').value.trim();
  const telefone = document.getElementById('telefoneCliente').value.trim();
  const localizacao = document.getElementById('localizacaoCliente').value.trim();
  const tipo = document.getElementById('tipoEntrega').value;
  const endereco = document.getElementById('enderecoCliente').value.trim();
  const obs = document.getElementById('observacoes').value.trim();

  if (tipo === 'entrega' && !endereco) {
    alert('Por favor, indique o endereço de entrega.');
    return;
  }

  let msg = `🛒 *NOVO PEDIDO - Ndongala Sabor e Arte*\n\n`;
  msg += `👤 *Cliente:* ${nome}\n`;
  msg += `📞 *Telefone:* ${telefone}\n`;
  msg += `📍 *Localização:* ${localizacao}\n`;
  msg += `📦 *Tipo:* ${tipo === 'retirada' ? 'Retirada no local' : 'Entrega'}\n`;
  if (tipo === 'entrega') msg += `🏠 *Endereço completo:* ${endereco}\n`;
  if (obs) msg += `📝 *Observações:* ${obs}\n`;
  msg += `\n*Itens:*\n`;

  carrinho.forEach(i => {
    msg += `• ${i.nome} × ${i.quantidade} = ${formatarPreco(i.preco * i.quantidade)}\n`;
  });

  const subtotal = calcularTotal();
  const taxa = tipo === 'entrega' ? TAXA_ENTREGA : 0;
  const totalFinal = subtotal + taxa;

  // Gerar número de pedido
  const numeroPedido = 'NDG-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random()*9000+1000);

  msg += `\n*Nº Pedido:* ${numeroPedido}\n`;
  msg += `\n*Subtotal:* ${formatarPreco(subtotal)}\n`;
  if (taxa) msg += `*Taxa de entrega:* ${formatarPreco(taxa)}\n`;
  msg += `*TOTAL:* ${formatarPreco(totalFinal)}\n\n_Pedido feito pelo site_`;

  // Gravar no Supabase (se configurado)
  if (typeof gravarPedidoSupabase === 'function') {
    gravarPedidoSupabase({
      numeroPedido,
      nome,
      telefone,
      localizacao,
      tipo,
      endereco,
      observacoes: obs,
      subtotal,
      taxa,
      total: totalFinal,
      itens: [...carrinho]
    }).then(resultado => {
      if (resultado) console.log('Pedido gravado no Supabase:', resultado);
    });
  }

  window.open(`https://wa.me/244972893829?text=${encodeURIComponent(msg)}`, '_blank');
  limparCarrinho();
  fecharCheckout();
  alert('Pedido enviado! Nº ' + numeroPedido + '\nVamos confirmar consigo pelo WhatsApp. Obrigado! 🥐');
}

document.addEventListener('DOMContentLoaded', () => {
  carregarCarrinho();

  document.getElementById('botaoAbrirCarrinho')?.addEventListener('click', abrirCarrinho);
  document.getElementById('botaoFecharCarrinho')?.addEventListener('click', fecharCarrinho);
  document.getElementById('overlayCarrinho')?.addEventListener('click', fecharCarrinho);
  document.getElementById('botaoFinalizar')?.addEventListener('click', abrirCheckout);
  document.getElementById('botaoCancelarCheckout')?.addEventListener('click', fecharCheckout);
  document.getElementById('overlayCheckout')?.addEventListener('click', fecharCheckout);

  document.getElementById('opcaoRetirada')?.addEventListener('click', () => {
    document.getElementById('opcaoRetirada').classList.add('seleccionado');
    document.getElementById('opcaoEntrega').classList.remove('seleccionado');
    document.getElementById('tipoEntrega').value = 'retirada';
    document.getElementById('campoEndereco').classList.add('escondido');
  });

  document.getElementById('opcaoEntrega')?.addEventListener('click', () => {
    document.getElementById('opcaoEntrega').classList.add('seleccionado');
    document.getElementById('opcaoRetirada').classList.remove('seleccionado');
    document.getElementById('tipoEntrega').value = 'entrega';
    document.getElementById('campoEndereco').classList.remove('escondido');
  });
});
