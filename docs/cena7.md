# Cena 7

## Fluxograma

```mermaid
flowchart TD
    A[Jogadores abrem a porta e entram na sala]
    B[Veem um quadro de luz]
    C{Fazem a sequência correta no quadro?}
    D[Sim]
    E[Não]
    F[O globo começa a girar e uma música toca]
    G[Erro: precisam tentar novamente]
    H[Próxima Cena → Cena 8]

    A --> B
    B --> C
    C --> D
    C --> E
    D --> F
    E --> G
    G --> C
    F --> H
    ```