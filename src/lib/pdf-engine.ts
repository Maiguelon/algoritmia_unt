import { marked } from 'marked';
import { monoFontBase64 } from './pdf-fonts';

export type PdfNode = Record<string, unknown>;
export interface PdfDefinition {
  content: PdfNode[];
  [key: string]: unknown;
}

type MarkdownToken = {
  type: string;
  text?: string;
  raw?: string;
  depth?: number;
  href?: string;
  ordered?: boolean;
  start?: number;
  tokens?: MarkdownToken[];
  items?: MarkdownToken[];
  header?: MarkdownToken[];
  rows?: MarkdownToken[][];
};

type PdfEngine = {
  addVirtualFileSystem: (files: Record<string, string>) => void;
  addFonts: (fonts: Record<string, Record<string, string>>) => void;
  createPdf: (definition: PdfDefinition) => { getBuffer: () => Promise<Uint8Array> };
};

let enginePromise: Promise<PdfEngine> | undefined;

async function engine(): Promise<PdfEngine> {
  enginePromise ??= Promise.all([
    import('pdfmake/build/pdfmake.js'),
    import('pdfmake/build/vfs_fonts.js'),
  ]).then(([module, fonts]) => {
    const pdfMake = module.default as unknown as PdfEngine;
    pdfMake.addVirtualFileSystem({ ...fonts.default, 'RobotoMono-Regular.ttf': monoFontBase64 });
    pdfMake.addFonts({
      Mono: {
        normal: 'RobotoMono-Regular.ttf',
        bold: 'RobotoMono-Regular.ttf',
        italics: 'RobotoMono-Regular.ttf',
        bolditalics: 'RobotoMono-Regular.ttf',
      },
    });
    return pdfMake;
  }).catch((error) => {
    enginePromise = undefined;
    throw error;
  });
  return enginePromise;
}

export async function renderPdf(definition: PdfDefinition): Promise<Uint8Array> {
  const pdfMake = await engine();
  return new Uint8Array(await pdfMake.createPdf(definition).getBuffer());
}

export function savePdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([new Uint8Array(bytes).buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Give the browser time to start reading the download before releasing it.
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function baseDefinition(title: string): PdfDefinition {
  return {
    info: { title, author: 'Club de Algoritmia - UNT', subject: 'Preparación para programación competitiva' },
    pageSize: 'A4',
    pageMargins: [48, 48, 48, 45],
    defaultStyle: { font: 'Roboto', fontSize: 9.5, lineHeight: 1.15, color: '#111111' },
    styles: {
      documentTitle: { fontSize: 21, bold: true, margin: [0, 5, 0, 5] },
      chunkTitle: { fontSize: 16, bold: true, margin: [0, 17, 0, 8] },
      sectionTitle: { fontSize: 11, bold: true, margin: [0, 10, 0, 5] },
      subheading: { fontSize: 10, bold: true, margin: [0, 8, 0, 4] },
      tableHeader: { bold: true, fillColor: '#eeeeee' },
      subtle: { color: '#555555', fontSize: 8.5 },
    },
    header: {
      text: 'CLUB DE ALGORITMIA - UNT',
      fontSize: 7.5,
      color: '#555555',
      margin: [48, 24, 48, 0],
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `${currentPage} / ${pageCount}`,
      alignment: 'center', fontSize: 8, color: '#555555', margin: [0, 13, 0, 0],
    }),
    pageBreakBefore: (node: PdfNode, container: { getFollowingNodesOnPage?: () => PdfNode[] }) => (
      Boolean(node.headlineLevel) && typeof container.getFollowingNodesOnPage === 'function'
      && container.getFollowingNodesOnPage().every((following) => Boolean(following.headlineLevel))
    ),
    content: [],
  };
}

function inline(tokens: MarkdownToken[] | undefined, fallback = '', inTable = false): PdfNode[] {
  if (!tokens?.length) return [{ text: fallback }];
  return tokens.flatMap((token): PdfNode[] => {
    const children = () => inline(token.tokens, token.text ?? '', inTable);
    switch (token.type) {
      case 'codespan':
        return [{ text: token.text ?? '', font: 'Mono', fontSize: inTable ? 7.5 : 8.5 }];
      case 'strong': return [{ text: children(), bold: true }];
      case 'em': return [{ text: children(), italics: true }];
      case 'link': return [{ text: children(), link: token.href, decoration: 'underline' }];
      case 'br': return [{ text: '\n' }];
      case 'escape': return [{ text: token.text ?? '' }];
      case 'image': return [{ text: token.text ?? 'Imagen' }];
      default: return token.tokens?.length ? children() : [{ text: token.text ?? token.raw ?? '' }];
    }
  });
}

export function codeToPdf(code: string): PdfNode {
  const lines = code.replace(/\r/g, '').trimEnd().split('\n');
  return {
    margin: [0, 5, 0, 8],
    unbreakable: lines.length <= 25,
    table: {
      widths: ['*'],
      dontBreakRows: true,
      body: lines.map((line) => [{
        text: line || ' ', font: 'Mono', fontSize: 8,
        preserveLeadingSpaces: true, lineHeight: 1.12,
      }]),
    },
    layout: {
      hLineWidth: () => 0, vLineWidth: () => 0,
      paddingLeft: () => 7, paddingRight: () => 7,
      paddingTop: () => 1.5, paddingBottom: () => 1.5,
      fillColor: () => '#f3f3f3',
    },
  };
}

function tokensToPdf(tokens: MarkdownToken[]): PdfNode[] {
  return tokens.flatMap((token): PdfNode[] => {
    switch (token.type) {
      case 'space': return [];
      case 'heading': return [{
        text: inline(token.tokens, token.text),
        style: 'subheading', headlineLevel: Math.min(token.depth ?? 3, 6),
      }];
      case 'code': return [codeToPdf(token.text ?? '')];
      case 'paragraph':
      case 'text': return [{ text: inline(token.tokens, token.text), margin: [0, 0, 0, 6] }];
      case 'blockquote': return [{ stack: tokensToPdf(token.tokens ?? []), margin: [12, 3, 0, 6], color: '#444444' }];
      case 'list': return [{
        [token.ordered ? 'ol' : 'ul']: (token.items ?? []).map((item) => ({
          stack: tokensToPdf(item.tokens ?? [{ type: 'text', text: item.text }]),
        })),
        ...(token.ordered && typeof token.start === 'number' ? { start: token.start } : {}),
        margin: [0, 0, 0, 6],
      }];
      case 'table': {
        const headers = token.header ?? [];
        const columns = headers.length;
        if (!columns) return [];
        const available = 499.28 - columns * 8;
        const weights = columns === 4 ? [0.36, 0.22, 0.30, 0.12]
          : columns === 3 ? [0.35, 0.30, 0.35] : Array(columns).fill(1 / columns);
        const cell = (item: MarkdownToken, header = false) => ({
          text: inline(item.tokens, item.text, true),
          fontSize: 8.1, ...(header ? { style: 'tableHeader' } : {}),
          margin: [0, 2, 0, 2],
        });
        return [{
          table: {
            headerRows: 1, keepWithHeaderRows: 1, dontBreakRows: true,
            widths: weights.map((weight) => available * weight),
            body: [headers.map((item) => cell(item, true)), ...(token.rows ?? []).map((row) => row.map((item) => cell(item)))],
          },
          layout: {
            hLineWidth: (index: number) => index === 1 ? 0.7 : 0.3,
            vLineWidth: () => 0,
            hLineColor: () => '#bcbcbc',
            paddingLeft: () => 4, paddingRight: () => 4,
            paddingTop: () => 3, paddingBottom: () => 3,
          },
          margin: [0, 5, 0, 8],
        }];
      }
      case 'hr': return [{ canvas: [{ type: 'line', x1: 0, x2: 499, y1: 0, y2: 0, lineWidth: 0.5, lineColor: '#bbbbbb' }], margin: [0, 6, 0, 6] }];
      default: return token.text ? [{ text: token.text, margin: [0, 0, 0, 6] }] : [];
    }
  });
}

export function markdownToPdf(markdown: string): PdfNode[] {
  const tokens = marked.lexer(markdown, { gfm: true }) as unknown as MarkdownToken[];
  return tokensToPdf(tokens);
}
