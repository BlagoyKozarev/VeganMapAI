// Working search endpoint to replace the broken one
app.get("/api/search", async (req: any, res: any) => {
  const startTime = Date.now();
  
  try {
    // Parse parameters
    const params = {
      q: req.query.q || '',
      minScore: req.query.minScore ? parseFloat(req.query.minScore) : undefined,
      maxScore: req.query.maxScore ? parseFloat(req.query.maxScore) : undefined,
      priceMin: req.query.priceMin ? parseInt(req.query.priceMin) : undefined,
      priceMax: req.query.priceMax ? parseInt(req.query.priceMax) : undefined,
      sort: req.query.sort || 'score',
      order: req.query.order || 'desc',
      page: parseInt(req.query.page) || 1,
      limit: Math.max(10, Math.min(50, parseInt(req.query.limit) || 20))
    };
    
    console.log('[Search] Parameters:', params);

    // Build simple query conditions
    const conditions: string[] = [];
    
    if (params.q) {
      conditions.push(`(name ILIKE '%${params.q}%' OR address ILIKE '%${params.q}%')`);
    }
    
    if (params.minScore !== undefined) {
      conditions.push(`vegan_score >= ${params.minScore}`);
    }
    
    if (params.maxScore !== undefined) {
      conditions.push(`vegan_score <= ${params.maxScore}`);
    }
    
    if (params.priceMin !== undefined) {
      conditions.push(`price_level >= ${params.priceMin}`);
    }
    
    if (params.priceMax !== undefined) {
      conditions.push(`price_level <= ${params.priceMax}`);
    }
    
    // Build WHERE clause
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    
    // Build ORDER BY
    let orderColumn = 'vegan_score';
    if (params.sort === 'price') orderColumn = 'price_level';
    else if (params.sort === 'rating') orderColumn = 'rating';
    
    // Main query
    const offset = (params.page - 1) * params.limit;
    const query = `
      SELECT id, name, latitude, longitude, vegan_score, price_level, 
             cuisine_types, address, rating, phone_number, website
      FROM restaurants 
      ${whereClause}
      ORDER BY ${orderColumn} ${params.order}
      LIMIT ${params.limit} OFFSET ${offset}
    `;
    
    // Count query  
    const countQuery = `SELECT COUNT(*) as total FROM restaurants ${whereClause}`;
    
    console.log('[Search] Query:', query);
    
    // Execute both queries
    const [results, countResult] = await Promise.all([
      db.execute(sql.raw(query)),
      db.execute(sql.raw(countQuery))
    ]);
    
    const items = Array.isArray(results) ? results : [results];
    const countRows = Array.isArray(countResult) ? countResult : [countResult];
    const total = parseInt((countRows[0] as any)?.total || '0');

    const response = {
      items: items.map((r: any) => ({
        ...r,
        lat: parseFloat(r.latitude),
        lng: parseFloat(r.longitude),
        veganScore: r.vegan_score,
        priceLevel: r.price_level,
        cuisineTypes: r.cuisine_types || [],
        phone_number: r.phone_number,
        website: r.website
      })),
      total,
      page: params.page,
      pages: Math.ceil(total / params.limit),
      took_ms: Date.now() - startTime,
      facets: {
        cuisines: [],
        priceRanges: []
      }
    };

    console.log(`[Search] Found ${items.length} restaurants in ${response.took_ms}ms`);
    res.json(response);

  } catch (error) {
    console.error('[Search] Error:', error);
    res.status(500).json({
      error: "Search failed",
      message: (error as Error).message,
      took_ms: Date.now() - startTime
    });
  }
});