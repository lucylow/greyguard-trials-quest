import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from "@/lib/utils";

interface VoiceInterfaceProps {
  onTranscript: (text: string) => void;
  onAudioResponse?: (audioUrl: string) => void;
  className?: string;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onTranscript,
  onAudioResponse,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToSTT(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Audio level monitoring
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioLevel = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setAudioLevel(average / 255);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "🎤 Recording started",
        description: "Speak clearly into your microphone"
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "❌ Recording failed",
        description: "Please check your microphone permissions",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      toast({
        title: "🔄 Processing audio",
        description: "Converting speech to text..."
      });
    }
  };

  const sendAudioToSTT = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('STT request failed');
      }
      
      const data = await response.json();
      
      if (data.transcript) {
        onTranscript(data.transcript);
        toast({
          title: "✅ Speech recognized",
          description: `"${data.transcript.substring(0, 50)}${data.transcript.length > 50 ? '...' : ''}"`
        });
      }
      
    } catch (error) {
      console.error('STT error:', error);
      toast({
        title: "❌ Speech recognition failed",
        description: "Please try speaking again",
        variant: "destructive"
      });
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        size="sm"
        variant={isRecording ? "destructive" : "outline"}
        className={cn(
          "relative transition-all duration-200",
          isRecording && "animate-pulse"
        )}
      >
        {isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        
        {isRecording && (
          <div 
            className="absolute inset-0 bg-red-500 opacity-20 rounded"
            style={{ 
              transform: `scale(${1 + audioLevel * 0.3})`,
              transition: 'transform 0.1s ease'
            }}
          />
        )}
      </Button>

      {onAudioResponse && (
        <Button
          onClick={isPlaying ? stopAudio : undefined}
          size="sm"
          variant="ghost"
          disabled={!onAudioResponse}
          className={cn(
            isPlaying && "animate-pulse"
          )}
        >
          {isPlaying ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      )}

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};