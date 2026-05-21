#!/usr/bin/env node
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = resolve(__dirname, 'fonts');
const projectRoot = resolve(__dirname, '../..');
const outDir = resolve(projectRoot, 'public/og');

const enJson = JSON.parse(await readFile(resolve(projectRoot, 'src/i18n/en.json'), 'utf8'));
const ptJson = JSON.parse(await readFile(resolve(projectRoot, 'src/i18n/pt-br.json'), 'utf8'));

const fontMed = await readFile(resolve(fontsDir, 'Schibsted-Med.ttf'));
const fontBold = await readFile(resolve(fontsDir, 'Schibsted-Bold.ttf'));
const fontExtra = await readFile(resolve(fontsDir, 'Schibsted-Extra.ttf'));

const logoSvg = await readFile(resolve(projectRoot, 'public/assets/brand/icon_dark_background.svg'), 'utf8');
const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg, 'utf8').toString('base64')}`;

const fonts = [
  { name: 'Schibsted Grotesk', data: fontMed, weight: 500, style: 'normal' },
  { name: 'Schibsted Grotesk', data: fontBold, weight: 700, style: 'normal' },
  { name: 'Schibsted Grotesk', data: fontExtra, weight: 800, style: 'normal' },
];

function splitHookline(line) {
  const commaIdx = line.lastIndexOf(',');
  if (commaIdx < 0) return [line, null];
  return [line.slice(0, commaIdx + 1).trim(), line.slice(commaIdx + 1).trim()];
}

function h(type, props, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

function buildTree({ wordmark, hook, audience, url }) {
  const [line1, line2] = splitHookline(hook);

  return h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        padding: '64px 72px',
        position: 'relative',
        backgroundImage:
          'linear-gradient(180deg, #0d1126 0%, #1a2447 55%, #2d3f66 100%), radial-gradient(at 18% 120%, rgba(91, 134, 199, 0.42), rgba(91, 134, 199, 0) 70%)',
        backgroundColor: '#0d1126',
        color: '#f3f4f6',
        fontFamily: 'Schibsted Grotesk',
        justifyContent: 'space-between',
      },
    },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '28px' } },
      h('img', { src: logoDataUri, width: 132, height: 132, style: { width: '132px', height: '132px' } }),
      h(
        'div',
        {
          style: {
            fontSize: '60px',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#1C6BCC',
            display: 'flex',
          },
        },
        wordmark,
      ),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '28px' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '10px 22px',
            borderRadius: '999px',
            backgroundColor: '#1C6BCC',
            color: '#f9fafb',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          },
        },
        audience,
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: '66px',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.035em',
            color: '#f3f4f6',
          },
        },
        h('div', { style: { display: 'flex', whiteSpace: 'nowrap' } }, line1 ?? ''),
        line2
          ? h(
              'div',
              {
                style: {
                  display: 'flex',
                  whiteSpace: 'nowrap',
                  color: '#5ea0e6',
                  marginTop: '10px',
                },
              },
              line2,
            )
          : null,
      ),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: '22px',
          fontWeight: 500,
          color: '#f3f4f6',
          letterSpacing: '0.02em',
        },
      },
      url,
    ),
  );
}

async function render(locale, content) {
  const tree = buildTree(content);
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  await mkdir(outDir, { recursive: true });
  const outPath = resolve(outDir, `default-${locale}.png`);
  await (await import('node:fs/promises')).writeFile(outPath, png);
  console.log(`✓ wrote public/og/default-${locale}.png`);
}

await render('en', {
  wordmark: 'Syncologic',
  hook: enJson.homepage.heroHookLine,
  audience: enJson.homepage.heroAudience,
  url: 'syncologic.com',
});

await render('pt-br', {
  wordmark: 'Syncologic',
  hook: ptJson.homepage.heroHookLine,
  audience: ptJson.homepage.heroAudience,
  url: 'syncologic.com',
});
