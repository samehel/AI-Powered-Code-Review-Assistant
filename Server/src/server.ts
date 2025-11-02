import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GitHub Token Exchange Route
app.post('/api/github/token', async (req, res) => {
  try {
    const { code } = req.body;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

// Groq + LLaMA 3 PR Analyzer
app.post('/api/analyze-pr', async (req: any, res: any) => {
  try {
    const { prDescription } = req.body;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert GitHub pull request reviewer and Senior Software Engineer. Provide constructive, conversational feedback while getting to the point. Make comments on the: File name, content, description, code (if any), spelling, and give recommendations for next steps that can be taken. Don\'t say things like "Hey there" or "Thanks for creating a new pull request! I\'m happy to help review it.", just get to the point. and once you have addressed all the points, do not say anything else at all and just stop talking. Don\'t say things like "Please address these points, and I\'ll be happy to review the updated pull request."',
          },
          {
            role: 'user',
            content: `Please analyze this pull request:\n\n${prDescription}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const result = await groqResponse.json();

    if (!result || !result.choices || result.choices.length === 0) {
      return res.status(500).json({ error: 'No response from Groq' });
    }

    res.json({ analysis: result.choices[0].message.content });

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
