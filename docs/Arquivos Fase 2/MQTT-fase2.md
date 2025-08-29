## Mensagens MQTT Arcade

flowchart LR
  A("<img src='https://cdn-icons-png.freepik.com/512/2656/2656529.png'; width='30' />" Arcade)
 C[Broker Cena 2] -- Recebe moedas e envia sinal ao dispenser quando é terminado (Pub-Sub) <--> A
  Cel1("<img src='https://cdn-icons-png.flaticon.com/512/6785/6785788.png'; width='30'/>") -- Envia moeda (Pub) --> B[Broker Cena 4]
  Cel2("<img src='https://cdn-icons-png.flaticon.com/512/6785/6785788.png'; width='30'/>") -- Envia moeda (Pub) --> B
  Cel3("<img src='https://cdn-icons-png.flaticon.com/512/6785/6785788.png'; width='30'/>") -- Envia moeda (Pub) --> B
  Cel4("<img src='https://cdn-icons-png.flaticon.com/512/6785/6785788.png'; width='30'/>") -- Envia moeda (Pub) --> B
B -- Pub-Sub <--> C
B -- Recebe o sinal do Arcade e libera o prêmio (Sub) --> D("<img src='https://cdn-icons-png.flaticon.com/512/683/683895.png'; width='30'/>" Dispenser)
P("<img src='https://cdn-icons-png.flaticon.com/512/3945/3945330.png'; width='30'/>") -- Sensor identifica que os jogadores entraram na sala (Pub) --> C