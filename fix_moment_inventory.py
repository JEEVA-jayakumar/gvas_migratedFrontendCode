import os
import re

directory = 'src/pages/inventory/'

def fix_moment(content):
    # Fix filters: | moment("format") -> .format("format")
    # This is tricky because the subject of the filter needs to be wrapped in $moment()
    # Example: props.row.updated_date | moment("Do MMM Y") -> $moment(props.row.updated_date).format("Do MMM Y")

    # Simple regex for filters in templates
    # Matches: {{ expression | moment("format") }}
    # group 1: expression, group 2: format
    content = re.sub(r'\{\{\s*(.*?)\s*\|\s*moment\("(.*?)"\)\s*\}\}', r'{{ $moment(\1).format("\2") }}', content)

    # Matches: :prop="expression | moment('format')"
    content = re.sub(r'=\s*"(.*?)\s*\|\s*moment\("(.*?)"\)"', r'="$moment(\1).format("\2")"', content)

    # Fix direct moment calls in script or template: moment(...) -> this.$moment(...) or $moment(...)
    # In <template>, it should be $moment. In <script>, it should be this.$moment.
    # However, table column field functions often use arrow functions where 'this' might be available or not depending on context.
    # But in Quasar components, they usually refer to 'this'.

    # If it's inside a <script> tag
    if '<script>' in content:
        parts = content.split('<script>')
        template_part = parts[0]
        script_part = parts[1]

        # In script, moment -> this.$moment
        # Avoid double replacing if it's already this.$moment
        script_part = re.sub(r'(?<!this\.)(?<!\$)\bmoment\(', r'this.$moment(', script_part)

        content = template_part + '<script>' + script_part
    else:
        # If no script tag found (unlikely for these files), just do a general replacement for $moment
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
