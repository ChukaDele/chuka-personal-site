import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export async function createEvidence({ catalogPath, sha }) {
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('Evidence SHA must be 40 lowercase hexadecimal characters.');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  if (catalog.standard !== 'Website Launch QA v2.0' || catalog.controls?.length !== 47) {
    throw new Error('Expected the Website Launch QA v2.0 catalog with exactly 47 controls.');
  }
  const controls = Object.fromEntries(catalog.controls.map(({ id }) => [id, {
    status: 'NOT_TESTED',
    release_sha: sha,
    tested_by: '',
    reviewed_by: '',
    evidence_url: '',
    observed_at: '',
  }]));
  return {
    schema_version: 1,
    standard: catalog.standard,
    release_sha: sha,
    generated_status: 'CLOSEOUT_BLOCKED',
    controls,
    approvals: {
      prelaunch: { status: 'NOT_TESTED', approved_by: '', release_sha: sha },
      live: { status: 'NOT_TESTED', approved_by: '', release_sha: sha },
      closeout: { status: 'NOT_TESTED', approved_by: '', release_sha: sha },
    },
    notice: 'Template only. Automated test success is separate from independent review and owner acceptance.',
  };
}

async function main() {
  const [sha, output] = process.argv.slice(2);
  if (!sha || !output) throw new Error('Usage: npm run qa:evidence -- <40-char-sha> <output.json>');
  const evidence = await createEvidence({ catalogPath: '.website-qa/catalog.json', sha });
  await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  console.log(`CLOSEOUT_BLOCKED: wrote 47 NOT_TESTED controls to ${output}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(`EVIDENCE_TEMPLATE_FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
