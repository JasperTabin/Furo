// types/timer.ts - TypeScript type definitions for timer data structures

export type TimerMode = 'focus' | 'shortbreak' | 'longBreak' | 'infinite';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  mode: TimerMode;              
  status: TimerStatus;          
  timeLeft: number;             
  totalTime: number;            
  sessionsCompleted: number;    
}

export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  sound?: string;
  volume?: number;
  isMuted?: boolean;

    repeatCount: number;

}