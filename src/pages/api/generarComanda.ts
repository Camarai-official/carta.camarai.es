// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req: any, res: any) {
    console.log('Handler invoked');
    const { method } = req;
    console.log('HTTP Method:', method);

    if (method === 'POST') {
        const { data } = req.body;
        console.log('Request body:', req.body);

        if (!data) {
            console.log('Session missing in request');
            return res.status(400).json({ error: 'Session is required' });
        }

        console.log(`Draft for session ${data}`);
        const url = 'http://bot1.camarai.es:5678/webhook/generate-order'; // POST
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }), // Stringify the body object
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
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        console.log('Method not allowed:', method);
        return res.status(405).json({ error: 'Method not allowed' });
    }
}