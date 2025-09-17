## Fluxograma da Cena 4 (Arcade)
No fluxograma, se encontram em azul as partes da sala desenvolvidas para a cena 3 (cena prévia). Já a cor vermelha corresponde às partes pertencentes à cena 4:




```mermaid


---
config:
  theme: redux-dark
---
flowchart TD
    A["Jogadores entram na sala"] -- Luzes desligadas --> n1["Vêem o gerador brilhando"]
    n1 -- "Colocam alavanca para ativá-lo" --> n2["Luzes ligam"]
    n2 --> B{"Jogadores são atraídos"}
    B -- Pelo pulso de LEDs até o --> n3["Arcade"]
    B -- Pelo som até a --> n4["Bancada de prêmios"]
    n4 -- Se deparam com símbolos espalhados pelo arcade --> n5["Utilizam a câmera para obter todos os símbolos"]
    n3 -- Um jogador fica preso no arcade --> n10["Jogador insere os símbolos fornecidos pelos demais"]
    n5 -- Fornecem os símbolos ao jogador no arcade --> n10
    n10 -- Jogo do arcade é concluído --> n11["Máquina de prêmios libera a fita cassete"]
    n11 -- Isso é detectado --> n13["Começa a vazar um gás tóxico (Máquina de fumaça)"]
    n13 --> n14{"Jogador preso no arcade tem duas opções:"}
    n14 --> C["Deixar a porta fechada"] & D["Ficar apertando um botão e abrir a porta"]
    C --> E["Todos permanecem presos até o tempo se esgotar"]
    D -- Demais jogadores fogem --> n15["Jogador no arcade permanece e perde o jogo"]

    classDef Blue stroke-width:1px, stroke-dasharray:none, stroke:#FFFFFF, fill:#00008B, color:#FFFFFF
    A:::Blue
    n1:::Blue
    n2:::Blue
    n3:::Blue
    n10:::Blue

    classDef Red stroke-width:1px, stroke-dasharray:none, stroke:#FFFFFF, fill:#8B0000, color:#FFFFFF
    n4:::Red
    n5:::Red
    n11:::Red
    n13:::Red
    C:::Red
    E:::Red
    D:::Red
    n15:::Red

```

