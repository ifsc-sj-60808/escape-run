# IFSC-SJ, turma 60808

Escolhas tecnológicas:

- Linguagem: TypeScript (Web e Node.js)
- *Engine*: Phaser 4 (beta)
- Empacotador (*bundler*): Parcel
- IDE: VSCode, com as extensões:
  - *Linter*: ESLint
  - Assistente de código: GitHub Copilot + GitHub Copilot Chat
  - *Issues* e *pull requests*: GitHub Pull Requests
  - Visualização da árvore git: GitLens
  - Auto indentação: Prettier

Boas práticas:

- Usar *issues* e *pull requests* para criar ramos (*branches*) alternativos e, depois, mesclar (*merge*) no ramo principal.

# Para rodar no servidor

O arquivo `package.json` tem instruções para rodar o servidor. É preciso criar o arquivo `/etc/systemd/system/escape-run.service` com o seguinte conteúdo:

```ini
[Unit]
Description=Escape Run: servidor
Documentation=https://github.com/ifsc-sj-60808/escape-run/
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/escape-run
ExecStart=/usr/local/bin/npm run serve
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

e ativar o serviço com os comandos:

```sh
sudo systemctl daemon-reload
sudo systemctl enable escape-run.service
sudo systemctl start escape-run.service
````

Por fim, para verificar o estado do serviço:

```sh
sudo systemctl status escape-run.service
```

No cenário, o código está no diretório `/opt/escape-run` e os executáveis, `node` e `npm`, em `/usr/local/bin`.
