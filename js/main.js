function main() {
  if (!("localStorage" in window)) {
    console.error(
      "> [ERROR] LocalStorage não detectado, a aplicação não funcionará."
    );
    document.innerText =
      "LocalStorage não detectado, a aplicação não funcionará.";
    return;
  }

  if (!localStorage.getItem("tarefas")) localStorage.setItem("tarefas", "[]");

  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  const adicionarTarefaForm = document.querySelector("#adicionar-tarefa__form");
  const listaTarefas = document.querySelector("#tarefas__list");

  function carregarTarefas() {
    tarefas.forEach((tarefa) => criarTarefaElement(tarefa));
  }

  function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }

  function removerTarefa(id) {
    const index = tarefas.findIndex((tarefa) => tarefa.id == id);
    tarefas.splice(index, 1);
    const tarefaElement = document.querySelector(`#tarefa__id-${id}`);
    tarefaElement.remove();
    salvarTarefas();
  }

  function criarTarefaElement(tarefa) {
    const tarefaElement = document.createElement("li");
    const tarefaElementConteudo = document.createElement("p");
    const tarefaElementFinalizar = document.createElement("input");
    const tarefaElementFinalizarLabel = document.createElement("label");

    const tarefaElementFerramentas = document.createElement("div");
    tarefaElementFerramentas.classList.add("tarefa__ferramentas");

    const ferramentaRemover = document.createElement("button");
    ferramentaRemover.classList.add("tarefa__ferramenta-remover");
    ferramentaRemover.type = "button";
    ferramentaRemover.title = "Remover tarefa";
    ferramentaRemover.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;

    function tarefaElementFinalizarF(e) {
      const taf = tarefas.find((tarf) => tarf.id == tarefa.id);
      const t_taf = taf;
      taf.checked = e.currentTarget.checked;
      tarefas.splice(tarefas.indexOf(t_taf), 1, taf);
      tarefaElementConteudo.style.textDecoration = e.currentTarget.checked ? "line-through" : null;
      tarefaElementConteudo.style.opacity = e.currentTarget.checked ? "50%" : null;
      salvarTarefas();
    }
    tarefaElementFinalizar.addEventListener("change", tarefaElementFinalizarF);

    function ferramentaRemoverF() {
      ferramentaRemover.removeEventListener("click", ferramentaRemoverF);
      tarefaElementFinalizar.removeEventListener(
        "click",
        tarefaElementFinalizarF
      );
      removerTarefa(tarefa.id);
    }
    ferramentaRemover.addEventListener("click", ferramentaRemoverF);

    tarefaElementFerramentas.appendChild(ferramentaRemover);

    tarefaElement.classList.add("tarefa");
    tarefaElementConteudo.classList.add("tarefa__conteudo");
    tarefaElement.id = `tarefa__id-${tarefa.id}`;
    tarefaElementFinalizar.classList.add("tarefa__finalizar");
    tarefaElementFinalizar.id = `tarefa__finalizar__id-${tarefa.id}`;
    tarefaElementFinalizarLabel.classList.add("sr-only");

    tarefaElementConteudo.innerText = tarefa.conteudo;
    tarefaElementFinalizar.type = "checkbox";
    tarefaElementFinalizarLabel.innerText = `Conteúdo da tarefa - id ${tarefa.id}`;
    tarefaElementFinalizarLabel.htmlFor = `tarefa__finalizar__id-${tarefa.id}`;
    tarefaElementFinalizar.checked = tarefa.checked;

    if(tarefa.checked) {
        tarefaElementConteudo.style.textDecoration = "line-through";
        tarefaElementConteudo.style.opacity = "50%";
    }

    tarefaElement.appendChild(
      (() => {
        const wrapper_div = document.createElement("div");

        wrapper_div.appendChild(tarefaElementFinalizarLabel);
        wrapper_div.appendChild(tarefaElementFinalizar);

        return wrapper_div;
      })()
    );
    tarefaElement.appendChild(tarefaElementConteudo);
    tarefaElement.appendChild(tarefaElementFerramentas);

    listaTarefas.appendChild(tarefaElement);
  }

  function adicionarTarefa(conteudo) {
    const tarefa = {
      id: crypto.randomUUID(),
      conteudo,
      checked: false,
    };
    tarefas.push(tarefa);
    criarTarefaElement(tarefa);
    salvarTarefas();
  }

  adicionarTarefaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    if (!dados.get("conteudo")) return;
    adicionarTarefa(dados.get("conteudo"));
    e.currentTarget.reset();
  });

  carregarTarefas();
}

main();
