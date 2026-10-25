"""Copy the Next static export into a preview folder that works from any sub-path (the claude.ai preview).

Every page becomes one flat HTML file next to the others; asset paths become relative; internal links
point at those files. A small click handler takes over in-site links before Next's router does, since
the router would try to fetch routes from the host root.

    python3 scripts/stage-preview.py out <dst>
    -> <dst>/rever.html (the home page) + <dst>/<page>.html + next/ images/ video/ icon.svg
"""
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


def flat(route: str) -> str:
    """'/' -> the preview's own page; '/events/lotus/' -> 'events--lotus.html'."""
    r = route.strip("/")
    return "./" if not r else r.replace("/", "--") + ".html"


pages = {}
for f in src.rglob("index.html"):
    route = "/" + str(f.parent.relative_to(src)).replace(".", "").strip("/")
    route = "/" if route == "/" else route + "/"
    if route.startswith("/_"):  # Next's internal not-found route; the artifact service reserves "_" names
        continue
    pages[route] = f
pages = dict(sorted(pages.items()))
mapping = {route: flat(route) for route in pages}

# Taken before React sees the click: in-site links go to the staged file for that page.
INTERCEPT = (
    "<script>(function(){var m=" + str(mapping).replace("'", '"') + ";"
    "window.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');"
    "if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey)return;var h=a.getAttribute('href'),u=h.split('#'),t=null;"
    "if(h.charAt(0)==='/'){var p=u[0]||'/';if(p.slice(-1)!=='/')p+='/';t=m[p];if(t&&u[1])t+='#'+u[1];}"
    "else if(/\\.html(#|$)/.test(h)||h==='./'||h.indexOf('./#')===0){t=h;}"
    "if(!t)return;e.preventDefault();e.stopPropagation();location.href=t;},true);})();</script>"
)

ASSET = re.compile(r'(?<=[\s"\',`(])/(images/|video/|icon\.svg)')
LEFTOVER = re.compile(r'(?<![\w.])/(images/|video/|icon\.svg)')


def relink(html: str) -> str:
    def sub(m):
        path, frag = m.group(2), m.group(3) or ""
        key = path if path.endswith("/") else path + "/"
        return f'{m.group(1)}="{mapping.get(key, path)}{frag}"'
    return re.sub(r'(href)="(/[^"#]*)(#[^"]*)?"', sub, html)


def fix(text: str) -> str:
    text = text.replace("/_next/", "next/").replace("_next/", "next/")
    text = ASSET.sub(r"\1", text)
    return text.replace('"�"', '"\\ufffd"')


for route, f in pages.items():
    html = f.read_text(encoding="utf-8")
    html = re.sub(r"^<!DOCTYPE html>", "", html)
    html = relink(fix(html))
    html = html.replace("<head>", "<head>" + INTERCEPT, 1)
    name = "rever.html" if route == "/" else flat(route)
    (dst / name).write_text(("" if route == "/" else "<!DOCTYPE html>") + html, encoding="utf-8")

for p in [*dst.rglob("*.js"), *dst.rglob("*.css")]:
    s = p.read_text(encoding="utf-8")
    o = fix(s)
    if o != s:
        p.write_text(o, encoding="utf-8")

# Keep only images the pages can ask for: every size of each referenced photo (srcset and the lightbox pick sizes at runtime).
text = "".join(p.read_text(encoding="utf-8") for p in [*dst.glob("*.html"), *dst.rglob("*.js"), *dst.rglob("*.css")])
refs = set(re.findall(r"images/([\w.-]+\.(?:webp|jpg|png|svg))", text))
bases = {re.sub(r"-(640|1080|1280|1600|2400)\.webp$", "", r) for r in refs}
for f in list((dst / "images").iterdir()):
    m = re.match(r"(.+)-(640|1080|1280|1600|2400)\.webp$", f.name)
    if f.name not in refs and not (m and m.group(1) in bases):
        f.unlink()

# Fail loudly if any absolute asset path is left: it would point at the host root and show a broken image.
for p in [*dst.glob("*.html"), *dst.rglob("*.js"), *dst.rglob("*.css")]:
    s = p.read_text(encoding="utf-8")
    m = LEFTOVER.search(s)
    if m:
        sys.exit(f"absolute path left in {p.relative_to(dst)}: ...{s[max(0, m.start() - 20):m.end() + 25]}")

print("\n".join(sorted(str(f.relative_to(dst)) for f in dst.rglob("*") if f.is_file() and f.name != "rever.html")))
