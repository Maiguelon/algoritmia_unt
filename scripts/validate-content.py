from pathlib import Path
import collections
import json
import re
import shutil
import subprocess

root = Path(__file__).resolve().parents[1] / 'content/apuntes/cpp'
catalog = json.loads((root / 'catalogo.json').read_text(encoding='utf-8'))
expected_sections = ['Descripción', 'Funciones y operaciones', 'Ejemplos']
docs = {}
errors = []
sources = []
block_count = 0
helper_count = 0

for path in sorted(root.glob('*.md')):
    if path.name == 'README.md':
        continue
    text = path.read_text(encoding='utf-8')
    front = re.match(r'\A---\n(.*?)\n---\n', text, re.S)
    if not front:
        errors.append(f'{path.name}: falta metadato inicial')
        continue
    metadata = dict(re.findall(r'^([\w-]+): (.+)$', front.group(1), re.M))
    chunk_id = metadata.get('id')
    if chunk_id in docs:
        errors.append(f'ID repetido: {chunk_id}')
    docs[chunk_id] = (path, metadata)
    if chunk_id != 'cpp-' + path.stem:
        errors.append(f'{path.name}: ID distinto al archivo')
    if metadata.get('standard') != 'C++17':
        errors.append(f'{path.name}: estándar distinto')
    headings = re.findall(r'^## (.+)$', text, re.M)
    if headings != expected_sections:
        errors.append(f'{path.name}: secciones {headings}')
    if re.search(r'\bassert\s*\(|<cassert>', text):
        errors.append(f'{path.name}: bloque de comprobación publicado')
    if any(line != line.rstrip() for line in text.splitlines()):
        errors.append(f'{path.name}: espacios al final')
    fences = re.findall(r'^```.*$', text, re.M)
    blocks = re.findall(r'^```cpp\n(.*?)^```\s*$', text, re.M | re.S)
    if len(fences) != len(blocks) * 2:
        errors.append(f'{path.name}: revisar cierres de código')
    block_count += len(blocks)
    labeled = [(number, block) for number, block in enumerate(blocks, 1)]
    if path.stem == 'plantilla':
        for number, block in labeled:
            sources.append((f'{path.name}:{number}', block))
        continue
    if '#include' in text:
        errors.append(f'{path.name}: repite cabeceras')
    globals_ = []
    locals_ = []
    for number, block in labeled:
        label = f'#line 1 "{path.name}#{number}"\n'
        if re.match(r'\s*(?:void|bool|int|long long|double|string)\s+\w+\([^;\n]*\)\s*\{', block):
            globals_.append(label + block)
            helper_count += 1
        else:
            locals_.append(f'void ejemplo_{number}() {{\n{label}{block}\n}}\n')
    namespace = path.stem.replace('-', '_')
    combined = '\n'.join(globals_ + locals_)
    sources.append((path.name, f'namespace ejemplo_{namespace} {{\n{combined}\n}}\n'))

entries = catalog['chunks']
ids = [item['id'] for item in entries]
if len(docs) != 30 or len(ids) != 30:
    errors.append(f'Cantidad: archivos={len(docs)}, catálogo={len(ids)}')
if len(ids) != len(set(ids)) or set(ids) != set(docs):
    errors.append('IDs del catálogo no coinciden con archivos únicos')
if ids[0] != 'cpp-plantilla':
    errors.append('La plantilla no va primero')
grouped_ids = [cid for group in catalog['groups'] for cid in group['chunks']]
if grouped_ids != ids:
    errors.append('El orden de grupos no coincide con el catálogo')
families = {cid: group['title'] for group in catalog['groups'] for cid in group['chunks']}
for cid, (_, metadata) in docs.items():
    if families.get(cid) != metadata.get('family'):
        errors.append(f'{cid}: familia inconsistente')
graph = {}
for item in entries:
    cid = item['id']
    if cid in docs and item['file'] != docs[cid][0].name:
        errors.append(f'{cid}: enlace a archivo incorrecto')
    graph[cid] = item['suggestedPrerequisites']
    for dependency in graph[cid]:
        if dependency not in docs:
            errors.append(f'{cid}: apoyo inexistente {dependency}')
        if dependency == cid:
            errors.append(f'{cid}: dependencia de sí mismo')

def check_cycle(cid, route):
    if cid in route:
        errors.append('Ciclo: ' + ' -> '.join(route + [cid]))
        return
    for dependency in graph.get(cid, []):
        check_cycle(dependency, route + [cid])

for cid in graph:
    check_cycle(cid, [])

readme = (root / 'README.md').read_text(encoding='utf-8')
local_links = [target for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', readme) if not target.startswith('https://')]
for target in local_links:
    if not (root / target).is_file():
        errors.append(f'Enlace roto en índice: {target}')
if not {path.name for path, _ in docs.values()}.issubset(set(local_links)):
    errors.append('El índice no enlaza todos los bloques')
if errors:
    raise SystemExit('\n'.join(errors))

policy = catalog['exportPolicy']['index']
if policy != {'mode': 'multiple-content-chunks', 'exclude': ['cpp-plantilla']}:
    raise SystemExit('Politica de indice incorrecta')
for selected, expected in [([], False), (['cpp-plantilla'], False), (['cpp-plantilla','cpp-set'], False), (['cpp-set','cpp-set'], False), (['cpp-set','cpp-map'], True)]:
    if (len(set(selected) - {'cpp-plantilla'}) > 1) != expected:
        raise SystemExit('Indice incorrecto')
compiler = shutil.which('g++')
if not compiler:
    raise SystemExit('No se encontró g++')
template = '\n'.join(code for name, code in sources if name.startswith('plantilla.md:'))
library = '#include <bits/stdc++.h>\nusing namespace std;\n' + '\n'.join(code for name, code in sources if not name.startswith('plantilla.md:'))
for name, source in [('plantilla', template), ('fragmentos', library)]:
    result = subprocess.run([compiler, '-std=c++17', '-pedantic-errors', '-fsyntax-only', '-x', 'c++', '-'], input=source, text=True, capture_output=True, encoding='utf-8')
    if result.returncode:
        raise SystemExit(name + '\n' + result.stderr)

print(json.dumps({
    'chunks': len(docs),
    'groups': {group['title']: len(group['chunks']) for group in catalog['groups']},
    'cpp_blocks_compiled': block_count,
    'helper_definitions': helper_count,
    'catalog_links_and_optional_dependencies': 'OK',
    'headings_and_code_fences': 'OK',
    'published_assertions': 0,
    'compiler': compiler
}, ensure_ascii=False, indent=2))
