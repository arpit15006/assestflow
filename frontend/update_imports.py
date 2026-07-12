import os
import re

team_components = ["button", "card", "checkbox", "input", "label", "separator", "Button", "Card", "Checkbox", "Input", "Label", "Separator"]

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    # Replace Button
    new_content = re.sub(r'@/components/ui/button', '@/components/ui/Button', new_content)
    # Replace Card
    new_content = re.sub(r'@/components/ui/card', '@/components/ui/Card', new_content)
    # Replace Checkbox
    new_content = re.sub(r'@/components/ui/checkbox', '@/components/ui/Checkbox', new_content)
    # Replace Input
    new_content = re.sub(r'@/components/ui/input', '@/components/ui/Input', new_content)
    # Replace Label
    new_content = re.sub(r'@/components/ui/label', '@/components/ui/Label', new_content)
    # Replace Separator
    new_content = re.sub(r'@/components/ui/separator', '@/components/ui/Separator', new_content)

    # For everything else matching @/components/ui/, change to @/shared/ui/
    def replace_other_ui(match):
        comp = match.group(1)
        if comp not in team_components:
            return f'@/shared/ui/{comp}'
        return match.group(0)

    new_content = re.sub(r'@/components/ui/([a-zA-Z0-9_-]+)', replace_other_ui, new_content)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)

for root, _, files in os.walk('src/features'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

for root, _, files in os.walk('src/shared'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Import update complete.")
