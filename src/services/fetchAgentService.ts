import { toast } from '../hooks/use-toast';

export interface FetchAgent {
  id: string;
  name: string;
  address: string;
  capabilities: string[];
  status: string;
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  type: 'text' | 'analysis' | 'match' | 'recommendation';
}

export interface PatientAnalysis {
  patientId: string;
  conditions: string[];
  riskFactors: string[];
  recommendations: string[];
  matchingTrials: string[];
  confidence: number;
}

export interface TrialAnalysis {
  trialId: string;
  suitability: number;
  requirements: string[];
  exclusions: string[];
  recommendations: string[];
}

export class FetchAgentService {
  private static instance: FetchAgentService;
  private agents: Map<string, FetchAgent> = new Map();
  private messageHistory: Map<string, AgentMessage[]> = new Map();

  public static getInstance(): FetchAgentService {
    if (!FetchAgentService.instance) {
      FetchAgentService.instance = new FetchAgentService();
    }
    return FetchAgentService.instance;
  }

  constructor() {
    this.initializeDefaultAgents();
  }

  private initializeDefaultAgents() {
    const defaultAgents: FetchAgent[] = [
      {
        id: 'patient_analysis_agent',
        name: 'Patient Analysis Agent',
        address: 'fetch1h6u0j6u0j6u0j6u0j6u0j6u0j6u0j6u0',
        capabilities: ['patient_analysis', 'condition_matching', 'risk_assessment'],
        status: 'active'
      },
      {
        id: 'trial_matching_agent',
        name: 'Trial Matching Agent',
        address: 'fetch1h6u0j6u0j6u0j6u0j6u0j6u0j6u0j6u1',
        capabilities: ['trial_analysis', 'matching_algorithm', 'eligibility_check'],
        status: 'active'
      },
      {
        id: 'recommendation_agent',
        name: 'Recommendation Agent',
        address: 'fetch1h6u0j6u0j6u0j6u0j6u0j6u0j6u0j6u2',
        capabilities: ['personalized_recommendations', 'treatment_planning'],
        status: 'active'
      }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  // Get all available agents
  public getAgents(): FetchAgent[] {
    return Array.from(this.agents.values());
  }

  // Get agent by ID
  public getAgent(agentId: string): FetchAgent | undefined {
    return this.agents.get(agentId);
  }

  // Send message to agent (Chat Protocol implementation)
  public async sendMessage(agentId: string, content: string, messageType: AgentMessage['type'] = 'text'): Promise<AgentMessage> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const message: AgentMessage = {
      id: this.generateMessageId(),
      from: 'user',
      to: agentId,
      content,
      timestamp: Date.now(),
      type: messageType
    };

    // Store message in history
    if (!this.messageHistory.has(agentId)) {
      this.messageHistory.set(agentId, []);
    }
    this.messageHistory.get(agentId)!.push(message);

    // Simulate agent response (in real implementation, this would call Fetch.ai network)
    const response = await this.simulateAgentResponse(agentId, content, messageType);
    
    // Store agent response
    this.messageHistory.get(agentId)!.push(response);

    return response;
  }

  // Get message history for an agent
  public getMessageHistory(agentId: string): AgentMessage[] {
    return this.messageHistory.get(agentId) || [];
  }

  // Analyze patient using Fetch.ai agents
  public async analyzePatient(patientData: any): Promise<PatientAnalysis> {
    console.log('🔍 Starting patient analysis with Fetch.ai agents...');

    try {
      // Send patient data to Patient Analysis Agent
      const analysisMessage = await this.sendMessage(
        'patient_analysis_agent',
        JSON.stringify(patientData),
        'analysis'
      );

      // Send to Trial Matching Agent for trial recommendations
      const matchingMessage = await this.sendMessage(
        'trial_matching_agent',
        analysisMessage.content,
        'match'
      );

      // Get recommendations from Recommendation Agent
      const recommendationMessage = await this.sendMessage(
        'recommendation_agent',
        matchingMessage.content,
        'recommendation'
      );

      // Parse and return analysis results
      const analysis: PatientAnalysis = {
        patientId: patientData.id || 'unknown',
        conditions: this.extractConditions(analysisMessage.content),
        riskFactors: this.extractRiskFactors(analysisMessage.content),
        recommendations: this.extractRecommendations(recommendationMessage.content),
        matchingTrials: this.extractMatchingTrials(matchingMessage.content),
        confidence: this.calculateConfidence(analysisMessage.content)
      };

      console.log('✅ Patient analysis completed:', analysis);
      return analysis;

    } catch (error) {
      console.error('❌ Error in patient analysis:', error);
      throw new Error(`Patient analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Analyze clinical trial using Fetch.ai agents
  public async analyzeTrial(trialData: any): Promise<TrialAnalysis> {
    console.log('🔍 Starting trial analysis with Fetch.ai agents...');

    try {
      // Send trial data to Trial Matching Agent
      const analysisMessage = await this.sendMessage(
        'trial_matching_agent',
        JSON.stringify(trialData),
        'analysis'
      );

      // Parse and return analysis results
      const analysis: TrialAnalysis = {
        trialId: trialData.id || 'unknown',
        suitability: this.extractSuitability(analysisMessage.content),
        requirements: this.extractRequirements(analysisMessage.content),
        exclusions: this.extractExclusions(analysisMessage.content),
        recommendations: this.extractRecommendations(analysisMessage.content)
      };

      console.log('✅ Trial analysis completed:', analysis);
      return analysis;

    } catch (error) {
      console.error('❌ Error in trial analysis:', error);
      throw new Error(`Trial analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Simulate agent response (mock implementation)
  private async simulateAgentResponse(agentId: string, content: string, messageType: AgentMessage['type']): Promise<AgentMessage> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let responseContent = '';

    switch (agentId) {
      case 'patient_analysis_agent':
        responseContent = this.generatePatientAnalysisResponse(content, messageType);
        break;
      case 'trial_matching_agent':
        responseContent = this.generateTrialMatchingResponse(content, messageType);
        break;
      case 'recommendation_agent':
        responseContent = this.generateRecommendationResponse(content, messageType);
        break;
      default:
        responseContent = 'I am not sure how to help with that request.';
    }

    return {
      id: this.generateMessageId(),
      from: agentId,
      to: 'user',
      content: responseContent,
      timestamp: Date.now(),
      type: messageType
    };
  }

  // Generate mock responses for different agent types
  private generatePatientAnalysisResponse(content: string, messageType: AgentMessage['type']): string {
    if (messageType === 'analysis') {
      return JSON.stringify({
        analysis: 'patient_analysis',
        conditions: ['diabetes', 'hypertension'],
        riskFactors: ['age_over_65', 'family_history'],
        severity: 'moderate',
        recommendations: ['regular_monitoring', 'lifestyle_changes']
      });
    }
    return 'Patient analysis completed successfully.';
  }

  private generateTrialMatchingResponse(content: string, messageType: AgentMessage['type']): string {
    if (messageType === 'match') {
      return JSON.stringify({
        analysis: 'trial_matching',
        matchingTrials: ['trial_001', 'trial_003', 'trial_007'],
        scores: [0.95, 0.87, 0.82],
        eligibility: 'high',
        nextSteps: ['contact_researchers', 'schedule_screening']
      });
    }
    return 'Trial matching analysis completed successfully.';
  }

  private generateRecommendationResponse(content: string, messageType: AgentMessage['type']): string {
    if (messageType === 'recommendation') {
      return JSON.stringify({
        analysis: 'recommendations',
        personalizedPlan: 'custom_treatment_plan',
        priority: 'high',
        timeline: 'immediate',
        actions: ['schedule_appointment', 'prepare_documents', 'contact_support']
      });
    }
    return 'Recommendations generated successfully.';
  }

  // Helper methods for parsing responses
  private extractConditions(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      return parsed.conditions || [];
    } catch {
      return [];
    }
  }

  private extractRiskFactors(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      return parsed.riskFactors || [];
    } catch {
      return [];
    }
  }

  private extractRecommendations(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      return parsed.recommendations || [];
    } catch {
      return [];
    }
  }

  private extractMatchingTrials(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      return parsed.matchingTrials || [];
    } catch {
      return [];
    }
  }

  private extractSuitability(content: string): number {
    try {
      const parsed = JSON.parse(content);
      return parsed.suitability || 0.5;
    } catch {
      return 0.5;
    }
  }

  private extractRequirements(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      return parsed.requirements || [];
    } catch {
      return [];
    }
  }

  private extractExclusions(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      return parsed.exclusions || [];
    } catch {
      return [];
    }
  }

  private calculateConfidence(content: string): number {
    try {
      const parsed = JSON.parse(content);
      return parsed.confidence || 0.8;
    } catch {
      return 0.8;
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get agent status
  public getAgentStatus(agentId: string): string {
    const agent = this.agents.get(agentId);
    return agent?.status || 'unknown';
  }

  // Update agent status
  public updateAgentStatus(agentId: string, status: string): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      this.agents.set(agentId, agent);
      return true;
    }
    return false;
  }
}

export const fetchAgentService = FetchAgentService.getInstance();
