$(document).ready(function () {
    $('#formCadastro').submit(function (e) {

        e.preventDefault();

        if (!validarCPF($('#CPF').val())) {
            ModalDialog("CPF Inválido", "O CPF informado é inválido.");
            return;
        }


        var beneficiarios = [];
        $('#tabelaBeneficiarios tbody tr').each(function () {
            var cpf = $(this).find('td').eq(0).text().trim();
            var nome = $(this).find('td').eq(1).text().trim();
            beneficiarios.push({ CPF: cpf, Nome: nome });
        });


        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val().replace(/[.-]/g, ''),
                "Beneficiarios": beneficiarios
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    })


})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function mascaraCPF(cpf) {
    cpf.value = cpf.value.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}
function incluirBeneficiario() {

    if (!validarCPF($('#CPFBeneficiario').val())) {
        alert("CPF inválido.");
        $('#CPFBeneficiario').focus();
        return;
    }

    const cpfInput = document.getElementById("CPFBeneficiario");
    const nomeInput = document.getElementById("NomeBeneficiario");
    const cpf = cpfInput.value.trim();
    const nome = nomeInput.value.trim();

    const cpfClienteInput = document.getElementById("CPF");
    const cpfCliente = cpfClienteInput ? cpfClienteInput.value.trim() : "";

    if (cpf === "" || nome === "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (cpfCliente && cpf === cpfCliente) {
        alert("O CPF do beneficiário não pode ser igual ao CPF do cliente.");
        return;
    }

    const tabela = document.querySelector("#tabelaBeneficiarios tbody");
    let cpfJaExiste = false;

    Array.from(tabela.rows).forEach(row => {
        const cpfExistente = row.cells[0].textContent.trim();
        if (cpfExistente === cpf) {
            cpfJaExiste = true;
        }
    });

    if (cpfJaExiste) {
        alert("Este CPF já foi incluído como beneficiário.");
        return;
    }

    const novaLinha = document.createElement("tr");

    const tdCpf = document.createElement("td");
    tdCpf.textContent = cpf;

    const tdNome = document.createElement("td");
    tdNome.textContent = nome;

    const tdAcoes = document.createElement("td");

    const btnAlterar = document.createElement("button");
    btnAlterar.className = "btn btn-sm btn-primary";
    btnAlterar.style.marginRight = "5px";
    btnAlterar.textContent = "Alterar";
    btnAlterar.onclick = function () {
        cpfInput.value = cpf;
        nomeInput.value = nome;
        tabela.removeChild(novaLinha);
    };

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn btn-sm btn-primary";
    btnExcluir.textContent = "Excluir";
    btnExcluir.onclick = function () {
        if (confirm("Deseja excluir este beneficiário?")) {
            tabela.removeChild(novaLinha);
        }
    };

    tdAcoes.appendChild(btnAlterar);
    tdAcoes.appendChild(btnExcluir);

    novaLinha.appendChild(tdCpf);
    novaLinha.appendChild(tdNome);
    novaLinha.appendChild(tdAcoes);

    tabela.appendChild(novaLinha);

    // Limpar campos
    cpfInput.value = "";
    cpfInput.focus();
    nomeInput.value = "";



}
