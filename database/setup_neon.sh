#!/bin/bash
# Setup script for Neon database

PROJECT_ID="polished-sky-87327576"
DATABASE="neondb"

echo "Creating BigGrade database tables in Neon..."

# Read the schema file and execute it
psql "postgresql://neondb_owner:npg_Ciaod3u1vYsR@ep-snowy-cell-af1w7n5j-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require" < database/schema.sql

echo "Database setup complete!"
