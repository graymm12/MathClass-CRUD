// ========================================
// BANCO DE DADOS - SUPABASE
// ========================================

// URL do projeto Supabase
const SUPABASE_URL = "https://qzccppeyjjcnjwztnjuj.supabase.co";

// Chave pública do projeto Supabase
const SUPABASE_KEY = "sb_publishable_f3m-X8prh_THrSkOWcWfiA_GeiXsNin";

// Conexão com o Supabase
const banco = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Guarda o ID do registro que está sendo editado.
// null significa que nenhum registro está sendo editado.
let idEdicao = null;

// ========================================
// INSERT / UPDATE - SALVAR
// ========================================

async function salvarRegistro() {

    const nome = document.getElementById("nome").value.trim();
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
        estudante: nome,
        conteudo: conteudo,
        nota: nota,
        situacao: situacao
    };

    // ========================================
    // INSERT - NOVO REGISTRO
    // ========================================

    if (idEdicao === null) {

        const { error } = await banco
            .from("desempenhos")
            .insert([registro]);

        if (error) {
            console.error(error);
            alert("Erro ao cadastrar o registro.");
            return;
        }

        alert("Registro cadastrado com sucesso!");

    } else {

        // ========================================
        // UPDATE - ALTERAR REGISTRO
        // ========================================

        const { error } = await banco
            .from("desempenhos")
            .update(registro)
            .eq("id", idEdicao);

        if (error) {
            console.error(error);
            alert("Erro ao atualizar o registro.");
            return;
        }

        alert("Registro atualizado com sucesso!");

        idEdicao = null;
    }

    limparFormulario();
    await listarRegistros();
}


// ========================================
// SELECT - LISTAR
// ========================================

async function listarRegistros() {

    const tabela = document.getElementById("tabelaAlunos");

    tabela.innerHTML = "";

    const { data, error } = await banco
        .from("desempenhos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);
        tabela.innerHTML = `
            <tr>
                <td colspan="5">
                    Erro ao carregar os registros.
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((registro) => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${registro.estudante}</td>
            <td>${registro.conteudo}</td>
            <td>${Number(registro.nota).toFixed(1)}</td>
            <td>${registro.situacao}</td>
            <td>
                <button onclick="editarRegistro(${registro.id})">
                    Editar
                </button>

                <button onclick="excluirRegistro(${registro.id})">
                    Excluir
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}


// ========================================
// UPDATE - PREPARAR EDIÇÃO
// ========================================

async function editarRegistro(id) {

    const { data, error } = await banco
        .from("desempenhos")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        alert("Erro ao buscar o registro.");
        return;
    }

    document.getElementById("nome").value =
        data.estudante;

    document.getElementById("conteudo").value =
        data.conteudo;

    document.getElementById("nota").value =
        data.nota;

    idEdicao = data.id;

    document.querySelector(".btn-salvar").textContent =
        "Salvar alteração";
}


// ========================================
// DELETE - EXCLUIR
// ========================================

async function excluirRegistro(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este registro?"
    );

    if (!confirmar) {
        return;
    }

    const { error } = await banco
        .from("desempenhos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Erro ao excluir o registro.");
        return;
    }

    alert("Registro excluído com sucesso!");

    await listarRegistros();
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

    idEdicao = null;
}


// ========================================
// SAIR DO SISTEMA
// ========================================

function sair() {

    // Mantemos o login atual do MathClass.
    localStorage.setItem("logado", "false");

    window.location.href = "index.html";
}


// ========================================
// CARREGAR REGISTROS
// ========================================

// Busca os registros do Supabase quando a página abrir.
listarRegistros();