let ano = document.getElementById("ano").innerText;

let eventos = JSON.parse(eventosJSON.replaceAll("&#34;", '"'));

preencheCalendario();

pegaDiaAtual();

function preencheCalendario() {

    const meses = document.querySelectorAll('.mes');

    preencheDiasDaSemana(meses);

    adicionaDivsNosMeses(meses);

    preencheDias(meses);
    
}

function preencheDiasDaSemana (meses) {
    meses.forEach(mes => {
        mes.children[1].innerHTML = `<div>DOM</div>
        <div>SEG</div>
        <div>TER</div>
        <div>QUA</div>
        <div>QUI</div>
        <div>SEX</div>
        <div>SAB</div>`
    });
}

function adicionaDivsNosMeses(meses) {
    let divDias = [];
    const numeroMaximoDiasMes = 37;


    meses.forEach(mes => {
        divDias = [];

        for(let i = 0; i < numeroMaximoDiasMes; i++) {
            divDias.push('<div class="dias"></div>');
        }
        
        mes.lastElementChild.innerHTML = divDias.join("\n");
    });
}

function preencheDias(meses) {
    let primeiroDiaMes;
    let diaSemanaPrimeiroDia;
    let ultimoDiaMes;
    let elementosDiaHTML;
    let data;
    let numeroTotaldeDiasMes;

    meses.forEach( mes => {
        let posicaoMes = Number(mes.id);

        primeiroDiaMes = new Date(`${ano} ${posicaoMes + 1} 1`);
        diaSemanaPrimeiroDia = primeiroDiaMes.getDay();

        ultimoDiaMes = getUltimoDiaMes(posicaoMes + 1);

        elementosDiaHTML = mes.lastElementChild.children;
        data = 1;

        numeroTotaldeDiasMes = ultimoDiaMes.getDate() + diaSemanaPrimeiroDia;

        for (let posElemDia = diaSemanaPrimeiroDia; posElemDia < numeroTotaldeDiasMes; posElemDia++) {
            // Id = "mes-1" + "dia-1". Ex: dia 3 de maio -> "42"
            elementosDiaHTML[posElemDia].id = mes.id + String(data - 1);
            elementosDiaHTML[posElemDia].innerText = data++;
        }
    });

}

function getUltimoDiaMes(mes) {
    let ultimoDia = undefined;

    if (mes === 12) ultimoDia = new Date(`${ano + 1}, ${1}, 0`);
    else ultimoDia = new Date(`${ano}, ${mes + 1}, 0`);

    return ultimoDia;
}

function pegaDiaAtual() {

    // Separa em ["YYYY", "MM", "DD"]
    const dataAtualSeparada = separaDataEmArray(new Date());

    // Seleciona a div de mes atual
    const mesAtual = document.querySelectorAll(".mes")[dataAtualSeparada[1] - 1];

    const posInicialDasDiv = (new Date(`${dataAtualSeparada[0]} ${dataAtualSeparada[1]} 1`)).getDay();
    const diaAtual = mesAtual.
                             lastElementChild.
                             children[Number(dataAtualSeparada[2]) + Number(posInicialDasDiv) - 1];

    diaAtual.classList.add("class", "hoje");
}

function verificaHorarios(form) {
    let inicio = form.inicio;
    let fim = form.fim;

    const dataQualquer = '2021 01 01';

    inicio = new Date(`${dataQualquer} ${inicio.value}`);
    fim = new Date(`${dataQualquer} ${fim.value}`);

    if(inicio < fim) {
        return true;
    } else {
        alert("Horarios invalidos");
        return false;
    }
}

function separaDataEmArray(data) {
    // en-CA ja formata em ISO 8601
    return data.toLocaleDateString("en-CA").split("-");
}

// Funcoes para a barra lateral

Array.from(document.getElementsByClassName("dias")).forEach(dia => {
    dia.addEventListener('click', function () {
        abreBarraEventos(this);
    });
});

let diaBarraEventos = undefined;

function retornaDiaDaBarra() {return diaBarraEventos};

function abreBarraEventos(dia) {
    const barraEventos = document.getElementById("barra-de-eventos");
    diaBarraEventos = idToDate(dia.id);

    escondeEventos();

    document.getElementById("dia-evento").value = diaBarraEventos.toLocaleDateString("en-CA");
    barraEventos.children[1].innerText = diaBarraEventos.toLocaleDateString("pt-BR");
    barraEventos.removeAttribute("hidden");

    mostraEventosDoDia();
}

function escondeEventos() {
    document.querySelectorAll(".evento").forEach(evento => {
        if( !evento.hasAttribute("hidden") ) {
            evento.setAttribute("hidden", "");
        }
    });
}

function idToDate(id) {
    const mes = Number(id.slice(0,2)) + 1;
    const dia = Number(id.slice(2)) + 1;

    return new Date( `${ano} ${mes} ${dia}` );
}

function fechaBarraEventos() {
    document.getElementById("barra-de-eventos").setAttribute("hidden", "");
}

function toggleAdicionarEvento() {
    const areaEscondida = document.getElementById("adicionar-evento-escondida");

    areaEscondida.toggleAttribute("hidden");

    const botaoAdicionarEvento = document.getElementById("botao-extender-adicionar");

    botaoAdicionarEvento.classList.toggle("fa-plus");
    botaoAdicionarEvento.classList.toggle("fa-minus");
}


function toggleDetalhesEvento(evento) {
    const botaoMostrarEvento = evento.children[0];

    botaoMostrarEvento.classList.toggle("fa-caret-down");
    botaoMostrarEvento.classList.toggle("fa-caret-up");
    
    const areaEscondida = evento.children[2];

    areaEscondida.toggleAttribute("hidden");
}

function abrirEditor(elemento) {
    const detalhes = elemento.children[0];
    const btnEditar = elemento.children[2];
    const btnApagar = elemento.children[4];
    const editor = elemento.children[1];
    const btnCancelar = elemento.children[3];

    // Esconder detalhes
    detalhes.setAttribute("hidden", "");
    // Esconder botao editar
    btnEditar.setAttribute("hidden", "");
    // Esconder botao apagar
    btnApagar.setAttribute("hidden", "");
    // Mostrar editor
    editor.removeAttribute("hidden");
    // Mostrar botao cancelar
    btnCancelar.removeAttribute("hidden");
}

function fecharEditor(elemento) {
    const detalhes = elemento.children[0];
    const btnEditar = elemento.children[2];
    const btnApagar = elemento.children[4];
    const editor = elemento.children[1];
    const btnCancelar = elemento.children[3];

    // Mostra detalhes
    detalhes.removeAttribute("hidden");
    // Mostra botao editar
    btnEditar.removeAttribute("hidden");
    // Mostra botao apagar
    btnApagar.removeAttribute("hidden");
    // Esconde editor
    editor.setAttribute("hidden", "");
    // Esconde botao cancelar
    btnCancelar.setAttribute("hidden", "");
}

function mostraEventosDoDia() {
    const eventosDoDia = selecionaEventosDoDia();

    eventosDoDia.forEach(evento => {
        document.getElementById("evento-" + evento.id).removeAttribute("hidden");
    });
}

function selecionaEventosDoDia() {
    const dataEscolhida = new Date(document.getElementById("dia-evento").value.replaceAll("-", " "));

    const eventosDataEscolhida = [];

    eventos.forEach(evento => {
        let diaEvento = new Date(evento.dia);

        if( dataEscolhida.getTime() === diaEvento.getTime() ) {
            eventosDataEscolhida.push(evento);
        }
    });

    return eventosDataEscolhida;
}