// Cria um usuário padrão no localStorage
if (!localStorage.getItem("usuarioSistema")) {
    const usuarioPadrao = {
        usuario: "professora",
        senha: "1234"
    };

    localStorage.setItem("usuarioSistema", JSON.stringify(usuarioPadrao));
}

// Função responsável pelo login
function fazerLogin() {

    const usuarioDigitado = document.getElementById("usuario").value;
    const senhaDigitada = document.getElementById("senha").value;

    const usuarioSalvo = JSON.parse(
        localStorage.getItem("usuarioSistema")
    );

    if (
        usuarioDigitado === usuarioSalvo.usuario &&
        senhaDigitada === usuarioSalvo.senha
    ) {
        alert("Login realizado com sucesso!");

        localStorage.setItem("logado", "true");
        window.location.href = "painel.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}