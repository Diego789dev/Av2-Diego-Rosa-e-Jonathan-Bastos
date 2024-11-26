document.addEventListener("DOMContentLoaded", function () {
    const historicoDiv = document.querySelector(".agendamentos-section .historico");
    const proximosDiv = document.querySelector(".agendamentos-section .proximos");

    // Função para carregar os agendamentos
    function carregarAgendamentos() {
        fetch("agendamento.php")
            .then(response => response.json())
            .then(agendamentos => {
                if (agendamentos.length === 0) {
                    historicoDiv.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
                    proximosDiv.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
                    return;
                }

                const hoje = new Date();
                let historicoHTML = "";
                let proximosHTML = "";

                // Percorre os agendamentos e organiza entre históricos e futuros
                agendamentos.forEach(agendamento => {
                    const dataAgendamento = new Date(agendamento.data);
                    const agendamentoHTML = `
                        <div class="agendamento" data-id="${agendamento.id_agendamento}">
                            <p><strong>Funcionário:</strong> ${agendamento.nomefuncionario}</p>
                            <p><strong>Data:</strong> ${agendamento.data}</p>
                            <p><strong>Horário:</strong> ${agendamento.horario}</p>
                            <p><strong>Preço:</strong> R$ ${parseFloat(agendamento.preco).toFixed(2)}</p>
                            <button class="remover-btn">Remover</button>
                        </div>
                        <hr />
                    `;

                    if (dataAgendamento < hoje) {
                        historicoHTML += agendamentoHTML;
                    } else {
                        proximosHTML += agendamentoHTML;
                    }
                });

                // Insere os agendamentos nas respectivas seções
                historicoDiv.innerHTML = historicoHTML || "<p>Nenhum histórico encontrado.</p>";
                proximosDiv.innerHTML = proximosHTML || "<p>Nenhum agendamento futuro encontrado.</p>";

                // Adiciona os eventos de remoção após carregar os agendamentos
                adicionarEventosRemocao();
            })
            .catch(error => {
                console.error("Erro ao carregar os agendamentos:", error);
                historicoDiv.innerHTML = "<p>Erro ao carregar os agendamentos.</p>";
                proximosDiv.innerHTML = "<p>Erro ao carregar os agendamentos.</p>";
            });
    }

    // Função para remover agendamentos
    function removerAgendamento(idAgendamento) {
        fetch("remover_agendamento.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id_agendamento=${idAgendamento}`
        })
            .then(response => response.json())
            .then(result => {
                if (result.sucesso) {
                    alert("Agendamento removido com sucesso!");
                    carregarAgendamentos(); // Atualiza a lista após a remoção
                } else {
                    alert("Erro ao remover o agendamento: " + (result.erro || "Desconhecido"));
                }
            })
            .catch(error => {
                console.error("Erro ao remover o agendamento:", error);
                alert("Erro ao remover o agendamento.");
            });
    }

    // Função para adicionar eventos de remoção
    function adicionarEventosRemocao() {
        const botoesRemover = document.querySelectorAll(".remover-btn");
        botoesRemover.forEach(botao => {
            botao.addEventListener("click", function () {
                const agendamentoDiv = this.closest(".agendamento");
                const idAgendamento = agendamentoDiv.dataset.id;

                if (confirm("Tem certeza que deseja remover este agendamento?")) {
                    removerAgendamento(idAgendamento);
                }
            });
        });
    }

    // Carrega os agendamentos ao iniciar
    carregarAgendamentos();
});
