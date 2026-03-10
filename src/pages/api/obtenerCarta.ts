// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req: any, res: any) {
    console.log('Handler invoked');
    const { method } = req;
    console.log('HTTP Method:', method);

    if (method === 'POST') {
        const { session, data } = req.body;
        console.log('Request body:', req.body);

        if (!session) {
            console.log('Session missing in request');
            return res.status(400).json({ error: 'Session is required' });
        }

        console.log(`Draft for session ${session}`);
        const url = 'http://bot1.camarai.es:5678/webhook/get-catalog'; // POST

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session }), // Stringify the body object
        };
        console.log('Fetch options:', options);

        try {
            console.log('Sending fetch request...');
            const response = await fetch(url, options);
            console.log('Fetch response status:', response.status);

            const result = await response.json();
            console.log('Fetch response JSON:', result);

            return res.status(200).json(result);
        } catch (error) {
            console.warn('Error fetching menu, returning mock data.');
            return res.status(200).json({
                "tapas": [
                    { "nombre_producto": "Patatas Bravas", "id_categoria_detectada": "tapas", "url": "https://images.unsplash.com/photo-1541529086526-db283c563270?w=400", "variaciones": { "name": "Ración", "price": "6.50", "currency": "EUR" } },
                    { "nombre_producto": "Jamón Ibérico", "id_categoria_detectada": "tapas", "url": "https://images.unsplash.com/photo-1544022613-e87f17a7845f?w=400", "variaciones": { "name": "Plato", "price": "18.00", "currency": "EUR" } }
                ],
                "principales": [
                    { "nombre_producto": "Entrecot", "id_categoria_detectada": "principales", "url": "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400", "variaciones": { "name": "Punto", "price": "22.00", "currency": "EUR" } }
                ]
            });
        }
    } else {
        console.log('Method not allowed:', method);
        return res.status(405).json({ error: 'Method not allowed' });
    }
}