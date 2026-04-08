import os
import re

directory = 'src/components/inventory/'

def fix_moment(content):
    # Fix filters: | moment("format") -> .format("format")
    content = re.sub(r'\{\{\s*(.*?)\s*\|\s*moment\("(.*?)"\)\s*\}\}', r'{{ $moment(\1).format("\2") }}', content)
    content = re.sub(r'=\s*"(.*?)\s*\|\s*moment\("(.*?)"\)"', r'="$moment(\1).format("\2")"', content)

    # Fix direct moment calls
    if '<script>' in content:
        parts = content.split('<script>')
        template_part = parts[0]
        script_part = parts[1]
        script_part = re.sub(r'(?<!this\.)(?<!\$)\bmoment\(', r'this.$moment(', script_part)
        content = template_part + '<script>' + script_part
    else:
        content = re.sub(r'(?<!\$)\bmoment\(', r'$moment(', content)

    return content

for filename in os.listdir(directory):
    if filename.endswith(".vue"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        new_content = fix_moment(content)

        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Fixed {filename}")
