
const juegoBlackJack = (() => {
    'use strict';

    let deck = [];
    const   tipos       = ['C','D','H','S'],
            especiales  = ['A', 'J','Q','K'];

    let puntosJugadores = [];

    // Referencias objetos DOM
    const btnPedir = document.querySelector('#btnPedir'),
    divCartasJugadores = document.querySelectorAll('.divCartas'),
    puntosHTML = document.querySelectorAll('small'),
    btnDetener = document.querySelector('#btnDetener'),
    btnNuevo = document.querySelector('#btnNuevo');


    //Esta funcion inicializa el juego de

    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();
        puntosJugadores = [];
        for(let i=0; i< numJugadores; i++){
            puntosJugadores.push(0);
        }        

        btnNuevo.disabled = true;
        btnPedir.disabled = false;
        btnDetener.disabled = false;
        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML ='');
 
    }

    // crea una nueva lista de barajas
    const crearDeck = () => {
        deck = [];
        for(let i=2; i<=10; i++){
            for(let tipo of tipos){
                deck.push ( i + tipo);
            }
        }

        for(let tipo of tipos){
            for(let esp of especiales){
                deck.push ( esp + tipo);
            }
        }

        return  _.shuffle(deck);
    }

  

    // Funcion nos permite pedir una carta

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    const pedirCarta= () => {

        if(deck.length === 0){
            throw 'No Hay cartas en el deck';
        }
        let reg = getRandomInt(0, deck.length-1);
        //let carta = deck[reg];
        let removed = deck.splice(reg, 1);
        
        return deck[reg];
    }


    //LLAMAR CARTA
    const valorCarta =  (carta) => {
        const valor = carta.substring(0, carta.length - 1); 
        return (isNaN(valor)) ? (valor === 'A') ? 11 : 10 :  valor * 1;
    }


    // turno: 0 = primer jugador, y el ultimo es la computadora,
    const acumularPuntos = ( carta,  turno )=> {

        puntosJugadores[turno]  =  puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerHTML = puntosJugadores[turno] ;

        return puntosJugadores[turno];
    }


    const crearCarta = (carta, turno) =>{
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`;
        imgCarta.classList.add('carta');        
        divCartasJugadores[turno].append(imgCarta);
    }

    const evaluarCalificacion = () => {
        const [puntosJugador, puntosComputadora] = puntosJugadores;

        (puntosJugador === puntosComputadora) ? alert('EMPATE!')
        : ( puntosJugador === 21) ? alert('21, GANASTES!')
        : ( puntosComputadora > 21) ? alert('GANASTES!')
        : (puntosJugador < puntosComputadora) ? alert('Gana Computadora!')
        : alert('Lo siento Mucho, PERDISTE');
    };


    //Logica del computador

    const turnoComputadora = (puntosMinimos)=>{
        let puntosComputadora = 0;
        do{
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
            if( puntosMinimos > 21){
                break;
            }

        } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

        setTimeout(()=>{
            evaluarCalificacion();
        }, 50); 

        btnNuevo.disabled = false;
    }



    //Eventos

    // boton pedir cartas
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);
        if(puntosJugador > 21 ){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if( puntosJugador === 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }

    });

    btnDetener.addEventListener('click', () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    
    });


    btnNuevo.addEventListener('click', ()=>{
        inicializarJuego();        
    });


    return {

        nuevoJuego : inicializarJuego
    };

})();
