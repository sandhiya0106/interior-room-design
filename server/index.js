import cors from 'cors';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const app = express();
const PORT = process.env.PORT || 4000;

const dataDir = path.resolve(process.cwd(), 'server', 'data');
const dataFile = path.join(dataDir, 'designs.json');

app.use(cors());
app.use(express.json());

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch {
    await writeFile(dataFile, '[]', 'utf8');
  }
}

async function readDesigns() {
  await ensureDataFile();
  const content = await readFile(dataFile, 'utf8');
  return JSON.parse(content);
}

async function writeDesigns(designs) {
  await ensureDataFile();
  await writeFile(dataFile, JSON.stringify(designs, null, 2), 'utf8');
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/designs', async (_req, res) => {
  try {
    const designs = await readDesigns();
    res.json(designs);
  } catch {
    res.status(500).json({ message: 'Failed to read designs' });
  }
});

app.post('/api/designs', async (req, res) => {
  try {
    const design = req.body;
    if (!design || typeof design !== 'object') {
      return res.status(400).json({ message: 'Invalid design payload' });
    }

    const designs = await readDesigns();
    const savedDesign = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...design,
    };

    designs.push(savedDesign);
    await writeDesigns(designs);

    return res.status(201).json(savedDesign);
  } catch {
    return res.status(500).json({ message: 'Failed to save design' });
  }
});

app.listen(PORT, () => {
  console.log(`Minimal API running on http://localhost:${PORT}`);
});
