document.addEventListener('DOMContentLoaded', function () {
    fetchFuncionarios();

    const filterSelect = document.getElementById('specialty');
    filterSelect.addEventListener('change', function () {
        fetchFuncionarios(this.value);
    });
});

function fetchFuncionarios(filter = 'all') {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'funcionario.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (this.status === 200) {
            const funcionarios = JSON.parse(this.responseText);
            const container = document.getElementById('team-container');
            container.innerHTML = '';

            if (funcionarios.length === 0) {
                container.innerHTML = '<p>Nenhum funcionário encontrado para este filtro.</p>';
                return;
            }

            funcionarios.forEach(funcionario => {
                const card = `
                    <div class="team-card" data-specialty="${funcionario.cargo.toLowerCase()}">
                        <img src="${funcionario.foto}" alt="${funcionario.nome}">
                        <h3>${funcionario.nome}</h3>
                        <p>${funcionario.cargo}</p>
                        <p class="preco">Preço: R$ ${funcionario.precoservico.toFixed(2)}</p>
                        <button class="btn" onclick="redirectToCalendarWithPost('${funcionario.nome}', '${funcionario.cargo}', '${funcionario.carga_horaria}', '${funcionario.tempo_servico}', '${funcionario.foto}', ${funcionario.precoservico})">Agendar</button>
                    </div>
                `;
                container.innerHTML += card;
            });
        }
    };

    xhr.send(`filter=${filter}`);
}

function redirectToCalendarWithPost(nome, cargo, cargaHoraria, tempoServico, foto, precoservico) {
    const funcionario = {
        nome,
        cargo,
        carga_horaria: cargaHoraria, // Ajustado para manter o padrão de nome
        tempo_servico: tempoServico, // Ajustado para manter o padrão de nome
        foto,
        precoservico,
    };
    localStorage.setItem('funcionarioSelecionado', JSON.stringify(funcionario));
    window.location.href = '../calendario/pagamento.html';
}
