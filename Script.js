class Jogador {
  constructor(nome, simbolo) {
    this.nome = nome;
    this.simbolo = simbolo;
    this.vitorias = 0;
    this.derrotas = 0;
  }

  registrarJogada(tabuleiro, linha, coluna) {
    tabuleiro[linha][coluna] = this.simbolo;
  }
}

class JogoDaVelha {
  constructor(jogador1, jogador2) {
    this.tabuleiro = Array(3).fill().map(() => Array(3).fill(null));
    this.jogador1 = jogador1;
    this.jogador2 = jogador2;
    this.jogadorAtual = jogador1;
    this.historico = JSON.parse(localStorage.getItem('ranking')) || {};
    this.atualizarRankingDisplay();
  }

  inicializarJogo() {
    this.tabuleiro = Array(3).fill().map(() => Array(3).fill(null));
    document.querySelectorAll('.celula').forEach(celula => celula.textContent = '');
    this.jogadorAtual = this.jogador1;
  }

  registrarJogada(linha, coluna) {
    if (!this.tabuleiro[linha][coluna]) {
      this.jogadorAtual.registrarJogada(this.tabuleiro, linha, coluna);
      document.querySelector(`[data-pos="${linha},${coluna}"]`).textContent = this.jogadorAtual.simbolo;
      if (this.verificarVencedor()) {
        alert(`${this.jogadorAtual.nome} venceu!`);
        this.atualizarRanking(this.jogadorAtual.nome, 'vitorias');
        this.atualizarRanking(this.jogadorAtual === this.jogador1 ? this.jogador2.nome : this.jogador1.nome, 'derrotas');
        this.inicializarJogo();
      } else if (this.tabuleiro.flat().every(cell => cell)) {
        alert('Empate!');
        this.inicializarJogo();
      } else {
        this.alternarJogador();
      }
    }
  }

  verificarVencedor() {
    const linhas = this.tabuleiro;
    const colunas = this.tabuleiro[0].map((_, i) => this.tabuleiro.map(row => row[i]));
    const diagonais = [
      [this.tabuleiro[0][0], this.tabuleiro[1][1], this.tabuleiro[2][2]],
      [this.tabuleiro[0][2], this.tabuleiro[1][1], this.tabuleiro[2][0]]
    ];
    const todas = [...linhas, ...colunas, ...diagonais];
    return todas.some(combinacao => combinacao.every(celula => celula === this.jogadorAtual.simbolo));
  }

  alternarJogador() {
    this.jogadorAtual = this.jogadorAtual === this.jogador1 ? this.jogador2 : this.jogador1;
  }

  atualizarRanking(nome, resultado) {
    if (!this.historico[nome]) {
      this.historico[nome] = { vitorias: 0, derrotas: 0 };
    }
    this.historico[nome][resultado]++;
    localStorage.setItem('ranking', JSON.stringify(this.historico));
    this.atualizarRankingDisplay();
  }

  atualizarRankingDisplay() {
    const rankingDiv = document.getElementById('ranking');
    rankingDiv.innerHTML = '<h3>Ranking</h3>';
    Object.entries(this.historico).forEach(([nome, { vitorias, derrotas }]) => {
      const rankingItem = document.createElement('div');
      rankingItem.textContent = `${nome} - Vitórias: ${vitorias}, Derrotas: ${derrotas}`;
      rankingDiv.appendChild(rankingItem);
    });
  }
}

let jogo;

function iniciarJogo() {
  const nomeJogador1 = document.getElementById('jogador1').value;
  const nomeJogador2 = document.getElementById('jogador2').value;
  if (nomeJogador1 && nomeJogador2) {
    const jogador1 = new Jogador(nomeJogador1, 'X');
    const jogador2 = new Jogador(nomeJogador2, 'O');
    jogo = new JogoDaVelha(jogador1, jogador2);
    jogo.inicializarJogo();
    document.querySelectorAll('.celula').forEach(celula => {
      celula.addEventListener('click', () => {
        const [linha, coluna] = celula.getAttribute('data-pos').split(',').map(Number);
        jogo.registrarJogada(linha, coluna);
      });
    });
  } else {
    alert('Por favor, insira os nomes dos jogadores.');
  }
}
