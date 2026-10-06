import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # 1. Colors - Brand Purples/Blues -> Emeralds
    color_map = {
        '#3498db': 'emerald-600',
        '#2980b9': 'emerald-700',
        '#5dade2': 'emerald-400',
        '#9C27B0': 'emerald-600',
        '#7B1FA2': 'emerald-700',
        '#BA68C8': 'emerald-400',
        '#f3e5f5': 'emerald-50',
        
        # Grays
        '#2c3e50': 'slate-900',
        '#ecf0f1': 'slate-200',
        '#d5dbdb': 'slate-300',
        '#95a5a6': 'slate-400',
        '#7f8c8d': 'slate-500',
        '#555': 'slate-600',
        '#666': 'slate-500',
        '#333': 'slate-800',
        '#f8f9fa': 'slate-50',
        '#e0e0e0': 'slate-200',
        '#f5f5f5': 'slate-100',
        '#f5f7fa': 'slate-50',
        '#c3cfe2': 'slate-200',
    }

    # Replace literal hex codes in text-[..] bg-[..] border-[..]
    for hex_code, tw_color in color_map.items():
        # exact replacements in arbitrary values
        content = content.replace(f'text-[{hex_code}]', f'text-{tw_color}')
        content = content.replace(f'bg-[{hex_code}]', f'bg-{tw_color}')
        content = content.replace(f'border-[{hex_code}]', f'border-{tw_color}')
        content = content.replace(f'from-[{hex_code}]', f'from-{tw_color}')
        content = content.replace(f'to-[{hex_code}]', f'to-{tw_color}')
        content = content.replace(f'via-[{hex_code}]', f'via-{tw_color}')
        content = content.replace(f'focus-visible:outline-[{hex_code}]', f'focus-visible:outline-{tw_color}')
        content = content.replace(f'ring-[{hex_code}]', f'ring-{tw_color}')

    # 2. Fix gradients and backgrounds
    # Remove chaotic inline style gradients
    content = re.sub(r'style=\{\{\s*background:\s*\'linear-gradient.*?\'.*?\}\}', '', content)
    content = re.sub(r'bg-\[linear-gradient.*?\]', 'bg-slate-50', content)
    
    # Standardize page wrappers
    content = re.sub(r'min-h-\[calc\(100vh-[0-9]+px\)\].*?bg-gradient-to-b[r]? from-\[.*?\] to-\[.*?\]', 'min-h-[100dvh] bg-slate-50', content)
    content = re.sub(r'min-h-\[calc\(100vh-[0-9]+px\)\]', 'min-h-[100dvh]', content)
    
    # Spacing
    content = content.replace('p-[clamp(1rem,2vw,2rem)]', 'p-4 sm:p-6 lg:p-8')
    content = content.replace('p-[clamp(1rem,2vw,2rem)_1rem]', 'px-4 py-8 sm:px-6 lg:px-8')
    content = content.replace('max-md:min-h-auto', '')

    # Fix broken classes from earlier
    content = content.replace('change-w-[100px]', 'w-[100px]')
    content = content.replace('font-bold-btn', 'font-bold')
    content = content.replace('text-white-settings-btn', 'text-white')

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('frontend/src/components'):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))

