import subprocess
import os
import re

# Components that use v$ in template but might miss setup hook
output = subprocess.check_output(['grep', '-r', 'v\$', 'src/']).decode('utf-8')
found_files = set()
for line in output.split('\n'):
    if line and '.vue' in line:
        filepath = line.split(':')[0]
        found_files.add(filepath)

setup_code = """
  setup() {
    return { v$: useVuelidate() };
  },"""

import_vuelidate = "import { useVuelidate } from '@vuelidate/core';\n"

for filepath in found_files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()

    if 'useVuelidate' in content and 'setup()' in content:
        continue

    print(f"Fixing {filepath}...")

    # Add import if missing
    if 'import { useVuelidate }' not in content:
        script_match = re.search(r'<script>', content)
        if script_match:
            content = content[:script_match.end()] + "\n" + import_vuelidate + content[script_match.end():]

    # Add setup hook to export default
    export_match = re.search(r'export\s+default\s*\{', content)
    if export_match:
        content = content[:export_match.end()] + setup_code + content[export_match.end():]

    with open(filepath, 'w') as f:
        f.write(content)
