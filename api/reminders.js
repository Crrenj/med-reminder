let reminders = [];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Renvoyer tous les rappels
    return res.status(200).json(reminders);
  } else if (req.method === 'POST') {
    // Lire le corps de la requête
    const body = await getJSONBody(req);
    const { name, time } = body;
    
    if (!name || !time) {
      return res.status(400).json({ error: "Name and time are required" });
    }

    const reminder = { name, time };
    reminders.push(reminder);
    return res.status(201).json(reminder);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

// Fonction utilitaire pour parser le corps JSON de la requête
function getJSONBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}
