import { generateOpenApiDocument } from '@/lib/openapi';

export function GET() {
  return Response.json(generateOpenApiDocument());
}
