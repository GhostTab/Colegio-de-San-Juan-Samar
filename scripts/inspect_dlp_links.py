import re
import sys

import requests

url = sys.argv[1]
text = requests.get(url, timeout=30).text
print("len", len(text))

patterns = [
    r"https://drive\.google\.com/[^\s\"'<>]+",
    r"https://docs\.google\.com/[^\s\"'<>]+",
    r"https://lh3\.googleusercontent\.com/[^\s\"'<>]+",
]

for pattern in patterns:
    matches = re.findall(pattern, text)
    unique = list(dict.fromkeys(matches))
    print(pattern, len(unique))
    for match in unique[:10]:
        print(match)
