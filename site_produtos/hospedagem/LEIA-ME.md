# Colocar o formulário no site k4marcas.com.br

O formulário continua rodando no Google Apps Script (é ele que envia os
e-mails). No site da K4 ele aparece "embutido", com o endereço do seu
domínio — por exemplo `k4marcas.com.br/produtos/`. O `Code.gs` já libera
esse uso (`XFrameOptionsMode.ALLOWALL`).

O endereço do Apps Script aparece em um único lugar em cada arquivo
(`src="https://script.google.com/macros/s/.../exec"`). Se um dia criar
uma implantação nova com outro link, troque só esse endereço.

## Opção A — Site em WordPress (com ou sem Elementor)

1. Painel do WordPress → **Páginas → Adicionar nova**.
2. Título: `Escolha de produtos`. Em **Link permanente**, deixe
   `produtos`.
3. Adicione um bloco **HTML personalizado** (no Elementor: widget
   **HTML**) e cole o conteúdo de `trecho-wordpress.html`.
4. **Publicar**. O endereço fica `https://k4marcas.com.br/produtos/`.

Dica: se o tema permitir, escolha o modelo de página **sem barra
lateral / largura total** (ou "Elementor Canvas"), para o formulário
ocupar a tela inteira.

## Opção B — Hospedagem com gerenciador de arquivos (cPanel, Hostinger, FTP)

1. No gerenciador de arquivos, entre na pasta do site (`public_html`).
2. Crie a pasta `produtos`.
3. Envie para dentro dela o arquivo `index.html` desta pasta.
4. O endereço fica `https://k4marcas.com.br/produtos/`.

Esse arquivo mostra o formulário em tela cheia, sem o menu do site.

## Depois de publicar

- Abra `k4marcas.com.br/produtos/` no computador e no celular e faça um
  envio de teste.
- Se aparecer uma tela cinza ou "recusou a conexão", confira se a
  implantação do Apps Script está com **Quem pode acessar: Qualquer
  pessoa** e se a versão mais recente do `Code.gs` foi implantada
  (Implantar → Gerenciar implantações → ✏️ → Nova versão).
