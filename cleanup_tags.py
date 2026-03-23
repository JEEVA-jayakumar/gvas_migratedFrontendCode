import os
import re

def cleanup_vue_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix typo tags
    content = content.replace('q-tab-panellls', 'q-tab-panels')
    content = content.replace('q-tab-panelll', 'q-tab-panel')

    # Fix common migration artifacts
    # Remove </template> immediately following </q-td>, </q-tr>, </q-th> if it's likely redundant
    # We should be careful not to remove legitimate template closures.
    # Usually, if it's on the same line or right after, it's a bug from a previous regex.

    content = re.sub(r'</q-td>\s*</template>', '</q-td>', content)
    content = re.sub(r'</q-tr>\s*</template>', '</q-tr>', content)
    content = re.sub(r'</q-th>\s*</template>', '</q-th>', content)

    with open(filepath, 'w') as f:
        f.write(content)

def main():
    root_dir = 'src/components/sat/'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.vue'):
                cleanup_vue_file(os.path.join(root, file))

    root_dir_pages = 'src/pages/sat/'
    for root, dirs, files in os.walk(root_dir_pages):
        for file in files:
            if file.endswith('.vue'):
                cleanup_vue_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
