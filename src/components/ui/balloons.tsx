import * as React from 'react';
import { cn } from '@/lib/utils';
import { balloons, textBalloons } from 'balloons-js';

export interface BalloonsProps {
 type?: 'default' | 'text';
 text?: string;
 fontSize?: number;
 color?: string;
 className?: string;
 onLaunch?: () => void;
}

export type BalloonsHandle = { launchAnimation: () => void };

const PARTY_COLOR_PAIRS: ReadonlyArray<readonly [light: string, body: string]> = [
 ['#c9e7d3', '#4d7c5a'],
 ['#dfe3e6', '#8e959b'],
 ['#ffffff', '#eceeee'],
];

export function launchPartyBalloons() {
 void balloons();
 document.querySelectorAll<HTMLElement>('balloons balloon').forEach((el, index) => {
  const pair = PARTY_COLOR_PAIRS[index % PARTY_COLOR_PAIRS.length];
  if (!pair) return;
  el.style.setProperty('--balloon-color', pair[1]);
  el.style.setProperty('--light-color', pair[0]);
 });
}

const Balloons = React.forwardRef<BalloonsHandle, BalloonsProps>(
 ({ type = 'default', text, fontSize = 120, color = '#000000', className, onLaunch }, ref) => {
  const launchAnimation = React.useCallback(() => {
   if (type === 'default') launchPartyBalloons();
   else if (type === 'text' && text) textBalloons([{ text, fontSize, color }]);
   onLaunch?.();
  }, [type, text, fontSize, color, onLaunch]);

  React.useImperativeHandle(ref, () => ({ launchAnimation }), [launchAnimation]);

  return <div className={cn('balloons-container', className)} aria-hidden="true" />;
 }
);
Balloons.displayName = 'Balloons';

export { Balloons };
