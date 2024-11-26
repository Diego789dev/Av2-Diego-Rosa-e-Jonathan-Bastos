$(document).ready(function () {
    // Obtém os parâmetros passados via POST (em formato de query string)
    const urlParams = new URLSearchParams(window.location.search);
    const staffName = urlParams.get('staffName');
    const staffId = urlParams.get('staffId');
    const price = urlParams.get('price');

    // Exibe informações básicas na página (opcional)
    if (staffName) {
        $('#calendar-container').before(`<h3>Profissional: ${staffName} | Preço: R$ ${parseFloat(price).toFixed(2)}</h3>`);
    }

    // Inicializa o calendário
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay',
        },
        events: [], // Você pode carregar eventos aqui se necessário
        dayClick: function (date, jsEvent, view) {
            const selectedDate = date.format(); // Formata a data para 'YYYY-MM-DD'

            alert(`Você selecionou a data: ${selectedDate}`); // Apenas para feedback

            // Configura o botão "Confirmar"
            const confirmBtn = $('#confirm-btn');
            confirmBtn
                .show() // Exibe o botão
                .prop('disabled', false) // Habilita o botão
                .off('click') // Remove eventos anteriores
                .on('click', function () {
                    // Cria um formulário para redirecionamento
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = 'pagamento.html';

                    // Adiciona os dados necessários ao formulário
                    form.innerHTML = `
                        <input type="hidden" name="staffName" value="${staffName}">
                        <input type="hidden" name="staffId" value="${staffId}">
                        <input type="hidden" name="price" value="${price}">
                        <input type="hidden" name="date" value="${selectedDate}">
                    `;

                    // Adiciona o formulário ao corpo e o submete
                    document.body.appendChild(form);
                    form.submit();
                });
        },
    });

    // Oculta o botão "Confirmar" inicialmente
    $('#confirm-btn').hide();
});
