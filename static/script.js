const data_inicio_element = document.getElementById("data-inicio");
const data_fim_element = document.getElementById("data-fim");
const data_inicio_lead_element = document.getElementById("data-inicio_lead");
const data_fim_lead_element = document.getElementById("data-fim_lead");

function selecao_relatorios() {
  const btnCards = document.getElementById("btnCards");
  const btnListas = document.getElementById("btnListas");
  const sairButtons = document.querySelectorAll(".sair");

  const relatorioCards = document.querySelector(".cards");
  const relatorioListas = document.querySelector(".listas");
  const box_button = document.querySelector(".box-button");

  btnCards.addEventListener("click", () => {
    relatorioCards.style.display = 'block';
    box_button.style.display = 'none';
  });

  btnListas.addEventListener("click", () => {
    relatorioListas.style.display = 'block';
    box_button.style.display = 'none';
  });

  sairButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      relatorioCards.style.display = 'none';
      relatorioListas.style.display = 'none';
      box_button.style.display = 'flex';
    });
  });
}
selecao_relatorios();

function validacao_inputs(inicio_element, fim_element) {
  const inputsArray = [inicio_element, fim_element];

  for (let i = 0; i < inputsArray.length; i++) {
    const input = inputsArray[i];

    if (input.value.trim() === '') {
      input.style.borderColor = 'red';

      setTimeout(() => {
        input.style.borderColor = '#bdc3c7';
      }, 3000);

      Toastify({
        text: "O campo está vazio!",
        duration: 5000,
        gravity: "top",
        position: "right",
        close: true,
        style: { background: "linear-gradient(to right, #ff0000, #ec5353)" },
      }).showToast();

      return false;
    } else {
      input.style.borderColor = 'green';
    }
  }
  return true;
}

function gerar_csv(data_inicio, data_fim) {
  fetch('/csv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "data-inicio": data_inicio, "data-fim": data_fim }),
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao gerar relatório de cards");
    return response.blob();
  })
  .then(blob => {
    Toastify({
      text: "Gerando Relatório...",
      duration: 5000,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
    }).showToast();

    setTimeout(() => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Relatório de Cards ${data_inicio} - ${data_fim}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      Toastify({
        text: "Relatório Baixado com Sucesso!",
        duration: 5000,
        gravity: "top",
        position: "right",
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
      }).showToast();
    }, 1500);
  })
  .catch(error => {
    Toastify({
      text: "Erro ao gerar Relatório.",
      duration: 5000,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #ff0000, #ec5353)" },
    }).showToast();
    console.error("Erro ao gerar relatório:", error);
  });
}

document.getElementById("form_cards").addEventListener("submit", function(event) {
  event.preventDefault();

  const data_inicio = data_inicio_element.value;
  const data_fim = data_fim_element.value;

  if (!validacao_inputs(data_inicio_element, data_fim_element)) return;

  if (new Date(data_inicio) > new Date(data_fim)) {
    Toastify({
      text: "Data de Início não pode ser maior do que a Data Final.",
      duration: 5000,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #ff0000, #ec5353)" },
    }).showToast();

    data_inicio_element.style.borderColor = 'red';
    data_fim_element.style.borderColor = 'red';

    setTimeout(() => {
      data_inicio_element.style.borderColor = '#bdc3c7';
      data_fim_element.style.borderColor = '#bdc3c7';
    }, 3000);
    return;
  }

  gerar_csv(data_inicio, data_fim);
});

function gerar_leadtime(data_inicio, data_fim){
  fetch('/leadtime', {
    method: 'POST',
    headers: {
          'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "data-inicio": data_inicio,
      "data-fim": data_fim
    })     
  })
  .then(response => {
    if(!response.ok){
      throw new Error("Erro ao gerar relatório de cards");
    }else{
      return response.blob();
    }
  })
  .then(blob => {
    Toastify({
        text: "Gerando Relatório...",
        duration: 5000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)"
        },
        onClick: function(){} 
      }).showToast();
    console.log("Gerando relatório...");
    for(let i =0; i < inputsArray.length; i++){
      const input = inputsArray[i];
      setTimeout(function(){
        input.style.borderColor = '#bdc3c7'; 
      },1500)
    }

    
      setTimeout(function(){
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Relatório de Leadtime " + data_inicio + " -  "  + data_fim +  ".xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        Toastify({
            text: "Relatório Baixado com Sucesso!",
            duration: 5000,
            destination: "",
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)"
            },
            onClick: function(){} 
          }).showToast();
        console.log("Relatório baixado com sucesso!");
      },1500)
    
  })
  .catch(error => {
      Toastify({
          text: "Erro ao gerar Relatório.",
          duration: 5000,
          destination: "",
          newWindow: true,
          close: true,
          gravity: "top", 
          position: "right", 
          stopOnFocus: true, 
          style: {
            background: "linear-gradient(to right, #ff0000, #ec5353)"
          },
          onClick: function(){} 
        }).showToast();
      console.error("Erro ao gerar relatório:", error);
  });
}

document.getElementById("form_lead").addEventListener("submit", function(event) {
  event.preventDefault();

  const data_inicio = data_inicio_lead_element.value;
  const data_fim = data_fim_lead_element.value

  if (!validacao_inputs(data_inicio_lead_element, data_fim_lead_element)) return;

  if (new Date(data_inicio) > new Date(data_fim)) {
    Toastify({
      text: "Data de Início não pode ser maior do que a Data Final.",
      duration: 5000,
      gravity: "top",
      position: "right",
      close: true,
      style: { background: "linear-gradient(to right, #ff0000, #ec5353)" },
    }).showToast();

    data_inicio_element.style.borderColor = 'red';
    data_fim_element.style.borderColor = 'red';

    setTimeout(() => {
      data_inicio_element.style.borderColor = '#bdc3c7';
      data_fim_element.style.borderColor = '#bdc3c7';
    }, 3000);
    return;
  }

  gerar_csv(data_inicio, data_fim);
})





