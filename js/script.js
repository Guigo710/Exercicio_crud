$(document).ready(function () {
  let clientes = [];
  let editandoId = null;

  // Carregar clientes do localStorage
  function carregarClientes() {
    const dados = localStorage.getItem("clientes");
    if (dados) {
      clientes = JSON.parse(dados);
    }
    listarClientes();
  }

  // Salvar clientes no localStorage
  function salvarNoLocalStorage() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }

  // Calcular idade
  function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  // Listar clientes
  function listarClientes() {
    const tbody = $("#listaClientes");
    tbody.empty();

    if (clientes.length === 0) {
      tbody.append(`
                        <tr>
                            <td colspan="5" class="text-center text-muted">
                                Nenhum cliente cadastrado
                            </td>
                        </tr>
                    `);
      return;
    }

    clientes.forEach((cliente) => {
      const idade = calcularIdade(cliente.dataNascimento);
      const dataFormatada = new Date(
        cliente.dataNascimento + "T00:00:00"
      ).toLocaleDateString("pt-BR");

      tbody.append(`
                        <tr>
                            <td>${cliente.nome}</td>
                            <td>${cliente.email}</td>
                            <td>${dataFormatada}</td>
                            <td>${idade} anos</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-warning" onclick="editarCliente(${cliente.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="excluirCliente(${cliente.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `);
    });
  }

  // Adicionar ou editar cliente
  $("#formCliente").submit(function (e) {
    e.preventDefault();

    const cliente = {
      id: editandoId || Date.now(),
      nome: $("#nome").val(),
      email: $("#email").val(),
      dataNascimento: $("#dataNascimento").val(),
    };

    if (editandoId) {
      const index = clientes.findIndex((c) => c.id === editandoId);
      clientes[index] = cliente;
      editandoId = null;
      $("#btnSalvar").html('<i class="fas fa-save"></i> Salvar Cliente');
      $("#btnCancelar").hide();
    } else {
      clientes.push(cliente);
    }

    salvarNoLocalStorage();
    listarClientes();
    this.reset();

    // Feedback visual
    const Toast = $(
      '<div class="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" role="alert" style="z-index: 9999;">' +
        '<i class="fas fa-check-circle"></i> Cliente salvo com sucesso!' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
        "</div>"
    );
    $("body").append(Toast);
    setTimeout(() => Toast.remove(), 3000);
  });

  // Editar cliente (função global)
  window.editarCliente = function (id) {
    const cliente = clientes.find((c) => c.id === id);
    if (cliente) {
      editandoId = id;
      $("#nome").val(cliente.nome);
      $("#email").val(cliente.email);
      $("#dataNascimento").val(cliente.dataNascimento);
      $("#btnSalvar").html('<i class="fas fa-save"></i> Atualizar Cliente');
      $("#btnCancelar").show();
      $("html, body").animate({ scrollTop: 0 }, 500);
    }
  };

  // Cancelar edição
  $("#btnCancelar").click(function () {
    editandoId = null;
    $("#formCliente")[0].reset();
    $("#btnSalvar").html('<i class="fas fa-save"></i> Salvar Cliente');
    $(this).hide();
  });

  // Excluir cliente (função global)
  window.excluirCliente = function (id) {
    if (confirm("Deseja realmente excluir este cliente?")) {
      clientes = clientes.filter((c) => c.id !== id);
      salvarNoLocalStorage();
      listarClientes();

      const Toast = $(
        '<div class="alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" role="alert" style="z-index: 9999;">' +
          '<i class="fas fa-trash"></i> Cliente excluído com sucesso!' +
          '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
          "</div>"
      );
      $("body").append(Toast);
      setTimeout(() => Toast.remove(), 3000);
    }
  };

  // Carregar dados ao iniciar
  carregarClientes();
});
