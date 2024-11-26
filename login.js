const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isAdm = document.getElementById('admCheckbox').checked;
    const isClient = document.getElementById('clientCheckbox').checked;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (!isAdm && !isClient) {
        alert('Por favor, selecione ADM ou Cliente!');
        return;
    }

    try {
        const response = await axios.post('login.php', {
            email,
            password,
            role: isAdm ? 'adm' : 'client'
        });

        if (response.data.success) {
            const redirectUrl = isAdm ? 'adm/adm.html' : 'inicio/inicio.html';
            window.location.href = redirectUrl;
        } else {
            alert(response.data.message || 'Credenciais inválidas!');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar realizar o login.');
    }
});
