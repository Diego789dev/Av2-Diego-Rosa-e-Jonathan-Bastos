document.addEventListener('DOMContentLoaded', function () {

    const funcionario = JSON.parse(localStorage.getItem('funcionarioSelecionado'));

    if (funcionario) {
        document.getElementById('staff-name').value = funcionario.nome || "Não informado";
        document.getElementById('staff-cargo').value = funcionario.cargo || "Não informado";
        document.getElementById('service-price').value = `R$ ${funcionario.precoservico ? funcionario.precoservico.toFixed(2) : "0.00"}`;
        document.getElementById('service-duration').value = funcionario.tempo_servico || "Não informado";
        document.getElementById('workload').value = funcionario.carga_horaria || "Não informado";

        if (funcionario.foto) {
            const img = document.createElement('img');
            img.src = funcionario.foto;
            img.alt = funcionario.nome || "Foto do funcionário";
            img.style.maxWidth = '100px';
            img.style.borderRadius = '10px';
            document.getElementById('photo-container').appendChild(img);
        }

        const inputHorario = document.getElementById('appointment-time');
        inputHorario.addEventListener('change', function () {
            const cargaHoraria = funcionario.carga_horaria || "00:00-23:59"; 
            const [inicio, fim] = cargaHoraria.split('-').map(h => h.trim());
            const horarioSelecionado = this.value;

            if (horarioSelecionado < inicio || horarioSelecionado > fim) {
                alert(`Por favor, selecione um horário entre ${inicio} e ${fim}.`);
                this.value = ''; 
            }
        });
    } else {
        console.error("Funcionário não encontrado no localStorage.");
    }
});


document.getElementById('name').addEventListener('input', function () {
    const regex = /^[a-zA-ZÀ-ÿ'\-\s]*$/;
    if (!regex.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-ZÀ-ÿ'\-\s]/g, '');
    }
});

document.getElementById('card-number').addEventListener('input', function () {
    let value = this.value.replace(/\D/g, ''); 
    this.value = value.replace(/(.{4})/g, '$1 ').trim(); 
});

document.getElementById('expiry').addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2); 
    }
    this.value = value;
});

document.getElementById('cvv').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('payment-form').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const nomefuncionario = document.getElementById('staff-name').value;
    const preco = parseFloat(document.getElementById('service-price').value.replace('R$', '').trim());
    const data = document.getElementById('appointment-date').value;
    const horario = document.getElementById('appointment-time').value;
    const nomecartao = document.getElementById('name').value;
    const numerocartao = document.getElementById('card-number').value.replace(/\s/g, ''); 
    const validade = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (!nomecartao || !numerocartao || !validade || !cvv || !data || !horario) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    if (numerocartao.length !== 16) {
        alert('O número do cartão deve conter exatamente 16 dígitos.');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(validade)) {
        alert('A validade deve estar no formato MM/AA.');
        return;
    }

    if (cvv.length < 3 || cvv.length > 4) {
        alert('O CVV deve conter 3 ou 4 dígitos.');
        return;
    }

    const dataEnvio = {
        nomefuncionario,
        preco,
        data,
        horario,
        nomecartao,
        numerocartao,
        validade,
        cvv,
    };

    try {
        const response = await axios.post('pagamento.php', dataEnvio, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data.success) {
            alert('Pagamento realizado com sucesso!');
            window.location.href = '../inicio/inicio.html';
        } else {
            console.error('Erro do servidor:', response.data.error);
            alert('Erro: ' + response.data.error);
        }
    } catch (error) {
        console.error('Erro no envio:', error);
        alert('Erro ao processar o pagamento. Verifique o console.');
    }
});
