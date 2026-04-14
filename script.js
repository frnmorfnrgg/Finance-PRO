// Memória Central do Hub (Carrega o que estiver salvo no navegador)
let dadosHub = {
    lucro: parseFloat(localStorage.getItem('hub_lucro') || 0),
    investido: parseFloat(localStorage.getItem('hub_inv') || 0)
};

// Executa assim que o script é carregado
atualizarInterfaceHub();

// --- FUNÇÕES DE NAVEGAÇÃO ---

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

function showPage(p) {
    document.querySelectorAll('.page').forEach(c => c.classList.remove('active'));
    document.getElementById('page-' + p).classList.add('active');
    
    // Controle dos botões: Puxar aparece na IA, Lançar aparece no Financeiro
    document.getElementById('btn-puxar-ia').style.display = (p === 'ia') ? 'block' : 'none';
    document.getElementById('btn-lancar-pedro').style.display = (p === 'fin') ? 'block' : 'none';
    
    toggleMenu();
}

// --- FUNÇÕES DE DADOS ---

// 1. Solicita os dados ao site da IA (Cavalo)
function puxarDadosIA() {
    const frameIA = document.getElementById('iframe-ia').contentWindow;
    frameIA.postMessage({ type: 'requestFullHistory' }, '*');
}

// 2. Envia os dados do Hub para o Painel Central (Pedro)
function transferirParaCentro() {
    const frameFin = document.getElementById('iframe-fin').contentWindow;
    frameFin.postMessage({
        type: 'forceUpdateFinance',
        lucro: dadosHub.lucro,
        investido: dadosHub.investido
    }, '*');
    alert("🚀 Saldo enviado para o painel de Pedro!");
}

// 3. Escuta as mensagens vindas dos sites filhos
window.addEventListener('message', function(event) {
    // Quando a IA (Cavalo) envia o histórico
    if (event.data.type === 'sync_history') {
        dadosHub.lucro = event.data.lucroTotal;
        dadosHub.investido = event.data.invTotal;
        
        // Salva permanentemente no navegador
        localStorage.setItem('hub_lucro', dadosHub.lucro);
        localStorage.setItem('hub_inv', dadosHub.investido);
        
        atualizarInterfaceHub();
        alert("✅ Hub atualizado com o histórico da IA!");
    }
});

// Atualiza os números que aparecem no topo (verde e amarelo)
function atualizarInterfaceHub() {
    const elLucro = document.getElementById('saldo-lucro');
    const elInv = document.getElementById('saldo-inv');
    
    if(elLucro) elLucro.innerText = 'R$ ' + dadosHub.lucro.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    if(elInv) elInv.innerText = 'R$ ' + dadosHub.investido.toLocaleString('pt-BR', {minimumFractionDigits: 2});
}

// Função para limpar tudo
function resetarTudo() {
    if(confirm("Deseja zerar todos os saldos salvos no Hub?")) {
        localStorage.removeItem('hub_lucro');
        localStorage.removeItem('hub_inv');
        location.reload();
    }
}
