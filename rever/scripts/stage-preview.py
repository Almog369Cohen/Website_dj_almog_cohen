"""Copy the Next static export into a preview folder with relative asset paths."""
import pathlib, re, shutil, sys
src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
if dst.exists():
    shutil.rmtree(dst)
dst.mkdir(parents=True)
shutil.copytree(src / "_next", dst / "next")
shutil.copytree(src / "images", dst / "images")
shutil.copy(src / "icon.svg", dst / "icon.svg")
for f in (dst / "next" / "static").glob("*/_*"):
    f.unlink()
html = (src / "index.html").read_text(encoding="utf-8")
html = re.sub(r"^<!DOCTYPE html>", "", html)
html = re.sub(r"<title>[^<]*</title>", "<title>Rever הפקות אירועים</title>", html, count=1)
(dst / "rever.html").write_text(html, encoding="utf-8")
for p in [dst / "rever.html", *dst.rglob("*.js"), *dst.rglob("*.css")]:
    s = p.read_text(encoding="utf-8")
    o = s
    s = s.replace("/_next/", "next/").replace("_next/", "next/")
    for a in ("images/", "icon.svg"):
        s = s.replace('"/' + a, '"' + a).replace('\\"/' + a, '\\"' + a)
    s = s.replace('"\ufffd"', '"\\ufffd"')
    if s != o:
        p.write_text(s, encoding="utf-8")
print("\n".join(sorted(str(f.relative_to(dst)) for f in dst.rglob("*") if f.is_file() and f.name != "rever.html")))
