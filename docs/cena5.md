# Cena 5

## Fluxograma

```mermaid
flowchart TD

A[Jogadores entram na sala]
D{Procuram pela senha do cofre que está transcrita com luz negra nas garrafas}
E[Sim]
e[Sim]
F[Não]
f[Não]
G{Encontraram a estante?}
H{Continuam procurando, está literalmente na frente deles}
I{Encontraram a senha?}
J[Liberam o cofre]
K{Encontraram o cofre?}
e1[Sim]
e2[Não]

A --> |Encontram a estante cheia de garrafas| G
G --> E
G --> F
F --> H
E --> D
H --> G
D --> I
I --> e
I --> f
e --> J
f --> D
J -->|Procuram pelo cofre| K
K --> e1
K --> e2
e2 --> |Continuam procurando|K




```