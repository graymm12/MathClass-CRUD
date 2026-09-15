// ========================================
// BANCO DE DADOS - LOCALSTORAGE
// ========================================

// Busca os registros já salvos.
// Se não existir nenhum, começa com uma lista vazia.
let registros = JSON.parse(localStorage.getItem("registrosMatematica")) || [];

// Guarda qual registro está sendo editado.
// -1 significa que nenhum está sendo editado.
let indiceEdicao = -1;


// ========================================
// INSERT - CADASTRAR
// ========================================

function salvarRegistro() {

    const nome = document.getElementById("nome").value;
    const conteudo = document.getElementById("conteudo").value;
    const nota = parseFloat(document.getElementById("nota").value);

    // Verifica se todos os campos foram preenchidos
    if (nome === "" || conteudo === "" || isNaN(nota)) {
        alert("Preencha todos os campos!");
        return;
    }

    // Verifica se a nota está entre 0 e 10
    if (nota < 0 || nota > 10) {
        alert("A nota deve estar entre 0 e 10.");
        return;
    }

    // Calcula automaticamente a situação
    const situacao = nota >= 6 ? "Aprovado" : "Recuperação";

    const registro = {
        nome: nome,
        conteudo: conteudo,
        nota: nota,
        situacao: situacao
    };

    // Se não estiver editando, cadastra um novo
    if (indiceEdicao === -1) {

        registros.push(registro);

    } else {

        // UPDATE - altera um registro existente
        registros[indiceEdicao] = registro;
        indiceEdicao = -1;
    }

    localStorage.setItem(
        "registrosMatematica",
        JSON.stringify(registros)
    );

    limparFormulario();
    listarRegistros();
}


// ========================================
// SELECT - LISTAR
// ========================================

function listarRegistros() {

    const tabela = document.getElementById("tabelaAlunos");

    tabela.innerHTML = "";

    registros.forEach((registro, indice) => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${registro.nome}</td>
            <td>${registro.conteudo}</td>
            <td>${registro.nota.toFixed(1)}</td>
            <td>${registro.situacao}</td>
            <td>
                <button onclick="editarRegistro(${indice})">
                    Editar
                </button>

                <button onclick="excluirRegistro(${indice})">
                    Excluir
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}


// ========================================
// UPDATE - EDITAR
// ========================================

function editarRegistro(indice) {

    const registro = registros[indice];

    document.getElementById("nome").value = registro.nome;
    document.getElementById("conteudo").value = registro.conteudo;
    document.getElementById("nota").value = registro.nota;

    indiceEdicao = indice;

    document.querySelector(".btn-salvar").textContent =
        "Salvar alteração";
}


// ========================================
// DELETE - EXCLUIR
// ========================================

function excluirRegistro(indice) {

    const confirmar = confirm(
        "Deseja realmente excluir este registro?"
    );

    if (confirmar) {

        registros.splice(indice, 1);

        localStorage.setItem(
            "registrosMatematica",
            JSON.stringify(registros)
        );

        listarRegistros();
    }
}


// ========================================
// LIMPAR FORMULÁRIO
// ========================================

function limparFormulario() {

    document.getElementById("nome").value = "";
    document.getElementById("conteudo").value = "";
    document.getElementById("nota").value = "";

    document.querySelector(".btn-salvar").textContent =
        "Cadastrar";
}


// ========================================
// SAIR DO SISTEMA
// ========================================

function sair() {

    localStorage.setItem("logado", "false");

    window.location.href = "index.html";
}


// Mostra os registros quando a página abrir
listarRegistros();