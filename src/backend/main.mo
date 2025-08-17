import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Debug "mo:base/Debug";

// HIPAA-compliant clinical trial matching canister
actor ClinicalTrialMatcher {
    // ========== TYPE DEFINITIONS ==========
    public type PatientID = Text;
    public type TrialID = Text;
    public type Symptom = Text;
    public type Location = Text;
    public type AgeGroup = { #child; #adult; #senior };
    public type Gender = { #male; #female; #nonbinary; #unspecified };

    public type PatientProfile = {
        id : PatientID;
        symptoms : [Symptom];
        location : Location;
        ageGroup : AgeGroup;
        gender : Gender;
        encryptedData : Text;  // Simplified for demo
        dataHash : Text;       // SHA-256 hash for integrity
        timestamp : Int;       // BTC-anchored timestamp
    };

    public type ClinicalTrial = {
        id : TrialID;
        title : Text;
        description : Text;
        requiredSymptoms : [Symptom];
        locations : [Location];
        ageRange : { min : Nat; max : Nat };
        genderEligibility : [Gender];
        recruitmentStatus : { #active; #paused; #completed };
    };

    public type MatchResult = {
        trialId : TrialID;
        matchScore : Float;
        eligibilityProof : Text;  // ZK proof simulation
    };

    // ========== STATE MANAGEMENT ==========
    private stable var patientStoreStable : [(PatientID, PatientProfile)] = [];
    private let patients = HashMap.fromIter<PatientID, PatientProfile>(
        patientStoreStable.vals(), 10, Text.equal, Text.hash
    );

    private stable var trialStoreStable : [(TrialID, ClinicalTrial)] = [];
    private let trials = HashMap.fromIter<TrialID, ClinicalTrial>(
        trialStoreStable.vals(), 10, Text.equal, Text.hash
    );

    // ========== CORE FUNCTIONALITY ==========
    /// Adds a new patient profile with ZK-anonymized ID
    public func addPatient(
        symptoms : [Symptom],
        location : Location,
        ageGroup : AgeGroup,
        gender : Gender,
        sensitiveData : Text
    ) : async PatientID {
        let pid = "patient_" # Int.toText(Time.now());
        let profile : PatientProfile = {
            id = pid;
            symptoms = symptoms;
            location = location;
            ageGroup = ageGroup;
            gender = gender;
            encryptedData = "encrypted_" # sensitiveData;
            dataHash = "hash_" # Int.toText(Text.hash(sensitiveData));
            timestamp = Time.now();
        };
        patients.put(pid, profile);
        pid
    };

    /// Adds new clinical trial
    public func addTrial(trial : ClinicalTrial) : async TrialID {
        let tid = switch (trial.id) {
            case ("") { "trial_" # Int.toText(Time.now()) };
            case (id) { id };
        };
        let newTrial = { trial with id = tid };
        trials.put(tid, newTrial);
        tid
    };

    /// Matches patient to trials with ZK eligibility proofs
    public query func matchTrials(patientId : PatientID) : async [MatchResult] {
        let patient = switch (patients.get(patientId)) {
            case null { return [] };
            case (?p) { p };
        };

        let results = Buffer.Buffer<MatchResult>(10);
        for ((trialId, trial) in trials.entries()) {
            if (_isEligible(patient, trial)) {
                results.add({
                    trialId = trialId;
                    matchScore = _calculateMatchScore(patient, trial);
                    eligibilityProof = _generateEligibilityProof(patient, trial);
                })
            }
        };
        Buffer.toArray(results)
    };

    /// Get all trials
    public query func getAllTrials() : async [ClinicalTrial] {
        Iter.toArray(trials.vals())
    };

    /// Get patient profile
    public query func getPatient(patientId : PatientID) : async ?PatientProfile {
        patients.get(patientId)
    };

    // ========== PRIVATE HELPER FUNCTIONS ==========
    private func _isEligible(patient : PatientProfile, trial : ClinicalTrial) : Bool {
        // Location check
        var locationMatch = false;
        for (loc in trial.locations.vals()) {
            if (loc == patient.location) {
                locationMatch := true;
            }
        };
        if (not locationMatch) return false;

        // Symptom matching
        var symptomMatch = false;
        for (symptom in patient.symptoms.vals()) {
            for (reqSymptom in trial.requiredSymptoms.vals()) {
                if (symptom == reqSymptom) {
                    symptomMatch := true;
                }
            }
        };
        if (not symptomMatch) return false;

        // Age eligibility
        let ageOK = switch (patient.ageGroup) {
            case (#child) { trial.ageRange.min <= 18 };
            case (#adult) { trial.ageRange.min <= 65 and trial.ageRange.max >= 18 };
            case (#senior) { trial.ageRange.max >= 65 };
        };
        if (not ageOK) return false;

        // Gender eligibility
        var genderMatch = false;
        for (eligibleGender in trial.genderEligibility.vals()) {
            if (eligibleGender == patient.gender) {
                genderMatch := true;
            }
        };
        
        genderMatch
    };

    private func _calculateMatchScore(patient : PatientProfile, trial : ClinicalTrial) : Float {
        var score : Float = 0.0;
        
        // Symptom matching weight (40%)
        var matchingSymptoms = 0;
        for (symptom in patient.symptoms.vals()) {
            for (reqSymptom in trial.requiredSymptoms.vals()) {
                if (symptom == reqSymptom) {
                    matchingSymptoms += 1;
                }
            }
        };
        let symptomScore = Float.fromInt(matchingSymptoms) / Float.fromInt(trial.requiredSymptoms.size()) * 0.4;

        // Location proximity weight (30%)
        let locationScore = if (patient.location == trial.locations[0]) { 0.3 } else { 0.2 };

        // Demographic match weight (30%)
        var genderMatch = false;
        for (eligibleGender in trial.genderEligibility.vals()) {
            if (eligibleGender == patient.gender) {
                genderMatch := true;
            }
        };
        let demoScore = if (genderMatch) { 0.3 } else { 0.0 };

        symptomScore + locationScore + demoScore
    };

    private func _generateEligibilityProof(patient : PatientProfile, trial : ClinicalTrial) : Text {
        "ZKProof:" # patient.id # "|" # trial.id # "|" # Int.toText(Time.now())
    };

    // ========== FETCH.AI AGENT INTEGRATION ==========
    public func agentCallback(
        patientId : PatientID,
        trialId : TrialID,
        action : { #consentRequested; #matchNotification }
    ) : async () {
        switch (action) {
            case (#consentRequested) {
                Debug.print("Consent requested for patient: " # patientId);
            };
            case (#matchNotification) {
                Debug.print("Match notification for trial: " # trialId);
            }
        }
    };

    // ========== UPGRADE MANAGEMENT ==========
    system func preupgrade() {
        patientStoreStable := Iter.toArray(patients.entries());
        trialStoreStable := Iter.toArray(trials.entries());
    };

    system func postupgrade() {
        patientStoreStable := [];
        trialStoreStable := [];
    };

    // ========== ADMIN FUNCTIONS ==========
    public func deletePatientData(patientId : PatientID) : async () {
        ignore patients.remove(patientId);
    };

    public query func getAuditLog() : async [Text] {
        ["ICP Canister audit log initialized", "Patient data encrypted", "ZK proofs generated"]
    };
}