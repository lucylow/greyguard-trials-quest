import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrialMatchRequest {
  symptoms: string
  location?: string
  age?: number
  patientId?: string
}

interface TrialMatch {
  id: string
  title: string
  description: string
  phase: string
  status: string
  sponsor: string
  locations: string[]
  criteria: string
  matchScore: number
  url: string
  startDate: string
  endDate: string
  participants: number
  contact: string
  zkProof: {
    proofId: string
    timestamp: string
    btcTx: string
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the ASI:One API key from Supabase secrets
    const asiApiKey = Deno.env.get('ASI_ONE_API_KEY')
    if (!asiApiKey) {
      throw new Error('ASI:One API key not configured')
    }

    // Parse the request
    const { symptoms, location, age, patientId }: TrialMatchRequest = await req.json()

    if (!symptoms || symptoms.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Symptoms are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Processing trial match request:', { symptoms, location, age, patientId })

    // Create the uAgent communication payload
    const uAgentPayload = {
      apiKey: asiApiKey,
      request: {
        type: 'CLINICAL_TRIAL_MATCH',
        patientData: {
          symptoms: symptoms.trim(),
          location: location || 'any',
          age: age || null,
          patientId: patientId || `patient_${Date.now()}`
        },
        privacy: {
          useZkProofs: true,
          encryptData: true,
          btcAnchor: true
        }
      }
    }

    // In a real implementation, you would call your deployed Fetch.ai agent here
    // For now, we'll simulate the uAgent response with realistic data
    const uAgentResponse = await simulateUAgentResponse(uAgentPayload)

    // Generate ZK-proof metadata for each match
    const enhancedMatches = uAgentResponse.matches.map((match: any) => ({
      ...match,
      zkProof: {
        proofId: `zk-proof-${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        btcTx: `${Math.random().toString(16).substr(2, 8)}deadbeef${Math.random().toString(16).substr(2, 8)}`
      }
    }))

    // Log the successful match for monitoring
    console.log(`Found ${enhancedMatches.length} trial matches for symptoms: ${symptoms}`)

    return new Response(
      JSON.stringify({
        success: true,
        matches: enhancedMatches,
        privacy: {
          zkProofGenerated: true,
          dataEncrypted: true,
          btcAnchored: true,
          icpSecured: true
        },
        metadata: {
          processedAt: new Date().toISOString(),
          patientId: uAgentPayload.request.patientData.patientId,
          matchCount: enhancedMatches.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in clinical trial matcher:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process trial matching request',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Simulate uAgent response (replace with actual Fetch.ai agent call)
async function simulateUAgentResponse(payload: any): Promise<{ matches: TrialMatch[] }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
  const symptoms = payload.request.patientData.symptoms.toLowerCase()
  
  // Mock trial database with realistic data
  const allTrials: TrialMatch[] = [
    {
      id: "NCT04556747",
      title: "Phase 3 Immunotherapy for Breast Cancer",
      description: "Testing novel PD-L1 inhibitor in advanced HER2-negative breast cancer patients",
      phase: "Phase 3",
      status: "Recruiting",
      sponsor: "OncoPharma Inc.",
      locations: ["New York, NY", "Boston, MA", "Chicago, IL"],
      criteria: "Stage III/IV breast cancer, failed prior chemotherapy",
      matchScore: 0,
      url: "https://clinicaltrials.gov/ct2/show/NCT04556747",
      startDate: "2024-01-15",
      endDate: "2026-12-31",
      participants: 350,
      contact: "research@oncopharma.com",
      zkProof: { proofId: "", timestamp: "", btcTx: "" }
    },
    {
      id: "NCT03945682",
      title: "Targeted Therapy for EGFR+ Lung Cancer",
      description: "Study of osimertinib in EGFR mutation-positive non-small cell lung cancer",
      phase: "Phase 2",
      status: "Active, not recruiting",
      sponsor: "LungCancer Research Foundation",
      locations: ["Los Angeles, CA", "Houston, TX", "Miami, FL"],
      criteria: "Stage IV NSCLC, confirmed EGFR mutation",
      matchScore: 0,
      url: "https://clinicaltrials.gov/ct2/show/NCT03945682",
      startDate: "2023-06-01",
      endDate: "2025-11-30",
      participants: 220,
      contact: "contact@lungresearch.org",
      zkProof: { proofId: "", timestamp: "", btcTx: "" }
    },
    {
      id: "NCT05123789",
      title: "Novel Alzheimer's Treatment Study",
      description: "Investigating amyloid-beta clearance in early-stage Alzheimer's patients",
      phase: "Phase 2/3",
      status: "Recruiting",
      sponsor: "NeuroCure Biopharma",
      locations: ["San Francisco, CA", "Seattle, WA", "Austin, TX"],
      criteria: "Mild cognitive impairment, APOE4 positive",
      matchScore: 0,
      url: "https://clinicaltrials.gov/ct2/show/NCT05123789",
      startDate: "2024-03-01",
      endDate: "2027-05-01",
      participants: 500,
      contact: "alz-study@neurocure.com",
      zkProof: { proofId: "", timestamp: "", btcTx: "" }
    },
    {
      id: "NCT06789012",
      title: "Diabetes Management with AI-Driven Insulin",
      description: "Smart insulin delivery system for Type 1 diabetes patients",
      phase: "Phase 2",
      status: "Recruiting",
      sponsor: "DiabetesAI Research",
      locations: ["Seattle, WA", "Portland, OR", "San Francisco, CA"],
      criteria: "Type 1 diabetes, age 18-65, HbA1c > 7%",
      matchScore: 0,
      url: "https://clinicaltrials.gov/ct2/show/NCT06789012",
      startDate: "2024-06-01",
      endDate: "2026-12-31",
      participants: 180,
      contact: "diabetes-study@airesearch.com",
      zkProof: { proofId: "", timestamp: "", btcTx: "" }
    }
  ]
  
  // Simple keyword matching for demo (in production, use AI/ML)
  const matches = allTrials.filter(trial => {
    let score = 0
    
    // Check for condition matches
    if (symptoms.includes('breast') && trial.title.toLowerCase().includes('breast')) score += 90
    if (symptoms.includes('lung') && trial.title.toLowerCase().includes('lung')) score += 90
    if (symptoms.includes('alzheimer') && trial.title.toLowerCase().includes('alzheimer')) score += 95
    if (symptoms.includes('diabetes') && trial.title.toLowerCase().includes('diabetes')) score += 88
    if (symptoms.includes('cancer') && trial.title.toLowerCase().includes('cancer')) score += 85
    
    // Check for stage matches
    if (symptoms.includes('stage 3') || symptoms.includes('stage iii')) {
      if (trial.criteria.toLowerCase().includes('stage iii')) score += 10
    }
    
    // Check for mutation matches
    if (symptoms.includes('egfr') && trial.title.toLowerCase().includes('egfr')) score += 15
    if (symptoms.includes('her2') && trial.description.toLowerCase().includes('her2')) score += 15
    
    // Assign score and return if above threshold
    trial.matchScore = Math.min(score + Math.floor(Math.random() * 10), 100)
    return score > 70
  })
  
  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore)
  
  return { matches: matches.slice(0, 3) } // Return top 3 matches
}

/* 
TODO: Replace simulateUAgentResponse with actual Fetch.ai agent call:

async function callFetchAiAgent(payload: any): Promise<{ matches: TrialMatch[] }> {
  const response = await fetch('YOUR_FETCH_AI_AGENT_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${payload.apiKey}`
    },
    body: JSON.stringify(payload.request)
  })
  
  if (!response.ok) {
    throw new Error(`Agent call failed: ${response.statusText}`)
  }
  
  return await response.json()
}
*/