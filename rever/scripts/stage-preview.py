"""Copy the Next static export into a preview folder with relative asset paths."""
import pathlib, re, shutil, sys
src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
if dst.exists():
    shutil.rmtree(dst)
dst.mkdir(parents=True)
shutil.copytree(src / "_next", dst / "next")
shutil.copytree(src / "images", dst / "images")
if (src / "video").exists():
    shutil.copytree(src / "video", dst / "video")
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
    # (a backtick counts too: template-string paths like `/images/${name}.jpg` are built in the browser)
    # every absolute /images/, /video/ or /icon.svg reference (src, srcset lists, RSC payload)
    s = re.sub(r'(?<=[\s"\',`])/(images/|video/|icon\.svg)', r'\1', s)
    s = s.replace('"\ufffd"', '"\\ufffd"')
    if s != o:
        p.write_text(s, encoding="utf-8")
# fail loudly if any absolute asset path is left: it would point at the host root and show a broken image
LEFTOVER = re.compile(r'(?<![\w.])/(images/|video/|icon\.svg)')
for p in [dst / "rever.html", *dst.rglob("*.js"), *dst.rglob("*.css")]:
    m = LEFTOVER.search(p.read_text(encoding="utf-8"))
    if m:
        sys.exit(f"absolute path left in {p.relative_to(dst)}: ...{p.read_text(encoding='utf-8')[max(0, m.start() - 20):m.end() + 25]}")
print("\n".join(sorted(str(f.relative_to(dst)) for f in dst.rglob("*") if f.is_file() and f.name != "rever.html")))
