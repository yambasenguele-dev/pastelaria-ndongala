/* ============================================
   SCRIPT PRINCIPAL - NDONGALA SABOR E ARTE
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const botaoMenu = document.getElementById('botaoMenu');
  const menu = document.getElementById('menuNavegacao');
  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', () => menu.classList.toggle('aberto'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('aberto')));
  }

  // Marquee de comentários
  const comentarios = [
    { texto: "Os bolos da Ndongala são simplesmente divinos! Encomendei para o aniversário e todos elogiaram.", autor: "Maria C., Luanda", estrelas: "★★★★★" },
    { texto: "Melhor pastelaria de Luanda! Os pastéis e os bolos personalizados são de outro nível.", autor: "Ana S., Maianga", estrelas: "★★★★★" },
    { texto: "Atendimento excelente e produtos sempre frescos. Recomendo de olhos fechados!", autor: "Carlos M., Viana", estrelas: "★★★★★" },
    { texto: "O bolo de chocolate estava perfeito. Sabor e apresentação impecáveis.", autor: "Pedro L., Benfica", estrelas: "★★★★★" },
    { texto: "Profissional dedicada. Uma referência em bolos personalizados em Luanda!", autor: "Isabel T., Cacuaco", estrelas: "★★★★★" },
    { texto: "Os salgados são deliciosos e o atendimento pelo WhatsApp é super rápido.", autor: "Rui F., Samba", estrelas: "★★★★★" },
    { texto: "Encomendei um bolo temático e ficou exactamente como eu imaginei. Obrigada!", autor: "Sofia R., Kilamba", estrelas: "★★★★★" },
    { texto: "Qualidade, carinho e pontualidade. Já sou cliente fiel da Ndongala!", autor: "João P., Talatona", estrelas: "★★★★★" }
  ];

  const faixa = document.getElementById('faixaComentarios');
  if (faixa) {
    const lista = [...comentarios, ...comentarios];
    faixa.innerHTML = lista.map(c => `
      <div class="comentario-item">
        <div class="estrelas">${c.estrelas}</div>
        <p>"${c.texto}"</p>
        <div class="autor">— ${c.autor}</div>
      </div>
    `).join('');
  }
});

function enviarContacto(e) {
  e.preventDefault();
  const nome = document.getElementById('nomeContacto').value;
  const telefone = document.getElementById('telefoneContacto').value;
  const mensagem = document.getElementById('mensagemContacto').value;

  const texto = encodeURIComponent(
    `Olá! Vim pelo site Ndongala Sabor e Arte.\n\nNome: ${nome}\nTelefone: ${telefone}\n\nMensagem: ${mensagem}`
  );
  window.open(`https://wa.me/244972893829?text=${texto}`, '_blank');
  e.target.reset();
  alert('Obrigado! Vamos abrir o WhatsApp para enviar a sua mensagem.');
}
