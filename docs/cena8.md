# Cena 8

## Fluxograma

```mermaid

flowchart TD
    A[Jogadores encontram um cofre com a última fita]
    B[Percebem que há uma senha escondida na parede]
    C{Usam a luz azul para ver a senha?}
    D[Sim]
    E[Não]
    F[Tempo acaba e os jogadores perdem]
    G[Conseguem abrir o cofre]
    H[Dentro há uma caixa com um botão]
    I[Um jogador aperta o botão enquanto o outro sai]
    J[Jogador vencedor]

    A --> B
    B --> C
    C --> D
    C --> E
    D --> G
    E --> F
    G --> H
    H --> I
    I --> J
    ```