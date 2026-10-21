import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, TextRun, WidthType } from 'docx'
import type { ReportDocModel } from './build-report-doc'

const STATUS_LABEL: Record<string, string> = {
  pass: 'PASS',
  fail: 'FAIL',
  warn: 'WARN',
  na: 'N/A',
}

function headerCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
    width: { size: 20, type: WidthType.PERCENTAGE },
  })
}

function cell(text: string, width = 20): TableCell {
  return new TableCell({
    children: [new Paragraph(text)],
    width: { size: width, type: WidthType.PERCENTAGE },
  })
}

export async function toDocx(doc: ReportDocModel): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [
    new Paragraph({ text: doc.title, heading: HeadingLevel.TITLE }),
    new Paragraph({ text: `Generated: ${doc.generatedAt}` }),
    new Paragraph({
      text: `Overall score: ${doc.overallScore}/100${doc.complianceGated ? ' (capped by a compliance failure)' : ''}`,
    }),
  ]

  for (const section of doc.sections) {
    children.push(new Paragraph({ text: `${section.categoryLabel} — ${section.score}/100`, heading: HeadingLevel.HEADING_2 }))
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [headerCell('Status'), headerCell('Check'), headerCell('Details')] }),
          ...section.rows.map(
            (row) =>
              new TableRow({
                children: [
                  cell(STATUS_LABEL[row.status] ?? row.status, 10),
                  cell(row.label + (row.mode === 'manual' ? ' (manual)' : ''), 30),
                  cell(row.message, 60),
                ],
              }),
          ),
        ],
      }),
    )
  }

  children.push(new Paragraph({ text: 'Search Console', heading: HeadingLevel.HEADING_2 }))
  if (doc.gsc) {
    children.push(
      new Paragraph({ text: `Clicks: ${doc.gsc.clicks} · Impressions: ${doc.gsc.impressions} · CTR: ${(doc.gsc.ctr * 100).toFixed(1)}% · Avg. position: ${doc.gsc.avgPosition.toFixed(1)}` }),
      new Paragraph({
        text: `LCP: ${doc.gsc.coreWebVitals.lcpMs ?? 'n/a'}ms (${doc.gsc.coreWebVitals.lcpPass ? 'pass' : 'fail'}) · INP: ${doc.gsc.coreWebVitals.inpMs ?? 'n/a'}ms (${doc.gsc.coreWebVitals.inpPass ? 'pass' : 'fail'}) · CLS: ${doc.gsc.coreWebVitals.cls ?? 'n/a'} (${doc.gsc.coreWebVitals.clsPass ? 'pass' : 'fail'})`,
      }),
      new Paragraph({ text: `Crawl errors: ${doc.gsc.crawlErrors}` }),
    )
  } else {
    children.push(
      new Paragraph({
        text: 'Google Search Console not connected. Connect it in SEO Reports settings to include live Core Web Vitals and search performance data.',
      }),
    )
  }

  const document = new Document({ sections: [{ children }] })
  return Packer.toBuffer(document)
}
