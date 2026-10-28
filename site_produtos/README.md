# Site de escolha de produtos — registro de marca (K4 Marcas)

Página onde o cliente informa seus dados e marca os produtos que deseja
incluir no registro da marca. Ao enviar, o resultado vai **automaticamente
por e-mail** para:

- o **cliente** (resposta direciona ao escritório), e
- o **escritório** (resposta direciona ao cliente).

Roda como **Web App do Google Apps Script** — sem servidor nem custo; o
e-mail sai da conta Google de quem publicar o site.

## Como publicar

1. Acesse <https://script.google.com> com a conta do escritório →
   **Novo projeto**. Dê o nome "Site produtos K4".
2. Em ⚙️ **Configurações do projeto**, marque *"Mostrar o arquivo de
   manifesto appsscript.json"* e cole o conteúdo de `appsscript.json`.
3. Crie os arquivos com os mesmos nomes desta pasta e cole o conteúdo:
   - `Code.gs` (Script)
   - `Index`, `Estilo`, `Script`, `Produtos` (HTML — o editor adiciona o
     `.html` sozinho)
4. Em ⚙️ **Configurações do projeto → Propriedades do script**, adicione:
   - `EMAIL_ESCRITORIO` = e-mail que recebe as escolhas (aceita vários,
     separados por vírgula). **Obrigatório.**
   - `PLANILHA_ID` = *(opcional)* ID de uma planilha Google (o trecho da
     URL entre `/d/` e `/edit`). Se definido, cada envio também é gravado
     na aba `SOLICITACOES_PRODUTOS` — serve de backup caso um e-mail se
     perca.
5. **Implantar → Nova implantação → Tipo: App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize as permissões pedidas (envio de e-mail e planilha) e copie a
   URL gerada (`https://script.google.com/macros/s/.../exec`). Esse é o
   link para enviar aos clientes.

Para alterar algo depois: edite os arquivos e use **Implantar → Gerenciar
implantações → ✏️ → Versão: Nova versão** (a URL continua a mesma).

## Adicionando outras classes

A lista de produtos vem dos PDFs em `listas/` (hoje só a **Classe 12**).
Para incluir outra classe:

1. Salve o PDF como `listas/Classe_NN.pdf` (mesmo formato do exemplo: um
   item por linha começando com `- `).
2. Rode `python3 site_produtos/ferramentas/gerar_produtos.py` (precisa do
   `pdftotext`, pacote `poppler-utils`).
3. Cole o novo `Produtos.html` no projeto do Apps Script e publique uma
   nova versão.

As classes aparecem automaticamente no seletor "Classe" do site, e o
cliente pode escolher produtos de várias classes no mesmo envio.

## Proteções

- O servidor só aceita produtos que existem na lista da classe (o cliente
  não consegue "injetar" itens; para algo fora da lista existe o campo
  livre *Outros produtos*).
- Campo invisível anti-robô (honeypot) e limites de tamanho nos textos.
- Limite do Gmail: contas gratuitas enviam até ~100 e-mails/dia pelo
  Apps Script (cada envio do site usa 2); Google Workspace, ~1.500/dia.
