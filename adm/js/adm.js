const apiUrl = './js/gerenciar_funcionario.php'; // URL do PHP
let funcionarioEmEdicao = null;

// Função para listar funcionários
function listarFuncionarios() {
    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        success: function (funcionarios) {
            const listaFuncionarios = $('#lista-funcionarios');
            listaFuncionarios.empty(); // Limpa a lista

            if (Array.isArray(funcionarios) && funcionarios.length > 0) {
                // Popula a lista com os funcionários
                funcionarios.forEach(funcionario => {
                    const li = $(`
                        <li>
                            <strong>Nome:</strong> ${funcionario.nome} <br>
                            <strong>Cargo:</strong> ${funcionario.cargo} <br>
                            <strong>Carga Horária:</strong> ${funcionario.carga_horaria} <br>
                            <strong>Tempo de Serviço:</strong> ${funcionario.tempo_servico} <br>
                            <strong>Preço do Serviço:</strong> R$${parseFloat(funcionario.precoservico).toFixed(2)} <br>
                            <button class="editar" onclick="editarFuncionario(${funcionario.id_funcionario})">Editar</button>
                            <button class="excluir" onclick="excluirFuncionario(${funcionario.id_funcionario})">Excluir</button>
                        </li>
                    `);
                    listaFuncionarios.append(li);
                });
            } else {
                listaFuncionarios.html('<p>Nenhum funcionário encontrado.</p>');
            }
        },
        error: function (error) {
            console.error('Erro ao listar os funcionários:', error);
        }
    });
}

// Função para cadastrar ou editar funcionário
$('#btnCadastrar').on('click', function () {
    const nome = $('#nome').val().trim();
    const cargo = $('#cargo').val().trim();
    const cargaHoraria = $('#carga_horaria').val().trim();
    const tempoServico = $('#tempo_servico').val().trim();
    const precoServico = parseFloat($('#precoservico').val().trim());

    if (!nome || !cargo || !cargaHoraria || !tempoServico || isNaN(precoServico)) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const funcionario = { nome, cargo, carga_horaria: cargaHoraria, tempo_servico: tempoServico, precoservico: precoServico };

    if (funcionarioEmEdicao) {
        funcionario.id_funcionario = funcionarioEmEdicao; // Adiciona o ID ao objeto
        $.ajax({
            url: apiUrl,
            method: 'PUT',
            data: JSON.stringify(funcionario),
            contentType: 'application/json',
            success: function (response) {
                alert(response.message || 'Funcionário atualizado com sucesso.');
                listarFuncionarios();
                limparFormulario();
            },
            error: function (error) {
                console.error('Erro ao editar funcionário:', error);
            }
        });
    } else {
        $.ajax({
            url: apiUrl,
            method: 'POST',
            data: JSON.stringify(funcionario),
            contentType: 'application/json',
            success: function (response) {
                alert(response.message || 'Funcionário cadastrado com sucesso.');
                listarFuncionarios();
                limparFormulario();
            },
            error: function (error) {
                console.error('Erro ao cadastrar funcionário:', error);
            }
        });
    }
});

// Função para excluir funcionário
function excluirFuncionario(id) {
    $.ajax({
        url: apiUrl,
        method: 'DELETE',
        data: JSON.stringify({ id_funcionario: id }),
        contentType: 'application/json',
        success: function (response) {
            alert(response.message || 'Funcionário excluído com sucesso.');
            listarFuncionarios();
        },
        error: function (error) {
            console.error('Erro ao excluir funcionário:', error);
        }
    });
}

// Função para editar funcionário
function editarFuncionario(id) {
    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        success: function (funcionarios) {
            const funcionario = funcionarios.find(f => f.id_funcionario == id);

            if (funcionario) {
                // Preenche o formulário com os dados do funcionário
                $('#nome').val(funcionario.nome);
                $('#cargo').val(funcionario.cargo);
                $('#carga_horaria').val(funcionario.carga_horaria);
                $('#tempo_servico').val(funcionario.tempo_servico);
                $('#precoservico').val(funcionario.precoservico);

                funcionarioEmEdicao = id; // Define que está editando
                $('#btnCadastrar').text('Atualizar');
            }
        },
        error: function (error) {
            console.error('Erro ao buscar funcionário:', error);
        }
    });
}

// Função para limpar o formulário
function limparFormulario() {
    $('#formulario')[0].reset();
    funcionarioEmEdicao = null;
    $('#btnCadastrar').text('Cadastrar');
}

// Carrega a lista de funcionários ao carregar a página
listarFuncionarios();
