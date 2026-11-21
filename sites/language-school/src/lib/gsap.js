'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  // Кривые в духе Эмиля Ковальски: быстрый старт, долгое мягкое торможение.
  CustomEase.create('out', '0.22, 1, 0.36, 1');
  CustomEase.create('inOut', '0.76, 0, 0.24, 1');
  CustomEase.create('soft', '0.33, 1, 0.68, 1');
  gsap.defaults({ ease: 'out', duration: 0.8 });
}

export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
