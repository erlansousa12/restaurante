let cardapio = [];
let pedido = [];

// Carregar cardápio do JSON
async function carregarCardapio() {
    const resposta = await fetch('cardapio.json');
    const dados = await resposta.json();
    cardapio = dados.CARDAPIO.PRODUTOS;
    exibirCardapio();
}

// Exibir o cardápio na tabela
function exibirCardapio() {
    const tabela = document.getElementById('corpo-tabela');
    tabela.innerHTML = '';

    cardapio.forEach((item) => {
        const linha = `
            <tr>
                <td>${item.descricao}</td>
                <td>${item.preco}</td>
                <td>
                    <input type="number" min="0" value="0" 
                    onchange="atualizarPedido(${item.id}, this.value)">
                </td>
            </tr>
        `;
        tabela.insertAdjacentHTML('beforeend', linha);
    });
}

// Atualizar o pedido conforme a quantidade selecionada
function atualizarPedido(id, quantidade) {
    const produto = cardapio.find((item) => item.id == id);
    quantidade = parseInt(quantidade);

    if (quantidade > 0) {
        const itemPedido = pedido.find((p) => p.id == id);

        if (itemPedido) {
            itemPedido.quantidade = quantidade;
        } else {
            pedido.push({ ...produto, quantidade });
        }
    } else {
        // Remover produto do pedido
        pedido = pedido.filter((p) => p.id != id);
    }

    exibirPedido();
}

// Exibir resumo do pedido e calcular o total
function exibirPedido() {
    const resumo = document.getElementById('resumo-pedido');
    const totalElemento = document.getElementById('total-pedido');

    resumo.innerHTML = '';
    let total = 0;

    pedido.forEach((item) => {
        const preco = parseFloat(item.preco.replace('R$', '').replace(',', '.'));
        const subtotal = preco * item.quantidade;
        total += subtotal;

        resumo.insertAdjacentHTML('beforeend', `
            <p>${item.descricao} - ${item.quantidade} x ${item.preco} = R$${subtotal.toFixed(2)}</p>
        `);
    });

    totalElemento.textContent = total.toFixed(2);
}

// Fechar comanda
function fecharComanda() {
    alert('Comanda fechada! Total: R$ ' + document.getElementById('total-pedido').textContent);
    pedido = [];
    exibirPedido();
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = 0);
}

// Carregar o cardápio ao carregar a página
window.onload = carregarCardapio;
