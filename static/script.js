const inputsArray = [document.getElementById("data-inicio"), document.getElementById("data-fim")];


function selecao_relatorios(){
  const btnCards = document.getElementById("btnCards");
  const btnListas = document.getElementById("btnListas");
  const sairButtons = document.querySelectorAll(".sair");

  const relatorioCards = document.querySelector(".cards");
  const relatorioListas = document.querySelector(".listas");
  const box_button = document.querySelector(".box-button")

  btnCards.addEventListener("click", () => {
    relatorioCards.style.display = 'block'
    box_button.style.display = 'none'
  })

  btnListas.addEventListener("click", () => {
    relatorioListas.style.display = 'block'
    box_button.style.display = 'none'
  })

  sairButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      relatorioCards.style.display = 'none'
      relatorioListas.style.display = 'none'
  
      box_button.style.display = 'flex'
    })
  });

}

selecao_relatorios()





function validacao_inputs() {
    for (let i = 0; i < inputsArray.length; i++) {
        const input = inputsArray[i];
        if (input.value.trim() === '') {
          
            input.style.borderColor = 'red'; 

            setTimeout(function(){
              input.style.borderColor = '#bdc3c7'; 
            },3000)

            return Toastify({
                        text: "O campo está vazio!",
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
        } else {
            input.style.borderColor = 'green'; 

            }
        }
    }


function gerar_csv(data_inicio, data_fim) {
    fetch('/csv', {
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
        if (!response.ok){
            throw new Error("Erro ao gerar relatório de cards");
        } else{
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
            a.download = "Relatório de Cards " + data_inicio + " -  "  + data_fim +  ".xlsx";
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

document.getElementById("form_cards").addEventListener("submit", function(event) {
  event.preventDefault();

  const data_inicio = document.getElementById("data-inicio").value;
  const data_fim = document.getElementById("data-fim").value;

  if (isNaN(data_inicio) || isNaN(data_fim)) {
      validacao_inputs(); 
  }

  if (data_inicio > data_fim) {
      Toastify({
          text: "Data de Início não pode ser maior do que a Data Final.",
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
      document.getElementById("data-inicio").style.borderColor = 'red';
      document.getElementById("data-fim").style.borderColor = 'red';

      setTimeout(function(){
        document.getElementById("data-inicio").style.borderColor = '#bdc3c7';
        document.getElementById("data-fim").style.borderColor = '#bdc3c7'; 
      }, 3000);
      return;
  }

  validacao_inputs(); 
  gerar_csv(data_inicio, data_fim);
});



