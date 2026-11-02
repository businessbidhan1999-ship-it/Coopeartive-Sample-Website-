import { NextRequest } from 'next/server';
import { handleEnquiry } from '@/lib/server/enquiry';
export const runtime = 'nodejs';
export const POST = (request: NextRequest) => handleEnquiry(request, 'apply');
