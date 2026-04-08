import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Correct q-table :data to :rows
    new_content = re.sub(r'<q-table([^>]*)\s:data=', r'<q-table\1 :rows=', content)

    # Correct direct moment() to this.$moment() in script
    if '<script>' in new_content:
        parts = new_content.split('<script>')
        template_part = parts[0]
        script_part = parts[1]
        script_part = re.sub(r'(?<!this\.)(?<!\$)\bmoment\(', r'this.$moment(', script_part)
        new_content = template_part + '<script>' + script_part

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

directories = ['src/pages/inventory/', 'src/components/inventory/']
for directory in directories:
    for filename in os.listdir(directory):
        if filename.endswith(".vue"):
            if fix_file(os.path.join(directory, filename)):
                print(f"Fixed {os.path.join(directory, filename)}")
