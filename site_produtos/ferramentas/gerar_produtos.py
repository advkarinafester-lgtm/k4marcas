"""Gera site_produtos/Produtos.html a partir dos PDFs de lista de produtos.

Uso: python3 site_produtos/ferramentas/gerar_produtos.py
Lê todo arquivo site_produtos/listas/Classe_NN.pdf (requer `pdftotext`, do
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
    itens = []
    for linha in texto.splitlines():
        linha = linha.strip()
        if not linha or re.fullmatch(r"CLASSE\s+\d+", linha, re.I):
            continue
        if linha.startswith("- "):
            itens.append(linha[2:].strip())
        elif itens:
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
    for pdf in sorted(LISTAS.glob("Classe_*.pdf")):
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
