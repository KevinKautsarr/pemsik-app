import db from '../db.json' assert { type: 'json' };

let matakuliah = [...db.matakuliah];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    if (id) {
      const item = matakuliah.find((m) => String(m.id) === String(id));
      return item ? res.status(200).json(item) : res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(matakuliah);
  }

  if (req.method === 'POST') {
    const newItem = { ...req.body, id: String(Date.now()) };
    matakuliah.push(newItem);
    return res.status(201).json(newItem);
  }

  if (req.method === 'PUT') {
    matakuliah = matakuliah.map((m) => (String(m.id) === String(id) ? { ...m, ...req.body } : m));
    return res.status(200).json(matakuliah.find((m) => String(m.id) === String(id)));
  }

  if (req.method === 'DELETE') {
    matakuliah = matakuliah.filter((m) => String(m.id) !== String(id));
    return res.status(200).json({ message: 'Deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
