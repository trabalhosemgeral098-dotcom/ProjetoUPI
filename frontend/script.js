const API = "http://localhost:3000";

const telefone = document.getElementById("telefone");
telefone.addEventListener("input", () => {
    let valor = telefone.value.replace(/\D/g, "");
    if(valor.length <= 11){
        valor = valor.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/,"($1) $2 $3-$4");
    }
    telefone.value = valor;
});

function mostrarSenha() {
let senha = document.getElementById("senha");
let olho = document.getElementById("olho");

if (senha.type === "password") {
senha.type = "text";
olho.textContent = "🙈";
} else {
senha.type = "password";
olho.textContent = "👁️";
}
}

async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const resposta = await fetch("http://localhost:3000/admin", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email, senha
        })
    });
    const dados = await resposta.json();
    if(dados.sucesso){
        window.location.href = "admin.html";
    } else {
        alert("Email ou senha incorretos!")
    }
}




async function cadastrar(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    const email = document.getElementById("email").value;

    const telefone = document.getElementById("telefone").value;


    const novoCadastro = {

        nome,
        email,
        telefone

    };

    try {

        const resposta = await fetch(
            `${API}/cadastro`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(novoCadastro)

            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro);

            return;

        }

        alert("Cadastro realizado com sucesso.");

        document
            .getElementById("formcadastro")
            .reset();

    } catch (erro) {

        console.log(erro);

    }

}

function verificar() {

    const login =
        document.getElementById("login");

    const conteudo =
        document.getElementById("conteudo");

    if (!login || !conteudo) return;

    if (
        sessionStorage.getItem(
            "admin_logado"
        ) === "true"
    ) {

        login.style.display = "none";

        conteudo.style.display = "block";

        carregarCadastros();

    } else {

        login.style.display = "block";

        conteudo.style.display = "none";

    }

}


function logoutAdmin() {

    sessionStorage.removeItem(
        "admin_logado"
    );

    window.location.reload();

}


async function carregarCadastros() {

    const resposta = await fetch(
        `${API}/cadastro`
    );

    const cadastros = await resposta.json();

    const lista =
        document.getElementById("listaCadastros");

    if (!lista) return;

    lista.innerHTML = "";

    cadastros.forEach(cadastro => {

        lista.innerHTML += `

        <div class="cardCadastro">

            <h3>${cadastro.nome}</h3>

            <p>Email: ${cadastro.email}</p>

            <p>Telefone: ${cadastro.telefone}</p>

            <p>Status:
                ${cadastro.ativo ? "Ativo" : "Inativo"}
            </p>

            <button onclick="alterarStatus(${cadastro.id})">
                Ativar/Desativar
            </button>

            <button onclick="removerCadastro(${cadastro.id})">
                Remover
            </button>

        </div>

        <hr>

        `;

    });

}

async function removerCadastro(id) {

    await fetch(
        `${API}/cadastro/${id}`,
        {
            method: "DELETE"
        }
    );

    carregarCadastros();

}

async function alterarStatus(id) {

    await fetch(
        `${API}/cadastro/${id}`,
        {
            method: "PUT"
        }
    );

    carregarCadastros();

}

verificar();