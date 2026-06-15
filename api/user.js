import db from '../db.json' assert { type: 'json' };

let users = [...db.user];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { email, id } = req.query;

  if (req.method === 'GET') {
    let result = users;
    if (email) result = result.filter((u) => u.email === email);
    if (id) result = result.filter((u) => String(u.id) === String(id));
    return res.status(200).json(result);
  }

  if (req.method === 'POST') {
    const newUser = { ...req.body, id: Date.now() };
    users.push(newUser);
    return res.status(201).json(newUser);
  }

  if (req.method === 'PUT') {
    const { id: putId } = req.query;
    users = users.map((u) => (String(u.id) === String(putId) ? { ...u, ...req.body } : u));
    return res.status(200).json(users.find((u) => String(u.id) === String(putId)));
  }

  if (req.method === 'DELETE') {
    const { id: delId } = req.query;
    users = users.filter((u) => String(u.id) !== String(delId));
    return res.status(200).json({ message: 'Deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
