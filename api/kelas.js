import db from '../db.json' assert { type: 'json' };

let kelas = [...db.kelas];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    if (id) {
      const item = kelas.find((k) => String(k.id) === String(id));
      return item ? res.status(200).json(item) : res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(kelas);
  }

  if (req.method === 'POST') {
    const newItem = { ...req.body, id: String(Date.now()) };
    kelas.push(newItem);
    return res.status(201).json(newItem);
  }

  if (req.method === 'PUT') {
    kelas = kelas.map((k) => (String(k.id) === String(id) ? { ...k, ...req.body } : k));
    return res.status(200).json(kelas.find((k) => String(k.id) === String(id)));
  }

  if (req.method === 'DELETE') {
    kelas = kelas.filter((k) => String(k.id) !== String(id));
    return res.status(200).json({ message: 'Deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
