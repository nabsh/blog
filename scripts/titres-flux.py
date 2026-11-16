# Après le rendu : donne à chaque flux RSS un titre qui nomme sa rubrique
# (Quarto reprend sinon le seul titre du site, « NSH », pour tous les flux).
import pathlib, re

TITRES = {
    "_site/blog.xml": "NSH · tout le blog",
    "_site/blog/economie.xml": "NSH · Économie",
    "_site/blog/reflexions.xml": "NSH · Réflexions",
    "_site/blog/methodes.xml": "NSH · Méthodes",
}
for chemin, titre in TITRES.items():
    p = pathlib.Path(chemin)
    if not p.exists():
        continue
    xml = p.read_text(encoding="utf-8")
    xml = re.sub(r"(<channel>\s*<title>)(.*?)(</title>)", lambda m: m.group(1) + titre + m.group(3), xml, count=1, flags=re.S)
    p.write_text(xml, encoding="utf-8")

# Résumés : avec nos gabarits de listing, Quarto écrit « undefined » dans la description
# de chaque billet. On la remplace par la description du billet (sa balise meta).
import html as _html
for chemin in TITRES:
    p = pathlib.Path(chemin)
    if not p.exists():
        continue
    xml = p.read_text(encoding="utf-8")
    def resume(m):
        item = m.group(0)
        lien = re.search(r"<link>https?://[^/]+/(.*?)</link>", item)
        page = pathlib.Path("_site") / (lien.group(1) if lien else "") / "index.html"
        desc = ""
        if lien and page.exists():
            meta = re.search(r'<meta name="description" content="([^"]*)"', page.read_text(encoding="utf-8"))
            desc = _html.unescape(meta.group(1)) if meta else ""
        return item.replace("<![CDATA[ undefined ]]>", "<![CDATA[ " + desc + " ]]>")
    xml = re.sub(r"<item>.*?</item>", resume, xml, flags=re.S)
    p.write_text(xml, encoding="utf-8")
