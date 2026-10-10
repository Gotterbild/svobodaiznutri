"""Import approved comments from the WordPress export into per-post Eleventy data files.

For every post `content/blog/YYYY/<name>/<name>.md` with comments, writes `<name>.11tydata.json`
next to it: {"comments": [...]} in WordPress thread order (each reply right after its parent).

Usage: python3 -I scripts/import_wp_comments.py
"""
import html
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "_sources/c.WordPress.2021-05-30.xml"
NS = {"wp": "http://wordpress.org/export/1.2/"}

# Not archived: question about social networks on /fire/ and the answers pointing to the (closed) VK group
EXCLUDED_COMMENTS = {9443, 9445, 9446}

# Links in comments that no longer work
LINK_REWRITES = {
    # "the beginning of the blog" is now the last page of the listing
    "http://svobodaiznutri.ru/page/14/": "https://svobodaiznutri.com/page/11/",
    # the archive lives on the .com domain
    "http://svobodaiznutri.ru/": "https://svobodaiznutri.com/",
    "https://svobodaiznutri.ru/": "https://svobodaiznutri.com/",
}
DEAD_LINKS = {
    "http://kvartira.mirtesen.ru/blog/43373507125/Kak-v-SHveytsarii-200-letniy-saray-prevratili-v-uyutnyiy-3-etazh",
}


def text(el, tag):
    found = el.find(f"wp:{tag}", NS)
    return (found.text or "").strip() if found is not None else ""


def autop(content):
    """Simplified WordPress wpautop: blank lines -> paragraphs, single newlines -> <br />."""
    content = content.replace("\r\n", "\n").strip()
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", content) if p.strip()]
    return "\n".join(f"<p>{p.replace(chr(10), '<br />' + chr(10))}</p>" for p in paragraphs)


def fix_links(content):
    for old, new in LINK_REWRITES.items():
        content = content.replace(old, new)
    for url in DEAD_LINKS:
        content = re.sub(rf'<a [^>]*href="{re.escape(url)}"[^>]*>(.*?)</a>', r"\1", content)
    return content


def thread(comments):
    children = {}
    for c in comments:
        children.setdefault(c["parent"], []).append(c)
    ordered = []

    def walk(parent, depth):
        for c in sorted(children.get(parent, []), key=lambda c: c["date"]):
            ordered.append({**c, "depth": depth})
            walk(c["id"], depth + 1)

    walk(0, 1)
    return ordered


def main():
    posts = {}
    for md in (ROOT / "content/blog").glob("*/*/*.md"):
        slug = re.search(r'^permalink: "/(.*)/"$', md.read_text(), re.M).group(1)
        posts[slug] = md

    root = ET.parse(EXPORT).getroot()
    written = total = 0
    for item in root.iter("item"):
        if text(item, "post_type") != "post":
            continue
        md = posts.get(text(item, "post_name"))
        comments = []
        for c in item.findall("wp:comment", NS):
            if text(c, "comment_approved") != "1" or text(c, "comment_type") not in ("", "comment"):
                continue
            if int(text(c, "comment_id")) in EXCLUDED_COMMENTS:
                continue
            comments.append({
                "id": int(text(c, "comment_id")),
                "parent": int(text(c, "comment_parent") or 0),
                "author": html.unescape(text(c, "comment_author")),
                "date": text(c, "comment_date"),
                "isPostAuthor": text(c, "comment_user_id") != "0",
                "content": fix_links(autop(text(c, "comment_content"))),
            })
        if not comments or md is None:
            continue
        comments = [{k: v for k, v in c.items() if k != "parent"} for c in thread(comments)]
        out = md.with_name(md.stem + ".11tydata.json")
        out.write_text(json.dumps({"comments": comments}, ensure_ascii=False, indent="\t") + "\n")
        written += 1
        total += len(comments)

    print(f"{total} comments written for {written} posts")


if __name__ == "__main__":
    main()
