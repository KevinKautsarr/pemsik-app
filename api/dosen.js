import db from '../db.json' assert { type: 'json' };

let dosen = [...db.dosen];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    if (id) {
      const item = dosen.find((d) => String(d.id) === String(id));
      return item ? res.status(200).json(item) : res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(dosen);
  }

  if (req.method === 'POST') {
    const newItem = { ...req.body, id: String(Date.now()) };
    dosen.push(newItem);
    return res.status(201).json(newItem);
  }

  if (req.method === 'PUT') {
    dosen = dosen.map((d) => (String(d.id) === String(id) ? { ...d, ...req.body } : d));
    return res.status(200).json(dosen.find((d) => String(d.id) === String(id)));
  }

  if (req.method === 'DELETE') {
    dosen = dosen.filter((d) => String(d.id) !== String(id));
    return res.status(200).json({ message: 'Deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
