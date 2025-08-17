import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Debug "mo:base/Debug";

actor ClinicalTrialCanister {
    // ========== TYPE DEFINITIONS ==========
    public type PatientID = Text;
    public type TrialID = Text;
    public type Symptom = Text;
    public type Location = Text;
    public type AgeGroup = { #child; #adult; #senior };
    public type Gender = { #male; #female; #nonbinary; #unspecified };
    public type ConsentStatus = { #granted; #revoked; #pending };
    
    public type AuditAction = {
        #patientCreated;
        #trialAdded;
        #matchRequested;
        #dataDeleted;
        #consentUpdated;
        #systemInit;
    };

    public type PatientProfile = {
        id : PatientID;
        symptoms : [Symptom];
        location : Location;
        ageGroup : AgeGroup;
        gender : Gender;
        encryptedData : Text;  // Simplified for demo
        dataHash : Text;
        consent : ConsentStatus;
        timestamp : Int;
        btcAnchor : ?Text;
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
        sponsor : Principal;
        zkCircuit : Text;  // Simplified ZK circuit
    };

    public type MatchResult = {
        trialId : TrialID;
        matchScore : Float;
        eligibilityProof : Text;
        consentRequired : Bool;
    };

    public type AgentCallback = {
        #consentRequest : { patientId : PatientID; trialId : TrialID };
        #matchNotification : { patientId : PatientID; trialIds : [TrialID] };
    };

    // ========== STATE MANAGEMENT ==========
    private stable var patientStoreStable : [(PatientID, PatientProfile)] = [];
    private stable var trialStoreStable : [(TrialID, ClinicalTrial)] = [];
    private stable var auditLogStable : [(Int, Principal, AuditAction, Text)] = [];

    private let patients = HashMap.fromIter<PatientID, PatientProfile>(
        patientStoreStable.vals(), 10, Text.equal, Text.hash
    );
    
    private let trials = HashMap.fromIter<TrialID, ClinicalTrial>(
        trialStoreStable.vals(), 10, Text.equal, Text.hash
    );

    private var auditLog : [(Int, Principal, AuditAction, Text)] = auditLogStable;

    // ========== CRYPTO UTILITIES ==========
    private func _encryptData(data : Text) : (Text, Text) {
        // Simplified encryption for demo
        let encrypted = "encrypted_" # data;
        let hash = "hash_" # Int.toText(Text.hash(data));
        (encrypted, hash)
    };

    private func _generateZKProof(patient : PatientProfile, trial : ClinicalTrial) : Text {
        "ZKProof:" # patient.id # "|" # trial.id # "|" # Int.toText(Time.now())
    };

    private func _anchorToBTC(data : Text) : async Text {
        // Simulated Bitcoin anchoring
        "btc_" # Int.toText(Time.now()) # "_" # Int.toText(Text.hash(data))
    };

    // ========== CORE FUNCTIONALITY ==========
    /// Creates new patient profile with encrypted data
    public func createPatient(
        symptoms : [Symptom],
        location : Location,
        ageGroup : AgeGroup,
        gender : Gender,
        sensitiveData : Text
    ) : async PatientID {
        let pid = "patient_" # Int.toText(Time.now());
        let (encrypted, hash) = _encryptData(sensitiveData);

        let profile : PatientProfile = {
            id = pid;
            symptoms = symptoms;
            location = location;
            ageGroup = ageGroup;
            gender = gender;
            encryptedData = encrypted;
            dataHash = hash;
            consent = #pending;
            timestamp = Time.now();
            btcAnchor = null;
        };

        patients.put(pid, profile);
        _logAction(#patientCreated, "Patient " # pid # " created");

        // Anchor to Bitcoin
        try {
            let txHash = await _anchorToBTC(hash);
            let updated = { profile with btcAnchor = ?txHash };
            patients.put(pid, updated);
        } catch e {
            Debug.print("Bitcoin anchoring failed");
        };

        pid
    };

    /// Adds new clinical trial
    public func addClinicalTrial(
        title : Text,
        description : Text,
        requiredSymptoms : [Symptom],
        locations : [Location],
        ageRange : { min : Nat; max : Nat },
        genderEligibility : [Gender],
        zkCircuit : Text
    ) : async Result.Result<TrialID, Text> {
        let tid = "trial_" # Int.toText(Time.now());

        let trial : ClinicalTrial = {
            id = tid;
            title = title;
            description = description;
            requiredSymptoms = requiredSymptoms;
            locations = locations;
            ageRange = ageRange;
            genderEligibility = genderEligibility;
            recruitmentStatus = #active;
            sponsor = Principal.fromText("aaaaa-aa");  // Simplified
            zkCircuit = zkCircuit;
        };

        trials.put(tid, trial);
        _logAction(#trialAdded, "Trial " # tid # " added");
        #ok(tid)
    };

    /// Finds matching trials for patient
    public query func findTrials(patientId : PatientID) : async Result.Result<[MatchResult], Text> {
        let patient = switch (patients.get(patientId)) {
            case null { return #err("Patient not found") };
            case (?p) { p };
        };

        let matches = Buffer.Buffer<MatchResult>(5);
        for ((_, trial) in trials.entries()) {
            if (trial.recruitmentStatus == #active and _isEligible(patient, trial)) {
                let proof = _generateZKProof(patient, trial);
                matches.add({
                    trialId = trial.id;
                    matchScore = _calculateMatchScore(patient, trial);
                    eligibilityProof = proof;
                    consentRequired = true;
                });
            }
        };

        #ok(Buffer.toArray(matches))
    };

    /// Updates patient consent status
    public func updateConsent(
        patientId : PatientID,
        trialId : TrialID,
        status : ConsentStatus
    ) : async Result.Result<(), Text> {
        switch (patients.get(patientId)) {
            case null { #err("Patient not found") };
            case (?patient) {
                let updated = { patient with consent = status };
                patients.put(patientId, updated);
                _logAction(#consentUpdated, "Consent updated for " # patientId);
                #ok(())
            };
        }
    };

    // ========== INTEGRATION ENDPOINTS ==========
    /// Endpoint for Fetch.ai agents
    public func agentEndpoint(callback : AgentCallback) : async Result.Result<(), Text> {
        switch (callback) {
            case (#consentRequest req) {
                _logAction(#matchRequested, "Consent requested for " # req.patientId);
                #ok(())
            };
            case (#matchNotification notif) {
                _logAction(#matchRequested, "Match notification sent");
                #ok(())
            }
        }
    };

    // ========== HELPER FUNCTIONS ==========
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

        ageOK and patient.consent == #granted
    };

    private func _calculateMatchScore(patient : PatientProfile, trial : ClinicalTrial) : Float {
        var score : Float = 0.0;
        
        // Symptom matching (40%)
        var matchingSymptoms = 0;
        for (symptom in patient.symptoms.vals()) {
            for (reqSymptom in trial.requiredSymptoms.vals()) {
                if (symptom == reqSymptom) {
                    matchingSymptoms += 1;
                }
            }
        };
        let symptomScore = Float.fromInt(matchingSymptoms) / Float.fromInt(trial.requiredSymptoms.size()) * 0.4;

        // Location proximity (30%)
        let locationScore = if (patient.location == trial.locations[0]) { 0.3 } else { 0.1 };

        // Gender match (30%)
        var genderMatch = false;
        for (eligibleGender in trial.genderEligibility.vals()) {
            if (eligibleGender == patient.gender) {
                genderMatch := true;
            }
        };
        let demoScore = if (genderMatch) { 0.3 } else { 0.0 };

        symptomScore + locationScore + demoScore
    };

    private func _logAction(action : AuditAction, details : Text) {
        let entry = (Time.now(), Principal.fromText("aaaaa-aa"), action, details);
        auditLog := Array.append(auditLog, [entry]);
    };

    // ========== QUERY FUNCTIONS ==========
    public query func getAllTrials() : async [ClinicalTrial] {
        Iter.toArray(trials.vals())
    };

    public query func getPatient(patientId : PatientID) : async ?PatientProfile {
        patients.get(patientId)
    };

    public query func getAuditLog() : async [(Int, Principal, AuditAction, Text)] {
        auditLog
    };

    // ========== ADMIN FUNCTIONS ==========
    public func deletePatientData(patientId : PatientID) : async Result.Result<(), Text> {
        ignore patients.remove(patientId);
        _logAction(#dataDeleted, "Patient " # patientId # " deleted");
        #ok(())
    };

    public func updateTrialStatus(
        trialId : TrialID,
        status : { #active; #paused; #completed }
    ) : async Result.Result<(), Text> {
        switch (trials.get(trialId)) {
            case null { #err("Trial not found") };
            case (?trial) {
                let updated = { trial with recruitmentStatus = status };
                trials.put(trialId, updated);
                _logAction(#trialAdded, "Trial " # trialId # " status updated");
                #ok(())
            }
        }
    };

    // ========== UPGRADE MANAGEMENT ==========
    system func preupgrade() {
        patientStoreStable := Iter.toArray(patients.entries());
        trialStoreStable := Iter.toArray(trials.entries());
        auditLogStable := auditLog;
    };

    system func postupgrade() {
        patientStoreStable := [];
        trialStoreStable := [];
        auditLogStable := [];
    };
}