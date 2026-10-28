"""Gera site_produtos/Produtos.html a partir dos PDFs de lista de produtos.

Uso: python3 site_produtos/ferramentas/gerar_produtos.py
Lê todo arquivo site_produtos/listas/Classe_NN.pdf (ou "Classe N.pdf") (requer `pdftotext`, do
pacote poppler-utils) e grava a lista de cada classe em Produtos.html, que o
Index.html inclui.
"""
import json
import pathlib
import re
import subprocess

BASE = pathlib.Path(__file__).resolve().parent.parent
LISTAS = BASE / "listas"
SAIDA = BASE / "Produtos.html"


def extrair_itens(pdf):
    texto = subprocess.run(
        ["pdftotext", "-layout", str(pdf), "-"],
        check=True, capture_output=True, text=True,
    ).stdout
    linhas = [l.strip() for l in texto.splitlines()]
    linhas = [l for l in linhas if l and not re.fullmatch(r"CLASSE\s+\d+", l, re.I)]
    # Formato padrão: cada produto começa com "- ". Alguns PDFs (ex.: classe
    # 16) não têm o traço; aí cada linha iniciada por maiúscula é um produto.
    com_traco = any(l.startswith("- ") for l in linhas)
    itens = []
    for linha in linhas:
        if com_traco:
            novo = linha.startswith("- ")
            if novo:
                linha = linha[2:].strip()
        else:
            novo = not re.match(r"[a-zà-ÿ\[(]", linha)
        if novo or not itens:
            itens.append(linha)
        elif itens[-1].endswith("-"):
            # Palavra hifenizada quebrada entre linhas: "máquina-" + "ferramenta".
            itens[-1] += linha
        else:
            # Item quebrado em duas linhas no PDF: junta com o anterior.
            itens[-1] += " " + linha
    vistos = set()
    unicos = []
    for item in itens:
        item = re.sub(r"\s+", " ", item)
        if item.lower() not in vistos:
            vistos.add(item.lower())
            unicos.append(item)
    return unicos


def main():
    classes = {}
    for pdf in sorted(LISTAS.glob("Classe*.pdf"), key=lambda p: int(re.search(r"(\d+)", p.stem).group(1))):
        numero = int(re.search(r"(\d+)", pdf.stem).group(1))
        classes[numero] = extrair_itens(pdf)
        print(f"Classe {numero}: {len(classes[numero])} itens")
    dados = json.dumps(classes, ensure_ascii=False, indent=1)
    SAIDA.write_text(
        "<!-- Gerado por ferramentas/gerar_produtos.py — não editar à mão. -->\n"
        f"<script>\nconst PRODUTOS_POR_CLASSE = {dados};\n</script>\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
