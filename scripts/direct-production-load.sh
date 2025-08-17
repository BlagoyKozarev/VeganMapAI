#!/bin/bash

echo "Loading restaurants to production via direct bulk insert..."

# Create SQL INSERT statement from JSON
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('restaurants-export.json', 'utf-8'));
const restaurants = data.restaurants || data;

console.log('INSERT INTO restaurants (id, place_id, name, address, latitude, longitude, phone_number, website, vegan_score, is_fully_vegan, has_vegan_options, cuisine_types, price_level, rating, review_count, opening_hours, city, country) VALUES');

const values = restaurants.slice(0, 50).map(r => {
  const escape = (str) => str ? \"'\" + str.replace(/'/g, \"''\") + \"'\" : 'NULL';
  const escapeArray = (arr) => arr && arr.length > 0 ? \"'{\" + arr.map(s => escape(s).slice(1, -1)).join(',') + \"}'\" : \"'{}'\";
  
  return '(' + [
    escape(r.id),
    escape(r.placeId || ''),
    escape(r.name),
    escape(r.address),
    escape(r.latitude),
    escape(r.longitude),
    escape(r.phoneNumber || r.phone_number),
    escape(r.website),
    escape(r.veganScore || r.vegan_score),
    r.isFullyVegan || r.is_fully_vegan ? 'true' : 'false',
    r.hasVeganOptions || r.has_vegan_options ? 'true' : 'false',
    escapeArray(r.cuisineTypes || r.cuisine_types || []),
    r.priceLevel || r.price_level || 2,
    escape(r.rating),
    r.reviewCount || r.review_count || 0,
    escape(JSON.stringify(r.openingHours || r.opening_hours || {})),
    escape(r.city || 'Sofia'),
    escape(r.country || 'Bulgaria')
  ].join(', ') + ')';
}).join(',\\n');

console.log(values + ';');
" > production-insert.sql

echo "Generated SQL insert for first 50 restaurants"
head -3 production-insert.sql