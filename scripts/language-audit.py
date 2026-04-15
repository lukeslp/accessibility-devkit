#!/usr/bin/env python3
"""
Language Attribute Audit

Check HTML for the presence and validity of the 'lang' attribute on the 
<html> element. 

WCAG 3.1.1 (Level A): Language of Page — The default human language of 
each web page can be programmatically determined.

No dependencies — stdlib only.

Usage:
    python3 language-audit.py index.html
    python3 language-audit.py --format json page.html
"""

import argparse
import json
import os
import re
import sys
from html.parser import HTMLParser


# BCP 47 pattern: primary subtag (2-3 letters), optional region/script/variant subtags
BCP47_PATTERN = re.compile(r'^[a-z]{2,3}(-[a-zA-Z0-9]{1,8})*$')
# Stricter: primary (2-3 lowercase), optional script (4 title case), optional region (2 upper or 3 digit)
BCP47_STRICT = re.compile(
    r'^[a-z]{2,3}'                     # primary language
    r'(?:-[A-Z][a-z]{3})?'             # optional script (Latn, Cyrl, etc.)
    r'(?:-(?:[A-Z]{2}|[0-9]{3}))?'     # optional region (US, GB, 419, etc.)
    r'(?:-(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*'  # optional variants
    r'$'
)


class LanguageAuditor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.html_lang = None
        self.html_line = 0
        self.issues = []
        self._in_body = False
        self.nested_langs = []  # Elements with lang inside body

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        line = self.getpos()[0]

        if tag == "html":
            self.html_lang = attrs_dict.get("lang")
            self.html_line = line

        if tag == "body":
            self._in_body = True

        # Detect lang attributes on elements inside body (WCAG 3.1.2)
        if self._in_body and tag != "html" and "lang" in attrs_dict:
            self.nested_langs.append({
                "tag": tag,
                "lang": attrs_dict["lang"],
                "line": line,
            })

    def analyze(self):
        if self.html_line == 0:
            # Didn't find <html> tag (might be a partial)
            return

        if not self.html_lang:
            self.issues.append({
                "line": self.html_line, "severity": "error",
                "issue": "Missing 'lang' attribute on <html> element",
                "fix": "Add a lang attribute (e.g., <html lang='en'>) to help screen readers "
                       "use the correct pronunciation."
            })
        else:
            # Validate against BCP 47
            if not BCP47_PATTERN.match(self.html_lang):
                self.issues.append({
                    "line": self.html_line, "severity": "warning",
                    "issue": f"Potentially invalid 'lang' attribute: '{self.html_lang}'",
                    "fix": "Use a valid BCP 47 language tag (e.g., 'en', 'en-US', 'es')."
                })

        # Validate nested lang attributes (WCAG 3.1.2)
        for nl in self.nested_langs:
            if not BCP47_PATTERN.match(nl["lang"]):
                self.issues.append({
                    "line": nl["line"], "severity": "warning",
                    "issue": f"Invalid nested lang attribute on <{nl['tag']}>: '{nl['lang']}'",
                    "fix": "Use a valid BCP 47 language tag (e.g., 'fr', 'de', 'ja')."
                })


def audit_file(filepath):
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    auditor = LanguageAuditor()
    auditor.feed(content)
    auditor.analyze()
    return auditor.issues, auditor.html_lang, auditor.nested_langs


def main():
    parser = argparse.ArgumentParser(
        description="Audit HTML for language attribute compliance (WCAG 3.1.1)."
    )
    parser.add_argument("files", nargs="+", help="HTML files to audit")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    args = parser.parse_args()

    all_results = {}
    total_issues = 0

    for filepath in args.files:
        if not os.path.isfile(filepath):
            print(f"Warning: {filepath} not found, skipping", file=sys.stderr)
            continue
        issues, lang, nested_langs = audit_file(filepath)
        all_results[filepath] = {"issues": issues, "lang": lang, "nested_langs": nested_langs}
        total_issues += len(issues)

    if args.format == "json":
        print(json.dumps(all_results, indent=2))
    else:
        for filepath, result in all_results.items():
            issues = result["issues"]
            nested = result.get("nested_langs", [])
            print(f"\n{'='*60}")
            print(f"  {filepath} — Language Audit")
            print(f"  Detected lang: {result['lang'] or 'NONE'}")
            if nested:
                print(f"  Nested lang attributes: {len(nested)}")
            print(f"{'='*60}")
            for issue in issues:
                icon = {"error": "ERR", "warning": "WRN"}[issue["severity"]]
                print(f"  [{icon}] Line {issue['line']}: {issue['issue']}")
                print(f"        fix: {issue['fix']}")
            if not issues:
                print("  Language attribute is present and valid.")
            print()

    sys.exit(1 if total_issues > 0 else 0)


if __name__ == "__main__":
    main()
