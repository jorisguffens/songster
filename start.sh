#!/bin/sh

export PORT=80

echo "Starting web service..."
exec node --enable-source-maps --max-http-header-size=65536 build
