import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import type { ReportDocModel } from './build-report-doc'

const STATUS_LABEL: Record<string, string> = {
  pass: 'PASS',
  fail: 'FAIL',
  warn: 'WARN',
  na: 'N/A',
}

const STATUS_COLOR: Record<string, string> = {
  pass: '#1a7f37',
  fail: '#cf222e',
  warn: '#9a6700',
  na: '#57606a',
}

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica' },
  title: { fontSize: 18, marginBottom: 4 },
  meta: { fontSize: 9, color: '#57606a', marginBottom: 12 },
  score: { fontSize: 13, marginBottom: 16 },
  sectionTitle: { fontSize: 12, marginTop: 14, marginBottom: 6, fontFamily: 'Helvetica-Bold' },
  row: { flexDirection: 'row', borderBottom: '1 solid #d0d7de', paddingVertical: 4 },
  statusCol: { width: 40, fontFamily: 'Helvetica-Bold' },
  labelCol: { width: 180 },
  messageCol: { flex: 1, color: '#333' },
  gscLine: { marginBottom: 2 },
})

function ReportPdfDocument({ doc }: { doc: ReportDocModel }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.meta}>Generated: {doc.generatedAt}</Text>
        <Text style={styles.score}>
          Overall score: {doc.overallScore}/100{doc.complianceGated ? ' (capped by a compliance failure)' : ''}
        </Text>

        {doc.sections.map((section) => (
          <View key={section.category} wrap={false}>
            <Text style={styles.sectionTitle}>
              {section.categoryLabel} — {section.score}/100
            </Text>
            {section.rows.map((row) => (
              <View key={row.id} style={styles.row}>
                <Text style={[styles.statusCol, { color: STATUS_COLOR[row.status] }]}>
                  {STATUS_LABEL[row.status] ?? row.status}
                </Text>
                <Text style={styles.labelCol}>
                  {row.label}
                  {row.mode === 'manual' ? ' (manual)' : ''}
                </Text>
                <Text style={styles.messageCol}>{row.message}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Search Console</Text>
        {doc.gsc ? (
          <View>
            <Text style={styles.gscLine}>Clicks: {doc.gsc.clicks}</Text>
            <Text style={styles.gscLine}>Impressions: {doc.gsc.impressions}</Text>
            <Text style={styles.gscLine}>CTR: {(doc.gsc.ctr * 100).toFixed(1)}%</Text>
            <Text style={styles.gscLine}>Avg. position: {doc.gsc.avgPosition.toFixed(1)}</Text>
            <Text style={styles.gscLine}>
              LCP: {doc.gsc.coreWebVitals.lcpMs ?? 'n/a'}ms ({doc.gsc.coreWebVitals.lcpPass ? 'pass' : 'fail'})
            </Text>
            <Text style={styles.gscLine}>
              INP: {doc.gsc.coreWebVitals.inpMs ?? 'n/a'}ms ({doc.gsc.coreWebVitals.inpPass ? 'pass' : 'fail'})
            </Text>
            <Text style={styles.gscLine}>
              CLS: {doc.gsc.coreWebVitals.cls ?? 'n/a'} ({doc.gsc.coreWebVitals.clsPass ? 'pass' : 'fail'})
            </Text>
            <Text style={styles.gscLine}>Crawl errors: {doc.gsc.crawlErrors}</Text>
          </View>
        ) : (
          <Text style={styles.gscLine}>
            Google Search Console not connected. Connect it in SEO Reports settings to include live Core Web
            Vitals and search performance data.
          </Text>
        )}
      </Page>
    </Document>
  )
}

export async function toPdf(doc: ReportDocModel): Promise<Buffer> {
  return renderToBuffer(<ReportPdfDocument doc={doc} />)
}
