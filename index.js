const container = document.querySelector('.container');
const pesquisa = document.querySelector('.caixa-pesquisa button');
const caixaClima = document.querySelector('.caixa-clima');
const climaDetalhes = document.querySelector('.clima-detalhes');
const error404 = document.querySelector('.nao-encontrado');

function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historicoClima')) || [];

    const listaHistorico = document.getElementById('lista-historico');
    listaHistorico.innerHTML = ''; 
    historico.forEach(pesquisa => {
        const itemHistorico = document.createElement('li');
        itemHistorico.innerHTML = `
            <strong>Cidade:</strong> ${pesquisa.cidade}, 
            <strong>Temperatura:</strong> ${pesquisa.temperatura}°C,
            <strong>Descrição:</strong> ${pesquisa.descricao}, 
            <strong>Umidade:</strong> ${pesquisa.umidade}%, 
            <strong>Vento:</strong> ${pesquisa.vento} m/s
        `;
        listaHistorico.appendChild(itemHistorico);
    });
}


window.onload = carregarHistorico;



pesquisa.addEventListener('click', () => {
    const APIKey = '3d86b0fac7c7851f8b4516796a39add7';
    let cidade = document.querySelector('.caixa-pesquisa input').value;

    if (cidade === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '600px';
                caixaClima.style.display = 'none';
                climaDetalhes.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const pesquisaClima = {
                cidade: cidade,
                temperatura: Math.round(json.main.temp - 273.15),
                descricao: json.weather[0].description,
                umidade: json.main.humidity,
                vento: parseInt(json.wind.speed)
            };

            let pesquisasAnteriores = JSON.parse(localStorage.getItem('historicoClima')) || [];
            pesquisasAnteriores.push(pesquisaClima);
            localStorage.setItem('historicoClima', JSON.stringify(pesquisasAnteriores));

            carregarHistorico(); 

            const imagem = document.querySelector('.caixa-clima img');
            const temperatura = document.querySelector('.caixa-clima .temperatura');
            const descricao = document.querySelector('.caixa-clima .descricao');
            const umidade = document.querySelector('.umidade span');
            const vento = document.querySelector('.vento span'); 

            switch (json.weather[0].main) {
                case 'Clear':
                    imagem.src = './Imagens/clear.png';
                    break;

                case 'Rain':
                    imagem.src = './Imagens/rain.png';
                    break;

                case 'Snow':
                    imagem.src = './Imagens/snow.png';
                    break;

                case 'Clouds':
                    imagem.src = './Imagens/cloud.png';
                    break;

                case 'Haze':
                    imagem.src = './Imagens/mist.png';
                    break;

                default:
                    imagem.src = '';
            }

            temperatura.innerHTML = `${Math.round(json.main.temp - 273.15)}<span>°C</span>`;
            descricao.innerHTML = `${json.weather[0].description}`;
            umidade.innerHTML = `${json.main.humidity}%`;
            vento.innerHTML = `${parseInt(json.wind.speed)}m/s`;

            caixaClima.style.display = '';
            climaDetalhes.style.display = '';
            caixaClima.classList.add('fadeIn');
            climaDetalhes.classList.add('fadeIn');
            container.style.height = '590px';
        });
});
