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
