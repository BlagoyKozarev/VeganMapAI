import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get('/healthz', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'veganmapai-backend'
  });
});

// --- Feedback endpoint ---
app.post('/api/feedback', async (req,res)=>{
  try{
    const { uid, place_id, score_details, comment } = req.body || {};
    if(!uid || !place_id) return res.status(400).json({error:'uid and place_id required'});
    // TODO: add Firestore write here when firebase-admin is wired
    console.log('Feedback received:', { uid, place_id, score_details, comment });
    res.json({ok:true, queued:true});
  }catch(e){ 
    console.error(e); 
    res.status(500).json({error:'failed'}); 
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🌱 VeganMapAI Backend running on port ${port}`);
});